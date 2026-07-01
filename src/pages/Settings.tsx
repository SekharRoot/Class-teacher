import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Settings() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const darkMode = mode === "dark";

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure application-wide settings and preferences.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Logged in as: {currentUser?.email}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Enable Push Notifications"
        />
        <br />
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={toggleTheme} />}
          label="Dark Theme"
        />
      </Paper>
    </Box>
  );
}
