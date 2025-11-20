import nodemailer from 'nodemailer';

// Create email transporter configuration
const createTransporter = () => {
  // For production, use SMTP settings from environment variables
  if (globalThis.process?.env.NODE_ENV === 'production' || true) { // Force use of real email even in development
    const emailService = globalThis.process?.env.EMAIL_SERVICE;
    const port = parseInt(globalThis.process?.env.EMAIL_PORT) || 587;
    const isSecure = port === 465;
    
    // Clean password - remove quotes if present (dotenv may include them)
    let emailPass = globalThis.process?.env.EMAIL_PASS || '';
    if (emailPass.startsWith('"') && emailPass.endsWith('"')) {
      emailPass = emailPass.slice(1, -1);
    }
    if (emailPass.startsWith("'") && emailPass.endsWith("'")) {
      emailPass = emailPass.slice(1, -1);
    }
    
    const transporterConfig = {
      host: globalThis.process?.env.EMAIL_HOST,
      port: port,
      secure: isSecure, // true for 465, false for other ports
      auth: {
        user: globalThis.process?.env.EMAIL_USER,
        pass: emailPass
      },
      // For Hostinger and other SMTP servers using STARTTLS (port 587)
      requireTLS: !isSecure,
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      }
    };
    
    // Only include service property if EMAIL_SERVICE is set (for well-known services like Gmail)
    if (emailService && emailService.trim() !== '') {
      transporterConfig.service = emailService;
    }
    
    // Log configuration for debugging (without password)
    console.log('Email transporter config:', {
      host: transporterConfig.host,
      port: transporterConfig.port,
      secure: transporterConfig.secure,
      requireTLS: transporterConfig.requireTLS,
      user: transporterConfig.auth.user,
      passwordLength: transporterConfig.auth.pass?.length || 0,
      passwordStartsWith: transporterConfig.auth.pass?.substring(0, 2) || 'N/A'
    });
    
    return nodemailer.createTransport(transporterConfig);
  }
  
  // For development, use Ethereal (fake SMTP service for testing)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: globalThis.process?.env.ETHEREAL_EMAIL || 'abigale45@ethereal.email',
      pass: globalThis.process?.env.ETHEREAL_PASSWORD || 'G77dV6N2QrCKy2Xrdb'
    }
  });
};

// Generate verification email
export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    // Always use the production URL for email links
    const baseUrl = 'https://oriro.org';
      
    const verificationLink = `${baseUrl}/verify-email/${verificationToken}`;
    
    // Always log the verification link for debugging
    console.log('\n=====================================================');
    console.log(`🔑 EMAIL VERIFICATION LINK for ${user.email}:`);
    console.log(`📧 ${verificationLink}`);
    console.log('=====================================================\n');
    
    // Create the email content
    const mailOptions = {
      from: globalThis.process?.env.EMAIL_FROM || '"Oriro Team" <noreply@oriro.org>',
      to: user.email,
      subject: 'Verify Your Oriro Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1; margin-bottom: 0;">Oriro</h1>
            <p style="color: #666; font-size: 14px;">Your Web3 Investment Platform</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.firstName},</h2>
            <p style="color: #555; line-height: 1.5;">
              Thank you for registering with Oriro! To complete your registration and activate your account,
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #6366f1; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify My Email
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.5;">
              If the button doesn't work, you can also copy and paste the following link into your browser:
            </p>
            
            <p style="background-color: #eaeaea; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
              ${verificationLink}
            </p>
            
            <p style="color: #555; line-height: 1.5;">
              This verification link will expire in 24 hours.
            </p>
          </div>
          
          <div style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p>If you didn't create an account with Oriro, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Oriro. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send the email
    const transporter = createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError.message);
      throw verifyError;
    }
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Verification email sent: %s', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication Error Details:');
      console.error('  - Email: ' + (globalThis.process?.env.EMAIL_USER || 'not set'));
      console.error('  - Password length: ' + (globalThis.process?.env.EMAIL_PASS?.length || 0) + ' characters');
      console.error('  - Host: ' + (globalThis.process?.env.EMAIL_HOST || 'not set'));
    }
    
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    // Always use the production URL for email links
    const baseUrl = 'https://oriro.org';
      
    const resetLink = `${baseUrl}/reset-password/${resetToken}`;
    
    // Always log the reset link for debugging
    console.log('\n=====================================================');
    console.log(`🔑 PASSWORD RESET LINK for ${user.email}:`);
    console.log(`📧 ${resetLink}`);
    console.log('=====================================================\n');
    
    // Create the email content
    const mailOptions = {
      from: globalThis.process?.env.EMAIL_FROM || '"Oriro Team" <noreply@oriro.org>',
      to: user.email,
      subject: 'Reset Your Oriro Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1; margin-bottom: 0;">Oriro</h1>
            <p style="color: #666; font-size: 14px;">Your Web3 Investment Platform</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.firstName},</h2>
            <p style="color: #555; line-height: 1.5;">
              We received a request to reset your password. If you didn't make this request, you can ignore this email.
              Otherwise, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #6366f1; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.5;">
              If the button doesn't work, you can also copy and paste the following link into your browser:
            </p>
            
            <p style="background-color: #eaeaea; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
              ${resetLink}
            </p>
            
            <p style="color: #555; line-height: 1.5;">
              This password reset link will expire in 1 hour.
            </p>
          </div>
          
          <div style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p>If you didn't request a password reset, please secure your account.</p>
            <p>&copy; ${new Date().getFullYear()} Oriro. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send the email
    const transporter = createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError.message);
      console.error('Please check your email credentials in .env file');
      console.error('Common issues:');
      console.error('  - Wrong email or password');
      console.error('  - Email account not activated');
      console.error('  - SMTP not enabled for this account');
      console.error('  - Password with special characters may need quotes in .env');
      throw verifyError;
    }
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent: %s', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication Error Details:');
      console.error('  - Email: ' + (globalThis.process?.env.EMAIL_USER || 'not set'));
      console.error('  - Password length: ' + (globalThis.process?.env.EMAIL_PASS?.length || 0) + ' characters');
      console.error('  - Host: ' + (globalThis.process?.env.EMAIL_HOST || 'not set'));
      console.error('\n⚠️  Please verify:');
      console.error('  1. Email and password are correct');
      console.error('  2. Email account exists and is active');
      console.error('  3. SMTP access is enabled in Hostinger');
      console.error('  4. Password in .env is properly quoted if it contains special characters\n');
    }
    
    return false;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail
}; 