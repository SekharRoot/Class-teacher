import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ClassItem } from "../types";

interface ClassSelectionGridProps {
  classes: ClassItem[];
  onSelectClass: (classId: string) => void;
}

export const ClassSelectionGrid: React.FC<ClassSelectionGridProps> = ({
  classes,
  onSelectClass,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Select a Class
      </Typography>
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
          <Paper
            key={cls.id}
            elevation={2}
            onClick={() => onSelectClass(cls.id)}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
              "&:hover": { transform: "translateY(-4px) scale(1.02)", boxShadow: 6 },
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {cls.board} {cls.classStandard}
            </Typography>
            <Typography color="text.secondary">
              Section: {cls.section}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
