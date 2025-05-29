import React, { useState, useEffect } from 'react';
import { FiSave, FiEdit, FiEye, FiRefreshCw, FiBook, FiFileText, FiHelpCircle, FiShield, FiAlertTriangle } from 'react-icons/fi';
import api from '../../utils/api';

const ContentManagement = () => {
  const [selectedContent, setSelectedContent] = useState('documentation');
  const [contentData, setContentData] = useState({});
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const contentTypes = [
    {
      id: 'documentation',
      name: 'Documentation',
      icon: <FiBook className="w-5 h-5" />,
      description: 'Platform documentation and guides'
    },
    {
      id: 'whitepaper',
      name: 'Whitepaper',
      icon: <FiFileText className="w-5 h-5" />,
      description: 'Technical whitepaper and tokenomics'
    },
    {
      id: 'support',
      name: 'Support',
      icon: <FiHelpCircle className="w-5 h-5" />,
      description: 'Support center and help content'
    },
    {
      id: 'faq',
      name: 'FAQs',
      icon: <FiHelpCircle className="w-5 h-5" />,
      description: 'Frequently asked questions'
    },
    {
      id: 'privacy',
      name: 'Privacy Policy',
      icon: <FiShield className="w-5 h-5" />,
      description: 'Privacy policy and data protection'
    },
    {
      id: 'terms',
      name: 'Terms of Service',
      icon: <FiFileText className="w-5 h-5" />,
      description: 'Terms of service and user agreements'
    },
    {
      id: 'cookies',
      name: 'Cookie Policy',
      icon: <FiAlertTriangle className="w-5 h-5" />,
      description: 'Cookie policy and preferences'
    }
  ];

  // Load content when component mounts or selected content changes
  useEffect(() => {
    loadContent(selectedContent);
  }, [selectedContent]);

  const loadContent = async (contentType) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log(`Loading content for type: ${contentType}`);
      const response = await api.get(`/admin/content/${contentType}`);
      
      if (response.data.success) {
        const content = response.data.data.content;
        setContentData({ ...contentData, [contentType]: content });
        setEditingContent(content);
      } else {
        setError('Failed to load content');
      }
      
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    if (!editingContent.trim()) {
      setError('Content cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      console.log(`Saving content for type: ${selectedContent}`);
      const response = await api.put(`/admin/content/${selectedContent}`, { 
        title: currentContentType?.name || 'Untitled',
        content: editingContent 
      });
      
      if (response.data.success) {
        setContentData({ ...contentData, [selectedContent]: editingContent });
        setIsEditing(false);
        setMessage('Content saved successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to save content');
      }
      
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingContent(contentData[selectedContent] || '');
    setIsEditing(false);
    setError('');
  };

  const currentContentType = contentTypes.find(type => type.id === selectedContent);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage and update platform content including documentation, policies, and support materials.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Content Type Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content Types</h2>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContent(type.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    selectedContent === type.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-dark-darker text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {type.icon}
                  <div className="flex-1">
                    <div className="font-medium">{type.name}</div>
                    <div className={`text-xs ${selectedContent === type.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                      {type.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentContentType?.icon}
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {currentContentType?.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {currentContentType?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadContent(selectedContent)}
                    disabled={isLoading || isSaving}
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                    title="Refresh content"
                  >
                    <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveContent}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content (Markdown supported)
                    </label>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white font-mono text-sm"
                      placeholder="Enter your content here..."
                    />
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-dark-darker p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Markdown Tips:</h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <p><code># Title</code> - Large heading</p>
                      <p><code>## Subtitle</code> - Medium heading</p>
                      <p><code>**bold text**</code> - Bold text</p>
                      <p><code>*italic text*</code> - Italic text</p>
                      <p><code>[link text](URL)</code> - Create links</p>
                      <p><code>- item</code> - Bullet points</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-slate-50 dark:bg-dark-darker p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FiEye className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Preview Mode</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-900 dark:text-white leading-relaxed">
                      {contentData[selectedContent] || 'No content available. Click Edit to add content.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement; 