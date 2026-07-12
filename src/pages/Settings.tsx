import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Fingerprint,
  CheckCircle,
  Autorenew,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { studentsApi } from "../api";
import { useData } from "../contexts/DataContext";

export default function Settings() {
  const { currentUser, userProfile } = useAuth();
  const { fetchInitialData } = useData();
  const [notifications, setNotifications] = useState(true);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; show: boolean }>({ count: 0, show: false });

  const darkMode = mode === "dark";
  const isAdmin = ["owner", "admin"].includes(userProfile?.role || "");

  const handleFixProfileIds = async () => {
    setLoading(true);
    try {
      const count = await studentsApi.assignMissingProfileIds();
      setResult({ count, show: true });
      fetchInitialData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6, px: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure application-wide settings and preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: isAdmin ? 6 : 12 }}>
          <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Account Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Logged in as: {currentUser?.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Enable Push Notifications"
              />
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleTheme} />}
                label="Dark Theme"
              />
            </Box>
          </Paper>
        </Grid>

        {isAdmin && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <Fingerprint sx={{ mr: 1 }} /> Data Integrity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Automatically generate and assign unique Profile IDs to all student records that are missing one.
                </Typography>
                
                {result.show && (
                  <Alert severity={result.count > 0 ? "success" : "info"} sx={{ mb: 2 }}>
                    {result.count > 0 
                      ? `Successfully assigned Profile IDs to ${result.count} students.`
                      : "All students already have valid Profile IDs."}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  onClick={handleFixProfileIds}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Assign Missing Profile IDs
                </Button>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <Autorenew sx={{ mr: 1 }} /> Historical Migration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Safely move classes, students, leaves, and attendance records from root collections into nested tenant collections for this school.
                </Typography>
                
                <Button
                  variant="outlined"
                  component={Link}
                  to="/admin"
                  state={{ activeTab: 6 }}
                  startIcon={<Autorenew />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                >
                  Go to Migration Tool
                </Button>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
