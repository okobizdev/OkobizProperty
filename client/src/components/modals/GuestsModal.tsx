import { poppins } from "@/app/font";
import { TFloorPlan } from "@/types";
import React from "react";

interface GuestsModalProps {
  guests: number;
  setGuests: (value: number) => void;
  setShowGuests: (value: boolean) => void;
  floorPlan: TFloorPlan;
}

const GuestsModal: React.FC<GuestsModalProps> = ({
  guests,
  setGuests,
  setShowGuests,
  floorPlan,
}) => {
  const totalGuests = guests  ;

  const isMaxReached =
    floorPlan.guestCount !== undefined && totalGuests >= floorPlan.guestCount;

  return (
    <div
      className={`border bg-[#fff] rounded shadow py-4 px-4 relative pb-10 ${poppins.className}`}
    >
      <div className="flex flex-col gap-4">
        {/* Guests */}
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
              onClick={() => {
                if (isMaxReached) return;
                setGuests(guests + 1);
              }}
              className={`text-xl w-[30px] h-[30px] text-center rounded-full border ${
                isMaxReached
                  ? "cursor-not-allowed text-[#262626]/20"
                  : "cursor-pointer text-[#262626]/50"
              }`}
            >
              +
            </p>
          </div>
        </div>


        {/* Close Button */}
        <div
          className="right-5 bottom-2 absolute cursor-pointer"
          onClick={() => setShowGuests(false)}
        >
          <p className="text-base font-medium capitalize underline hover:text-primary duration-300">
            close
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestsModal;
