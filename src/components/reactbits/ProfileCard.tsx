import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Chip, Paper, useTheme } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface ProfileCardProps {
  name: string;
  title: string;
  handle?: string;
  status?: string;
  contactText?: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  onContactClick?: () => void;
  behindGlowColor?: string;
  iconUrl?: string;
  behindGlowEnabled?: boolean;
  innerGradient?: string;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "Sekhar",
  title = "App Creator & Lead Developer",
  handle = "sekhar.root",
  status = "Active Creator",
  contactText = "Contact Creator",
  avatarUrl = "",
  enableTilt = true,
  onContactClick,
  behindGlowColor = "rgba(125, 190, 255, 0.67)",
  behindGlowEnabled = true,
  innerGradient = "linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)",
  className = "",
}) => {
  const theme = useTheme();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXVal = ((y - centerY) / centerY) * -12;
    const rotateYVal = ((x - centerX) / centerX) * 12;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        perspective: "1000px",
      }}
      className={className}
    >
      {/* Behind Glow Effect */}
      {behindGlowEnabled && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            borderRadius: "32px",
            background: behindGlowColor,
            filter: "blur(40px)",
            opacity: 0.7,
            pointerEvents: "none",
            zIndex: 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Main 3D Card */}
      <Paper
        elevation={8}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: 300, sm: 380 },
          p: 3,
          borderRadius: "24px",
          background: innerGradient,
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(255, 255, 255, 0.6)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
          overflow: "hidden",
        }}
      >
        {/* Subtle background overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              theme.palette.mode === "dark"
                ? "rgba(10, 15, 25, 0.75)"
                : "rgba(255, 255, 255, 0.75)",
            zIndex: -1,
            borderRadius: "24px",
          }}
        />

        {/* Card Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 2,
          }}
        >
          {/* Status Chip */}
          <Chip
            icon={<CheckCircleIcon style={{ fontSize: 16, color: "#10B981" }} />}
            label={status}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
              color: "#10B981",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              px: 1,
            }}
          />

          {/* Avatar / Profile Picture */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: 90,
                height: 90,
                fontSize: "2.2rem",
                fontWeight: 800,
                bgcolor: "primary.main",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                border: "3px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "#ffffff",
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "S"}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: "#10B981",
                border: "2px solid #ffffff",
              }}
            />
          </Box>

          {/* User Details */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              Made by {name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "primary.main",
                mt: 0.5,
              }}
            >
              {title}
            </Typography>
            {handle && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  mt: 0.25,
                  fontWeight: 500,
                }}
              >
                @{handle}
              </Typography>
            )}
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              px: 1,
            }}
          >
            Crafted with precision using React, Vite, Material UI, and React Bits animations.
          </Typography>

          {/* Contact Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onContactClick}
            startIcon={<EmailIcon />}
            sx={{
              mt: 1,
              borderRadius: "14px",
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
              },
            }}
          >
            {contactText}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileCard;
