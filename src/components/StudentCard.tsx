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
} from "@mui/material";
import { School, Phone, Person, Edit, Delete } from "@mui/icons-material";
import { Student, ClassItem } from "../types";

interface StudentCardProps {
  item: Student;
  classes: ClassItem[];
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string, fullName: string) => void;
  readOnly?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  item,
  classes,
  onViewDetails,
  onEdit,
  onDelete,
  readOnly = false,
}) => {
  const fullName = `${item.firstName} ${item.lastName}`;

  const getClassNameFromId = (classId?: string) => {
    if (!classId) return "No Class Assigned";
    const foundClass = classes.find((c) => c.id === classId);
    return foundClass
      ? `${foundClass.board} ${foundClass.classStandard} ${foundClass.section}`
      : "No Class Assigned";
  };

  const className = getClassNameFromId(item.classId);

  return (
    <Card
      id={`profile-card-${item.id}`}
      elevation={2}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          pt: 3,
        }}
      >
        {/* Photo Profile Avatar */}
        {item.image ? (
          <Avatar
            variant="rounded"
            src={item.image}
            sx={{
              width: 132,
              height: 132,
              mb: 2,
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
              width: 132,
              height: 132,
              mb: 2,
              borderRadius: "2px",
              bgcolor: "primary.light",
              color: "primary.contrastText",
              fontSize: "2.5rem",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            {item.firstName[0] || ""}
            {item.lastName ? item.lastName[0] : ""}
          </Avatar>
        )}

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "text.primary", mb: 0.5 }}
        >
          {fullName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "600", mb: 1.5, fontFamily: "monospace" }}
        >
          Roll: {item.rollNumber}
        </Typography>

        <Chip
          label={className}
          size="small"
          color="primary"
          variant="outlined"
          icon={<School fontSize="small" />}
          sx={{ mb: 1, fontWeight: "bold", px: 1, height: 26 }}
        />

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

        <Divider sx={{ width: "100%", my: 1.5 }} />

        {/* Quick Guardian & Phone labels */}
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
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <Person fontSize="inherit" color="action" /> Guardian:{" "}
              {item.fatherName}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 1 }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            color="primary"
            variant="text"
            onClick={() => onViewDetails(item)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            View Details
          </Button>
          {!readOnly && (
            <Button
              id={`btn-edit-profile-${item.id}`}
              size="small"
              color="secondary"
              variant="text"
              startIcon={<Edit sx={{ fontSize: 16 }} />}
              onClick={() => onEdit(item)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Edit
            </Button>
          )}
        </Box>
        {!readOnly && (
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
              transition: "all 0.2s",
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
