import React from "react";
import { motion } from "motion/react";

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ children, className, style }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Tiny, snappy delay for list items
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "inherit",
        gap: "inherit",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, className, style }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 16,
      },
    },
  } as const;

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={{
        height: "100%",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
