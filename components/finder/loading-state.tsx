"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  "Reading your profile...",
  "Scanning central schemes...",
  "Checking state-specific programs...",
  "Estimating total yearly benefits...",
  "Preparing your personalised shortlist..."
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-saffron-200 bg-white/85 px-6 py-14 text-center shadow-soft">
      <div className="size-16 animate-spin rounded-full border-4 border-saffron-100 border-t-saffron-400" />
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-8 text-sm text-stone-600"
        >
          {steps[currentStep]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
