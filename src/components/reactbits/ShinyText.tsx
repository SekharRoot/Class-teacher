import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 via-neutral-400 to-neutral-800 dark:from-neutral-200 dark:via-neutral-500 dark:to-neutral-200 ${
        disabled ? "" : "animate-shiny-text"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        animation: disabled
          ? "none"
          : `shiny-text ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
