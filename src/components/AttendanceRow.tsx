import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Cancel,
  Star,
  AccessTime,
} from "@mui/icons-material";
import { Student, AttendanceStatus, LeaveRequest } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus | undefined;
  onMarkStatus: (studentId: string, status: AttendanceStatus | null) => void;
  index: number;
  isLast: boolean;
  disabled?: boolean;
  leavesList?: LeaveRequest[];
  dateString?: string;
}

const AttendanceRowComponent: React.FC<AttendanceRowProps> = ({
  student,
  status,
  onMarkStatus,
  index,
  isLast,
  disabled = false,
  leavesList = [],
  dateString = "",
}) => {
  const timerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const isLongPress = React.useRef(false);

  const startPress = () => {
    if (disabled) return;
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onMarkStatus(student.id, "leave");
    }, 500); // 500ms long press
  };

  const endPress = () => {
    if (disabled) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const handleAbsentClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (isLongPress.current) {
      e.stopPropagation();
      e.preventDefault();
      isLongPress.current = false;
    }
  };

  const getStatusColor = (
    s?: AttendanceStatus,
  ): "success" | "warning" | "error" | "info" | "default" => {
    switch (s) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "leave":
        return "info";
      default:
        return "default";
    }
  };

  const statusColor = getStatusColor(status);

  const approvedLeave = leavesList.find(
    (l) =>
      l.studentId === student.id &&
      l.status === "approved" &&
      dateString >= l.startDate &&
      dateString <= l.endDate,
  );

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatus: AttendanceStatus | null,
  ) => {
    if (disabled) return;
    if (isLongPress.current) {
      return;
    }
    onMarkStatus(student.id, newStatus);
  };

  return (
    <React.Fragment>
      <ListItem
        sx={{
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 3 },
          flexDirection: "row",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          bgcolor:
            status === "absent"
              ? "error.50"
              : status === "leave"
                ? "info.50"
                : status === "present"
                  ? "success.50"
                  : "inherit",
          "&:hover": {
            bgcolor:
              status === "absent"
                ? "error.100"
                : status === "leave"
                  ? "info.100"
                  : status === "present"
                    ? "success.100"
                    : "grey.50",
          },
        }}
      >
        {/* Student Details */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 0,
            mr: 1,
          }}
        >
          <ListItemAvatar sx={{ minWidth: { xs: 76, sm: 88 } }}>
            {student.image ? (
              <Box
                component="img"
                src={student.image}
                sx={{
                  width: { xs: 64, sm: 72 },
                  height: { xs: 64, sm: 72 },
                  borderRadius: "2px",
                  border: status ? "2px solid" : "none",
                  borderColor: `${statusColor}.main`,
                  boxShadow: 2,
                  objectFit: "cover",
                }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  width: { xs: 64, sm: 72 },
                  height: { xs: 64, sm: 72 },
                  borderRadius: "2px",
                  bgcolor: status ? `${statusColor}.light` : "primary.light",
                  color: status
                    ? `${statusColor}.contrastText`
                    : "primary.contrastText",
                  fontWeight: "bold",
                  boxShadow: 2,
                  fontSize: "1.5rem",
                }}
              >
                {student.firstName[0] || ""}
                {student.lastName ? student.lastName[0] : ""}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            sx={{ minWidth: 0 }}
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    color: "text.primary",
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {student.firstName} {student.lastName}
                </Typography>
                {approvedLeave && (
                  <Chip
                    label="On Leave"
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{
                      fontWeight: "bold",
                      height: 20,
                      fontSize: "0.7rem",
                      borderColor: "info.main",
                      color: "info.main",
                    }}
                  />
                )}
              </Box>
            }
            secondary={
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Roll: {student.rollNumber}
              </Typography>
            }
          />
        </Box>

        {/* Attendance Marking Toggle Group */}
        <ToggleButtonGroup
          value={status}
          exclusive
          disabled={disabled}
          onChange={handleStatusChange}
          aria-label="student attendance"
          size="medium"
          sx={{
            flexShrink: 0,
            display: "flex",
            gap: 1,
            "& .MuiToggleButton-root": {
              minWidth: 0,
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: "8px !important",
              border: "1px solid !important",
              borderColor: "divider !important",
              marginLeft: "0 !important", // prevent negative margin from ToggleButtonGroup
              "&.Mui-selected": {
                boxShadow: 2,
              },
            },
            '& .MuiToggleButton-root.Mui-selected[value="present"]': {
              bgcolor: "success.main",
              color: "success.contrastText",
              "&:hover": { bgcolor: "success.dark" },
            },
            '& .MuiToggleButton-root.Mui-selected[value="absent"]': {
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": { bgcolor: "error.dark" },
            },
            '& .MuiToggleButton-root.Mui-selected[value="leave"]': {
              bgcolor: "info.main",
              color: "info.contrastText",
              "&:hover": { bgcolor: "info.dark" },
            },
          }}
        >
          <ToggleButton value="present" aria-label="present">
            <CheckCircle sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </ToggleButton>
          <ToggleButton
            value={status === "leave" ? "leave" : "absent"}
            aria-label="absent"
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onClick={handleAbsentClick}
            sx={{
              '&.Mui-selected[value="leave"]': {
                bgcolor: "info.main",
                color: "info.contrastText",
                "&:hover": { bgcolor: "info.dark" },
              },
            }}
          >
            {status === "leave" ? (
              <Star sx={{ fontSize: { xs: 28, sm: 32 } }} />
            ) : (
              <Cancel sx={{ fontSize: { xs: 28, sm: 32 } }} />
            )}
          </ToggleButton>
        </ToggleButtonGroup>
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </React.Fragment>
  );
};

export const AttendanceRow = React.memo(
  AttendanceRowComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.status === nextProps.status &&
      prevProps.isLast === nextProps.isLast &&
      prevProps.index === nextProps.index &&
      prevProps.student.id === nextProps.student.id &&
      prevProps.student.firstName === nextProps.student.firstName &&
      prevProps.student.lastName === nextProps.student.lastName &&
      prevProps.student.image === nextProps.student.image &&
      prevProps.dateString === nextProps.dateString &&
      prevProps.leavesList?.length === nextProps.leavesList?.length
    );
  },
);
