import NFTRequest from '../models/NFTRequest.js';
import BondRequest from '../models/BondRequest.js';
import TokenRequest from '../models/TokenRequest.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Create NFT Request
export const createNFTRequest = async (req, res) => {
  try {
    const { name, description, imageUrl, price, quantity } = req.body;
    
    const nftRequest = await NFTRequest.create({
      user: req.user._id,
      name,
      description,
      imageUrl,
      price,
      quantity
    });
    
    res.status(201).json(nftRequest);
  } catch (error) {
    console.error('Error creating NFT request:', error);
    res.status(400).json({ message: 'Error creating NFT request', error: error.message });
  }
};

// Create Bond Request
export const createBondRequest = async (req, res) => {
  try {
    const { name, description, faceValue, interestRate, maturityPeriod, quantity, terms } = req.body;
    
    const bondRequest = await BondRequest.create({
      user: req.user._id,
      name,
      description,
      faceValue,
      interestRate,
      maturityPeriod,
      quantity,
      terms
    });
    
    res.status(201).json(bondRequest);
  } catch (error) {
    console.error('Error creating Bond request:', error);
    res.status(400).json({ message: 'Error creating Bond request', error: error.message });
  }
};

// Create Token Request
export const createTokenRequest = async (req, res) => {
  try {
    const { 
      name, 
      symbol, 
      description, 
      totalSupply, 
      decimals, 
      tokenType, 
      features, 
      initialPrice, 
      useCase, 
      targetNetwork 
    } = req.body;
    
    const tokenRequest = await TokenRequest.create({
      user: req.user._id,
      name,
      symbol: symbol.toUpperCase(),
      description,
      totalSupply,
      decimals,
      tokenType,
      features,
      initialPrice,
      useCase,
      targetNetwork
    });
    
    res.status(201).json(tokenRequest);
  } catch (error) {
    console.error('Error creating Token request:', error);
    res.status(400).json({ message: 'Error creating Token request', error: error.message });
  }
};

// Get User's Requests
export const getUserRequests = async (req, res) => {
  try {
    const nftRequests = await NFTRequest.find({ user: req.user._id }).sort('-createdAt');
    const bondRequests = await BondRequest.find({ user: req.user._id }).sort('-createdAt');
    const tokenRequests = await TokenRequest.find({ user: req.user._id }).sort('-createdAt');
    
    res.json({
      nftRequests,
      bondRequests,
      tokenRequests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(400).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Get Approved Tokens for marketplace display
export const getApprovedTokens = async (req, res) => {
  try {
    const approvedTokens = await TokenRequest.find({ 
      status: { $in: ['approved', 'completed'] }
    })
    .populate('user', 'name email')
    .sort('-createdAt');
    
    // Transform the data for marketplace display
    const tokens = approvedTokens.map(token => ({
      id: token._id,
      name: token.name,
      symbol: token.symbol,
      description: token.description,
      totalSupply: token.totalSupply,
      decimals: token.decimals,
      tokenType: token.tokenType,
      features: token.features,
      initialPrice: token.initialPrice,
      targetNetwork: token.targetNetwork,
      creator: token.user,
      createdAt: token.createdAt,
      status: token.status,
      // Mock data for marketplace display (these would come from actual blockchain/market data in production)
      currentPrice: token.initialPrice * (0.8 + Math.random() * 0.4), // Simulate price variation
      change24h: (Math.random() - 0.5) * 20, // Random price change
      marketCap: token.totalSupply * token.initialPrice * (0.8 + Math.random() * 0.4), // Calculated market cap
      volume24h: Math.random() * 10000, // Mock trading volume
    }));
    
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching approved tokens:', error);
    res.status(400).json({ message: 'Error fetching tokens', error: error.message });
  }
};

// Admin: Get All Requests
export const getAllRequests = async (req, res) => {
  try {
    const nftRequests = await NFTRequest.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    
    const bondRequests = await BondRequest.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    
    const tokenRequests = await TokenRequest.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    
    res.json({
      nftRequests,
      bondRequests,
      tokenRequests
    });
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(400).json({ message: 'Error fetching requests', error: error.message });
  }
};

// Admin: Update Request Status
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, requestType, status, adminFeedback } = req.body;
    
    let RequestModel;
    switch (requestType) {
      case 'nft':
        RequestModel = NFTRequest;
        break;
      case 'bond':
        RequestModel = BondRequest;
        break;
      case 'token':
        RequestModel = TokenRequest;
        break;
      default:
        return res.status(400).json({ message: 'Invalid request type' });
    }
    
    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = status;
    request.adminFeedback = adminFeedback || '';
    
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(400).json({ message: 'Error updating request', error: error.message });
  }
};

/**
 * Upload an NFT image to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadNFTImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const file = req.files.image;

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'File must be an image' });
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }

    // Upload to Cloudinary with NFT-specific options
    const result = await uploadToCloudinary(file, {
      folder: 'nft_images',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Error uploading NFT image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};