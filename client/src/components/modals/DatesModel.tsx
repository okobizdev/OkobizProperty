import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { DateRangePicker } from "react-date-range";
import { useDateRange } from "@/contexts/DateRangeContext";

interface DatesModelProps {
  onClose: () => void;
  blockedDates: Date[];
}

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

const DatesModel = ({ onClose, blockedDates }: DatesModelProps) => {
  const { dateRange, setDateRange } = useDateRange();

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
          onClick={(e) => e.stopPropagation()}
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
            <div className="flex justify-center items-center h-full">
              <DateRangePicker
                onChange={(item) => {
                  const { startDate, endDate } = item.selection;
                  setDateRange({ startDate, endDate });
                }}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={[{ ...dateRange, key: "selection" }]}
                direction="horizontal"
                preventSnapRefocus={true}
                staticRanges={[]}
                inputRanges={[]}
                className="w-full"
                minDate={new Date()}
                disabledDates={blockedDates}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DatesModel;

// import React from "react";
// import { HiMiniXMark } from "react-icons/hi2";
// import { motion, AnimatePresence } from "framer-motion";
// import { DateRangePicker } from "react-date-range";
// import { useDateRange } from "@/contexts/DateRangeContext";

// const backdropVariants = {
//   visible: { opacity: 1 },
//   hidden: { opacity: 0 },
// };

// const modalVariants = {
//   hidden: { opacity: 0, y: -50 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", stiffness: 300, damping: 25 },
//   },
//   exit: { opacity: 0, y: -30 },
// };

// const DatesModel = ({ onClose }: { onClose: () => void }) => {
//   const { dateRange, setDateRange } = useDateRange();
//   // const { startDate, endDate } = dateRange;

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed top-0 right-0 w-full h-screen bg-[#262626]/20 z-50"
//         variants={backdropVariants}
//         initial="hidden"
//         animate="visible"
//         exit="hidden"
//         onClick={onClose}
//       >
//         <div
//           className="flex items-center justify-center w-full h-full"
//           onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
//         >
//           <motion.div
//             className="bg-[#fff] w-[600px] h-[400px] rounded shadow relative"
//             variants={modalVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//           >
//             <div
//               className="p-1 rounded-full border absolute top-4 left-4 text-[#262626]/60 cursor-pointer"
//               onClick={onClose}
//             >
//               <HiMiniXMark className="text-xl" />
//             </div>
//             <div className="flex justify-center items-center h-full">
//               <DateRangePicker
//                 onChange={(item) => {
//                   const { startDate, endDate } = item.selection;
//                   setDateRange({ startDate, endDate });
//                 }}
//                 moveRangeOnFirstSelection={false}
//                 months={1}
//                 ranges={[{ ...dateRange, key: "selection" }]}
//                 direction="horizontal"
//                 preventSnapRefocus={true}
//                 staticRanges={[]}
//                 inputRanges={[]}
//                 className=" w-full"
//               />
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default DatesModel;
