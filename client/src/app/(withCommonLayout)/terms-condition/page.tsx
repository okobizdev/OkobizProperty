"use client";

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Terms & Conditions
      </h1>
      <p className="mb-10 text-gray-600">
        Please read these terms and conditions carefully before using our
        platform. By accessing or using our services, you agree to be bound by
        these terms.
      </p>

      {/* General Terms */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          General Terms
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Users must provide accurate and up-to-date information during
            registration and booking.
          </li>
          <li>
            All payments must be made through the platform’s secure payment
            gateway.
          </li>
          <li>
            Users are responsible for maintaining the confidentiality of their
            account credentials.
          </li>
          <li>
            Any misuse of the platform may result in account suspension or
            termination.
          </li>
          <li>Respect the privacy and property of all users and hosts.</li>
        </ul>
      </section>

      {/* Host Terms */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Host Terms
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Hosts must ensure that all listing information is accurate and
            regularly updated.
          </li>
          <li>
            Hosts are responsible for the cleanliness, safety, and legality of
            their property.
          </li>
          <li>
            All bookings must be honored as per the agreed terms with guests.
          </li>
          <li>
            Hosts must comply with all local laws and regulations regarding
            property rental.
          </li>
          <li>
            Cancellation or changes to bookings must be communicated promptly to
            guests.
          </li>
        </ul>
      </section>

      {/* Host Listing Policies */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Host Listing Policies
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Listings must include clear photos, accurate descriptions, and
            transparent pricing.
          </li>
          <li>
            Hosts must set clear house rules and communicate them to guests
            before booking.
          </li>
          <li>
            Any prohibited activities or restricted areas must be clearly
            mentioned in the listing.
          </li>
          <li>
            Hosts are encouraged to respond to guest inquiries within 24 hours.
          </li>
          <li>
            Repeated violations of listing policies may result in removal from
            the platform.
          </li>
        </ul>
      </section>

      <div className="text-sm text-gray-500">Last updated: June 30, 2025</div>
    </div>
  );
}
