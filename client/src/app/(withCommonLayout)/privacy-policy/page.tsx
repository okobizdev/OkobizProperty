"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <p className="mb-8 text-gray-600">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you use our
        platform.
      </p>

      {/* Information Collection */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Personal identification information (name, email address, phone
            number, etc.)
          </li>
          <li>Booking and payment details</li>
          <li>Usage data and cookies</li>
          <li>Communications and feedback</li>
        </ul>
      </section>

      {/* Use of Information */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>To provide and maintain our services</li>
          <li>To process bookings and payments securely</li>
          <li>To communicate with you about your account or bookings</li>
          <li>To improve our platform and user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      {/* Information Sharing */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Information Sharing & Disclosure
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>We do not sell your personal information to third parties.</li>
          <li>
            Information may be shared with hosts, guests, or service providers
            as necessary for bookings.
          </li>
          <li>
            We may disclose information if required by law or to protect our
            rights.
          </li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Data Security
        </h2>
        <p className="text-gray-700">
          We implement industry-standard security measures to protect your data.
          However, no method of transmission over the Internet or electronic
          storage is 100% secure.
        </p>
      </section>

      {/* Your Rights */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Rights & Choices
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            You may review, update, or delete your personal information at any
            time.
          </li>
          <li>You can opt out of marketing communications.</li>
          <li>Contact us for any privacy-related requests or questions.</li>
        </ul>
      </section>

      <div className="text-sm text-gray-500">Last updated: June 30, 2025</div>
    </div>
  );
}
