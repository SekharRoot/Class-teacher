import React from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { motion } from "motion/react";

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface BottomNavBarProps {
  primaryMenuItems: NavItem[];
  secondaryMenuItems: NavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  primaryMenuItems,
  secondaryMenuItems,
  currentPath,
  onNavigate,
}) => {
  const theme = useTheme();
  
  const sortedMenuItems = React.useMemo(() => {
    const allItems = [...primaryMenuItems, ...secondaryMenuItems];
    const dashboardItem = allItems.find((item) => item.text === "Dashboard");
    const attendanceItem = allItems.find((item) => item.text === "Attendance");
    const profilesItem = allItems.find((item) => item.text === "Profiles");
    const appInfoItem = allItems.find((item) => item.text === "App Info");
    
    const otherItems = allItems.filter(
      (item) =>
        item.text !== "Dashboard" &&
        item.text !== "Attendance" &&
        item.text !== "Profiles" &&
        item.text !== "App Info"
    );
    otherItems.sort((a, b) => a.text.localeCompare(b.text));

    const result = [];
    if (dashboardItem) result.push(dashboardItem);
    if (attendanceItem) result.push(attendanceItem);
    if (profilesItem) result.push(profilesItem);
    result.push(...otherItems);
    if (appInfoItem) result.push(appInfoItem);

    return result;
  }, [primaryMenuItems, secondaryMenuItems]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 24 },
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1100,
        width: "100%",
        display: { xs: "flex", md: "none" },
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          p: { xs: 0.5, sm: 1 },
          borderRadius: "24px",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
              : "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          maxWidth: "95%",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {sortedMenuItems.map((item) => {
          const active =
            item.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.path);
          return (
            <Tooltip key={item.text} title={item.text} arrow>
              <IconButton
                onClick={() => onNavigate(item.path)}
                sx={{
                  color: active ? "primary.main" : "text.secondary",
                  bgcolor: "transparent",
                  borderRadius: "18px",
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.25 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  minWidth: { xs: 50, sm: 70 },
                  flexShrink: 0,
                  position: "relative",
                  transition: "color 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    color: "primary.main",
                    transform: "translateY(-1px) scale(1.05)",
                  },
                }}
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavActivePill"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      borderRadius: "18px",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.15)"
                          : "rgba(25, 118, 210, 0.08)",
                      zIndex: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <Box sx={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                  {item.icon}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: active ? 700 : 500,
                      fontSize: { xs: "0.65rem", sm: "0.72rem" },
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>
          );
        })}
      </Paper>
    </Box>
  );
};
