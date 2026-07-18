import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Divider,
  Checkbox,
} from "@mui/material";
import { School, Phone, Person, Edit, Delete } from "@mui/icons-material";
import { Student } from "../../types";

interface StudentCardGridLayoutProps {
  item: Student;
  fullName: string;
  displayImage: string;
  className: string;
  isCompact: boolean;
  readOnly: boolean;
  selected: boolean;
  onSelect?: (studentId: string, selected: boolean) => void;
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string, fullName: string) => void;
}

export const StudentCardGridLayout: React.FC<StudentCardGridLayoutProps> = ({
  item,
  fullName,
  displayImage,
  className,
  isCompact,
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
      elevation={selected ? 6 : 2}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: selected ? "2px solid" : "none",
        borderColor: "primary.main",
        transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px) scale(1.01)",
          boxShadow: 5,
        },
      }}
    >
      {!readOnly && onSelect && (
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
          }}
        />
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          pt: isCompact ? 2 : 3,
        }}
      >
        {displayImage ? (
          <Avatar
            variant="rounded"
            src={displayImage}
            sx={{
              width: isCompact ? 80 : 132,
              height: isCompact ? 80 : 132,
              mb: isCompact ? 1 : 2,
              borderRadius: "2px",
              border: "2.5px solid",
              borderColor: "primary.main",
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
            }}
          />
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              width: isCompact ? 80 : 132,
              height: isCompact ? 80 : 132,
              mb: isCompact ? 1 : 2,
              borderRadius: "2px",
              bgcolor: "primary.light",
              color: "primary.contrastText",
              fontSize: isCompact ? "1.5rem" : "2.5rem",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            {item.firstName[0] || ""}
            {item.lastName ? item.lastName[0] : ""}
          </Avatar>
        )}

        <Typography
          variant={isCompact ? "subtitle1" : "h6"}
          sx={{ fontWeight: "bold", color: "text.primary", mb: 0.5 }}
        >
          {fullName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "600", mb: 1, fontFamily: "monospace" }}
        >
          Roll: {item.rollNumber}
        </Typography>

        <Chip
          label={className}
          size="small"
          color="primary"
          variant="outlined"
          icon={<School fontSize="small" />}
          sx={{ mb: 1, fontWeight: "bold", px: 1, height: 24, fontSize: isCompact ? "0.7rem" : "inherit" }}
        />

        {!isCompact && (
          <Chip
            label={item.boarderType || "Day Scholar"}
            size="small"
            color={
              item.boarderType === "Full Boarder"
                ? "success"
                : item.boarderType === "Day Boarder"
                  ? "info"
                  : "secondary"
            }
            sx={{ fontWeight: "600", mb: 2 }}
          />
        )}

        {!isCompact && <Divider sx={{ width: "100%", my: 1.5 }} />}

        {!isCompact && (
          <Box
            sx={{
              alignSelf: "flex-start",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              textAlign: "left",
              px: 1,
            }}
          >
            {item.phoneNumber && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Phone fontSize="inherit" color="action" /> {item.phoneNumber}
              </Typography>
            )}
            {item.fatherName && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textOverflow: "ellipsis",
                  overflow: "hidden", whiteSpace: "nowrap"
                }}
              >
                <Person fontSize="inherit" color="action" /> Guardian: {item.fatherName}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          px: 2,
          pb: isCompact ? 1.5 : 2,
          pt: 0.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            color="primary"
            variant="text"
            onClick={() => onViewDetails(item)}
            sx={{ textTransform: "none", fontWeight: "bold", minWidth: 0 }}
          >
            {isCompact ? <Person fontSize="small" /> : "Details"}
          </Button>
          {!readOnly && onSelect && (
            <Button
              id={`btn-edit-profile-${item.id}`}
              size="small"
              color="secondary"
              variant="text"
              startIcon={!isCompact && <Edit sx={{ fontSize: 16 }} />}
              onClick={() => onEdit(item)}
              sx={{ textTransform: "none", fontWeight: "bold", minWidth: 0 }}
            >
              {isCompact ? <Edit fontSize="small" /> : "Edit"}
            </Button>
          )}
        </Box>
        {!readOnly && onSelect && (
          <IconButton
            id={`btn-delete-profile-${item.id}`}
            color="error"
            size="small"
            onClick={() => onDelete(item.id, fullName)}
            title="Delete Student Profile"
            sx={{
              "&:hover": {
                bgcolor: "error.50",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
