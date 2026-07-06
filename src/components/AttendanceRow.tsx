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
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Cancel,
  Star,
  AccessTime,
  History as HistoryIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { Student, AttendanceStatus, LeaveRequest } from "../types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { attendanceApi } from "../api";

interface AttendanceRowProps {
  student: Student;
  status: any | undefined;
  onMarkStatus: (studentId: string, status: any | null) => void;
  index: number;
  isLast: boolean;
  disabled?: boolean;
  leavesList?: LeaveRequest[];
  dateString?: string;
}

const AttendanceRowComponent: React.FC<AttendanceRowProps> = ({
  student,
  status: rawStatus,
  onMarkStatus,
  index,
  isLast,
  disabled = false,
  leavesList = [],
  dateString = "",
}) => {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [studentHistory, setStudentHistory] = React.useState<any[]>([]);
  const [showNotes, setShowNotes] = React.useState(false);

  const rawStatusValue = typeof rawStatus === 'object' && rawStatus !== null ? (rawStatus.status as string) : (rawStatus as string);
  const status = (rawStatusValue === 'late' ? 'present' : rawStatusValue) as AttendanceStatus;
  const notes = typeof rawStatus === 'object' && rawStatus !== null ? (rawStatus.notes as string) : "";

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
    if (newStatus === 'absent') {
      setShowNotes(true);
    } else {
      setShowNotes(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMarkStatus(student.id, { status, notes: e.target.value });
  };

  return (
    <React.Fragment>
      <ListItem
        sx={{
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 3 },
          flexDirection: "column",
          alignItems: "stretch",
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
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: { xs: 1, sm: 2 } }}>
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
              <Box sx={{ position: 'relative' }}>
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
                <IconButton
                  size="small"
                  onClick={fetchStudentHistory}
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
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
            value={status === "leave" ? "leave" : status}
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
                marginLeft: "0 !important",
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
        </Box>

        {/* Reason for Absence Notes Field */}
        {(status === 'absent' || showNotes || notes) && (
          <Box sx={{ mt: 1.5, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              size="small"
              placeholder="Reason for absence..."
              fullWidth
              value={notes || ""}
              onChange={handleNotesChange}
              disabled={disabled}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EditIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                    '& .MuiInputBase-input': { py: 0.75, fontSize: '0.85rem' }
                  }
                }
              }}
              sx={{ maxWidth: { xs: '100%', sm: 300 } }}
            />
          </Box>
        )}
      </ListItem>

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
              src={student.image}
              sx={{ width: 48, height: 48, borderRadius: 2 }}
            >
              {student.firstName[0]}{student.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {student.firstName} {student.lastName}
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
