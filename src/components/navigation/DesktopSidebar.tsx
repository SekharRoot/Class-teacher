import React from "react";
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
import { useNavigationItems } from "../../hooks/useNavigationItems";

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSidebarTab?: string;
  setActiveSidebarTab?: (tab: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeSidebarTab,
  setActiveSidebarTab,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { primaryMenuItems, secondaryMenuItems } = useNavigationItems(userProfile);

  const sortedMenuItems = React.useMemo(() => {
    const allItems = [...primaryMenuItems, ...secondaryMenuItems];
    const dashboardItem = allItems.find((item) => item.text === "Dashboard");
    const otherItems = allItems.filter((item) => item.text !== "Dashboard");
    otherItems.sort((a, b) => a.text.localeCompare(b.text));
    return dashboardItem ? [dashboardItem, ...otherItems] : otherItems;
  }, [primaryMenuItems, secondaryMenuItems]);

  return (
    <Box
      sx={{
        width: sidebarOpen ? 240 : 72,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(25, 25, 25, 0.08)"
            : "rgba(0, 0, 0, 0.08)",
        bgcolor:
          theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
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
                    "&.Mui-selected": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(25, 118, 210, 0.15)"
                          : "rgba(25, 118, 210, 0.08)",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(25, 118, 210, 0.2)"
                            : "rgba(25, 118, 210, 0.12)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 2 : "auto",
                      justifyContent: "center",
                      color: active ? "primary.main" : "text.secondary",
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
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
