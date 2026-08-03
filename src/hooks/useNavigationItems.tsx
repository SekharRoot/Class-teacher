import React, { useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ScienceIcon from "@mui/icons-material/Science";
import SettingsIcon from "@mui/icons-material/Settings";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from "@mui/icons-material/Info";
import { UserProfile } from "../types";

export interface MenuItemType {
  text: string;
  icon: React.ReactElement;
  path: string;
}

export function useNavigationItems(userProfile: UserProfile | null) {
  const [showLeavesView, setShowLeavesView] = React.useState(() => {
    return localStorage.getItem("show_leaves_view") === "true";
  });

  React.useEffect(() => {
    const handleSettingChange = () => {
      setShowLeavesView(localStorage.getItem("show_leaves_view") === "true");
    };
    window.addEventListener("storage", handleSettingChange);
    window.addEventListener("leaves_setting_changed", handleSettingChange);
    return () => {
      window.removeEventListener("storage", handleSettingChange);
      window.removeEventListener("leaves_setting_changed", handleSettingChange);
    };
  }, []);

  const primaryMenuItems = useMemo<MenuItemType[]>(() => {
    return [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
      { text: "Attendance", icon: <CheckCircleIcon />, path: "/attendance" },
      { text: "Profiles", icon: <AccountBoxIcon />, path: "/profiles" },
      { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
    ];
  }, []);

  const secondaryMenuItems = useMemo<MenuItemType[]>(() => {
    if (!userProfile) return [];

    const items: MenuItemType[] = [];

    if (
      userProfile.role === "admin" ||
      userProfile.role === "owner" ||
      userProfile.role === "school_admin" ||
      userProfile.role === "academic_coordinator"
    ) {
      items.push({
        text: "User Admin & Approvals",
        icon: <SupervisorAccountIcon />,
        path: "/admin",
      });
    }

    if (userProfile.hasLeaveFeatureAccess && showLeavesView) {
      items.push({
        text: "Leave Requests",
        icon: <DateRangeIcon />,
        path: "/leaves",
      });
    }

    if (
      userProfile.role === "admin" ||
      userProfile.role === "owner" ||
      userProfile.role === "school_admin" ||
      userProfile.role === "academic_coordinator" ||
      userProfile.role === "principal" ||
      userProfile.role === "class_teacher"
    ) {
      items.push({
        text: "Inactive Profiles",
        icon: <DeleteSweepIcon />,
        path: "/inactive-profiles",
      });
    }

    items.push(
      { text: "Export", icon: <PictureAsPdfIcon />, path: "/export" },
      { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
      { text: "App Info", icon: <InfoIcon />, path: "/app-info" }
    );

    if (userProfile.role === "owner") {
      items.push({ text: "Testing", icon: <ScienceIcon />, path: "/testing" });
    }

    return items;
  }, [userProfile, showLeavesView]);

  return { primaryMenuItems, secondaryMenuItems };
}
