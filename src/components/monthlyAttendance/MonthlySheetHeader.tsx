import React from "react";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Undo as UndoIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

interface MonthlySheetHeaderProps {
  currentMonthDate: Date;
  modifiedCount: number;
  saving: boolean;
  searchQuery: string;
  statusFilter: "active" | "all" | "inactive";
  isDarkMode: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onRefresh: () => void;
  onSearchChange: (val: string) => void;
  onStatusFilterChange: (val: "active" | "all" | "inactive") => void;
}

export const MonthlySheetHeader: React.FC<MonthlySheetHeaderProps> = ({
  currentMonthDate,
  modifiedCount,
  saving,
  searchQuery,
  statusFilter,
  isDarkMode,
  onPrevMonth,
  onNextMonth,
  onCurrentMonth,
  onDiscardChanges,
  onSaveChanges,
  onRefresh,
  onSearchChange,
  onStatusFilterChange,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 1.25, sm: 2 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.25, sm: 1.75 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 1.25,
        }}
      >
        {/* Month Navigator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", sm: "flex-start" },
            gap: { xs: 0.5, sm: 1 },
            flexWrap: "nowrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Previous Month">
              <IconButton
                onClick={onPrevMonth}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 0.5, sm: 0.75 },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                minWidth: { xs: 110, sm: 140 },
                textAlign: "center",
                fontSize: { xs: "0.92rem", sm: "1.05rem" },
                userSelect: "none",
              }}
            >
              {format(currentMonthDate, "MMM yyyy")}
            </Typography>

            <Tooltip title="Next Month">
              <IconButton
                onClick={onNextMonth}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 0.5, sm: 0.75 },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Jump to current month">
            <Button
              size="small"
              variant="outlined"
              startIcon={<TodayIcon fontSize="small" />}
              onClick={onCurrentMonth}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                py: 0.4,
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                whiteSpace: "nowrap",
              }}
            >
              Current Month
            </Button>
          </Tooltip>
        </Box>

        {/* Action Buttons: Save & Discard & Sync */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1,
            flexWrap: "nowrap",
          }}
        >
          {modifiedCount > 0 && (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<UndoIcon fontSize="small" />}
              onClick={onDiscardChanges}
              disabled={saving}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                py: 0.4,
                px: 1.25,
                fontSize: "0.8125rem",
                whiteSpace: "nowrap",
              }}
            >
              Discard
            </Button>
          )}

          <Button
            variant="contained"
            color={modifiedCount > 0 ? "primary" : "inherit"}
            size="small"
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveIcon fontSize="small" />
              )
            }
            onClick={onSaveChanges}
            disabled={modifiedCount === 0 || saving}
            sx={{
              borderRadius: 2,
              px: { xs: 1.5, sm: 2 },
              py: 0.5,
              fontWeight: "bold",
              fontSize: "0.8125rem",
              boxShadow: modifiedCount > 0 ? 2 : 0,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            {saving
              ? "Saving..."
              : modifiedCount > 0
                ? `Save (${modifiedCount})`
                : "Save Changes"}
          </Button>

          <Tooltip title="Sync & refresh sheet data from server">
            <IconButton
              onClick={onRefresh}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: { xs: 0.5, sm: 0.75 },
                borderRadius: 2,
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filter Controls Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.25,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          size="small"
          placeholder="Search student or roll no..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: "100%", sm: 240, md: 280 },
            "& .MuiInputBase-root": {
              height: 34,
              fontSize: "0.85rem",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            gap: 0.75,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, mr: 0.25 }}
          >
            Status:
          </Typography>
          <Chip
            label="Active"
            size="small"
            clickable
            color={statusFilter === "active" ? "primary" : "default"}
            variant={statusFilter === "active" ? "filled" : "outlined"}
            onClick={() => onStatusFilterChange("active")}
            sx={{
              fontWeight: statusFilter === "active" ? 700 : 500,
              fontSize: "0.78rem",
              height: 28,
            }}
          />
          <Chip
            label="All"
            size="small"
            clickable
            color={statusFilter === "all" ? "primary" : "default"}
            variant={statusFilter === "all" ? "filled" : "outlined"}
            onClick={() => onStatusFilterChange("all")}
            sx={{
              fontWeight: statusFilter === "all" ? 700 : 500,
              fontSize: "0.78rem",
              height: 28,
            }}
          />
          <Chip
            label="Inactive"
            size="small"
            clickable
            color={statusFilter === "inactive" ? "default" : "default"}
            variant={statusFilter === "inactive" ? "filled" : "outlined"}
            onClick={() => onStatusFilterChange("inactive")}
            sx={{
              fontWeight: statusFilter === "inactive" ? 700 : 500,
              fontSize: "0.78rem",
              height: 28,
              bgcolor:
                statusFilter === "inactive"
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.16)"
                    : "grey.300"
                  : "transparent",
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};
