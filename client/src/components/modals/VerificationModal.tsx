"use client";

import React, { useState } from "react";

const VerificationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Trigger Button */}
      <div className="text-center">
        <div
          onClick={handleOpenModal}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm underline cursor-pointer"
        >
          Open Verification Modal
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg max-w-lg text-[16px] leading-5 w-full shadow-lg relative">
            {/* Header with title and close icon */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <button
                  onClick={handleCloseModal}
                  className="w-5 h-5 text-white bg-black rounded-full text-xl flex items-center justify-center cursor-pointer"
                  aria-label="Close Modal"
                >
                  ×
                </button>
              </div>
              <div className="text-lg font-semibold text-gray-800">
                Identity Verification
              </div>
              <div></div>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-gray-700">
              Someone being “Identity verified,” or having an identity
              verification badge, only means that they have provided info in
              order to complete our identity verification process. This process
              has safeguards, but is not a guarantee that someone is who they
              claim to be.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationModal;
