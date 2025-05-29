import React from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Oriro DAO ("we," "our," or "us") is committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website, use our services, or interact with our decentralized autonomous organization platform.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              By using our services, you consent to the data practices described in this Privacy Policy. 
              If you do not agree with this policy, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2.1 Personal Information</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  We may collect personal information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
                  <li>Name, email address, and contact information</li>
                  <li>Identity verification documents (for KYC compliance)</li>
                  <li>Wallet addresses and transaction data</li>
                  <li>Profile information and preferences</li>
                  <li>Support ticket communications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2.2 Technical Information</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  We automatically collect certain technical information when you use our services:
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
                  <li>IP addresses and device identifiers</li>
                  <li>Browser type and version</li>
                  <li>Operating system information</li>
                  <li>Usage patterns and analytics data</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2.3 Blockchain Data</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  As a blockchain-based platform, certain information is stored on public blockchains, 
                  including transaction histories, smart contract interactions, and token holdings. 
                  This information is publicly accessible and immutable.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and marketplace activities</li>
              <li>Verifying user identities for regulatory compliance</li>
              <li>Communicating with users about their accounts and our services</li>
              <li>Improving our platform and user experience</li>
              <li>Detecting and preventing fraud or unauthorized activities</li>
              <li>Complying with legal obligations and regulatory requirements</li>
              <li>Sending marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">4.1 We may share your information in the following circumstances:</h3>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
                  <li>With service providers who assist in operating our platform</li>
                  <li>For legal compliance, court orders, or regulatory requirements</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with business transfers or acquisitions</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">4.2 We do not sell your personal information to third parties.</h3>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Incident response and breach notification procedures</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Data Retention</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services, 
              comply with legal obligations, resolve disputes, and enforce our agreements. 
              Specific retention periods may vary based on the type of information and applicable regulations.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Your Privacy Rights</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
              <li>Right to access your personal information</li>
              <li>Right to correct or update inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to restrict processing of your information</li>
              <li>Right to data portability</li>
              <li>Right to object to certain processing activities</li>
              <li>Right to withdraw consent (where applicable)</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@oriro.org.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and features</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              You can control cookie settings through your browser preferences. Please see our 
              <a href="/cookies" className="text-primary hover:text-primary-dark"> Cookie Policy </a>
              for more detailed information.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. International Data Transfers</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              As a global platform, your information may be transferred to and processed in countries 
              other than your country of residence. We ensure appropriate safeguards are in place to 
              protect your information during such transfers, including data processing agreements and 
              adherence to applicable data protection frameworks.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Children's Privacy</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly 
              collect personal information from children under 18. If you believe we have collected 
              information from a child under 18, please contact us immediately so we can delete such information.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Updates to This Privacy Policy</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              services, or applicable laws. We will notify you of any material changes by posting the 
              updated policy on our website and updating the "Last updated" date. Your continued use 
              of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our 
              data practices, please contact us:
            </p>
            <div className="bg-slate-50 dark:bg-dark-darker p-4 rounded-lg">
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                <strong>Email:</strong> privacy@oriro.org
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                <strong>Data Protection Officer:</strong> dpo@oriro.org
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <strong>Support:</strong> support@oriro.org
              </p>
            </div>
          </section>

        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Related Policies</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/terms"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 