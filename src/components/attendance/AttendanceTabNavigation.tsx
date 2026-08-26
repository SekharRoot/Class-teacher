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
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: { xs: 2, sm: 3 } }}>
      <Tabs
        value={activeTab}
        onChange={(_, val) => onTabChange(val)}
        aria-label="attendance views"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: { xs: "flex-start", sm: "center" },
          },
          "& .MuiTab-root": {
            fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
            minWidth: { xs: "33%", sm: "auto" },
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 58, sm: 72 },
            textTransform: "none",
            fontWeight: "bold",
          },
          "& .MuiSvgIcon-root": {
            fontSize: { xs: "1.4rem", sm: "2rem" },
          }
        }}
      >
        <Tab
          icon={<ListAlt />}
          label="Take Attendance"
        />
        <Tab
          icon={<History />}
          label={`History (${historyCount})`}
        />
        <Tab
          icon={<TableChart />}
          label="Class Sheet"
        />
      </Tabs>
    </Box>
  );
};
