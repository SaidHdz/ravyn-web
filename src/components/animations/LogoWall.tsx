import { useState } from "react";
import { motion } from "framer-motion";

interface LogoWallProps {
  items: { imgUrl: string; altText: string }[];
  direction?: "left" | "right" | "up" | "down";
  pauseOnHover?: boolean;
  speed?: number;
  className?: string;
  textColor?: string;
  bgAccent?: string;
}

const LogoWall = ({
  items = [],
  direction = "left",
  pauseOnHover = false,
  speed = 20,
  className = "",
  textColor = "text-white",
  bgAccent = "bg-white/5",
}: LogoWallProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const isVertical = direction === "up" || direction === "down";
  
  const marqueeVariants = {
    animate: {
      x: direction === "left" ? [0, -1000] : direction === "right" ? [-1000, 0] : 0,
      y: direction === "up" ? [0, -1000] : direction === "down" ? [-1000, 0] : 0,
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div
      className={`relative overflow-hidden flex ${
        isVertical ? "flex-col h-[500px]" : "flex-row w-full"
      } ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className={`flex shrink-0 gap-8 p-4 ${
          isVertical ? "flex-col" : "flex-row"
        }`}
        variants={marqueeVariants}
        animate={isPaused ? "initial" : "animate"}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center px-8 py-4 rounded-xl transition-colors ${bgAccent} ${textColor}`}
          >
            <img
              src={item.imgUrl}
              alt={item.altText}
              className="h-8 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoWall;
