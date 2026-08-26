import React, { useContext, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { motion, AnimatePresence } from "motion/react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getTabEssenceStyle } from "../../utils/navigationColors";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { coloredNavIconsEnabled, translucencyEnabled } = useContext(ThemeContext);

  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  const sortedMenuItems = React.useMemo(() => {
    const allItems = [...primaryMenuItems, ...secondaryMenuItems];
    const dashboardItem = allItems.find((item) => item.text === "Dashboard");
    const attendanceItem = allItems.find((item) => item.text === "Attendance");
    const classesItem = allItems.find((item) => item.text === "Classes" || item.text === "Class");
    const profilesItem = allItems.find((item) => item.text === "Profiles");
    const settingsItem = allItems.find((item) => item.text === "Settings");

    const otherItems = allItems.filter(
      (item) =>
        item.text !== "Dashboard" &&
        item.text !== "Attendance" &&
        item.text !== "Classes" &&
        item.text !== "Class" &&
        item.text !== "Profiles" &&
        item.text !== "Settings"
    );
    otherItems.sort((a, b) => a.text.localeCompare(b.text));

    const result = [];
    if (dashboardItem) result.push(dashboardItem);
    if (attendanceItem) result.push(attendanceItem);
    if (classesItem) result.push(classesItem);
    if (profilesItem) result.push(profilesItem);
    if (settingsItem) result.push(settingsItem);
    result.push(...otherItems);

    return result;
  }, [primaryMenuItems, secondaryMenuItems]);

  // Mobile views split: 3 core unhidden tabs (Dashboard, Attendance, Profiles) vs extra hidden/collapsed tabs
  const { mobileMainItems, mobileExtraItems } = React.useMemo(() => {
    const mainKeys = ["Dashboard", "Attendance", "Profiles"];
    const main = sortedMenuItems
      .filter((item) => mainKeys.includes(item.text))
      .sort((a, b) => {
        return mainKeys.indexOf(a.text) - mainKeys.indexOf(b.text);
      });
    const extra = sortedMenuItems.filter((item) => !mainKeys.includes(item.text));
    return { mobileMainItems: main, mobileExtraItems: extra };
  }, [sortedMenuItems]);

  // If mobile and not expanded, show core 5 tabs. If expanded or desktop, show all tabs inside the bar itself.
  const displayedItems = isMobile && !mobileExpanded ? mobileMainItems : sortedMenuItems;

  const toggleExpand = () => {
    setMobileExpanded((prev) => !prev);
  };

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
        component={motion.div}
        layout
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        elevation={6}
        sx={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          p: { xs: 0.5, sm: 1 },
          borderRadius: "10px",
          bgcolor: translucencyEnabled
            ? theme.palette.mode === "dark"
              ? "rgba(16, 16, 22, 0.72)"
              : "rgba(255, 255, 255, 0.68)"
            : theme.palette.mode === "dark"
            ? "rgba(20, 20, 24, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: translucencyEnabled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: translucencyEnabled ? "blur(20px) saturate(180%)" : "none",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
          border: "1px solid",
          borderColor: translucencyEnabled
            ? theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(255, 255, 255, 0.7)"
            : theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.08)",
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
        <AnimatePresence initial={false} mode="popLayout">
          {displayedItems.map((item) => {
            const active =
              item.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.path);

            const isDark = theme.palette.mode === "dark";
            const { iconColor, inactiveColor, activePillBg } = getTabEssenceStyle(
              item.text,
              isDark,
              coloredNavIconsEnabled,
              theme.palette.primary.main
            );

            const activeColor = iconColor;
            const itemInactiveColor = inactiveColor || "text.secondary";

            return (
              <Box
                key={item.text}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                <Tooltip title={item.text} arrow>
                  <IconButton
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      color: active ? activeColor : itemInactiveColor,
                      opacity: active ? 1 : coloredNavIconsEnabled ? 0.75 : 1,
                      bgcolor: "transparent",
                      borderRadius: "10px",
                      px: { xs: 1.25, sm: 2 },
                      py: { xs: 1, sm: 1.25 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.25,
                      minWidth: { xs: 44, sm: 70 },
                      flexShrink: 0,
                      position: "relative",
                      transition: "color 0.2s ease, transform 0.2s ease, opacity 0.2s ease",
                      "&:hover": {
                        color: activeColor,
                        opacity: 1,
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
                          borderRadius: "10px",
                          backgroundColor: activePillBg,
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
                          color: "inherit",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
        </AnimatePresence>

        {/* Mobile View Toggle Button to Expand / Collapse Tabs directly inside the floating bar */}
        {isMobile && mobileExtraItems.length > 0 && (
          <Tooltip title={mobileExpanded ? "Show Less" : "More Tabs"} arrow>
            <IconButton
              onClick={toggleExpand}
              sx={{
                color: mobileExpanded ? "primary.main" : "text.secondary",
                bgcolor: mobileExpanded
                  ? theme.palette.mode === "dark"
                    ? "rgba(41, 121, 255, 0.20)"
                    : "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                borderRadius: "10px",
                px: 1.25,
                py: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 44,
                flexShrink: 0,
                position: "relative",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  color: "primary.main",
                },
              }}
            >
              <Box sx={{ zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {mobileExpanded ? <ChevronLeftIcon /> : <MoreHorizIcon />}
              </Box>
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
};
