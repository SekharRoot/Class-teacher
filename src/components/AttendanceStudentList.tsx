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
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChevronLeft, CloudUpload, Search, ContentCopy, ArrowDropDown } from "@mui/icons-material";
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
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<"absent" | "present" | null>(null);

  const classStudents = useMemo(() => {
    // 1. Get all currently active students in this class
    const activeStudents = students.filter(
      (s) => s.classId === selectedClassId && s.isActive !== false
    );
    const activeStudentIds = new Set(activeStudents.map((s) => s.id));

    // 2. Also look at students who have attendance records on this date for this class
    const loggedStudents: Student[] = [];
    Object.entries(attendance).forEach(([studentId, val]) => {
      if (activeStudentIds.has(studentId)) return; // Already in active list

      // Determine if this attendance record belongs to the selected class
      const isObj = typeof val === "object" && val !== null;
      const recordClassId = isObj ? (val as any).classId : null;

      if (
        recordClassId === selectedClassId ||
        (!recordClassId &&
          students.find((s) => s.id === studentId)?.classId === selectedClassId)
      ) {
        // Find the student in the master students list (even if they are inactive/deleted!)
        const foundStudent = students.find((s) => s.id === studentId);
        if (foundStudent) {
          loggedStudents.push(foundStudent);
        } else {
          // Synthesize a student object so they still show up in history
          loggedStudents.push({
            id: studentId,
            firstName: "Profile",
            lastName: "Removed",
            rollNumber: "-",
            classId: selectedClassId,
            gender: "Male",
            boarderType: isObj
              ? (val as any).boarderType || "Day Scholar"
              : "Day Scholar",
            isActive: false,
            schoolId: "",
          } as Student);
        }
      }
    });

    return [...activeStudents, ...loggedStudents];
  }, [students, selectedClassId, attendance]);

  const absentees = useMemo(() => {
    return classStudents.filter((student) => {
      const att = attendance[student.id];
      const status = typeof att === 'object' && att !== null ? att.status : att;
      return status === "absent";
    });
  }, [classStudents, attendance]);

  const presents = useMemo(() => {
    return classStudents.filter((student) => {
      const att = attendance[student.id];
      const status = typeof att === 'object' && att !== null ? att.status : att;
      return status === "present";
    });
  }, [classStudents, attendance]);

  const handleCopyAbsentees = () => {
    if (absentees.length === 0) {
      navigator.clipboard.writeText("No absentees");
      setCopied(true);
      setCopiedType("absent");
      setTimeout(() => {
        setCopied(false);
        setCopiedType(null);
      }, 2000);
      return;
    }
    
    const text = absentees
      .map((student, index) => `${index + 1}. ${student.firstName} ${student.lastName}`)
      .join("\n");
      
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType("absent");
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyPresents = () => {
    if (presents.length === 0) {
      navigator.clipboard.writeText("No presents");
      setCopied(true);
      setCopiedType("present");
      setTimeout(() => {
        setCopied(false);
        setCopiedType(null);
      }, 2000);
      return;
    }
    
    const text = presents
      .map((student, index) => `${index + 1}. ${student.firstName} ${student.lastName}`)
      .join("\n");
      
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType("present");
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopySelect = (event: SelectChangeEvent<"absent" | "present" | "">) => {
    const value = event.target.value as "absent" | "present";
    if (value === "absent") {
      handleCopyAbsentees();
    } else if (value === "present") {
      handleCopyPresents();
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return classStudents;
    const query = searchQuery.toLowerCase();
    return classStudents.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(query))
    );
  }, [classStudents, searchQuery]);

  const maxNameLength = useMemo(() => {
    if (filteredStudents.length === 0) return 0;
    return Math.max(...filteredStudents.map((s) => `${s.firstName} ${s.lastName}`.length));
  }, [filteredStudents]);

  const [displayCount, setDisplayCount] = useState(12);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedClassId, students.length]);

  const setLoadMoreRef = React.useCallback((node: HTMLElement | null) => {
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
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" }, alignItems: "center" }}>
          <Button
            startIcon={<ChevronLeft />}
            onClick={onBack}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: "none", height: 32, fontSize: '0.75rem', flexGrow: { xs: 1, sm: 0 } }}
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
              sx={{ borderRadius: 2, textTransform: "none", height: 32, fontSize: '0.75rem', flexGrow: { xs: 1, sm: 0 } }}
            >
              {syncing ? "Sync..." : "Sync"}
            </Button>
          )}
          <FormControl size="small" sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}>
            <Select
              value=""
              displayEmpty
              onChange={handleCopySelect}
              sx={{
                borderRadius: 2,
                height: 32,
                fontSize: '0.75rem',
                border: "1px solid",
                borderColor: copied ? "success.main" : "primary.main",
                color: copied ? "success.main" : "primary.main",
                fontWeight: "medium",
                '& .MuiSelect-select': {
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: copied ? "success.main" : "primary.main",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: "none"
                },
                '&:hover': {
                  borderColor: copied ? "success.dark" : "primary.dark",
                }
              }}
              renderValue={() => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ContentCopy sx={{ fontSize: 14 }} />
                  {copied
                    ? copiedType === "absent"
                      ? "Copied Abs!"
                      : "Copied Pres!"
                    : "Copy List"}
                </Box>
              )}
            >
              <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                <em>Select List to Copy</em>
              </MenuItem>
              <MenuItem value="absent" sx={{ fontSize: '0.75rem' }}>
                Copy Absentees ({absentees.length})
              </MenuItem>
              <MenuItem value="present" sx={{ fontSize: '0.75rem' }}>
                Copy Present Students ({presents.length})
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: { xs: '100%', sm: 140 },
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
          <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", alignItems: 'center', width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-start" }, borderTop: { xs: "1px dashed", sm: "none" }, borderColor: "divider", pt: { xs: 1.5, sm: 0 } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: "bold", whiteSpace: 'nowrap', fontSize: '0.75rem' }}
            >
              Bulk Actions:
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={() => onMarkAll("present", classStudents)}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  textTransform: "none",
                  py: 0.5,
                  px: 2,
                  minWidth: 80
                }}
              >
                Mark All Present
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onMarkAll("absent", classStudents)}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  textTransform: "none",
                  py: 0.5,
                  px: 2,
                  minWidth: 80
                }}
              >
                Mark All Absent
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Mobile Layout: Stack of cards (visible on xs, hidden on sm) */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mt: 2 }}>
        {filteredStudents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2.5 }}>
            <Typography color="text.secondary" sx={{ fontSize: "0.85rem" }}>
              {searchQuery ? "No matches found." : "No students found in this class."}
            </Typography>
          </Paper>
        ) : (
          <Box>
            {filteredStudents.slice(0, displayCount).map((student, idx) => (
              <AttendanceRow
                key={student.id}
                student={student}
                status={
                  typeof attendance[student.id] === 'object' && attendance[student.id] !== null 
                    ? attendance[student.id].status 
                    : attendance[student.id]
                }
                onMarkStatus={onMarkAttendance}
                index={idx}
                disabled={readOnly}
                leavesList={leavesList}
                dateString={dateString}
                maxNameLength={maxNameLength}
                isMobile={true}
              />
            ))}
            {displayCount < filteredStudents.length && (
              <Box ref={setLoadMoreRef} sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Desktop Layout: Table (hidden on xs, visible on sm) */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflowX: "auto" }}>
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
                      status={
                        typeof attendance[student.id] === 'object' && attendance[student.id] !== null 
                          ? attendance[student.id].status 
                          : attendance[student.id]
                      }
                      onMarkStatus={onMarkAttendance}
                      index={idx}
                      disabled={readOnly}
                      leavesList={leavesList}
                      dateString={dateString}
                      maxNameLength={maxNameLength}
                      isMobile={false}
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
    </Box>
  );
};
