import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ClassItem } from "../types";
import { motion } from "motion/react";

interface ClassSelectionGridProps {
  classes: ClassItem[];
  onSelectClass: (classId: string) => void;
}

export const ClassSelectionGrid: React.FC<ClassSelectionGridProps> = ({
  classes,
  onSelectClass,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 15,
      }
    }
  } as const;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Select a Class
      </Typography>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              style={{ height: "100%", width: "100%" }}
            >
              <Paper
                elevation={2}
                onClick={() => onSelectClass(cls.id)}
                sx={{
                  p: 3,
                  borderRadius: "10px",
                  cursor: "pointer",
                  height: "100%",
                  transition: "box-shadow 0.25s ease, background-color 0.25s ease",
                  "&:hover": { 
                    boxShadow: 6,
                    bgcolor: "action.hover"
                  },
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {cls.board} {cls.classStandard}
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Section: {cls.section}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};
