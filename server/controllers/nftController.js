import NFT from '../models/NFT.js';
import NFTHolding from '../models/NFTHolding.js';
import NFTRequest from '../models/NFTRequest.js';

// Get all active NFTs
export const getAllNFTs = async (req, res) => {
  try {
    const { category, search, sort = '-createdAt' } = req.query;
    
    // Build query
    const query = { status: 'active' };
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with sorting
    const nfts = await NFT.find(query)
      .populate('creator', 'name email')
      .sort(sort);

    res.json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ message: 'Error fetching NFTs' });
  }
};

// Get user's NFT holdings
export const getMyNFTs = async (req, res) => {
  try {
    const holdings = await NFTHolding.find({ 
      user: req.user._id,
      status: 'active'
    })
      .populate('nft')
      .sort('-purchaseDate');
    res.json(holdings);
  } catch (error) {
    console.error('Error fetching NFT holdings:', error);
    res.status(500).json({ message: 'Error fetching your NFTs' });
  }
};

// Get single NFT details
export const getNFTDetails = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.nftId)
      .populate('creator', 'name email');
    
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    res.json(nft);
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    res.status(500).json({ message: 'Error fetching NFT details' });
  }
};

// Purchase an NFT
export const purchaseNFT = async (req, res) => {
  try {
    const { quantity } = req.body;
    const nft = await NFT.findById(req.params.nftId);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (nft.status !== 'active') {
      return res.status(400).json({ message: 'This NFT is not available for purchase' });
    }

    if (nft.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient NFT quantity available' });
    }

    // Create or update holding
    const existingHolding = await NFTHolding.findOne({
      user: req.user._id,
      nft: nft._id,
      status: 'active'
    });

    if (existingHolding) {
      existingHolding.quantity += quantity;
      await existingHolding.save();
    } else {
      await NFTHolding.create({
        user: req.user._id,
        nft: nft._id,
        quantity,
        purchasePrice: nft.price
      });
    }

    // Update NFT quantity
    nft.quantity -= quantity;
    if (nft.quantity === 0) {
      nft.status = 'sold_out';
    }
    await nft.save();

    res.json({ message: 'NFT purchased successfully' });
  } catch (error) {
    console.error('Error purchasing NFT:', error);
    res.status(500).json({ message: 'Error purchasing NFT' });
  }
};

// Create NFT from approved request
export const createNFTFromRequest = async (req, res) => {
  try {
    const request = await NFTRequest.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'Request is not approved' });
    }

    // Check if NFT already created from this request
    const existingNFT = await NFT.findOne({ 'metadata.requestId': request._id });
    if (existingNFT) {
      return res.status(400).json({ message: 'NFT already created from this request' });
    }

    const nft = await NFT.create({
      name: request.name,
      description: request.description,
      imageUrl: request.imageUrl,
      price: request.price,
      quantity: request.quantity,
      creator: request.user,
      category: request.category || 'Other', // Use category from request or default to 'Other'
      metadata: {
        requestId: request._id,
        originalRequest: true
      }
    });

    // Update request status to completed
    request.status = 'completed';
    await request.save();

    res.status(201).json({
      message: 'NFT created successfully',
      nft: nft
    });
  } catch (error) {
    console.error('Error creating NFT from request:', error);
    res.status(500).json({ 
      message: 'Error creating NFT', 
      error: error.message 
    });
  }
};

// Get NFT categories
export const getNFTCategories = async (req, res) => {
  try {
    const categories = await NFT.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching NFT categories:', error);
    res.status(500).json({ message: 'Error fetching NFT categories' });
  }
};

// Transfer NFT
export const transferNFT = async (req, res) => {
  try {
    const { toUserId, quantity, transactionHash } = req.body;
    const holding = await NFTHolding.findById(req.params.holdingId)
      .populate('nft');

    if (!holding) {
      return res.status(404).json({ message: 'NFT holding not found' });
    }

    if (holding.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to transfer this NFT' });
    }

    if (holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient NFT quantity' });
    }

    // Update sender's holding
    if (holding.quantity === quantity) {
      holding.status = 'transferred';
      await holding.save();
    } else {
      holding.quantity -= quantity;
      await holding.save();
    }

    // Create recipient's holding
    await NFTHolding.create({
      user: toUserId,
      nft: holding.nft._id,
      quantity,
      purchasePrice: holding.nft.price,
      transactionHash
    });

    res.json({ message: 'NFT transferred successfully' });
  } catch (error) {
    console.error('Error transferring NFT:', error);
    res.status(500).json({ message: 'Error transferring NFT' });
  }
};