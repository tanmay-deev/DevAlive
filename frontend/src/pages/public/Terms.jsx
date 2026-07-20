import React from 'react';

export function Terms() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 text-on-surface">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-on-surface-variant mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using DevAlive ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our Service. The Service is provided as a developer tool for monitoring uptime and performance of web applications and APIs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You agree not to use the Service to monitor endpoints you do not own or have explicit permission to monitor.</li>
              <li>You agree not to abuse the monitoring intervals or attempt to use the Service for Denial of Service (DoS) attacks.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Fair Usage Policy</h2>
            <p>
              DevAlive is currently provided as a free tool. To ensure quality of service for all users, we reserve the right to rate-limit, pause, or terminate accounts that generate excessive load or violate our acceptable use guidelines. We automatically block monitoring of internal, loopback, or private IP addresses to prevent SSRF vulnerabilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee 100% accuracy of downtime alerts or response times. DevAlive shall not be liable for any indirect, incidental, or consequential damages arising from the use of or inability to use the Service, including missed alerts or false positives.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any significant changes via the email associated with their account. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
