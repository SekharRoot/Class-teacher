import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import CodeIcon from "@mui/icons-material/Code";
import SpeedIcon from "@mui/icons-material/Speed";
import { ProfileCard, SplitText } from "../components/reactbits";

export default function AppInfo() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <InfoIcon color="primary" sx={{ fontSize: 36 }} />
          <SplitText text="App Info & Credits" delay={0.03} duration={1.5} />
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          System Overview, Platform Specifications, and Creator Details
        </Typography>
      </Box>

      {/* Main Content Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        {/* Strands Visual & Profile Card Section */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 55%" } }}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: "24px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(15, 23, 42, 0.6)"
                  : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
            }}
          >
            {/* Profile Card Component */}
            <Box sx={{ position: "relative", zIndex: 1, my: 2 }}>
              <ProfileCard
                name="Sekhar"
                title="Physics Teacher and Programmer"
                handle="@wolfsekhar"
                status="Active"
                contactText="Thank You"
                avatarUrl=""
                showUserInfo={false}
                enableTilt={false}
                enableMobileTilt={false}
                onContactClick={() => {
                  window.location.href = "mailto:sekhar.root@gmail.com";
                }}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                iconUrl=""
                behindGlowEnabled
                innerGradient="linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)"
              />
            </Box>
          </Paper>
        </Box>

        {/* Application Details & Highlights */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 45%" } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              height: "100%",
              justifyContent: "center",
            }}
          >
            {/* App Overview Card */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: "20px",
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <VerifiedIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  School Management & Classroom System
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                SMCS is an enterprise classroom and attendance management portal designed for multi-school tracking, attendance reporting, profile management, and leave workflows.
              </Typography>
            </Paper>

            {/* Feature Cards Flex Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <CodeIcon color="secondary" sx={{ mb: 0.5 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Tech Stack
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      React 18, Vite, Material UI, Firebase
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <SpeedIcon color="success" sx={{ mb: 0.5 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Performance
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Realtime Firestore sync & optimized state
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Platform Badges */}
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: "0.05em" }}
              >
                CREDITS & VERSION
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="Created by Sekhar" color="primary" size="small" sx={{ fontWeight: 700 }} />
                <Chip label="Version 2.4.0" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                <Chip label="Multi-Tenant Ready" color="success" size="small" variant="outlined" />
                <Chip label="React Bits Integrated" color="secondary" size="small" />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Bottom Spacing Buffer for Floating Bottom Navigation Bar */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Container>
  );
}
