interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-serif text-gray-800 mb-1">Privacy Policy</h2>
        <p className="text-sm text-gray-400 mb-6">Effective Date: April 9, 2026</p>

        <div className="space-y-5 text-gray-600 text-sm leading-relaxed">

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">1. Introduction</h3>
            <p>Digital Dog Day Planner &amp; Calendar ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our App.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">2. Information We Collect</h3>
            <p>We collect the following information:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li><strong>Account information:</strong> Your email address, collected when you register</li>
              <li><strong>Planning data:</strong> Calendar entries, hourly plans, and notes you create within the App</li>
              <li><strong>Calendar integration data:</strong> If you connect Google Calendar, we access your calendar events solely to display and sync them within the App</li>
              <li><strong>Usage data:</strong> Basic usage information to maintain and improve the service</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">3. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Provide, operate, and maintain the App</li>
              <li>Authenticate your account and maintain your session</li>
              <li>Store and sync your planning data across devices</li>
              <li>Send password reset and account-related emails</li>
              <li>Improve and develop new features</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">4. Data Storage and Security</h3>
            <p>Your data is stored securely using Supabase, a trusted cloud database provider. All data is encrypted in transit using SSL/TLS and encrypted at rest. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">5. Third-Party Services</h3>
            <p>The App uses the following third-party services:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li><strong>Supabase</strong> — authentication and database storage</li>
              <li><strong>Google Calendar API</strong> — optional calendar integration (only if you choose to connect)</li>
              <li><strong>Vercel</strong> — application hosting and delivery</li>
            </ul>
            <p className="mt-1">Each of these services has its own privacy policy governing their data practices.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">6. Google Calendar Integration</h3>
            <p>If you choose to connect your Google Calendar, we request read access to your calendar events to display them alongside your Dog Day plans. We do not store your Google credentials. You may revoke access at any time through your Google account settings.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">7. Data Retention</h3>
            <p>We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us through the App's feedback feature.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">8. Children's Privacy</h3>
            <p>The App is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">9. Your Rights</h3>
            <p>Depending on your location, you may have the right to access, correct, or delete your personal data, or to object to or restrict certain processing of your data. To exercise these rights, contact us through the App's feedback feature.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">10. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the effective date at the top of this policy. Continued use of the App after changes are posted constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">11. Contact Us</h3>
            <p>If you have questions or concerns about this Privacy Policy, please contact us through the App's feedback feature.</p>
          </section>

          <p className="text-xs text-gray-400 pt-2">© 2026 Digital Dog Day Planner &amp; Calendar. All Rights Reserved.</p>
        </div>

        <button onClick={onClose} className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Close</button>
      </div>
    </div>
  );
}
