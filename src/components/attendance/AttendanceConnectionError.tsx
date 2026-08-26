import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { CloudOff, Refresh } from "@mui/icons-material";

interface AttendanceConnectionErrorProps {
  error: string;
  onRetry: () => void;
  onEnableOfflineMode: () => void;
}

export const AttendanceConnectionError: React.FC<AttendanceConnectionErrorProps> = ({
  error,
  onRetry,
  onEnableOfflineMode,
}) => {
  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: "10px" }}>
        <CloudOff sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
          Database Connection Pending
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
            Retry Connection
          </Button>
          <Button variant="outlined" color="secondary" onClick={onEnableOfflineMode}>
            Work Offline (Demo Mode)
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
