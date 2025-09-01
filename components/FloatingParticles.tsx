import { motion } from "motion/react";

const FloatingParticles = () => {
  return (
    <div className="z-5 absolute inset-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary opacity-30 rounded-full w-1 h-1"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
