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
import { UserProfile } from "../types";

export interface MenuItemType {
  text: string;
  icon: React.ReactElement;
  path: string;
}

export function useNavigationItems(userProfile: UserProfile | null) {
  const primaryMenuItems = useMemo<MenuItemType[]>(() => {
    return [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
      { text: "Attendance", icon: <CheckCircleIcon />, path: "/attendance" },
      { text: "Class", icon: <SchoolIcon />, path: "/class" },
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

    if (userProfile.hasLeaveFeatureAccess) {
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
      { text: "Settings", icon: <SettingsIcon />, path: "/settings" }
    );

    if (userProfile.role === "owner") {
      items.push({ text: "Testing", icon: <ScienceIcon />, path: "/testing" });
    }

    return items;
  }, [userProfile]);

  return { primaryMenuItems, secondaryMenuItems };
}
