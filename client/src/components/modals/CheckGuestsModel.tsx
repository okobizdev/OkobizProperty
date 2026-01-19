import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { poppins } from "@/app/font";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -30 },
};

interface GuestsModalProps {
  guests: number;
  setGuests: (value: number) => void;
  // younger: number;
  // setYounger: (value: number) => void;
  // infants: number;
  // setInfants: (value: number) => void;
  onClose: () => void;
}

const CheckGuestsModel: React.FC<GuestsModalProps> = ({
  guests,
  setGuests,
  // younger,
  // setYounger,
  // infants,
  // setInfants,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 w-full h-screen bg-[#262626]/20 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <div
          className="flex items-center justify-center w-full h-full"
          onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
        >
          <motion.div
            className="bg-[#fff] w-[600px] h-[400px] rounded shadow relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="p-1 rounded-full border absolute top-4 left-4 text-[#262626]/60 cursor-pointer"
              onClick={onClose}
            >
              <HiMiniXMark className="text-xl" />
            </div>
            <div className={`py-4 px-6  mt-12 relative  ${poppins.className}`}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-medium text-xl">Guests</h2>
                  <p className="text-base font-medium mt-1">
                    This place has a maximum of 3 guests
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-base">Guests</h2>
                    <p className="text-sm text-[#262626]/80">Ages 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      onClick={() => guests > 0 && setGuests(guests - 1)}
                      className="text-2xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      -
                    </p>
                    <span className="text-lg">{guests}</span>
                    <p
                      onClick={() => setGuests(guests + 1)}
                      className="text-xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      +
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-base">Children</h2>
                    <p className="text-sm text-[#262626]/80">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      onClick={() => younger > 0 && setYounger(younger - 1)}
                      className="text-2xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      -
                    </p>
                    <span className="text-lg">{younger}</span>
                    <p
                      onClick={() => setYounger(younger + 1)}
                      className="text-xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      +
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-base">Infants</h2>
                    <p className="text-sm text-[#262626]/80">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      onClick={() => infants > 0 && setInfants(infants - 1)}
                      className="text-2xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      -
                    </p>
                    <span className="text-lg">{infants}</span>
                    <p
                      onClick={() => setInfants(infants + 1)}
                      className="text-xl w-[30px] h-[30px] text-center rounded-full border cursor-pointer text-[#262626]/50"
                    >
                      +
                    </p>
                  </div>
                </div> */}
              </div>

              <div className="-bottom-10 right-7 absolute px-4 py-2 rounded bg-primary text-[#fff] cursor-pointer">
                <button className="cursor-pointer">Save</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckGuestsModel;
