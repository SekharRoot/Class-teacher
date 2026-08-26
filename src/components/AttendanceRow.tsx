import React from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  CircularProgress,
  TextField,
  InputAdornment,
  TableRow,
  TableCell,
  Avatar,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Star,
  History as HistoryIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { Student, AttendanceStatus, LeaveRequest } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { attendanceApi } from "../api";
import { resolveStudentImage } from "../utils/imageCache";

interface AttendanceRowProps {
  student: Student;
  status: AttendanceStatus | undefined | null;
  onMarkStatus: (studentId: string, status: AttendanceStatus | null) => void;
  index: number;
  disabled?: boolean;
  leavesList?: LeaveRequest[];
  dateString?: string;
}

const AttendanceRowComponent: React.FC<AttendanceRowProps> = ({
  student,
  status,
  onMarkStatus,
  index,
  disabled = false,
  leavesList = [],
  dateString = "",
}) => {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [studentHistory, setStudentHistory] = React.useState<any[]>([]);
  const [displayImage, setDisplayImage] = React.useState("");

  React.useEffect(() => {
    resolveStudentImage(student).then(setDisplayImage);
  }, [student, student?.image]);

  const timerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const isLongPress = React.useRef(false);

  const fetchStudentHistory = async () => {
    setHistoryLoading(true);
    setHistoryOpen(true);
    try {
      const history = await attendanceApi.getHistory([student.id], undefined, 30);
      setStudentHistory(history || []);
    } catch (err) {
      console.error("Failed to fetch student history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

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
      <TableRow
        hover
        sx={{
          bgcolor:
            status === "absent"
              ? "error.50"
              : status === "leave"
                ? "info.50"
                : status === "present"
                  ? "success.50"
                  : "inherit",
          "& td": { 
            borderBottom: "1px solid", 
            borderColor: "divider",
            p: { xs: 1, sm: 1.5, md: 2 } 
          },
        }}
      >
        <TableCell sx={{ pl: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                variant="rounded"
                src={displayImage}
                sx={{
                  width: { xs: 44, sm: 60 },
                  height: { xs: 44, sm: 60 },
                  borderRadius: 1,
                  boxShadow: 1,
                  bgcolor: status ? `${statusColor}.light` : "primary.light",
                }}
              >
                {student.firstName ? student.firstName[0] : ""}
                {student.lastName?.[0] || ""}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                {student.firstName} {student.lastName}
                {student.isActive === false && (
                  <Box component="span" sx={{ color: "text.secondary", fontWeight: "normal", fontSize: "0.85em", ml: 1 }}>
                    (Profile Removed)
                  </Box>
                )}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, flexWrap: "wrap" }}>
                {student.boarderType && (
                  <Chip
                    label={
                      student.boarderType === "Day Scholar"
                        ? "DS"
                        : student.boarderType === "Day Boarder"
                          ? "DB"
                          : student.boarderType === "Full Boarder"
                            ? "B"
                            : student.boarderType
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 16,
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      borderColor: "divider",
                      color: "text.primary",
                      bgcolor: "action.hover",
                      px: 0.25,
                    }}
                  />
                )}
                {approvedLeave && (
                  <Chip
                    label="On Leave"
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ height: 16, fontSize: "0.55rem", fontWeight: "bold" }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </TableCell>

        <TableCell align="center" sx={{ p: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <ToggleButtonGroup
              value={status || null}
              exclusive
              disabled={disabled}
              onChange={handleStatusChange}
              size="medium"
              sx={{
                "& .MuiToggleButton-root": {
                  p: 0,
                  width: { xs: 55, sm: 55 },
                  height: { xs: 55, sm: 55 },
                  minWidth: { xs: 55, sm: 55 },
                  borderRadius: "10px !important",
                  border: "1px solid !important",
                  borderColor: "divider !important",
                  marginLeft: "2px !important",
                  mx: 0.25,
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
                <CheckCircle sx={{ width: 40, height: 40, fontSize: 40 }} />
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
              >
                {status === "leave" ? (
                  <Star sx={{ width: 45, height: 45, fontSize: 45 }} />
                ) : (
                  <Cancel sx={{ width: 45, height: 45, fontSize: 45 }} />
                )}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </TableCell>
      </TableRow>

      {/* Student History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Attendance History
          <IconButton onClick={() => setHistoryOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 3 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={displayImage}
              sx={{ width: 48, height: 48, borderRadius: 2 }}
            >
              {student.firstName ? student.firstName[0] : ""}{student.lastName?.[0] || ""}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {student.firstName} {student.lastName}
                {student.isActive === false && (
                  <Box component="span" sx={{ color: "text.secondary", fontWeight: "normal", fontSize: "0.85em", ml: 1 }}>
                    (Profile Removed)
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 report cycles
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />

          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : studentHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No history records found.
            </Typography>
          ) : (
            <MuiList sx={{ maxHeight: 300, overflow: 'auto' }}>
              {studentHistory.map((record) => (
                <MuiListItem 
                  key={record.date} 
                  divider
                  sx={{ px: 1 }}
                >
                  <MuiListItemText 
                    primary={format(parseISO(record.date), "EEEE, MMM dd, yyyy")}
                    slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 600 } } }}
                  />
                  <Chip 
                    label={record.present > 0 ? "Present" : record.absent > 0 ? "Absent" : record.leave > 0 ? "Leave" : "N/A"}
                    size="small"
                    color={record.present > 0 ? "success" : record.absent > 0 ? "error" : record.leave > 0 ? "info" : "default"}
                    sx={{ fontWeight: 'bold', minWidth: 70 }}
                  />
                </MuiListItem>
              ))}
            </MuiList>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export const AttendanceRow = React.memo(
  AttendanceRowComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.status === nextProps.status &&
      prevProps.index === nextProps.index &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.onMarkStatus === nextProps.onMarkStatus &&
      prevProps.student.id === nextProps.student.id &&
      prevProps.student.firstName === nextProps.student.firstName &&
      prevProps.student.lastName === nextProps.student.lastName &&
      prevProps.student.image === nextProps.student.image &&
      prevProps.dateString === nextProps.dateString &&
      prevProps.leavesList?.length === nextProps.leavesList?.length
    );
  },
);
