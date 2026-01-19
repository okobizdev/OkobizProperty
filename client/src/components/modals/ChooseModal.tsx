import React from "react";
interface Choose {
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
}

interface ChooseModalProps {
  closeModal: () => void;
  choose: Choose;
}
const ChooseModal: React.FC<ChooseModalProps> = ({ closeModal, choose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999] w-full"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-md w-11/12 sm:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-xl font-medium mb-4">{choose.whyChooseUsTitle}</h4>
        <p className="text-base">{choose.whyChooseUsDescription}</p>
        <button onClick={closeModal} className="mt-4 text-primary font-medium">
          Close
        </button>
      </div>
    </div>
  );
};

export default ChooseModal;
