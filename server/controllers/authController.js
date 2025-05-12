import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import SiteSettings from '../models/SiteSettings.js';
import generateToken from '../utils/generateToken.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadToCloudinary } from '../config/cloudinary.js';
import crypto from 'crypto';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc    Verify site access password
// @route   POST /api/auth/site-access
// @access  Public
export const verifySiteAccess = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get site settings to check if site access is enabled
    const siteSettings = await SiteSettings.findSettings();
    
    // If site access is disabled, return success
    if (!siteSettings.siteAccessEnabled) {
      return res.json({
        success: true,
        message: 'Site access is not required'
      });
    }
    
    // Check if password matches the site access password
    if (!password || password !== siteSettings.siteAccessPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid site access password' 
      });
    }
    
    // Generate a temporary token for site access
    const siteAccessToken = generateToken('site-access', '24h');
    
    res.json({
      success: true,
      token: siteAccessToken
    });
  } catch (error) {
    console.error('Site access verification error:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { firstName, lastName, middleName, companyName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      middleName: middleName || '',
      companyName: companyName || '',
      email,
      password,
      emailVerified: false // Initialize as not verified
    });

    if (user) {
      // Generate verification token with user ID and purpose
      const verificationToken = jwt.sign(
        { id: user._id, purpose: 'email-verification' },
        globalThis.process?.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Store verification token in user document
      user.emailVerificationToken = verificationToken;
      await user.save();
      
      // Send verification email
      const emailSent = await sendVerificationEmail(user, verificationToken);
      
      if (!emailSent) {
        console.warn(`Verification email not sent to user ${user._id} (${user.email})`);
      }
      
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Verify email for newly registered user
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Log for debugging
    console.log(`Starting email verification process for token: ${token.substring(0, 15)}...`);
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, globalThis.process?.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.id, purpose: decoded.purpose });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }
    
    if (!decoded || !decoded.id || decoded.purpose !== 'email-verification') {
      console.error('Invalid token content:', decoded);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid verification token structure' 
      });
    }
    
    // Find user and update verification status
    const user = await User.findById(decoded.id).select('+emailVerificationToken');
    
    if (!user) {
      console.error(`User not found for ID: ${decoded.id}`);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if already verified
    if (user.emailVerified) {
      console.log(`User ${user.email} is already verified`);
      return res.status(200).json({ 
        success: true, 
        message: 'Email already verified' 
      });
    }
    
    // Check if token matches stored token
    if (!user.emailVerificationToken) {
      console.error(`No verification token stored for user: ${user.email}`);
      return res.status(400).json({ 
        success: false,
        message: 'Verification token not found or already used' 
      });
    }
    
    if (user.emailVerificationToken !== token) {
      console.error(`Token mismatch for user ${user.email}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }
    
    // Update user verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    await user.save();
    
    console.log(`Email verification successful for user: ${user.email}`);
    
    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Server error processing verification', 
      error: error.message 
    });
  }
};

// @desc    Register an admin user (only for initial setup)
// @route   POST /api/auth/register-admin
// @access  Public (should be protected in production)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Verify admin secret key
    if (adminSecret !== globalThis.process?.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Invalid admin secret key' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create admin user
    const user = await User.create({
      firstName: name,
      lastName: '',
      email,
      password,
      role: 'admin',
      emailVerified: true // Admin users are automatically verified
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        walletConnected: user.walletConnected,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if email is verified
      if (!user.emailVerified && user.role !== 'admin') {
        return res.status(401).json({ 
          message: 'Please verify your email before logging in',
          emailVerificationPending: true
        });
      }
      
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        walletConnected: user.walletConnected,
        kycStatus: user.kycStatus,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      companyName: user.companyName,
      email: user.email,
      role: user.role,
      walletConnected: user.walletConnected,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      kycDocuments: user.kycDocuments,
      contactEmail: user.contactEmail,
      contactPhone: user.contactPhone
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Connect wallet to user account
// @route   PUT /api/auth/connect-wallet
// @access  Private
export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.walletAddress = walletAddress;
    user.walletConnected = true;
    
    await user.save();
    
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      walletConnected: user.walletConnected,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Update user KYC information
// @route   POST /api/auth/kyc
// @access  Private
export const updateKyc = async (req, res) => {
  try {
    // Check for required data
    if (!req.files || !req.files.idDocument || !req.files.addressDocument) {
      return res.status(400).json({ message: 'Both ID and address documents are required' });
    }

    // Get the current user from the request (set by auth middleware)
    const userId = req.user._id;
    
    // Basic file validation 
    const idDoc = req.files.idDocument;
    const addressDoc = req.files.addressDocument;
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(idDoc.mimetype) || !validTypes.includes(addressDoc.mimetype)) {
      return res.status(400).json({ message: 'Files must be in JPEG, PNG, or PDF format' });
    }
    
    // Validate file size - limit to 5MB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (idDoc.size > MAX_SIZE || addressDoc.size > MAX_SIZE) {
      return res.status(400).json({ message: 'Files must be smaller than 5MB' });
    }

    // Save the contact information
    const contactEmail = req.body.contactEmail;
    const contactPhone = req.body.contactPhone;
    
    if (!contactEmail) {
      return res.status(400).json({ message: 'Contact email is required' });
    }

    console.log('Starting Cloudinary uploads...');
    
    // Start both uploads concurrently for better performance
    const [idDocResult, addressDocResult] = await Promise.all([
      uploadToCloudinary(idDoc, {
        folder: 'kyc_documents/id',
        public_id: `user_${userId}_id_${Date.now()}`,
        // Add resource-specific optimizations
        ...(idDoc.mimetype.startsWith('image/') && {
          quality: 'auto:good', // Balance quality and size
          fetch_format: 'auto',
        })
      }),
      uploadToCloudinary(addressDoc, {
        folder: 'kyc_documents/address',
        public_id: `user_${userId}_address_${Date.now()}`,
        // Add resource-specific optimizations
        ...(addressDoc.mimetype.startsWith('image/') && {
          quality: 'auto:good', // Balance quality and size
          fetch_format: 'auto',
        })
      })
    ]);

    console.log('Cloudinary uploads completed successfully');
    
    // Update the user's KYC documents and status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        contactEmail,
        contactPhone: contactPhone || '',
        'kycDocuments.idDocument': idDocResult.secure_url,
        'kycDocuments.idDocumentPublicId': idDocResult.public_id,
        'kycDocuments.addressDocument': addressDocResult.secure_url,
        'kycDocuments.addressDocumentPublicId': addressDocResult.public_id,
        'kycDocuments.submittedAt': new Date(),
        kycStatus: 'pending',
        kycStatusMessage: '',
      },
      { new: true }
    );

    // Find site admins for notification - to be implemented later
    // const admins = await User.find({ role: 'admin' }).select('email');
    
    // Return success response
    res.status(200).json({
      message: 'KYC documents submitted successfully',
      user: {
        id: user._id,
        email: user.email,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    console.error('Error updating KYC:', error);
    res.status(500).json({ message: `Error updating KYC: ${error.message}` });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    console.log(`Attempting to resend verification email to: ${email}`);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, still return success even if email doesn't exist
      console.log(`User not found for email: ${email}`);
      return res.status(200).json({ 
        success: true,
        message: 'If your email is registered, a verification link has been sent.' 
      });
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      console.log(`User ${email} is already verified`);
      return res.status(400).json({ 
        success: false,
        message: 'Email is already verified' 
      });
    }
    
    // Generate new verification token
    const verificationToken = jwt.sign(
      { id: user._id, purpose: 'email-verification' },
      globalThis.process?.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(`New verification token generated for user: ${email}`);
    
    // Update token in user document
    user.emailVerificationToken = verificationToken;
    await user.save();
    
    // Send verification email
    const emailSent = await sendVerificationEmail(user, verificationToken);
    
    if (!emailSent) {
      console.error(`Failed to send verification email to: ${email}`);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send verification email' 
      });
    }
    
    console.log(`Verification email sent successfully to: ${email}`);
    
    // Send success response
    res.status(200).json({ 
      success: true,
      message: 'Verification email sent successfully' 
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Server error processing verification email request', 
      error: error.message 
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide an email address' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    // Even if user not found, we don't want to reveal that information
    // for security reasons
    if (!user) {
      // Still show success to avoid user enumeration attacks
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving in database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiry (1 hour)
    const tokenExpiry = new Date(Date.now() + 3600000);
    
    // Update user with reset token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();
    
    // Send password reset email
    await sendPasswordResetEmail(user, resetToken);
    
    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify reset token
// @route   GET /api/auth/verify-reset-token/:token
// @access  Public
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.json({ valid: false });
    }
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with matching token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.json({ valid: false });
    }
    
    res.json({ valid: true });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Token and new password are required' 
      });
    }
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with matching token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters' 
      });
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 