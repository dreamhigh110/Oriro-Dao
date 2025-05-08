import React, { useState, useRef } from 'react';
import { 
  FiUpload, 
  FiMail, 
  FiPhone, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiClock,
  FiFile,
  FiTrash2,
  FiLoader
} from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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
        
        // Use toBlob for better browser support
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

const KycForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    contactEmail: currentUser?.email || '',
    contactPhone: currentUser?.contactPhone || ''
  });
  const [files, setFiles] = useState({
    idDocument: null,
    addressDocument: null
  });
  const [fileNames, setFileNames] = useState({
    idDocument: '',
    addressDocument: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [originalFileSizes, setOriginalFileSizes] = useState({
    idDocument: 0,
    addressDocument: 0
  });
  
  // Create refs for file inputs
  const idDocumentRef = useRef(null);
  const addressDocumentRef = useRef(null);

  // Display the current KYC status with the appropriate status badge
  const renderKycStatus = () => {
    if (!currentUser) return null;

    const statusConfig = {
      not_submitted: {
        icon: <FiInfo className="text-gray-500" />,
        text: 'Not Submitted',
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-700 dark:text-gray-300'
      },
      pending: {
        icon: <FiClock className="text-yellow-500" />,
        text: 'Pending Review',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300'
      },
      approved: {
        icon: <FiCheckCircle className="text-green-500" />,
        text: 'Approved',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300'
      },
      rejected: {
        icon: <FiAlertCircle className="text-red-500" />,
        text: 'Rejected',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300'
      }
    };

    const status = currentUser.kycStatus || 'not_submitted';
    const config = statusConfig[status];

    return (
      <div className={`flex items-center px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium`}>
        {config.icon}
        <span className="ml-1.5">{config.text}</span>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and size
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          [field]: 'File must be JPEG, PNG, or PDF'
        });
        return;
      }
      
      if (file.size > maxSize) {
        setErrors({
          ...errors,
          [field]: 'File size must be less than 5MB'
        });
        return;
      }
      
      // Clear any previous errors for this field
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
      
      // Store the original file size for reporting
      setOriginalFileSizes(prev => ({
        ...prev,
        [field]: file.size
      }));
      
      // Optimize image files before upload
      let processedFile = file;
      if (file.type.startsWith('image/')) {
        try {
          setLoadingState(`Optimizing ${field === 'idDocument' ? 'ID' : 'Address'} document...`);
          setLoading(true);
          
          // Show optimizing message
          toast.info(`Optimizing ${field === 'idDocument' ? 'ID' : 'Address'} document for faster upload...`);
          
          // Compress the image
          processedFile = await compressImage(file, {
            maxDimension: 1200,
            quality: 0.7
          });
          
          // Calculate size reduction percentage
          const reduction = Math.round(100 - ((processedFile.size / file.size) * 100));
          
          if (reduction > 5) { // Only notify if there was significant compression
            toast.success(`Successfully reduced file size by ${reduction}%`);
          }
        } catch (error) {
          console.error('Image compression error:', error);
          // Continue with original file if compression fails
          processedFile = file;
          toast.warning('Image optimization failed, using original file');
        } finally {
          setLoading(false);
          setLoadingState('');
        }
      }
      
      // Update files state with processed file
      setFiles({
        ...files,
        [field]: processedFile
      });
      
      // Update file names for display
      setFileNames({
        ...fileNames,
        [field]: file.name
      });
    }
  };

  // Trigger the hidden file input
  const triggerFileInput = (field) => {
    if (field === 'idDocument' && idDocumentRef.current) {
      idDocumentRef.current.click();
    } else if (field === 'addressDocument' && addressDocumentRef.current) {
      addressDocumentRef.current.click();
    }
  };

  // Remove a selected file
  const removeFile = (field) => {
    setFiles({
      ...files,
      [field]: null
    });
    setFileNames({
      ...fileNames,
      [field]: ''
    });
    
    // Reset the file input
    if (field === 'idDocument' && idDocumentRef.current) {
      idDocumentRef.current.value = '';
    } else if (field === 'addressDocument' && addressDocumentRef.current) {
      addressDocumentRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!files.idDocument) {
      newErrors.idDocument = 'Proof of ID is required';
    }

    if (!files.addressDocument) {
      newErrors.addressDocument = 'Proof of address is required';
    }

    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setLoadingState('Preparing files for upload...');
      setUploadProgress(5);
      
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('contactEmail', formData.contactEmail);
      if (formData.contactPhone) {
        formDataToSend.append('contactPhone', formData.contactPhone);
      }
      
      // Append files
      setLoadingState('Uploading ID document...');
      setUploadProgress(20);
      formDataToSend.append('idDocument', files.idDocument);
      
      // Small delay to update UI
      await new Promise(r => setTimeout(r, 500));
      
      setLoadingState('Uploading Address document...');
      setUploadProgress(40);
      formDataToSend.append('addressDocument', files.addressDocument);
      
      // Small delay to update UI
      await new Promise(r => setTimeout(r, 500));
      
      setLoadingState('Processing documents & verifying information...');
      setUploadProgress(60);

      const response = await api.put('/auth/kyc', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // Calculate the upload percentage
          const percentCompleted = Math.min(90, Math.round((progressEvent.loaded * 30 / progressEvent.total) + 60));
          setUploadProgress(percentCompleted);
          if (percentCompleted > 80) {
            setLoadingState('Almost done! Processing on server...');
          }
        }
      });

      setUploadProgress(100);
      setLoadingState('Success! Documents uploaded');

      if (response.data) {
        toast.success('KYC information submitted successfully. It will be reviewed by our team.');
        // Reset form state after successful submission
        setFiles({
          idDocument: null,
          addressDocument: null
        });
        setFileNames({
          idDocument: '',
          addressDocument: ''
        });
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit KYC information. Please try again later.');
      }
    } finally {
      // Small delay for better UX
      setTimeout(() => {
        setLoading(false);
        setLoadingState('');
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Display file size info
  const getFileSizeInfo = (field) => {
    if (!files[field]) return null;
    
    const original = originalFileSizes[field];
    const current = files[field].size;
    const reduction = original > 0 ? Math.round(100 - ((current / original) * 100)) : 0;
    
    if (reduction > 5) {
      return (
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
          Optimized: {(current / 1024).toFixed(0)}KB ({reduction}% smaller)
        </p>
      );
    }
    
    return (
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        Size: {(current / 1024).toFixed(0)}KB
      </p>
    );
  };

  // Show different UI based on KYC status
  if (currentUser?.kycStatus === 'approved') {
    return (
      <div className="bg-white dark:bg-dark-darker rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">KYC Verification</h2>
          {renderKycStatus()}
        </div>
        
        <div className="flex items-center justify-center p-8 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/30">
          <div className="text-center">
            <FiCheckCircle className="mx-auto text-green-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verification Complete</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your KYC verification has been approved. You now have full access to all platform features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.kycStatus === 'pending') {
    return (
      <div className="bg-white dark:bg-dark-darker rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">KYC Verification</h2>
          {renderKycStatus()}
        </div>
        
        <div className="flex items-center justify-center p-8 bg-yellow-50 dark:bg-yellow-900/10 rounded-md border border-yellow-100 dark:border-yellow-900/30">
          <div className="text-center">
            <FiClock className="mx-auto text-yellow-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verification In Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your KYC information has been submitted and is currently being reviewed by our team. 
              This process typically takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // For rejected or not submitted states, show the form
  // This renders both the default and rejected states with appropriate messaging
  const isRejected = currentUser?.kycStatus === 'rejected';
  
  return (
    <div className="bg-white dark:bg-dark-darker rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">KYC Verification</h2>
        {renderKycStatus()}
      </div>
      
      {isRejected ? (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/30">
          <div className="flex">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="text-md font-medium text-red-800 dark:text-red-300">Verification Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                {currentUser.kycStatusMessage || 'Your verification was rejected. Please resubmit with the correct documentation.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-900/30">
          <div className="flex">
            <FiInfo className="text-blue-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="text-md font-medium text-blue-800 dark:text-blue-300">Verification Required</h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                To access all platform features, please submit your KYC documents for verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FiLoader className="animate-spin mr-2 text-primary" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{loadingState}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isRejected ? 'Resubmit KYC Documents' : 'Submit KYC Documents'}
          </h3>
          
          {/* ID Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proof of ID (Passport, Driver's License, ID Card)
            </label>
            <div className="mt-1">
              {/* Hidden file input */}
              <input
                type="file"
                ref={idDocumentRef}
                className="hidden"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileChange(e, 'idDocument')}
              />
              
              {fileNames.idDocument ? (
                <div className="flex items-center p-3 bg-gray-50 dark:bg-dark-light rounded-md border border-gray-200 dark:border-gray-700">
                  <FiFile className="text-primary mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow truncate">
                    {fileNames.idDocument}
                  </span>
                  {getFileSizeInfo('idDocument')}
                  <button
                    type="button"
                    onClick={() => removeFile('idDocument')}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('idDocument')}
                  className={`w-full flex items-center justify-center px-4 py-2 border ${
                    errors.idDocument 
                      ? 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-light'
                  } rounded-md hover:bg-gray-50 dark:hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  <FiUpload className="mr-2" />
                  Upload ID Document
                </button>
              )}
              {errors.idDocument && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.idDocument}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Accepted formats: JPEG, PNG, PDF (max 5MB)
              </p>
            </div>
          </div>
          
          {/* Address Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proof of Address (Utility Bill, Bank Statement)
            </label>
            <div className="mt-1">
              {/* Hidden file input */}
              <input
                type="file"
                ref={addressDocumentRef}
                className="hidden"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileChange(e, 'addressDocument')}
              />
              
              {fileNames.addressDocument ? (
                <div className="flex items-center p-3 bg-gray-50 dark:bg-dark-light rounded-md border border-gray-200 dark:border-gray-700">
                  <FiFile className="text-primary mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-grow truncate">
                    {fileNames.addressDocument}
                  </span>
                  {getFileSizeInfo('addressDocument')}
                  <button
                    type="button"
                    onClick={() => removeFile('addressDocument')}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('addressDocument')}
                  className={`w-full flex items-center justify-center px-4 py-2 border ${
                    errors.addressDocument 
                      ? 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-light'
                  } rounded-md hover:bg-gray-50 dark:hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  <FiUpload className="mr-2" />
                  Upload Address Document
                </button>
              )}
              {errors.addressDocument && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.addressDocument}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Accepted formats: JPEG, PNG, PDF (max 5MB)
              </p>
            </div>
          </div>
          
          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contactEmail">
              Contact Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.contactEmail 
                    ? 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/10' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-light'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                placeholder="Your contact email"
              />
            </div>
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
            )}
          </div>
          
          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contactPhone">
              Contact Phone Number <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                id="contactPhone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
                placeholder="Your phone number"
              />
            </div>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingState || 'Submitting...'}
              </>
            ) : (
              isRejected ? 'Resubmit KYC Information' : 'Submit KYC Information'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KycForm;