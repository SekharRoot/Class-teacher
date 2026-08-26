import React from "react";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import { CellMenuState } from "./types";

interface CellStatusMenuProps {
  menuState: CellMenuState | null;
  isDarkMode: boolean;
  onClose: () => void;
  onSelectStatus: (status: string) => void;
}

export const CellStatusMenu: React.FC<CellStatusMenuProps> = ({
  menuState,
  isDarkMode,
  onClose,
  onSelectStatus,
}) => {
  return (
    <Menu
      anchorEl={menuState?.anchorEl}
      open={Boolean(menuState?.anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 6,
          sx: {
            borderRadius: 2.5,
            minWidth: 170,
            p: 0.75,
            border: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          mb: 0.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700, display: "block" }}
        >
          {menuState?.studentName}
        </Typography>
        <Typography
          variant="caption"
          color="primary.main"
          sx={{ fontWeight: 600 }}
        >
          {menuState?.dateStr
            ? format(parseISO(menuState.dateStr), "MMM d, yyyy (EEE)")
            : ""}
        </Typography>
      </Box>

      <MenuItem
        onClick={() => onSelectStatus("present")}
        selected={menuState?.currentStatus === "present"}
        sx={{
          color: isDarkMode ? "#81c784" : "#1b5e20",
          fontWeight: "bold",
          fontSize: "0.85rem",
          my: 0.25,
          borderRadius: 1.5,
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
            bgcolor: isDarkMode ? "rgba(46, 125, 50, 0.3)" : "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.75rem",
          }}
        >
          P
        </Box>
        (P) Present
      </MenuItem>

      <MenuItem
        onClick={() => onSelectStatus("absent")}
        selected={menuState?.currentStatus === "absent"}
        sx={{
          color: isDarkMode ? "#ef5350" : "#b71c1c",
          fontWeight: "bold",
          fontSize: "0.85rem",
          my: 0.25,
          borderRadius: 1.5,
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
            bgcolor: isDarkMode ? "rgba(198, 40, 40, 0.3)" : "#ffebee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.75rem",
          }}
        >
          A
        </Box>
        (A) Absent
      </MenuItem>

      <MenuItem
        onClick={() => onSelectStatus("leave")}
        selected={menuState?.currentStatus === "leave"}
        sx={{
          color: isDarkMode ? "#ffb74d" : "#e65100",
          fontWeight: "bold",
          fontSize: "0.85rem",
          my: 0.25,
          borderRadius: 1.5,
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
            bgcolor: isDarkMode ? "rgba(230, 81, 0, 0.3)" : "#fff3e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.75rem",
          }}
        >
          L
        </Box>
        (L) Leave
      </MenuItem>

      <MenuItem
        onClick={() => onSelectStatus("")}
        selected={!menuState?.currentStatus}
        sx={{
          color: "text.secondary",
          fontSize: "0.85rem",
          my: 0.25,
          borderRadius: 1.5,
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.75rem",
          }}
        >
          -
        </Box>
        (-) Clear
      </MenuItem>
    </Menu>
  );
};
