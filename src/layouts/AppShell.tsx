import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { imageCache } from "../utils/imageCache";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Paper,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LogoutIcon from "@mui/icons-material/Logout";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SyncIcon from "@mui/icons-material/Sync";
import ScienceIcon from "@mui/icons-material/Science";
import SettingsIcon from "@mui/icons-material/Settings";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { BottomNavBar } from "../components/navigation/BottomNavBar";

export default function AppShell() {
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [syncing, setSyncing] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.status === "pending") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          p: 3,
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CheckCircleIcon color="warning" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Account Pending Approval
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your account has been created successfully and is currently pending
            approval by an administrator. You will be able to access the
            application once your role and permissions are verified.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Log Out
          </Button>
        </Paper>
      </Box>
    );
  }

  const isReportsPage = location.pathname.startsWith("/reports") || location.pathname.includes("reports");
  const isDeepNavigation = location.pathname.split("/").filter(Boolean).length > 1 && !isReportsPage;
  const isDashboard = location.pathname === "/";

  const handleBack = () => {
    const parts = location.pathname.split("/");
    if (parts.length > 2) {
      navigate(`/${parts[1]}`);
    } else {
      navigate(-1);
    }
  };

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    window.dispatchEvent(new CustomEvent("force-sync"));
    setTimeout(() => {
      setSyncing(false);
    }, 1500);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    imageCache.cleanup();
  }, []);

  const primaryMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Attendance", icon: <CheckCircleIcon />, path: "/attendance" },
    { text: "Class", icon: <SchoolIcon />, path: "/class" },
    { text: "Profiles", icon: <AccountBoxIcon />, path: "/profiles" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  ];

  const secondaryMenuItems = [
    ...(userProfile?.role === "admin" || userProfile?.role === "owner"
      ? [
          {
            text: "User Admin & Approvals",
            icon: <SupervisorAccountIcon />,
            path: "/admin",
          },
        ]
      : []),
    ...(userProfile?.hasLeaveFeatureAccess
      ? [{ text: "Leave Requests", icon: <DateRangeIcon />, path: "/leaves" }]
      : []),
    ...(userProfile?.role === "admin" ||
    userProfile?.role === "owner" ||
    userProfile?.role === "academic_coordinator" ||
    userProfile?.role === "principal"
      ? [
          {
            text: "Inactive Profiles",
            icon: <DeleteSweepIcon />,
            path: "/inactive-profiles",
          },
        ]
      : []),
    { text: "Export", icon: <PictureAsPdfIcon />, path: "/export" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    ...(userProfile?.role === "owner"
      ? [{ text: "Testing", icon: <ScienceIcon />, path: "/testing" }]
      : []),
  ];

  const menuItems = [...primaryMenuItems, ...secondaryMenuItems];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 1,
          width: "100%",
        }}
        color="inherit"
      >
        <Toolbar>
          {isDeepNavigation && (
            <IconButton
              color="inherit"
              aria-label="go back"
              edge="start"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                color: "text.primary",
                fontSize: { xs: "0.95rem", sm: "1.15rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Attendance manager
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
                lineHeight: 1,
                mt: 0.25,
              }}
            >
              by Sekhar
            </Typography>
          </Box>
          {userProfile?.role === "principal" && (
            <Chip
              label="Principal (Read-Only)"
              color="info"
              size="small"
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
              }}
            />
          )}
          {userProfile?.role === "owner" && (
            <Chip
              label="Owner"
              color="warning"
              size="small"
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
              }}
            />
          )}
          {userProfile?.role === "admin" && (
            <Chip
              label="Admin Mode"
              color="error"
              size="small"
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
              }}
            />
          )}
          {userProfile?.role === "academic_coordinator" && (
            <Chip
              label="Academic Coordinator"
              color="secondary"
              size="small"
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
              }}
            />
          )}
          {userProfile?.role === "class_teacher" && (
            <Chip
              label="Class Teacher"
              color="success"
              size="small"
              sx={{
                ml: { xs: 1, sm: 2 },
                fontWeight: "bold",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
              }}
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isDashboard && (
            <>
              <Tooltip title="Synchronize Data with Server">
                <IconButton
                  id="btn-sync-global"
                  color="primary"
                  onClick={handleSync}
                  sx={{ mr: 1.5 }}
                  disabled={syncing}
                >
                  <SyncIcon className={syncing ? "animate-spin" : ""} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  id="btn-logout"
                  color="inherit"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of Classroom Manager?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          pb: { xs: 14, sm: 16 }, // Generous padding bottom so the floating bar doesn't overlap content
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          mt: 8,
          overflowX: "hidden",
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Outlet />
        </Box>
      </Box>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        currentPath={location.pathname}
        onNavigate={navigate}
        onMoreClick={handleMoreClick}
      />

      {/* Popover Menu for Secondary Navigation Items */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px",
            mt: -1.5,
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
            minWidth: 180,
            bgcolor:
              theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        {secondaryMenuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <MenuItem
              key={item.text}
              onClick={() => {
                navigate(item.path);
                handleMoreClose();
              }}
              selected={active}
              sx={{
                py: 1,
                px: 2,
                borderRadius: "8px",
                mx: 0.5,
                my: 0.25,
                display: "flex",
                gap: 1.5,
                color: active ? "primary.main" : "text.primary",
                "&.Mui-selected": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.2)"
                      : "rgba(25, 118, 210, 0.08)",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(25, 118, 210, 0.25)"
                        : "rgba(25, 118, 210, 0.12)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "primary.main" : "text.secondary",
                  minWidth: "auto !important",
                  mr: 1.5,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{ fontSize: "0.85rem", fontWeight: active ? 600 : 500 }}
                >
                  {item.text}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
