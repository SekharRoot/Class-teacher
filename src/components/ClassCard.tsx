import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  CardActionArea,
} from "@mui/material";
import { School, Delete, Group, Edit, Business } from "@mui/icons-material";
import { ClassItem } from "../types";

interface ClassCardProps {
  item: ClassItem;
  onDelete: (classId: string, className: string) => void;
  onEdit?: (item: ClassItem) => void;
  onClick?: (item: ClassItem) => void;
  readOnly?: boolean;
  onTransferSchool?: (item: ClassItem) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  item,
  onDelete,
  onEdit,
  onClick,
  readOnly = false,
  onTransferSchool,
}) => {
  const fullName = `${item.board} ${item.classStandard} ${item.section}`;

  const cardContent = (
    <>
      <CardContent sx={{ flexGrow: 1, pb: 1, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: "primary.light",
              color: "primary.contrastText",
              p: 1.2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.15)",
            }}
          >
            <School fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace" }}
            >
              ID: {item.id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          <Chip
            label={`Board: ${item.board}`}
            size="small"
            variant="filled"
            color="primary"
            sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: "0.75rem" }}
          />
          <Chip
            label={`Standard: ${item.classStandard}`}
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: "0.75rem" }}
          />
          <Chip
            label={`Section: ${item.section}`}
            size="small"
            variant="outlined"
            color="info"
            sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: "0.75rem" }}
          />
        </Box>
      </CardContent>
    </>
  );

  return (
    <Card
      id={`class-card-${item.id}`}
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
      {onClick ? (
        <CardActionArea
          onClick={() => onClick(item)}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {cardContent}
        </CardActionArea>
      ) : (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {cardContent}
        </Box>
      )}

      <CardActions
        sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 1 }}
      >
        <Chip
          label="Active Configuration"
          size="small"
          color="success"
          variant="outlined"
          sx={{
            height: 20,
            fontSize: "0.65rem",
            fontWeight: "bold",
            bgcolor: "success.50",
            color: "success.dark",
            border: "1px solid",
            borderColor: "success.200",
          }}
        />
        {!readOnly && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {onTransferSchool && (
              <IconButton
                id={`btn-transfer-class-${item.id}`}
                color="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onTransferSchool(item);
                }}
                title="Transfer Class to School"
                sx={{
                  "&:hover": { bgcolor: "secondary.50" },
                  transition: "all 0.2s",
                }}
              >
                <Business fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                title="Edit Class"
                sx={{
                  "&:hover": { bgcolor: "primary.50" },
                  transition: "all 0.2s",
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            <IconButton
              id={`btn-delete-${item.id}`}
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id, fullName);
              }}
              title="Delete Class"
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
          </Box>
        )}
      </CardActions>
    </Card>
  );
};
