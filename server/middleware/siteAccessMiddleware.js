import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteSettings from '../models/SiteSettings.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get site access configuration
const getSiteAccessConfig = () => {
  try {
    const configPath = path.resolve(__dirname, '..', 'config', 'site-access.json');
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
    return { siteAccessPassword: 'default_password' };
  } catch (error) {
    console.error('Error reading site access configuration:', error);
    return { siteAccessPassword: 'default_password' };
  }
};

/**
 * Middleware to check if a user has access to the site
 * This middleware should be applied to public routes to restrict access
 * during private beta or controlled launch phases
 */
export const checkSiteAccess = async (req, res, next) => {
  try {
    // Check if site access is enabled in settings
    const settings = await SiteSettings.findSettings();
    
    // If site access is disabled, allow all requests
    if (!settings.siteAccessEnabled) {
      return next();
    }
    
    // Check for site access token in headers
    const token = req.headers['x-site-access-token'];
    
    // If no token, check for beta password in headers or query
    if (!token) {
      const providedPassword = req.headers['x-site-password'] || req.query.access;
      
      if (!providedPassword) {
        return res.status(401).json({ 
          message: 'Site access restricted. Please provide an access token or password.' 
        });
      }
      
      // Get site access configuration
      const config = getSiteAccessConfig();
      
      // Check if password matches
      if (providedPassword !== config.siteAccessPassword) {
        return res.status(401).json({ 
          message: 'Invalid site access password.' 
        });
      }
      
      // Password is correct, generate a token and return it
      const accessToken = jwt.sign(
        { type: 'site_access' },
        config.siteAccessPassword,
        { expiresIn: '7d' }
      );
      
      // Add token to response headers
      res.setHeader('X-Site-Access-Token', accessToken);
      
      return next();
    }
    
    // Verify token
    try {
      const config = getSiteAccessConfig();
      const decoded = jwt.verify(token, config.siteAccessPassword);
      
      // Check if token is for site access
      if (decoded.type !== 'site_access') {
        return res.status(401).json({ 
          message: 'Invalid access token.' 
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Invalid or expired access token.' 
      });
    }
  } catch (error) {
    console.error('Site access middleware error:', error);
    res.status(500).json({ 
      message: 'Server error checking site access.',
      error: error.message
    });
  }
};

/**
 * Middleware to check if registrations are enabled
 * This middleware should be applied to registration routes
 */
export const checkRegistrationEnabled = async (req, res, next) => {
  try {
    // Check if registration is enabled in settings
    const settings = await SiteSettings.findSettings();
    
    if (!settings.registrationEnabled) {
      return res.status(403).json({ 
        message: 'Registration is currently disabled.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Registration check middleware error:', error);
    res.status(500).json({ 
      message: 'Server error checking registration status.',
      error: error.message
    });
  }
};

/**
 * Middleware to check if site is in maintenance mode
 * This middleware should be applied to all public routes
 */
export const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Check if maintenance mode is enabled in settings
    const settings = await SiteSettings.findSettings();
    
    if (settings.maintenanceMode) {
      // Allow admins to bypass maintenance mode
      const user = req.user;
      if (user && user.role === 'admin') {
        return next();
      }
      
      return res.status(503).json({ 
        message: settings.maintenanceMessage || 'Site is under maintenance. Please check back later.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Maintenance mode middleware error:', error);
    res.status(500).json({ 
      message: 'Server error checking maintenance status.',
      error: error.message
    });
  }
}; 