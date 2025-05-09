import nodemailer from 'nodemailer';

// Create email transporter configuration
const createTransporter = () => {
  // For production, use SMTP settings from environment variables
  if (globalThis.process?.env.NODE_ENV === 'production' || true) { // Force use of real email even in development
    return nodemailer.createTransport({
      service: globalThis.process?.env.EMAIL_SERVICE,
      host: globalThis.process?.env.EMAIL_HOST,
      port: globalThis.process?.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: globalThis.process?.env.EMAIL_USER,
        pass: globalThis.process?.env.EMAIL_PASS
      }
    });
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
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Verification email sent: %s', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
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
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent: %s', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail
}; 