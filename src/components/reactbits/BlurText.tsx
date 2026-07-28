import React from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 0.1,
  className = "",
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,-20px,0)" }
      : { filter: "blur(10px)", opacity: 0, transform: "translate3d(0,20px,0)" };

  const defaultTo = {
    filter: "blur(0px)",
    opacity: 1,
    transform: "translate3d(0,0,0)",
  };

  return (
    <span className={`inline-block ${className}`}>
      {elements.map((item, index) => (
        <motion.span
          key={index}
          initial={defaultFrom}
          animate={defaultTo}
          transition={{
            duration: 0.5,
            delay: index * delay,
            ease: "easeOut",
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          className="inline-block"
        >
          {item}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
