import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMessageCircle, FiShield, FiUsers, FiFileText } from 'react-icons/fi';
import api from '../utils/api';

const Support = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    priority: 'medium',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content/support');
      if (response.data.success) {
        setContent(response.data.data.content);
      } else {
        console.error('Failed to load support content');
      }
    } catch (err) {
      console.error('Error fetching support content:', err);
      // Set fallback content if API fails
      setContent(getDefaultContent());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Support Center

## Contact Information
- General Support: support@oriro.org
- Technical Issues: tech@oriro.org
- Security Concerns: security@oriro.org

## Response Times
- General inquiries: 24-48 hours
- Technical support: 4-12 hours
- Security issues: Immediate response

## Common Issues
1. Wallet connection problems
2. Transaction failures
3. Account verification`;
  };

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-bold text-slate-900 dark:text-white mb-6 mt-8">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 mt-6">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-slate-900 dark:text-white mb-3 mt-4">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-slate-700 dark:text-slate-300 ml-4">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-slate-900 dark:text-white mb-2">{line.slice(2, -2)}</p>;
      } else {
        return <p key={index} className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{line}</p>;
      }
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Support ticket submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      category: 'general',
      priority: 'medium',
      subject: '',
      message: ''
    });
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
  };

  const supportCategories = [
    { value: 'technical', label: 'Technical Issues' },
    { value: 'account', label: 'Account Problems' },
    { value: 'trading', label: 'Trading & Marketplace' },
    { value: 'staking', label: 'Staking & Rewards' },
    { value: 'governance', label: 'Governance Questions' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'other', label: 'Other' }
  ];

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email with detailed responses',
      contact: 'support@oriro.org',
      responseTime: '24 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9AM-6PM UTC',
      responseTime: 'Instant'
    },
    {
      icon: '📱',
      title: 'Discord Community',
      description: 'Join our Discord for community support',
      contact: 'discord.gg/oriro',
      responseTime: 'Community driven'
    },
    {
      icon: '📚',
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      contact: 'View Documentation',
      responseTime: 'Self-service'
    }
  ];

  const commonIssues = [
    {
      title: 'Wallet Connection Issues',
      description: 'How to connect and troubleshoot wallet problems',
      category: 'Technical',
      link: '/docs#wallet'
    },
    {
      title: 'Transaction Failed',
      description: 'Understanding failed transactions and gas fees',
      category: 'Technical',
      link: '/docs#transactions'
    },
    {
      title: 'Staking Rewards',
      description: 'How staking rewards are calculated and distributed',
      category: 'Staking',
      link: '/docs#staking-basics'
    },
    {
      title: 'NFT Not Showing',
      description: 'Troubleshoot NFT display issues in your collection',
      category: 'Marketplace',
      link: '/docs#nft-requests'
    },
    {
      title: 'Governance Voting',
      description: 'How to participate in DAO governance and voting',
      category: 'Governance',
      link: '/docs#voting'
    },
    {
      title: 'Account Verification',
      description: 'KYC process and account verification steps',
      category: 'Account',
      link: '/docs#kyc'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Support Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Database Content Section */}
        {!isLoading && content && (
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 mb-12">
            <div className="prose dark:prose-invert max-w-none">
              {renderMarkdown(content)}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center mb-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{method.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{method.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{method.description}</p>
              <p className="text-primary font-medium mb-2">{method.contact}</p>
              <span className="text-xs text-slate-500 dark:text-slate-400">Response: {method.responseTime}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Ticket Form */}
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  placeholder="Please provide as much detail as possible about your issue..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Common Issues */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Common Issues</h2>
              
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="border border-slate-200 dark:border-dark rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-dark-darker transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{issue.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{issue.description}</p>
                        <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {issue.category}
                        </span>
                      </div>
                      <Link
                        to={issue.link}
                        className="ml-4 text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Security Emergency?</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                If you've experienced a security breach or unauthorized access, contact us immediately.
              </p>
              <a
                href="mailto:security@oriro.org"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
              >
                security@oriro.org
              </a>
            </div>

            {/* Status Page */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">System Status</h3>
              <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                Check our system status page for real-time updates on platform availability.
              </p>
              <a
                href="https://status.oriro.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
              >
                View Status Page
              </a>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-white/90 mb-6">
            Our team is committed to providing excellent support. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Browse Documentation
            </Link>
            <Link
              to="/faq"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 