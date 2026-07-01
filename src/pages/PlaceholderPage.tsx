import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          This feature is coming soon in Phase 2/3.
        </Typography>
      </Paper>
    </Box>
  );
}
