import React from "react";
import {
  Paper,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ListAlt,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Student, AttendanceStatus } from "../../types";
import { AttendanceSummary } from "../AttendanceSummary";

interface AttendanceHeaderControlsProps {
  dateString: string;
  selectedDate: Date;
  isTeacher: boolean;
  isPrincipal: boolean;
  isTakeAttendanceMode: boolean;
  students: Student[];
  attendance: Record<string, AttendanceStatus>;
  selectedClassId: string | null;
  onDateShift: (days: number) => void;
  onDateSelect: (dateStr: string) => void;
  onSetToday: () => void;
  onToggleTakeAttendanceMode: () => void;
}

export const AttendanceHeaderControls: React.FC<AttendanceHeaderControlsProps> = ({
  dateString,
  isTeacher,
  isPrincipal,
  isTakeAttendanceMode,
  students,
  attendance,
  selectedClassId,
  onDateShift,
  onDateSelect,
  onSetToday,
  onToggleTakeAttendanceMode,
}) => {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        borderRadius: "10px",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
          bgcolor: "action.hover",
          p: 0.5,
          borderRadius: "10px",
        }}
      >
        <IconButton
          onClick={() => onDateShift(-1)}
          size="small"
          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
        >
          <ChevronLeft />
        </IconButton>

        <TextField
          type="date"
          size="small"
          value={dateString}
          onChange={(e) => {
            if (e.target.value) onDateSelect(e.target.value);
          }}
          sx={{
            width: 150,
            "& .MuiInputBase-root": {
              fontWeight: "bold",
              fontSize: "0.9rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />

        <IconButton
          onClick={() => onDateShift(1)}
          size="small"
          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
        >
          <ChevronRight />
        </IconButton>

        <Button
          variant="contained"
          size="small"
          onClick={onSetToday}
          disabled={todayStr === dateString}
          sx={{
            ml: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Today
        </Button>

        {!isTeacher && !isPrincipal && (
          <Button
            variant={isTakeAttendanceMode ? "contained" : "outlined"}
            color={isTakeAttendanceMode ? "primary" : "secondary"}
            size="small"
            startIcon={<ListAlt />}
            onClick={onToggleTakeAttendanceMode}
            sx={{
              ml: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {isTakeAttendanceMode ? "View Mode" : "Take Attendance"}
          </Button>
        )}
      </Box>

      <AttendanceSummary
        students={students}
        attendance={attendance}
        selectedClassId={selectedClassId}
      />
    </Paper>
  );
};
