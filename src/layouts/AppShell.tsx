import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { imageCache } from "../utils/imageCache";
import { Box, useTheme } from "@mui/material";
import { BottomNavBar } from "../components/navigation/BottomNavBar";
import { HeaderAppBar } from "../components/navigation/HeaderAppBar";
import { DesktopSidebar } from "../components/navigation/DesktopSidebar";
import { LogoutDialog } from "../components/navigation/LogoutDialog";
import { PendingApproval } from "../components/navigation/PendingApproval";
import { LoadingOverlay } from "../components/navigation/LoadingOverlay";
import { useNavigationItems } from "../hooks/useNavigationItems";
import { useData } from "../contexts/DataContext";

export default function AppShell() {
  const { currentUser, userProfile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { loading: globalLoading } = useData();
  const [localSyncing, setLocalSyncing] = useState(false);
  const syncing = globalLoading || localSyncing;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("profile");

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    imageCache.cleanup();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  if (userProfile?.status === "pending") {
    return <PendingApproval onLogout={handleLogout} />;
  }

  const isReportsPage =
    location.pathname.startsWith("/reports") ||
    location.pathname.includes("reports");
  const isDeepNavigation =
    location.pathname.split("/").filter(Boolean).length > 1 && !isReportsPage;
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
    setLocalSyncing(true);
    window.dispatchEvent(new CustomEvent("force-sync"));
    setTimeout(() => {
      setLocalSyncing(false);
    }, 1500);
  };

  const { primaryMenuItems, secondaryMenuItems } = useNavigationItems(userProfile);

  // Bottom bar items will be exactly the same as sidebar items
  const bottomBarPrimaryItems = primaryMenuItems;
  const bottomBarSecondaryItems = secondaryMenuItems;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <HeaderAppBar
        isDeepNavigation={isDeepNavigation}
        isDashboard={isDashboard}
        handleBack={handleBack}
        handleSync={handleSync}
        syncing={syncing}
        onLogoutClick={() => setLogoutDialogOpen(true)}
        userRole={userProfile?.role}
      />

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />

      <DesktopSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSidebarTab={activeSidebarTab}
        setActiveSidebarTab={setActiveSidebarTab}
      />

      {/* Main Content Wrapper Box */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pl: { xs: 0, md: sidebarOpen ? "240px" : "72px" },
          transition: theme.transitions.create("padding-left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            pb: { xs: 18, sm: 22 }, // Generous padding bottom so the floating bar doesn't overlap content
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            mt: 8,
            overflowX: "hidden",
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <Outlet />
            {/* Explicit vertical white space spacer at the bottom of all views */}
            <Box sx={{ height: { xs: 120, sm: 160 }, width: "100%" }} />
          </Box>
        </Box>
      </Box>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar
        primaryMenuItems={bottomBarPrimaryItems}
        secondaryMenuItems={bottomBarSecondaryItems}
        currentPath={location.pathname}
        onNavigate={navigate}
      />
    </Box>
  );
}
