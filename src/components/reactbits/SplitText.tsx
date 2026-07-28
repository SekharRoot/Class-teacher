import React from "react";
import { motion } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  animationFrom?: { opacity?: number; transform?: string };
  animationTo?: { opacity?: number; transform?: string };
  easing?: string | number[];
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "initial" | "inherit";
  onLetterAnimationComplete?: () => void;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  className = "",
  delay = 0.05,
  duration = 2,
  animationFrom = { opacity: 0, transform: "translate3d(0, 40px, 0)" },
  animationTo = { opacity: 1, transform: "translate3d(0, 0, 0)" },
  easing = [0.2, 0.65, 0.3, 0.9],
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const words = text.split(" ");

  return (
    <span
      className={`inline-block ${className}`}
      style={{ textAlign, wordWrap: "break-word" }}
    >
      {words.map((word, wordIndex) => {
        const letters = word.split("");
        // calculate base offset for letter index across previous words
        const previousLettersCount = words
          .slice(0, wordIndex)
          .reduce((acc, curr) => acc + curr.length, 0);

        return (
          <span
            key={wordIndex}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {letters.map((letter, letterIndex) => {
              const globalIndex = previousLettersCount + letterIndex;

              return (
                <motion.span
                  key={letterIndex}
                  initial={animationFrom}
                  animate={animationTo}
                  transition={{
                    duration,
                    delay: globalIndex * delay,
                    ease: easing as any,
                  }}
                  onAnimationComplete={
                    onLetterAnimationComplete &&
                    globalIndex === text.replace(/\s+/g, "").length - 1
                      ? onLetterAnimationComplete
                      : undefined
                  }
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: "inline-block" }}>&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default SplitText;
