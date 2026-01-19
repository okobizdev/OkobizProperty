"use client"
import Image from "next/image";
import { useEffect } from "react";

const renderClientForm = (
  property: any,
  client: any,
  setClient: React.Dispatch<React.SetStateAction<any>>,
  agreed: boolean,
  setAgreed: React.Dispatch<React.SetStateAction<boolean>>,
  user?: any,
  isAuthenticated?: boolean,
  appointmentDate?: string,
  setAppointmentDate?: React.Dispatch<React.SetStateAction<string>>,
  appointmentTime?: string,
  setAppointmentTime?: React.Dispatch<React.SetStateAction<string>>
) => {
  const numberOfAdults = client.numberOfAdults || 0;
  const numberOfChildren = client.numberOfChildren || 0;
  const totalGuests = numberOfAdults + numberOfChildren;
  const isLoggedIn = isAuthenticated && user;

  // No need for useEffect here since parent component handles auto-fill

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Information
      </h3>
      <div className="space-y-3">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${isLoggedIn ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            placeholder="Enter your full name"
            required
            readOnly={isLoggedIn}
            minLength={2}
            maxLength={50}
            title={isLoggedIn ? "You cannot change your registered name" : "Enter your full name"}
          />
          {isLoggedIn && (
            <p className="text-xs text-gray-500 mt-1">🔒 This information is from your account and cannot be changed here</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            value={client.address}
            onChange={(e) =>
              setClient({ ...client, address: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your complete address"
            required
            minLength={10}
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={client.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setClient({ ...client, phone: value });
            }}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${isLoggedIn ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            placeholder="01XXXXXXXXX"
            required
            readOnly={isLoggedIn}
            pattern="^01[3-9]\d{8}$"
            maxLength={11}
            title={isLoggedIn ? "You cannot change your registered phone number" : "Enter valid Bangladeshi phone number (01XXXXXXXXX)"}
          />
          {isLoggedIn && (
            <p className="text-xs text-gray-500 mt-1">🔒 This information is from your account and cannot be changed here</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${isLoggedIn ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            placeholder="your.email@example.com"
            required
            readOnly={isLoggedIn}
            title={isLoggedIn ? "You cannot change your registered email" : "Enter a valid email address"}
          />
          {isLoggedIn && (
            <p className="text-xs text-gray-500 mt-1">🔒 This information is from your account and cannot be changed here</p>
          )}
        </div>

        {property?.listingType === "RENT" && property?.rentDurationType === "FLEXIBLE" &&
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID (NID) *
              </label>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must be less than 5MB");
                        e.target.value = '';
                        return;
                      }
                      setClient({ ...client, nid: file });
                    }
                  }}
                  className="w-full"
                  id="nid-upload"
                  required
                />
                {client.nid && (
                  <div className="mt-3 p-2 bg-white rounded border border-green-200">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                      ✓ Selected: {client.nid.name}
                    </p>
                    {client.nid.type.startsWith('image/') && (
                      <Image
                        src={URL.createObjectURL(client.nid)}
                        alt="NID Preview"
                        width={200}
                        height={128}
                        className="object-contain mt-2 rounded"
                      />
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  📄 Upload a clear image/PDF of your National ID (Max 5MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Adults *
                </label>
                <input
                  type="number"
                  value={numberOfAdults}
                  max={property?.adultCount || 20}
                  onChange={(e) => {
                    const newNumberOfAdults = Math.max(0, parseInt(e.target.value) || 0);
                    const maxAdults = property?.adultCount || 20;

                    if (newNumberOfAdults > maxAdults) {
                      alert(`Maximum ${maxAdults} adults allowed`);
                      return;
                    }

                    const totalGuests = newNumberOfAdults + (client.numberOfChildren || 0);

                    // Update guest names array
                    const currentNames = [...(client.guests || [])];
                    const additionalGuestsCount = Math.max(0, totalGuests - 1);

                    if (currentNames.length < additionalGuestsCount) {
                      while (currentNames.length < additionalGuestsCount) {
                        currentNames.push("");
                      }
                    } else if (currentNames.length > additionalGuestsCount) {
                      currentNames.splice(additionalGuestsCount);
                    }

                    setClient({
                      ...client,
                      numberOfAdults: newNumberOfAdults,
                      numberOfGuests: Math.max(1, totalGuests),
                      guests: currentNames
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  title="Number of adults"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Max: {property?.adultCount || 20}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Children
                </label>
                <input
                  type="number"
                  max={property?.childrenCount || 20}
                  value={client.numberOfChildren || 0}
                  onChange={(e) => {
                    const newNumberOfChildren = Math.max(0, parseInt(e.target.value) || 0);
                    const maxChildren = property?.childrenCount || 20;

                    if (newNumberOfChildren > maxChildren) {
                      alert(`Maximum ${maxChildren} children allowed`);
                      return;
                    }

                    const totalGuests = (numberOfAdults || 0) + newNumberOfChildren;

                    // Update guest names array
                    const currentNames = [...(client.guests || [])];
                    const additionalGuestsCount = Math.max(0, totalGuests - 1);

                    if (currentNames.length < additionalGuestsCount) {
                      while (currentNames.length < additionalGuestsCount) {
                        currentNames.push("");
                      }
                    } else if (currentNames.length > additionalGuestsCount) {
                      currentNames.splice(additionalGuestsCount);
                    }

                    setClient({
                      ...client,
                      numberOfChildren: newNumberOfChildren,
                      numberOfGuests: Math.max(1, totalGuests),
                      guests: currentNames
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  title="Number of children"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Max: {property?.childrenCount || 20}</p>
              </div>
            </div>

            {/* Additional Guest Names */}
            {totalGuests > 1 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📝 Additional Guest Names *{" "}
                  <span className="text-gray-500 font-normal">
                    ({totalGuests - 1} {totalGuests - 1 === 1 ? 'guest' : 'guests'})
                  </span>
                </label>
                <div className="space-y-2">
                  {Array.from({ length: totalGuests - 1 }, (_, index) => (
                    <input
                      key={index}
                      type="text"
                      value={(client.guests || [])[index] || ""}
                      onChange={(e) => {
                        const updatedNames = [...(client.guests || [])];
                        updatedNames[index] = e.target.value;
                        // Ensure array has the right length
                        while (updatedNames.length < totalGuests - 1) {
                          updatedNames.push("");
                        }
                        setClient({ ...client, guests: updatedNames });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={`Guest ${index + 2} full name`}
                      required
                      minLength={2}
                      maxLength={50}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ All guest names are required for booking
                </p>
              </div>
            )}
          </>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            value={client.note}
            onChange={(e) => setClient({ ...client, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Any special requests or additional information..."
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {client.note?.length || 0}/500 characters
          </p>
        </div>

        <div className="flex items-start gap-2 pt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            required
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 cursor-pointer w-4 h-4"
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-700 leading-snug select-none"
          >
            By selecting <span className="font-semibold">Continue</span>, I
            agree to Okobiz Property&apos;s{" "}
            <a
              href="/terms-condition"
              className="text-primary underline font-medium hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{" "}
            and acknowledge the{" "}
            <a
              href="/privacy-policy"
              className="text-primary underline font-medium hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            . *
          </label>
        </div>
      </div>
    </div>
  );
};

export default renderClientForm;