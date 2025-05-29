import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      department: ''
    });
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'General Inquiries',
      subtitle: 'For general questions and information',
      contact: 'info@oriro.org',
      description: 'Get in touch for general questions about our platform'
    },
    {
      icon: '🛠️',
      title: 'Technical Support',
      subtitle: 'For technical issues and bugs',
      contact: 'support@oriro.org',
      description: 'Report technical issues or get help with the platform'
    },
    {
      icon: '🤝',
      title: 'Business Development',
      subtitle: 'For partnerships and business inquiries',
      contact: 'business@oriro.org',
      description: 'Explore partnership opportunities and collaborations'
    },
    {
      icon: '🔒',
      title: 'Security',
      subtitle: 'For security-related concerns',
      contact: 'security@oriro.org',
      description: 'Report security vulnerabilities or concerns'
    },
    {
      icon: '📰',
      title: 'Media & Press',
      subtitle: 'For media inquiries and press releases',
      contact: 'press@oriro.org',
      description: 'Media inquiries and press-related communications'
    },
    {
      icon: '⚖️',
      title: 'Legal',
      subtitle: 'For legal matters and compliance',
      contact: 'legal@oriro.org',
      description: 'Legal inquiries and compliance matters'
    }
  ];

  const departments = [
    { value: '', label: 'Select Department' },
    { value: 'general', label: 'General Inquiries' },
    { value: 'support', label: 'Technical Support' },
    { value: 'business', label: 'Business Development' },
    { value: 'security', label: 'Security' },
    { value: 'press', label: 'Media & Press' },
    { value: 'legal', label: 'Legal' }
  ];

  const officeInfo = {
    headquarters: {
      title: 'Headquarters',
      address: 'Virtual Office',
      description: 'Oriro DAO operates as a decentralized organization with team members worldwide.'
    },
    hours: {
      title: 'Response Times',
      general: 'General Inquiries: 24-48 hours',
      support: 'Technical Support: 4-12 hours',
      security: 'Security Issues: Immediate response'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help and answer any questions you may have.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{method.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{method.subtitle}</p>
                <a
                  href={`mailto:${method.contact}`}
                  className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium block mb-3 transition-colors"
                >
                  {method.contact}
                </a>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name *
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
                    Email *
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

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-darker text-slate-900 dark:text-white"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            {/* Office Information */}
            <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Organization Info</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {officeInfo.headquarters.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">
                    {officeInfo.headquarters.address}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {officeInfo.headquarters.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    {officeInfo.hours.title}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      📋 {officeInfo.hours.general}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      🛠️ {officeInfo.hours.support}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      🔒 {officeInfo.hours.security}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Links */}
            <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Join Our Community</h2>
              
              <div className="space-y-4">
                <a
                  href="https://discord.gg/oriro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-50 dark:bg-dark-darker rounded-lg hover:bg-slate-100 dark:hover:bg-dark transition-colors"
                >
                  <div className="text-2xl mr-4">💬</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Discord</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Join our community discussions</p>
                  </div>
                </a>

                <a
                  href="https://twitter.com/oriro_dao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-50 dark:bg-dark-darker rounded-lg hover:bg-slate-100 dark:hover:bg-dark transition-colors"
                >
                  <div className="text-2xl mr-4">🐦</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Twitter</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Follow us for updates</p>
                  </div>
                </a>

                <a
                  href="https://t.me/oriro_dao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-slate-50 dark:bg-dark-darker rounded-lg hover:bg-slate-100 dark:hover:bg-dark transition-colors"
                >
                  <div className="text-2xl mr-4">📱</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Telegram</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Join our Telegram channel</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Emergency Security Contact</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                For urgent security matters, smart contract vulnerabilities, or immediate threats to the platform.
              </p>
              <a
                href="mailto:security@oriro.org"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-block"
              >
                security@oriro.org
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Reference */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Looking for Quick Answers?</h2>
          <p className="text-white/90 mb-6">
            Check out our FAQ section and documentation for immediate answers to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              View FAQ
            </a>
            <a
              href="/docs"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 