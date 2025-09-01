"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Sparkles, Target, X } from "lucide-react";
import { Button } from "./ui/button";

interface Simple2DCelebrationProps {
  isVisible: boolean;
  taskTitle: string;
  onClose: () => void;
}

export const Simple2DCelebration: React.FC<Simple2DCelebrationProps> = ({
  isVisible,
  taskTitle,
  onClose,
}) => {
  // Auto-close after 8 seconds
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="z-[100] fixed inset-0 flex justify-center items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-lg"
          onClick={onClose}
        />

        {/* Celebration Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6,
          }}
          className="z-50 relative bg-white shadow-2xl border-2 border-yellow-200 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 p-6">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="text-3xl"
                >
                  🏆
                </motion.div>
                <div>
                  <h2 className="drop-shadow-lg font-bold text-white text-2xl">
                    🎉 Congratulations!
                  </h2>
                  <p className="text-white/90 text-sm">
                    You&lsquo;ve completed a task with 100% progress!
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Animated celebration content */}
          <div className="flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-purple-50 p-8 min-h-[300px]">
            {/* Floating emojis */}
            <div className="relative w-full max-w-md">
              {["🌟", "✨", "🎉", "🎊", "⭐", "💫", "🌈", "🎈"].map(
                (emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: 50,
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: -50,
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.5, 0.8, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut",
                    }}
                    className="absolute text-2xl"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                  >
                    {emoji}
                  </motion.div>
                )
              )}

              {/* Central trophy */}
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-4 text-8xl"
                >
                  🏆
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-2 font-bold text-gray-800 text-2xl"
                >
                  Task Completed!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mx-auto mb-6 max-w-sm text-gray-600 text-lg"
                >
                  &quot;{taskTitle}&quot;
                </motion.p>

                {/* Progress indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-6 rounded-full h-2"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </div>
          </div>

          {/* Achievement Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Task Completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">
                    100% Progress
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">
                    Achievement Unlocked
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-500 hover:from-green-600 to-blue-500 hover:to-blue-600 text-white"
                >
                  Awesome! 🎉
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
