import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChevronLeft, CloudUpload, Search } from "@mui/icons-material";
import { Student, AttendanceStatus, LeaveRequest } from "../types";
import { AttendanceRow } from "./AttendanceRow";

interface AttendanceStudentListProps {
  students: Student[];
  attendance: Record<string, any>;
  selectedClassId: string;
  onBack: () => void;
  onMarkAll: (status: AttendanceStatus, classStudents: Student[]) => void;
  onMarkAttendance: (
    studentId: string,
    status: any | null,
  ) => void;
  onSync: () => Promise<void>;
  readOnly?: boolean;
  leavesList?: LeaveRequest[];
  dateString?: string;
}

export const AttendanceStudentList: React.FC<AttendanceStudentListProps> = ({
  students,
  attendance,
  selectedClassId,
  onBack,
  onMarkAll,
  onMarkAttendance,
  onSync,
  readOnly = false,
  leavesList = [],
  dateString = "",
}) => {
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const classStudents = useMemo(() => 
    students.filter((s) => s.classId === selectedClassId && s.isActive !== false),
    [students, selectedClassId]
  );

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return classStudents;
    const query = searchQuery.toLowerCase();
    return classStudents.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(query))
    );
  }, [classStudents, searchQuery]);

  const [displayCount, setDisplayCount] = useState(12);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedClassId, students.length]);

  const setLoadMoreRef = React.useCallback((node: HTMLTableRowElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setDisplayCount((prev) => prev + 12);
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSync = async () => {
    if (readOnly) return;
    setSyncing(true);
    await onSync();
    setSyncing(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexGrow: 1 }}>
          <Button
            startIcon={<ChevronLeft />}
            onClick={onBack}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: "none", height: 32, fontSize: '0.75rem' }}
          >
            Back
          </Button>
          {!readOnly && (
            <Button
              startIcon={
                syncing ? (
                  <CircularProgress size={12} color="inherit" />
                ) : (
                  <CloudUpload sx={{ fontSize: 16 }} />
                )
              }
              onClick={handleSync}
              variant="contained"
              color="primary"
              size="small"
              disabled={syncing}
              sx={{ borderRadius: 2, textTransform: "none", height: 32, fontSize: '0.75rem' }}
            >
              {syncing ? "Sync..." : "Sync"}
            </Button>
          )}
          <TextField
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: { xs: '100%', sm: 140 },
              "& .MuiOutlinedInput-root": { borderRadius: 2, height: 32, bgcolor: 'background.paper', fontSize: '0.75rem' }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Box>

        {!readOnly && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", alignItems: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold", whiteSpace: 'nowrap', fontSize: '0.6rem' }}
            >
              Bulk:
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => onMarkAll("present", classStudents)}
              sx={{
                borderRadius: 2,
                fontSize: "0.65rem",
                textTransform: "none",
                py: 0.25,
                px: 1,
                minWidth: 0
              }}
            >
              Present
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onMarkAll("absent", classStudents)}
              sx={{
                borderRadius: 2,
                fontSize: "0.65rem",
                textTransform: "none",
                py: 0.25,
                px: 1,
                minWidth: 0
              }}
            >
              Absent
            </Button>
          </Box>
        )}
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: { xs: 150, sm: 220 } }}>
                Attendance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchQuery ? "No matches found." : "No students found in this class."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredStudents.slice(0, displayCount).map((student, idx) => (
                  <AttendanceRow
                    key={student.id}
                    student={student}
                    status={attendance[student.id]}
                    onMarkStatus={onMarkAttendance}
                    index={idx}
                    disabled={readOnly}
                    leavesList={leavesList}
                    dateString={dateString}
                  />
                ))}
                {displayCount < filteredStudents.length && (
                  <TableRow ref={setLoadMoreRef}>
                    <TableCell colSpan={2} align="center" sx={{ p: 2 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
