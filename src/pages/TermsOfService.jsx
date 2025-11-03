import React from 'react';

const TermsOfService = () => {
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction and Acceptance</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Welcome to Oriro DAO. These Terms of Service ("Terms") govern your use of our decentralized 
              autonomous organization platform, website, and related services (collectively, the "Services"). 
              By accessing or using our Services, you agree to be bound by these Terms.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If you do not agree to these Terms, you may not access or use our Services. 
              We reserve the right to modify these Terms at any time, and your continued use 
              constitutes acceptance of such modifications.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Eligibility</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              To use our Services, you must:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into agreements</li>
              <li>Not be prohibited from using our Services under applicable laws</li>
              <li>Complete identity verification when required</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Account Registration and Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3.1 Account Creation</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  You may need to create an account to access certain features. You agree to provide 
                  accurate, current, and complete information and to update such information to maintain accuracy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3.2 Account Security</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account. You must notify us immediately 
                  of any unauthorized use.
                </p>
              </div>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Description of Services</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Oriro DAO provides a decentralized platform that includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
              <li>NFT marketplace for buying, selling, and trading digital assets</li>
              <li>Bond marketplace for tokenized debt instruments</li>
              <li>Governance system for community decision-making</li>
              <li>Staking services for earning rewards</li>
              <li>Multi-chain infrastructure support</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. User Responsibilities and Prohibited Activities</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">5.1 You agree to:</h3>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
                  <li>Use the Services in compliance with all applicable laws</li>
                  <li>Provide accurate information and documentation</li>
                  <li>Maintain the security of your accounts and wallets</li>
                  <li>Respect intellectual property rights</li>
                  <li>Report security vulnerabilities responsibly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">5.2 You agree not to:</h3>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 ml-4">
                  <li>Engage in fraudulent, illegal, or harmful activities</li>
                  <li>Manipulate markets or engage in market abuse</li>
                  <li>Upload malicious content or software</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Create fake accounts or impersonate others</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Financial Terms */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Financial Terms and Fees</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">6.1 Platform Fees</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  We charge fees for certain transactions and services. Current fee structures are 
                  available on our platform and may be updated from time to time with notice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">6.2 Payment Terms</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  All fees are payable in cryptocurrency. You are responsible for any network fees, 
                  gas costs, or other blockchain-related expenses.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Intellectual Property Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">7.1 Our Rights</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  The Oriro DAO platform, including its software, design, content, and trademarks, 
                  is owned by us or our licensors and is protected by intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">7.2 User Content</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  You retain ownership of content you create or upload. By using our Services, 
                  you grant us a license to use, display, and distribute your content as necessary 
                  to provide our Services.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Privacy and Data Protection</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is 
              governed by our Privacy Policy, which is incorporated into these Terms by reference. 
              Please review our 
              <a href="/privacy" className="text-primary hover:text-primary-dark"> Privacy Policy </a>
              to understand our practices.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Disclaimers and Warnings</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Risk Disclosures:</h3>
              <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1 ml-4">
                <li>Cryptocurrency investments carry significant risk of loss</li>
                <li>Smart contracts may contain bugs or vulnerabilities</li>
                <li>Blockchain transactions are irreversible</li>
                <li>Regulatory environments may change</li>
                <li>Market volatility can result in substantial losses</li>
              </ul>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Our Services are provided "as is" without warranties of any kind. We do not guarantee 
              the accuracy, completeness, or reliability of any information or the availability of our Services.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To the maximum extent permitted by law, Oriro DAO and its affiliates shall not be liable 
              for any direct, indirect, incidental, special, consequential, or punitive damages arising 
              from your use of our Services, including but not limited to financial losses, data loss, 
              or business interruption.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Indemnification</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              You agree to indemnify and hold harmless Oriro DAO from any claims, damages, losses, 
              or expenses arising from your use of our Services, violation of these Terms, or 
              infringement of any third-party rights.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Termination</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We may suspend or terminate your access to our Services at any time, with or without 
              cause or notice. Upon termination, your right to use our Services ceases immediately. 
              Provisions that should survive termination will remain in effect.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">13. Governing Law and Dispute Resolution</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">13.1 Governing Law</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  These Terms are governed by and construed in accordance with applicable laws, 
                  without regard to conflict of law principles.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">13.2 Dispute Resolution</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Any disputes arising from these Terms or your use of our Services shall be resolved 
                  through binding arbitration, except where prohibited by applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">14. Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-50 dark:bg-dark-darker p-4 rounded-lg">
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                <strong>Email:</strong> legal@oriro.org
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                <strong>Support:</strong> support@oriro.org
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <strong>General Inquiries:</strong> info@oriro.org
              </p>
            </div>
          </section>

        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Related Policies</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/privacy"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Privacy Policy
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

export default TermsOfService; 