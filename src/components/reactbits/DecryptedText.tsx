import React, { useState, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "hover" | "view";
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
}) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (sequential) {
              if (index < iteration / maxIterations) {
                return text[index];
              }
            } else if (iteration >= maxIterations) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration > maxIterations * (sequential ? text.length : 1)) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, characters]);

  return (
    <span className={`inline-block ${parentClassName}`}>
      <span className={`${displayText === text ? className : encryptedClassName}`}>
        {displayText}
      </span>
    </span>
  );
};

export default DecryptedText;
