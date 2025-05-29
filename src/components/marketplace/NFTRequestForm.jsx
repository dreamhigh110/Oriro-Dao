import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FiUpload, FiFile, FiTrash2, FiLoader } from 'react-icons/fi';

// Image compression helper function
const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    // Skip compression for non-image files
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    // Skip compression for small images (less than 500KB)
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        
        // Calculate new dimensions (max 1200px width or height)
        let width = img.width;
        let height = img.height;
        const maxDimension = options.maxDimension || 1200;
        
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with quality setting
        const quality = options.quality || 0.7; // 70% quality
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
          
          // Create a new file from the blob
          const compressedFile = new File(
            [blob], 
            file.name, 
            { 
              type: file.type,
              lastModified: Date.now() 
            }
          );
          
          console.log(`Compressed ${file.name} from ${Math.round(file.size/1024)}KB to ${Math.round(compressedFile.size/1024)}KB`);
          resolve(compressedFile);
        }, file.type, quality);
      };
      
      img.onerror = (error) => {
        reject(error);
      };
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const NFTRequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    quantity: '',
    category: 'Other'
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'File must be JPEG or PNG'
      }));
      return;
    }

    // Validate file size - limit to 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors(prev => ({
        ...prev,
        image: 'File size must be less than 5MB'
      }));
      return;
    }

    try {
      setLoading(true);
      setLoadingState('Optimizing image...');
      setUploadProgress(10);
      
      // Store original file size for comparison
      setOriginalFileSize(file.size);
      
      // Show optimizing message
      toast.info('Optimizing image for faster upload...');
      
      // Compress the image
      const processedFile = await compressImage(file, {
        maxDimension: 1200,
        quality: 0.7
      });
      
      setLoadingState('Uploading image...');
      setUploadProgress(30);

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('image', processedFile);

      // Upload to server
      const response = await api.post('/marketplace/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 60) / progressEvent.total) + 30;
          setUploadProgress(Math.min(90, percentCompleted));
        }
      });

      // Calculate size reduction percentage
      const reduction = Math.round(100 - ((processedFile.size / file.size) * 100));
      if (reduction > 5) {
        toast.success(`Successfully reduced file size by ${reduction}%`);
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: response.data.url
      }));
      setFileName(file.name);
      
      // Clear any existing error
      setErrors(prev => ({
        ...prev,
        image: null
      }));

      setUploadProgress(100);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading image');
      setErrors(prev => ({
        ...prev,
        image: 'Failed to upload image'
      }));
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingState('');
        setUploadProgress(0);
      }, 1000);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    setFileName('');
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setLoadingState('Submitting request...');
      
      await api.post('/marketplace/nft-request', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      
      toast.success('NFT request submitted successfully');
      navigate('/marketplace/my-requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
      setLoadingState('');
    }
  };

  // Display file size info
  const getFileSizeInfo = () => {
    if (!formData.imageUrl || !originalFileSize) return null;
    
    const reduction = Math.round(100 - ((originalFileSize / originalFileSize) * 100));
    
    if (reduction > 5) {
      return (
        <p className="mt-1 text-xs text-green-600">
          Optimized: {Math.round(originalFileSize/1024)}KB ({reduction}% smaller)
        </p>
      );
    }
    
    return (
      <p className="mt-1 text-xs text-gray-600">
        Size: {Math.round(originalFileSize/1024)}KB
      </p>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create NFT Request</h2>
      
      {loading && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FiLoader className="animate-spin mr-2 text-indigo-600" />
            <span className="font-medium text-gray-700">{loadingState}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            NFT Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter NFT name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your NFT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <div className="mt-1">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              required={!formData.imageUrl}
              className="hidden"
              id="nft-image"
            />
            
            {formData.imageUrl ? (
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                  <FiFile className="text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-700 flex-grow truncate">
                    {fileName}
                  </span>
                  {getFileSizeInfo()}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <img
                  src={formData.imageUrl}
                  alt="NFT Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            ) : (
              <label
                htmlFor="nft-image"
                className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiUpload className="mr-2" />
                Upload Image
              </label>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: JPEG, PNG (max 5MB)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Art">Art</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Financial">Financial</option>
            <option value="Gaming">Gaming</option>
            <option value="Collectibles">Collectibles</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (ETH)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.000001"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default NFTRequestForm;