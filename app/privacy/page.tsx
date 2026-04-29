export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'DM Serif Display', serif !important; }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-stone-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <a href="/" className="font-serif text-xl text-stone-900 hover:text-amber-700 transition-colors">
            Regala
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-stone-900 mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-12">Last updated: April 7, 2026</p>

        <div className="prose-custom space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">1. Overview</h2>
            <p>
              Regala ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our gift recommendation service at this website (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>

            <p className="font-medium text-stone-800 mb-1">Information you provide directly</p>
            <ul className="list-disc list-inside space-y-1 mb-4 pl-2">
              <li>Quiz answers including occasion, relationship stage, budget, and gift preferences</li>
              <li>Partner or recipient profile information (name, interests, vibe preferences) if you choose to save it</li>
              <li>Email address and authentication credentials if you create an account</li>
            </ul>

            <p className="font-medium text-stone-800 mb-1">Information collected automatically</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>IP address and general location data</li>
              <li>Browser type and device information</li>
              <li>Pages visited and time spent on the Service</li>
              <li>Referral source (how you found us)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Generate personalized gift recommendations tailored to your quiz answers</li>
              <li>Save and retrieve partner profiles if you create an account</li>
              <li>Improve the accuracy and relevance of our recommendation algorithm</li>
              <li>Monitor and analyze usage patterns to improve the Service</li>
              <li>Prevent abuse and enforce our Terms of Service</li>
              <li>Respond to customer support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">4. Affiliate Links and Third-Party Retailers</h2>
            <p>
              Regala participates in affiliate programs including the Amazon Associates Program. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. The price you pay is identical to what you would pay visiting the retailer directly.
            </p>
            <p className="mt-3">
              We do not share your personal information with retailers. Clicking a product link will take you to a third-party website governed by their own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">5. Data Storage and Security</h2>
            <p>
              We use Supabase to store account and profile data. Data is stored on servers located in the United States. We implement reasonable technical and organizational measures to protect your information against unauthorized access, alteration, or destruction.
            </p>
            <p className="mt-3">
              No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to maintain session state and analyze usage. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the Service may not function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">7. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services to operate the Service:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>OpenAI</strong> — used to generate personalized gift recommendation reasons. Quiz answers are sent to OpenAI's API. OpenAI's privacy policy applies to this processing.</li>
              <li><strong>Supabase</strong> — used for user authentication and data storage.</li>
              <li><strong>Amazon Associates</strong> — affiliate program for product links.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">8. Anonymous Use</h2>
            <p>
              You may use the gift recommendation tool without creating an account. In this case, we do not collect any personally identifiable information. Quiz answers are used solely to generate recommendations for that session and are not stored or linked to any identity.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">9. Children's Privacy</h2>
            <p>
              The Service is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">10. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of certain data processing activities</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-stone-900 text-base mb-3">12. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className="mt-3 font-medium text-stone-800">
              Regala<br />
              <a href="mailto:support@regala.ai" className="text-amber-700 hover:underline">support@regala.ai</a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <a href="/" className="text-sm text-amber-700 hover:underline">← Back to Regala</a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Regala. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}