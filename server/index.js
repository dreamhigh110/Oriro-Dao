import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import SiteSettings from './models/SiteSettings.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://oriro.org', 'http://oriro.org', 'http://168.231.113.156:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-site-access-token', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['x-site-access-token'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests manually to ensure CORS headers are present
app.options('*', cors());

// File Upload Middleware
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  createParentPath: true,
  abortOnLimit: true,
  uriDecoded: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from uploads directory (only in development mode)
// In production, you would want to add proper authentication for these files
if (globalThis.process?.env.NODE_ENV !== 'production') {
  // Add middleware to handle download parameter
  app.use('/uploads', (req, res, next) => {
    if (req.query.download === 'true') {
      // Get the filename from the path
      const filePath = req.path;
      const fileName = path.basename(filePath);
      
      // Set headers for download
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    next();
  });
  
  // Serve the static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} else {
  // In production, serve documents only to authenticated admins
  app.use('/uploads', (req, res) => {
    // You would implement proper authentication check here
    // For simplicity, this is a placeholder
    res.status(403).send('Access denied: Authentication required for document access');
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const access = req.query.access;
  
  try {
    // Get site settings to check if site access is enabled
    const siteSettings = await SiteSettings.findSettings();
    
    // Always require site access for this application
    // if (!siteSettings.siteAccessEnabled) {
    //   return res.json({
    //     status: 'success',
    //     message: 'Oriro API is healthy',
    //     timestamp: new Date().toISOString()
    //   });
    // }
    
    // If the request includes a site access token, validate it
    const siteAccessToken = req.headers['x-site-access-token'];
    if (siteAccessToken) {
      // In a real implementation, you would validate the token
      // For this example, we'll just check if it exists
      return res.json({
        status: 'success',
        message: 'Oriro API is healthy',
        timestamp: new Date().toISOString()
      });
    }
    
    // If access password is provided, validate it
    if (access) {
      // Debug logs to check password comparison
      console.log('Access password provided:', access);
      console.log('Stored site access password:', siteSettings.siteAccessPassword);
      console.log('Passwords match?', access === siteSettings.siteAccessPassword);
      
      // Validate against the stored password in settings
      if (access === siteSettings.siteAccessPassword) {
        const accessToken = 'demo-token';
        
        // Debug the response setting
        console.log('Setting access token in header:', accessToken);
        console.log('Setting access token in body:', accessToken);
        
        // Set headers explicitly with separate set calls
        res.set('Access-Control-Expose-Headers', 'x-site-access-token');
        res.set('x-site-access-token', accessToken);
        
        return res.json({
          status: 'success',
          message: 'Site access granted',
          accessToken: accessToken
        });
      } else {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid access password',
          requiredAccess: true
        });
      }
    }
    
    // If site access is required but no token or password provided, return 401
    // if (siteSettings.siteAccessEnabled) {
    return res.status(401).json({
      status: 'error',
      message: 'Site access required',
      requiredAccess: true
    });
    // }
    
    // Default success response
    // res.json({
    //   status: 'success',
    //   message: 'Oriro API is healthy',
    //   timestamp: new Date().toISOString()
    // });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

// Debug endpoint for checking site access password
app.get('/api/debug/site-access', async (req, res) => {
  try {
    const siteSettings = await SiteSettings.findSettings();
    
    // Only return password in development environment
    if (globalThis.process?.env.NODE_ENV !== 'production') {
      res.json({
        siteAccessEnabled: siteSettings.siteAccessEnabled,
        siteAccessPassword: siteSettings.siteAccessPassword,
        message: 'This endpoint is only available in development'
      });
    } else {
      res.status(403).json({
        message: 'Debug endpoints are not available in production'
      });
    }
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Oriro API is running...');
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize SiteSettings on server startup
    try {
      await SiteSettings.findSettings();
      console.log('SiteSettings initialized successfully');
    } catch (settingsError) {
      console.error('Error initializing SiteSettings:', settingsError);
    }
    
    // Start server
    const PORT = globalThis.process?.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}, accessible from all interfaces`));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

startServer();

// Handle unhandled promise rejections
globalThis.process?.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  globalThis.process?.exit(1);
}); 