"use client"
import Image from "next/image";

const renderClientForm = (property: any, client: any, setClient: React.Dispatch<React.SetStateAction<any>>, agreed: boolean, setAgreed: React.Dispatch<React.SetStateAction<boolean>>) => {
    const numberOfAdults = client.numberOfAdults || 0;
    const numberOfChildren = client.numberOfChildren || 0;
    const totalGuests = numberOfAdults + numberOfChildren;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Your Information
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              value={client.address}
              onChange={(e) =>
                setClient({ ...client, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          
          
          { property?.listingType === "RENT" && property?.rentDurationType === "FLEXIBLE" && 
          <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NID *
            </label>
            <div className="border border-gray-300 rounded-md p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setClient({ ...client, nid: file });
                }}
                className="w-full"
                id="nid-upload"
              />
              {client.nid && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Selected: {client.nid.name}
                  </p>

                  <Image
                    src={URL.createObjectURL(client.nid)}
                    alt="NID Preview"
                    width={200}
                    height={128}
                    className="object-contain"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload a clear image of your National ID
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adults
              </label>
              <input
                type="number"
                value={numberOfAdults}
                max={property?.adultCount || 20}
                onChange={(e) => {
                  const newNumberOfAdults = parseInt(e.target.value) || 0;
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
                className="w-full px-3 py-2 border rounded-md "
                title="Number of adults"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Children
              </label>
              <input
                type="number"
                max={property?.childrenCount || 20}
                value={client.numberOfChildren || 0}
                onChange={(e) => {
                  const newNumberOfChildren = parseInt(e.target.value) || 0;
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
                className="w-full px-3 py-2 border rounded-md "
                title="Number of children"
                min="0"
              />
            </div>
          </div>

          {/* Additional Guest Names */}
          {totalGuests > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Guest Names{" "}
                {totalGuests > 1
                  ? `(${totalGuests - 1} more)`
                  : ""}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={`Guest ${index + 2} name`}
                  />
                ))}
              </div>
            </div>
          )}
        </> }
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <textarea
              value={client.note}
              onChange={(e) => setClient({ ...client, note: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Any additional notes"
              rows={3}
            />
          </div>
          <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  required
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-500 leading-snug select-none"
                >
                  By selecting <span className="font-medium">Continue</span>, I
                  agree to Okobiz Propery&apos;s{" "}
                  <a
                    href="/terms-condition"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>{" "}
                  and acknowledge the{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
        </div>
      </div>
    );
  };

export default renderClientForm;