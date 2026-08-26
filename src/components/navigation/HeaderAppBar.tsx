import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import SyncIcon from "@mui/icons-material/Sync";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { schoolsApi } from "../../api/schools";
import { School } from "../../types";

interface HeaderAppBarProps {
  isDeepNavigation: boolean;
  isDashboard: boolean;
  handleBack: () => void;
  handleSync: () => void;
  syncing: boolean;
  onLogoutClick: () => void;
  userRole?: string | null;
  sidebarOpen?: boolean;
}

export const HeaderAppBar: React.FC<HeaderAppBarProps> = ({
  isDeepNavigation,
  isDashboard,
  handleBack,
  handleSync,
  syncing,
  onLogoutClick,
  userRole,
  sidebarOpen = true,
}) => {
  const { userProfile, activeSchoolId, activeSchoolName, setActiveSchool } = useAuth();
  const { translucencyEnabled } = useContext(ThemeContext);
  const theme = useTheme();
  const [schools, setSchools] = React.useState<School[]>([]);

  const isOwnerOrAdmin =
    userProfile?.role === "owner" ||
    userProfile?.role === "admin" ||
    userProfile?.email === "sekhar.root@gmail.com";

  React.useEffect(() => {
    if (isOwnerOrAdmin) {
      schoolsApi.getAll().then((data) => {
        setSchools(data);
      });
    }
  }, [isOwnerOrAdmin]);

  return (
    <AppBar
      position="fixed"
      sx={{
        top: { xs: 10, sm: 14 },
        left: { xs: 10, md: sidebarOpen ? 252 : 84 },
        right: { xs: 10, md: 16 },
        width: "auto",
        borderRadius: "10px",
        zIndex: 1100,
        transition: theme.transitions.create(["left", "width", "background-color", "box-shadow"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        bgcolor: translucencyEnabled
          ? theme.palette.mode === "dark"
            ? "rgba(16, 16, 22, 0.72)"
            : "rgba(255, 255, 255, 0.68)"
          : theme.palette.mode === "dark"
          ? "rgba(20, 20, 26, 0.95)"
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
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.45)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
      }}
      color="inherit"
    >
      <Toolbar sx={{ px: { xs: 2, sm: 2.5 }, minHeight: { xs: 56, sm: 62 }, gap: 1 }}>
        {isDeepNavigation && (
          <IconButton
            color="inherit"
            aria-label="go back"
            edge="start"
            onClick={handleBack}
            sx={{ mr: 0.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            py: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              lineHeight: 1.2,
              color: "text.primary",
              fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.35rem" },
              letterSpacing: "-0.025em",
            }}
          >
            {activeSchoolName || "Default School"}
          </Typography>
        </Box>
        {isOwnerOrAdmin && (
          <FormControl
            size="small"
            sx={{
              ml: { xs: 1, sm: 2 },
              minWidth: { xs: 130, sm: 170 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "0.8rem",
                fontWeight: 600,
              },
            }}
          >
            <Select
              value={activeSchoolId || "default_school"}
              onChange={(e) => {
                const selId = e.target.value as string;
                let selName = "Default School";
                if (selId !== "default_school") {
                  const found = schools.find((s) => s.id === selId);
                  if (found) selName = found.name;
                }
                setActiveSchool(selId, selName);
              }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="default_school">
                <em>Default School</em>
              </MenuItem>
              {activeSchoolId && activeSchoolId !== "default_school" && !schools.some((s) => s.id === activeSchoolId) && (
                <MenuItem key={activeSchoolId} value={activeSchoolId} style={{ display: "none" }}>
                  {activeSchoolName || "Loading..."}
                </MenuItem>
              )}
              {schools.filter((sch) => sch.isActive !== false).map((sch) => (
                <MenuItem key={sch.id} value={sch.id}>
                  {sch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {syncing ? (
          <Tooltip title="Fetching data in background...">
            <Chip
              icon={
                <CircularProgress
                  size={14}
                  thickness={5}
                  color="inherit"
                  sx={{ color: "primary.main" }}
                />
              }
              label="Fetching Data..."
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                ml: { xs: 1, sm: 1.5 },
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 28,
                borderRadius: "8px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(144, 202, 249, 0.12)"
                    : "rgba(25, 118, 210, 0.08)",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(144, 202, 249, 0.3)"
                    : "rgba(25, 118, 210, 0.25)",
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%": { opacity: 0.75 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.75 },
                },
                "& .MuiChip-label": {
                  px: 1,
                  display: { xs: "none", sm: "inline-block" },
                },
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Sync / Refresh Data">
            <IconButton
              size="small"
              onClick={handleSync}
              sx={{
                ml: { xs: 0.5, sm: 1 },
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <SyncIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Log Out">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onLogoutClick}
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: { xs: 1.5, sm: 2 },
              ml: 1,
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Log Out
            </Box>
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
