import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ClassItem } from "../../types";

interface ClassHeaderBreadcrumbProps {
  selectedClass?: ClassItem;
  showChangeClassButton: boolean;
  onChangeClass: () => void;
}

export const ClassHeaderBreadcrumb: React.FC<ClassHeaderBreadcrumbProps> = ({
  selectedClass,
  showChangeClassButton,
  onChangeClass,
}) => {
  if (!showChangeClassButton) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1, flexWrap: "wrap" }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={onChangeClass}
        variant="text"
        sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
      >
        Change Class
      </Button>
      {selectedClass && (
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: "bold" }}>
          / {selectedClass.board} - {selectedClass.classStandard} {selectedClass.section}
        </Typography>
      )}
    </Box>
  );
};
