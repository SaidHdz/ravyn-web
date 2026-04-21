import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const options = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
        const formattedNumber = Intl.NumberFormat("en-US", options).format(
          Number(latest.toFixed(0))
        );
        
        ref.current.textContent = separator 
          ? formattedNumber.replace(/,/g, separator) 
          : formattedNumber;
      }

      if (latest === (direction === "down" ? from : to) && typeof onEnd === "function") {
        onEnd();
      }
    });
  }, [springValue, direction, from, to, separator, onEnd]);

  return <span ref={ref} className={className} />;
}
