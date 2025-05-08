import React, { useState, useEffect } from 'react';
import { FiFileText, FiImage, FiExternalLink, FiDownload, FiEye } from 'react-icons/fi';

const DocumentViewer = ({ documentPath, documentName, type = 'unknown' }) => {
  const [loading, setLoading] = useState(true);
  
  // Extract file extension from path or name
  const getFileExtension = () => {
    const name = documentName || documentPath;
    if (!name) return 'unknown';
    
    // Check if it's a Cloudinary URL
    if (name.includes('cloudinary.com')) {
      // Extract format from Cloudinary URL
      const formatMatch = name.match(/\.(jpg|jpeg|png|gif|pdf)$/i);
      if (formatMatch) return formatMatch[1].toLowerCase();
      
      // Check for format parameter in URL
      const formatParamMatch = name.match(/format=(jpg|jpeg|png|gif|pdf)/i);
      if (formatParamMatch) return formatParamMatch[1].toLowerCase();
      
      return 'unknown';
    }
    
    // Regular file name parsing
    const parts = name.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
    return 'unknown';
  };
  
  const extension = getFileExtension();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  const isPdf = extension === 'pdf';
  
  // Function to render appropriate icon based on file type
  const renderFileIcon = () => {
    if (isImage) return <FiImage className="text-blue-500 text-xl" />;
    if (isPdf) return <FiFileText className="text-red-500 text-xl" />;
    return <FiFileText className="text-gray-500 text-xl" />;
  };
  
  // Determine if URL is a Cloudinary URL
  const isCloudinaryUrl = documentPath && documentPath.includes('cloudinary.com');
  
  // Build the document URL
  const getDocumentUrl = () => {
    if (!documentPath) return '';
    
    // If it's already a Cloudinary URL, use it directly
    if (isCloudinaryUrl) {
      return documentPath;
    }
    
    // Handle local path
    let cleanPath = documentPath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    if (cleanPath.startsWith('kyc/')) {
      cleanPath = cleanPath.substring(4);
    }
    
    return `/uploads/${cleanPath}`;
  };
  
  const documentUrl = getDocumentUrl();
  
  // For PDF preview in a new window
  const openPdfPreview = () => {
    if (isPdf) {
      window.open(documentUrl, '_blank');
    }
  };
  
  // Handle image load completion
  useEffect(() => {
    if (!isImage && !isPdf) {
      setLoading(false);
    }
  }, [isImage, isPdf]);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {renderFileIcon()}
          <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
            {type === 'id' ? 'ID Document' : type === 'address' ? 'Address Document' : 'Document'}
          </span>
        </div>
        <div className="flex space-x-2">
          {isPdf && (
            <button
              onClick={openPdfPreview}
              className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="View PDF"
            >
              <FiEye />
            </button>
          )}
          <a 
            href={documentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Open in new tab"
          >
            <FiExternalLink />
          </a>
          <a 
            href={isCloudinaryUrl ? documentUrl : `${documentUrl}?download=true`}
            download={documentName || `document.${extension}`}
            className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Download"
            onClick={(e) => {
              if (isPdf && !isCloudinaryUrl) {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = documentUrl;
                link.download = documentName || `document.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            <FiDownload />
          </a>
        </div>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {isImage ? (
          <img 
            src={documentUrl} 
            alt={`${type} document`} 
            className="w-full h-auto max-h-96 object-contain"
            onLoad={() => setLoading(false)}
            onError={() => {
              console.error("Failed to load image:", documentUrl);
              setLoading(false);
            }}
          />
        ) : isPdf ? (
          <div className="relative flex items-center justify-center" style={{ height: '300px' }}>
            <div className="p-4 text-center">
              <FiFileText className="mx-auto text-4xl text-red-500 mb-2" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">PDF Document</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Click the eye icon to view this PDF in a new tab
              </p>
              <button
                onClick={openPdfPreview}
                className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark"
              >
                <FiEye className="inline mr-2" /> View PDF
              </button>
            </div>
            {/* Hidden iframe to trigger loading state completion */}
            <iframe 
              src={documentUrl} 
              style={{ display: 'none' }} 
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              title="pdf-loader"
            />
          </div>
        ) : (
          <div className="p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <FiFileText className="mr-2" />
            <span>Document preview not available</span>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
        {documentName || (isCloudinaryUrl ? "Cloud Hosted Document" : documentPath) || 'Unknown document'}
      </div>
    </div>
  );
};

export default DocumentViewer; 