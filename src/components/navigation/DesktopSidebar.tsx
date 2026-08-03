import React, { useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useNavigationItems } from "../../hooks/useNavigationItems";
import { getTabEssenceStyle } from "../../utils/navigationColors";
import { motion } from "motion/react";

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSidebarTab?: string;
  setActiveSidebarTab?: (tab: string) => void;
  onLogoutClick?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeSidebarTab,
  setActiveSidebarTab,
  onLogoutClick,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { coloredNavIconsEnabled, translucencyEnabled } = useContext(ThemeContext);
  const { primaryMenuItems, secondaryMenuItems } = useNavigationItems(userProfile);

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
        width: sidebarOpen ? 240 : 72,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: translucencyEnabled
          ? theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.06)"
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.08)",
        bgcolor: translucencyEnabled
          ? theme.palette.mode === "dark"
            ? "rgba(10, 10, 14, 0.82)"
            : "rgba(255, 255, 255, 0.82)"
          : theme.palette.mode === "dark"
          ? "background.paper"
          : "#ffffff",
        backdropFilter: translucencyEnabled ? "blur(8px) saturate(120%)" : "none",
        WebkitBackdropFilter: translucencyEnabled ? "blur(8px) saturate(120%)" : "none",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        position: "fixed",
        top: 64, // below AppBar
        bottom: 0,
        left: 0,
        zIndex: 100,
        pt: "22px",
        pl: "1px",
      }}
    >
      {/* Sidebar Header / Toggle Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          height: 56,
        }}
      >
        {sidebarOpen && (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Quick Navigation
          </Typography>
        )}
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          size="small"
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Sidebar Tabs */}
      <List sx={{ p: 1, gap: 0.5, display: "flex", flexDirection: "column" }}>
        {sortedMenuItems.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          const isDark = theme.palette.mode === "dark";
          const { iconColor, inactiveColor, activePillBg } = getTabEssenceStyle(
            item.text,
            isDark,
            coloredNavIconsEnabled,
            theme.palette.primary.main
          );

          const itemActiveColor = iconColor;
          const itemInactiveColor = inactiveColor || "text.secondary";

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!sidebarOpen ? item.text : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={active}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    position: "relative",
                    bgcolor: "transparent",
                    color: active ? itemActiveColor : itemInactiveColor,
                    "&.Mui-selected": {
                      bgcolor: "transparent",
                      color: itemActiveColor,
                      "& .MuiListItemIcon-root": {
                        color: itemActiveColor,
                      },
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                    },
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="desktopSidebarActivePill"
                      style={{
                        position: "absolute",
                        left: 4,
                        right: 4,
                        top: 4,
                        bottom: 4,
                        borderRadius: "8px",
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
                  <Box
                    sx={{
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: sidebarOpen ? "initial" : "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 0,
                        justifyContent: "center",
                        color: active ? itemActiveColor : itemInactiveColor,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: active ? 600 : 500,
                              color: active ? itemActiveColor : "text.primary",
                            }}
                          >
                            {item.text}
                          </Typography>
                        }
                      />
                    )}
                  </Box>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
