import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary with direct credentials
// Note: In production, these should be loaded from environment variables
cloudinary.config({
  cloud_name: 'dozsotsst',
  api_key: '939555166878456',
  api_secret: 'XKC8vyLPTzGP7TV1_atTkUUbT_g',
  secure: true
});

// Configure global Cloudinary timeout
cloudinary.config({
  timeout: 120000, // 2 minute timeout (more than default 60 seconds)
});

// Helper function to add delay between retries
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Upload a file to Cloudinary with optimizations for faster uploads
 * @param {Object} file - The file to upload (from express-fileupload)
 * @param {Object} options - Upload options (folder, public_id, etc.)
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadToCloudinary = async (file, options = {}) => {
  // Max retries for failed uploads
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError = null;

  while (retries <= MAX_RETRIES) {
    try {
      // Determine file type
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      const isLargeFile = file.size > 1024 * 1024; // > 1MB

      // Set default options with optimizations for faster uploads
      const uploadOptions = {
        folder: 'kyc_documents',
        resource_type: 'auto',
        // Apply quality and transformation optimizations
        ...(isImage && { 
          quality: 'auto:eco', // Use 'eco' instead of 'good' for faster uploads
          fetch_format: 'auto', // Convert to best format for web
          transformation: [
            { width: 800, crop: 'limit' }, // Reduced from 1200 to 800 for faster uploads
            { quality: 'auto:eco' } // Eco quality for speed
          ]
        }),
        ...(isPdf && {
          pages: true, 
          colors: true,
        }),
        // Add caching parameters to enhance performance
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        // Chunked uploads for large files to avoid timeouts
        ...(isLargeFile && {
          chunk_size: 1024 * 1024, // 1MB chunk size
        }),
        // Add any user-provided options
        ...options
      };
      
      // For the first attempt, log what we're doing
      if (retries === 0) {
        console.log(`Uploading ${file.name || 'file'} (${(file.size / 1024).toFixed(2)}KB) to Cloudinary...`);
        if (isLargeFile) console.log('Using chunked upload for large file');
      } else {
        console.log(`Retry attempt ${retries}/${MAX_RETRIES} for uploading to Cloudinary...`);
      }
      
      // Convert the file buffer to a base64 string
      const fileStr = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
      
      // Upload to Cloudinary with a timeout
      const result = await Promise.race([
        cloudinary.uploader.upload(fileStr, uploadOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout exceeded')), 60000) // 60 second local timeout
        )
      ]);
      
      console.log('Cloudinary upload successful, result:', result.secure_url);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Upload attempt ${retries + 1} failed:`, error);
      
      // Check if error is retriable
      const isTimeoutError = error.message?.includes('timeout') || 
                           error.error?.message?.includes('timeout') ||
                           error.http_code === 499;
                           
      if (!isTimeoutError && retries >= MAX_RETRIES) {
        throw new Error(`Failed to upload document to Cloudinary: ${error.message || 'Unknown error'}`);
      }
      
      // Exponential backoff for retries
      const backoffTime = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
      console.log(`Retrying upload in ${backoffTime/1000} seconds...`);
      await wait(backoffTime);
      retries++;
    }
  }
  
  // If we've exhausted retries
  throw new Error(`Failed to upload document after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    console.log('No public ID provided for deletion, skipping');
    return { result: 'skipped' };
  }
  
  try {
    console.log('Deleting file from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete successful');
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error(`Failed to delete document from Cloudinary: ${error.message}`);
  }
};

export default cloudinary; 