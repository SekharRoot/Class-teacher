import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { ListAlt, History, TableChart } from "@mui/icons-material";

interface AttendanceTabNavigationProps {
  activeTab: number;
  historyCount: number;
  onTabChange: (tab: number) => void;
}

export const AttendanceTabNavigation: React.FC<AttendanceTabNavigationProps> = ({
  activeTab,
  historyCount,
  onTabChange,
}) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, val) => onTabChange(val)}
        aria-label="attendance views"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
      >
        <Tab
          icon={<ListAlt fontSize="large" />}
          label="Take Attendance"
          sx={{ textTransform: "none", fontWeight: "bold", minHeight: 72 }}
        />
        <Tab
          icon={<History fontSize="large" />}
          label={`Attendance History (${historyCount})`}
          sx={{ textTransform: "none", fontWeight: "bold", minHeight: 72 }}
        />
        <Tab
          icon={<TableChart fontSize="large" />}
          label="Sheet"
          sx={{ textTransform: "none", fontWeight: "bold", minHeight: 72 }}
        />
      </Tabs>
    </Box>
  );
};
