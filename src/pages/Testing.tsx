import React, { useState } from "react";
import { Box, Typography, Alert, Stack, Snackbar } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { ExperimentalFeaturesCard } from "../components/testing/ExperimentalFeaturesCard";
import { DemoDataGenerationCard } from "../components/testing/DemoDataGenerationCard";
import { BulkStudentTransferCard } from "../components/testing/BulkStudentTransferCard";
import { DangerZoneCard } from "../components/testing/DangerZoneCard";

export default function Testing() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  if (userProfile?.role !== "owner") {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You must be an owner to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Testing & Debugging
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Utilities to seed, manage, and reset database environments during
        development.
      </Typography>

      <Stack spacing={4}>
        <ExperimentalFeaturesCard />
        <DemoDataGenerationCard
          loading={loading}
          setLoading={setLoading}
          showToast={showToast}
        />
        <BulkStudentTransferCard showToast={showToast} />
        <DangerZoneCard
          loading={loading}
          setLoading={setLoading}
          showToast={showToast}
        />
      </Stack>

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={6000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
