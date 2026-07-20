import React from 'react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 text-on-surface">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight">Privacy Policy</h1>
        <p className="text-on-surface-variant mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              When you use DevAlive, we collect information necessary to provide you with our monitoring services:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li><strong>Account Information:</strong> Your name, email address, and authentication credentials (including OAuth tokens from Google).</li>
              <li><strong>Monitoring Data:</strong> URLs, IP addresses, and endpoints you configure us to monitor.</li>
              <li><strong>Performance Logs:</strong> Response times, HTTP status codes, and downtime events associated with your projects.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use the collected information strictly to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Execute automated health checks against your configured endpoints.</li>
              <li>Send you downtime and recovery alerts via email.</li>
              <li>Maintain and improve the security of the DevAlive platform.</li>
              <li>Display analytical data within your dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard security measures to protect your data. Authentication tokens and passwords (if applicable) are securely hashed or encrypted. Your monitoring logs are stored securely in our MongoDB databases and are only accessible by you when logged into your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to others. We may use third-party service providers (such as Google OAuth for authentication, or email delivery services) to help us operate our business. These third parties have access to your personal information only to perform these tasks on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with DevAlive, please contact us at tanmaybonde20@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
