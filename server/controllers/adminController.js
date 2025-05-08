import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Update basic user information
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.middleName = req.body.middleName || user.middleName;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      
      // KYC status can be updated by admin
      if (req.body.kycStatus) {
        user.kycStatus = req.body.kycStatus;
      }
      
      // Email verification can be forced by admin
      if (req.body.emailVerified !== undefined) {
        user.emailVerified = req.body.emailVerified;
      }
      
      // Only update password if it's provided
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        kycStatus: updatedUser.kycStatus,
        emailVerified: updatedUser.emailVerified
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Prevent deleting self
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments({ role: 'user' });
    
    // Get admin count
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    // Get users with connected wallets
    const walletConnectedCount = await User.countDocuments({ walletConnected: true });
    
    // Get KYC stats
    const kycPendingCount = await User.countDocuments({ kycStatus: 'pending' });
    const kycApprovedCount = await User.countDocuments({ kycStatus: 'approved' });
    const kycRejectedCount = await User.countDocuments({ kycStatus: 'rejected' });
    
    // Get site settings
    let siteSettings = await SiteSettings.findOne();
    
    // If no settings exist, create default settings
    if (!siteSettings) {
      siteSettings = await SiteSettings.create({
        siteAccessEnabled: true,
        registrationEnabled: true
      });
    }
    
    // Get recent users (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUserCount = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    
    res.json({
      totalUsers: userCount + adminCount,
      userCount,
      adminCount,
      walletConnectedCount,
      kycStats: {
        pending: kycPendingCount,
        approved: kycApprovedCount,
        rejected: kycRejectedCount
      },
      siteSettings: {
        siteAccessEnabled: siteSettings.siteAccessEnabled,
        registrationEnabled: siteSettings.registrationEnabled
      },
      newUserCount,
      adminEmail: req.user.email
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update site settings
// @route   PUT /api/admin/site-settings
// @access  Admin
export const updateSiteSettings = async (req, res) => {
  try {
    const { 
      siteAccessEnabled, 
      registrationEnabled, 
      sitePassword,
      maintenanceMode,
      maintenanceMessage 
    } = req.body;
    
    // Find site settings
    let siteSettings = await SiteSettings.findOne();
    
    // If no settings exist, create default settings
    if (!siteSettings) {
      siteSettings = new SiteSettings({
        siteAccessEnabled: true,
        registrationEnabled: true,
        maintenanceMode: false,
        maintenanceMessage: 'The site is currently under maintenance. Please check back later.'
      });
    }
    
    // Update settings
    if (siteAccessEnabled !== undefined) {
      siteSettings.siteAccessEnabled = siteAccessEnabled;
    }
    
    if (registrationEnabled !== undefined) {
      siteSettings.registrationEnabled = registrationEnabled;
    }
    
    if (maintenanceMode !== undefined) {
      siteSettings.maintenanceMode = maintenanceMode;
    }
    
    if (maintenanceMessage) {
      siteSettings.maintenanceMessage = maintenanceMessage;
    }
    
    // Update site access password if provided
    if (sitePassword) {
      // In a real implementation, you would hash this password
      // For this demo, we're storing it directly
      siteSettings.siteAccessPassword = sitePassword;
      
      // Set environment variable for immediate use
      globalThis.process.env.SITE_ACCESS_PASSWORD = sitePassword;
      
      console.log(`Site access password updated to: ${sitePassword}`);
    }
    
    await siteSettings.save();
    
    res.json({
      success: true,
      siteSettings: {
        siteAccessEnabled: siteSettings.siteAccessEnabled,
        registrationEnabled: siteSettings.registrationEnabled,
        maintenanceMode: siteSettings.maintenanceMode,
        maintenanceMessage: siteSettings.maintenanceMessage
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Generate a new site access password
// @route   POST /api/admin/generate-access-password
// @access  Admin
export const generateAccessPassword = async (req, res) => {
  try {
    // Generate a random password
    const generateRandomPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      
      // Generate an 8-character password
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return password;
    };
    
    const newPassword = generateRandomPassword();
    
    // Find site settings
    let siteSettings = await SiteSettings.findOne();
    
    // If no settings exist, create default settings
    if (!siteSettings) {
      siteSettings = new SiteSettings({
        siteAccessEnabled: true,
        registrationEnabled: true
      });
    }
    
    // Update password in settings
    siteSettings.siteAccessPassword = newPassword;
    
    // Update environment variable
    globalThis.process.env.SITE_ACCESS_PASSWORD = newPassword;
    
    await siteSettings.save();
    
    res.json({
      success: true,
      password: newPassword
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get users with pending KYC status
// @route   GET /api/admin/kyc-requests
// @access  Private/Admin
export const getKycRequests = async (req, res) => {
  try {
    // Get users with pending KYC status
    const pendingKycUsers = await User.find({ kycStatus: 'pending' })
      .select('-password')
      .select('firstName lastName email _id kycStatus kycDocuments contactEmail contactPhone createdAt updatedAt');

    // Format response to include only necessary information
    const formattedUsers = pendingKycUsers.map(user => {
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactPhone: user.contactPhone,
        kycStatus: user.kycStatus,
        kycDocuments: user.kycDocuments,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching KYC requests:', error);
    res.status(500).json({
      message: 'Server error', 
      error: error.message
    });
  }
};

// @desc    Update KYC status
// @route   PUT /api/admin/kyc-requests/:id
// @access  Admin
export const updateKycStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid KYC status' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update KYC status
    user.kycStatus = status;
    user.kycStatusMessage = message || '';
    
    // If KYC was rejected and we have Cloudinary public IDs, clean up the documents
    if (status === 'rejected' && user.kycDocuments) {
      try {
        // Delete the ID document if public ID exists
        if (user.kycDocuments.idDocumentPublicId) {
          console.log(`Deleting ID document from Cloudinary: ${user.kycDocuments.idDocumentPublicId}`);
          await deleteFromCloudinary(user.kycDocuments.idDocumentPublicId);
        }
        
        // Delete the address document if public ID exists
        if (user.kycDocuments.addressDocumentPublicId) {
          console.log(`Deleting address document from Cloudinary: ${user.kycDocuments.addressDocumentPublicId}`);
          await deleteFromCloudinary(user.kycDocuments.addressDocumentPublicId);
        }
        
        // Clear document references
        user.kycDocuments = undefined;
      } catch (deleteError) {
        console.error('Error deleting documents from Cloudinary:', deleteError);
        // Continue with the process even if document deletion fails
      }
    }
    
    await user.save();
    
    // In a real implementation, send email notification to user
    // TODO: Add email notification about KYC status change

    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get current site settings
// @route   GET /api/admin/site-settings
// @access  Admin
export const getSiteSettings = async (req, res) => {
  try {
    // Find site settings
    const siteSettings = await SiteSettings.findOne();
    
    if (!siteSettings) {
      return res.status(404).json({ message: 'Site settings not found' });
    }
    
    res.json({
      success: true,
      siteSettings: {
        siteAccessEnabled: siteSettings.siteAccessEnabled,
        registrationEnabled: siteSettings.registrationEnabled,
        maintenanceMode: siteSettings.maintenanceMode,
        maintenanceMessage: siteSettings.maintenanceMessage,
        siteAccessPassword: siteSettings.siteAccessPassword
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 