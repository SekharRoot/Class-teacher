import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  CircularProgress,
  TextField,
  InputAdornment,
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
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedClassId, students.length]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + 12);
        }
      },
      { threshold: 1.0 },
    );
    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
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
            sx={{ borderRadius: 4, textTransform: "none", height: 40 }}
          >
            Back
          </Button>
          {!readOnly && (
            <Button
              startIcon={
                syncing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CloudUpload />
                )
              }
              onClick={handleSync}
              variant="contained"
              color="primary"
              size="small"
              disabled={syncing}
              sx={{ borderRadius: 4, textTransform: "none", height: 40 }}
            >
              {syncing ? "Syncing..." : "Sync"}
            </Button>
          )}
          <TextField
            placeholder="Search student..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: { xs: '100%', sm: 200 },
              "& .MuiOutlinedInput-root": { borderRadius: 4, height: 40, bgcolor: 'background.paper' }
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
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold", mr: 1 }}
            >
              BULK:
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => onMarkAll("present", classStudents)}
              sx={{
                borderRadius: 4,
                fontSize: "0.7rem",
                textTransform: "none",
                py: 0.5,
              }}
            >
              All Present
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onMarkAll("absent", classStudents)}
              sx={{
                borderRadius: 4,
                fontSize: "0.7rem",
                textTransform: "none",
                py: 0.5,
              }}
            >
              All Absent
            </Button>
          </Box>
        )}
      </Box>

      <Paper elevation={2} sx={{ overflow: "hidden", borderRadius: 2 }}>
        <List disablePadding>
          {filteredStudents.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                {searchQuery ? "No matches found." : "No students found in this class."}
              </Typography>
            </Box>
          ) : (
            <>
              {filteredStudents.slice(0, displayCount).map((student, idx, arr) => (
                <AttendanceRow
                  key={student.id}
                  student={student}
                  status={attendance[student.id]}
                  onMarkStatus={onMarkAttendance}
                  index={idx}
                  isLast={idx === arr.length - 1}
                  disabled={readOnly}
                  leavesList={leavesList}
                  dateString={dateString}
                />
              ))}
              {displayCount < filteredStudents.length && (
                <Box
                  ref={loadMoreRef}
                  sx={{ display: "flex", justifyContent: "center", p: 2 }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </>
          )}
        </List>
      </Paper>
    </Box>
  );
};
