import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SyncIcon from "@mui/icons-material/Sync";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
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
}

export const HeaderAppBar: React.FC<HeaderAppBarProps> = ({
  isDeepNavigation,
  isDashboard,
  handleBack,
  handleSync,
  syncing,
  onLogoutClick,
  userRole,
}) => {
  const { userProfile, activeSchoolId, activeSchoolName, setActiveSchool } = useAuth();
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

  const getRoleChip = () => {
    switch (userRole) {
      case "principal":
        return (
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
        );
      case "owner":
        return (
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
        );
      case "admin":
        return (
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
        );
      case "academic_coordinator":
        return (
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
        );
      case "class_teacher":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
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
            School Management System
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
            School: {activeSchoolName || "Default School"}
          </Typography>
        </Box>
        {getRoleChip()}
        {isOwnerOrAdmin && (
          <FormControl
            size="small"
            sx={{
              ml: { xs: 1, sm: 2 },
              minWidth: { xs: 140, sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
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
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Synchronize Data with Server">
          <span>
            <IconButton
              id="btn-sync-global"
              color="primary"
              onClick={handleSync}
              disabled={syncing}
              sx={{
                mr: 1.5,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: syncing ? "none" : "scale(1.1) rotate(30deg)",
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                },
                "&:active": {
                  transform: syncing ? "none" : "scale(0.95)",
                },
              }}
            >
              <SyncIcon
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  transition: "color 0.3s ease",
                  animation: syncing ? "spin-sync-keyframes 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
                  "@keyframes spin-sync-keyframes": {
                    "0%": {
                      transform: "rotate(0deg)",
                    },
                    "100%": {
                      transform: "rotate(360deg)",
                    },
                  },
                }}
              />
            </IconButton>
          </span>
        </Tooltip>
        {isDashboard && (
          <Tooltip title="Logout">
            <IconButton
              id="btn-logout"
              color="inherit"
              onClick={onLogoutClick}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};
