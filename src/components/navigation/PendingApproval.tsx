import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";

interface PendingApprovalProps {
  onLogout: () => void;
}

export const PendingApproval: React.FC<PendingApprovalProps> = ({
  onLogout,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 3,
        textAlign: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CheckCircleIcon color="warning" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Account Pending Approval
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your account has been created successfully and is currently pending
          approval by an administrator. You will be able to access the
          application once your role and permissions are verified.
        </Typography>
        <Button
          variant="outlined"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
        >
          Log Out
        </Button>
      </Paper>
    </Box>
  );
};
