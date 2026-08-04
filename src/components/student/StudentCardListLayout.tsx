import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Checkbox,
  Chip,
  Tooltip,
} from "@mui/material";
import { Phone, Person, Edit, Delete } from "@mui/icons-material";
import { Student } from "../../types";
import { ImagePreviewDialog } from "../common/ImagePreviewDialog";

interface StudentCardListLayoutProps {
  item: Student;
  fullName: string;
  displayImage: string;
  className: string;
  layout: "list_image" | "list_details";
  readOnly: boolean;
  selected: boolean;
  onSelect?: (studentId: string, selected: boolean) => void;
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string, fullName: string) => void;
}

export const StudentCardListLayout: React.FC<StudentCardListLayoutProps> = ({
  item,
  fullName,
  displayImage,
  className,
  layout,
  readOnly,
  selected,
  onSelect,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  return (
    <>
      <Card
      id={`profile-card-${item.id}`}
      elevation={selected ? 4 : 1}
      sx={{
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        p: 1.5,
        gap: 2,
        border: selected ? "2px solid" : "none",
        borderColor: "primary.main",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 3, bgcolor: "action.hover" },
      }}
    >
      {!readOnly && onSelect && (
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
          size="small"
        />
      )}

      {layout === "list_image" && (
        <Tooltip title={displayImage ? "Click to enlarge photo" : ""} arrow disableHoverListener={!displayImage}>
          <Avatar
            variant="rounded"
            src={displayImage}
            onClick={(e) => {
              if (displayImage) {
                e.stopPropagation();
                setImagePreviewOpen(true);
              }
            }}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: "primary.light",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: displayImage ? "pointer" : "default",
              transition: "transform 0.2s ease-in-out",
              "&:hover": displayImage ? { transform: "scale(1.08)" } : {},
            }}
          >
            {item.firstName ? item.firstName[0] : ""}
            {item.lastName ? item.lastName[0] : ""}
          </Avatar>
        </Tooltip>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {fullName}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
            ID: {item.profileId || item.rollNumber}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ height: 12, my: "auto" }} />
          <Typography variant="caption" color="text.secondary">
            {className}
          </Typography>
        </Box>
        {layout === "list_details" && (
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
            <Chip label={item.boarderType} size="small" variant="outlined" sx={{ height: 20, fontSize: "0.65rem" }} />
            {item.phoneNumber && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Phone sx={{ fontSize: 12 }} /> {item.phoneNumber}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton size="medium" onClick={() => onViewDetails(item)} color="primary">
          <Person fontSize="medium" />
        </IconButton>
        {!readOnly && onSelect && (
          <>
            <IconButton size="medium" onClick={() => onEdit(item)} color="secondary">
              <Edit fontSize="medium" />
            </IconButton>
            <IconButton size="medium" onClick={() => onDelete(item.id, fullName)} color="error">
              <Delete fontSize="medium" />
            </IconButton>
          </>
        )}
      </Box>
    </Card>

    <ImagePreviewDialog
      open={imagePreviewOpen}
      imageUrl={displayImage}
      title={fullName}
      subtitle={`ID: ${item.profileId || item.rollNumber} | Class: ${className}`}
      onClose={() => setImagePreviewOpen(false)}
    />
  </>
  );
};
