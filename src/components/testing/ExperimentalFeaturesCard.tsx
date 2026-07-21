import React, { useContext } from "react";
import { Paper, Box, Typography, FormControlLabel, Switch } from "@mui/material";
import { Science } from "@mui/icons-material";
import { ThemeContext } from "../../contexts/ThemeContext";

export function ExperimentalFeaturesCard() {
  const { translucencyEnabled, toggleTranslucency } = useContext(ThemeContext);
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Science color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Experimental Features (Testing)
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enable modern translucency (glassmorphism) across the entire application. This feature works beautifully in both Light and Dark modes.
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={translucencyEnabled}
            onChange={toggleTranslucency}
            color="primary"
          />
        }
        label={
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Enable Glassmorphic Translucency ({translucencyEnabled ? "Active" : "Disabled"})
          </Typography>
        }
      />
    </Paper>
  );
}
