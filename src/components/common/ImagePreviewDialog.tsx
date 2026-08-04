import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ImagePreviewDialogProps {
  open: boolean;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({
  open,
  imageUrl,
  title,
  subtitle,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
            bgcolor: "background.paper",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          {title && (
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close image preview"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: "action.hover" } }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(0,0,0,0.03)" }}>
        <Box
          component="img"
          src={imageUrl}
          alt={title || "Enlarged view"}
          sx={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            borderRadius: "10px",
            boxShadow: 4,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
