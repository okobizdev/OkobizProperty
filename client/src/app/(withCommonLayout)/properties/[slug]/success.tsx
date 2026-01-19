"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessProps {
  onComplete?: () => void;
}

const Success = ({ onComplete }: SuccessProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 400);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="relative bg-gradient-to-br from-white to-gray-50 px-12 py-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full"
          >
            {/* Animated background glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.15, scale: 1.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 bg-green-500 rounded-3xl blur-2xl"
            />
            
            {/* Success content */}
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-green-600" strokeWidth={2} />
                {/* Ripple effect */}
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-0 bg-green-500 rounded-full"
                />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 text-sm">
                  Your reservation has been successfully processed
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-3xl origin-left w-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Success;