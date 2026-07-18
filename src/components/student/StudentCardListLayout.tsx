import React from "react";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Checkbox,
  Chip,
} from "@mui/material";
import { Phone, Person, Edit, Delete } from "@mui/icons-material";
import { Student } from "../../types";

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
  return (
    <Card
      id={`profile-card-${item.id}`}
      elevation={selected ? 4 : 1}
      sx={{
        borderRadius: 2,
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
        <Avatar
          variant="rounded"
          src={displayImage}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            bgcolor: "primary.light",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {item.firstName ? item.firstName[0] : ""}
          {item.lastName ? item.lastName[0] : ""}
        </Avatar>
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
        <IconButton size="small" onClick={() => onViewDetails(item)} color="primary">
          <Person fontSize="small" />
        </IconButton>
        {!readOnly && onSelect && (
          <>
            <IconButton size="small" onClick={() => onEdit(item)} color="secondary">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(item.id, fullName)} color="error">
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </Card>
  );
};
