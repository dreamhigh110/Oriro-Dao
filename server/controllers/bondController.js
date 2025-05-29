import Bond from '../models/Bond.js';
import BondHolding from '../models/BondHolding.js';
import BondRequest from '../models/BondRequest.js';

// Get all active bonds
export const getAllBonds = async (req, res) => {
  try {
    const bonds = await Bond.find({ status: 'active' })
      .populate('creator', 'name email')
      .sort('-createdAt');
    res.json(bonds);
  } catch (error) {
    console.error('Error fetching bonds:', error);
    res.status(500).json({ message: 'Error fetching bonds' });
  }
};

// Get user's bond holdings
export const getMyBonds = async (req, res) => {
  try {
    const holdings = await BondHolding.find({ user: req.user._id })
      .populate('bond')
      .sort('-purchaseDate');
    res.json(holdings);
  } catch (error) {
    console.error('Error fetching bond holdings:', error);
    res.status(500).json({ message: 'Error fetching your bonds' });
  }
};

// Purchase a bond
export const purchaseBond = async (req, res) => {
  try {
    const { quantity } = req.body;
    const bond = await Bond.findById(req.params.bondId);

    if (!bond) {
      return res.status(404).json({ message: 'Bond not found' });
    }

    if (bond.status !== 'active') {
      return res.status(400).json({ message: 'This bond is not available for purchase' });
    }

    if (bond.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient bond quantity available' });
    }

    // Create or update holding
    const existingHolding = await BondHolding.findOne({
      user: req.user._id,
      bond: bond._id,
      status: 'active'
    });

    if (existingHolding) {
      existingHolding.quantity += quantity;
      await existingHolding.save();
    } else {
      await BondHolding.create({
        user: req.user._id,
        bond: bond._id,
        quantity,
        purchasePrice: bond.faceValue,
      });
    }

    // Update bond quantity
    bond.quantity -= quantity;
    await bond.save();

    res.json({ message: 'Bond purchased successfully' });
  } catch (error) {
    console.error('Error purchasing bond:', error);
    res.status(500).json({ message: 'Error purchasing bond' });
  }
};

// Create a bond from approved request
export const createBondFromRequest = async (req, res) => {
  try {
    console.log('Creating bond from request with ID:', req.params.requestId);
    
    const request = await BondRequest.findById(req.params.requestId);
    console.log('Found request:', request ? 'Yes' : 'No');
    
    if (!request) {
      console.log('Request not found');
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Request status:', request.status);
    if (request.status !== 'approved') {
      console.log('Request is not approved');
      return res.status(400).json({ message: 'Request is not approved' });
    }

    // Check if Bond already created from this request
    const existingBond = await Bond.findOne({ 'metadata.requestId': request._id });
    console.log('Existing bond found:', existingBond ? 'Yes' : 'No');
    if (existingBond) {
      return res.status(400).json({ message: 'Bond already created from this request' });
    }

    console.log('Creating bond with data:', {
      name: request.name,
      description: request.description,
      faceValue: request.faceValue,
      interestRate: request.interestRate,
      maturityPeriod: request.maturityPeriod,
      quantity: request.quantity,
      creator: request.user,
      terms: request.terms
    });

    const bond = await Bond.create({
      name: request.name,
      description: request.description,
      faceValue: request.faceValue,
      interestRate: request.interestRate,
      maturityPeriod: request.maturityPeriod,
      quantity: request.quantity,
      creator: request.user,
      terms: request.terms,
      metadata: {
        requestId: request._id,
        originalRequest: true,
        terms: request.terms
      }
    });

    console.log('Bond created successfully:', bond._id);

    // Update request status to completed
    request.status = 'completed';
    await request.save();
    console.log('Request status updated to completed');

    res.status(201).json({
      message: 'Bond created successfully',
      bond: bond
    });
  } catch (error) {
    console.error('Error creating bond from request:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating bond', 
      error: error.message 
    });
  }
};

// Check bond maturity
export const checkBondMaturity = async (req, res) => {
  try {
    const holdings = await BondHolding.find({ status: 'active' })
      .populate('bond');

    const updates = holdings.map(async (holding) => {
      const purchaseDate = new Date(holding.purchaseDate);
      const maturityDate = new Date(purchaseDate.getTime() + (holding.bond.maturityPeriod * 24 * 60 * 60 * 1000));
      
      if (new Date() >= maturityDate) {
        holding.status = 'matured';
        return holding.save();
      }
    });

    await Promise.all(updates);
    
    res.json({ message: 'Bond maturity check completed' });
  } catch (error) {
    console.error('Error checking bond maturity:', error);
    res.status(500).json({ message: 'Error checking bond maturity' });
  }
};