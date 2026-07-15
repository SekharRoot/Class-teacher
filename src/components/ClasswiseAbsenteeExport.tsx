import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  ContentCopy,
  ExpandMore,
  FileDownload,
  FilterList,
  CheckCircleOutlined,
  PersonOff,
  Search,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { ClassItem, Student } from "../types";

interface ClasswiseAbsenteeExportProps {
  classes: ClassItem[];
  students: Student[];
  attendance: Record<string, any>;
  dateString: string;
  onDateChange: (date: Date) => void;
  loading?: boolean;
}

export const ClasswiseAbsenteeExport: React.FC<ClasswiseAbsenteeExportProps> = ({
  classes,
  students,
  attendance,
  dateString,
  onDateChange,
  loading,
}) => {
  const [classSearch, setClassSearch] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);

  // Group active students by class
  const classToStudents = useMemo(() => {
    const mapping: Record<string, Student[]> = {};
    students.forEach((student) => {
      if (student.isActive !== false && student.classId) {
        if (!mapping[student.classId]) {
          mapping[student.classId] = [];
        }
        mapping[student.classId].push(student);
      }
    });
    return mapping;
  }, [students]);

  // Compute absentees class-wise
  const classWiseAbsentees = useMemo(() => {
    return classes.map((cls) => {
      const classStudents = classToStudents[cls.id] || [];
      const absenteesList = classStudents.filter((student) => {
        const att = attendance[student.id];
        const status = typeof att === "object" && att !== null ? att.status : att;
        return status === "absent";
      }).sort((a, b) => {
        // Sort by first name, then roll number if available
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      return {
        classId: cls.id,
        className: `${cls.classStandard} ${cls.section} (${cls.board})`,
        absentees: absenteesList,
      };
    }).sort((a, b) => a.className.localeCompare(b.className));
  }, [classes, classToStudents, attendance]);

  const totalAbsenteesCount = useMemo(() => {
    return classWiseAbsentees.reduce((sum, item) => sum + item.absentees.length, 0);
  }, [classWiseAbsentees]);

  const filteredClassWiseAbsentees = useMemo(() => {
    if (!classSearch.trim()) return classWiseAbsentees;
    const query = classSearch.toLowerCase();
    return classWiseAbsentees.filter((item) =>
      item.className.toLowerCase().includes(query)
    );
  }, [classWiseAbsentees, classSearch]);

  const generateReportText = () => {
    const formattedDate = format(new Date(dateString + "T12:00:00"), "dd/MM/yyyy");
    let text = `====================================\n`;
    text += `ABSENTEES REPORT FOR: ${formattedDate}\n`;
    text += `Total Absentees Across School: ${totalAbsenteesCount}\n`;
    text += `====================================\n\n`;

    let hasAnyAbsentees = false;

    classWiseAbsentees.forEach((item) => {
      if (item.absentees.length > 0) {
        hasAnyAbsentees = true;
        text += `• ${item.className} (Total: ${item.absentees.length} Absent):\n`;
        item.absentees.forEach((student, index) => {
          const rollInfo = student.rollNumber ? ` [Roll: ${student.rollNumber}]` : "";
          text += `  ${index + 1}. ${student.firstName} ${student.lastName}${rollInfo}\n`;
        });
        text += `\n`;
      }
    });

    if (!hasAnyAbsentees) {
      text += `All Present! No absentees recorded for this date.\n`;
    }

    return text;
  };

  const handleCopyAll = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Absentees_Report_${dateString}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClassAbsentees = (className: string, absentees: Student[], classId: string) => {
    if (absentees.length === 0) {
      navigator.clipboard.writeText(`${className}: No absentees`);
      setCopiedClassId(classId);
      setTimeout(() => setCopiedClassId(null), 2000);
      return;
    }

    const formattedDate = format(new Date(dateString + "T12:00:00"), "dd/MM/yyyy");
    let text = `${className} - Absentees (${formattedDate}):\n`;
    absentees.forEach((student, index) => {
      const rollInfo = student.rollNumber ? ` [Roll: ${student.rollNumber}]` : "";
      text += `${index + 1}. ${student.firstName} ${student.lastName}${rollInfo}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedClassId(classId);
    setTimeout(() => setCopiedClassId(null), 2000);
  };

  const formattedSelectedDate = format(new Date(dateString + "T12:00:00"), "dd MMMM yyyy");

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        mb: 4,
      }}
    >
      {/* Header and Action Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "primary.main",
            }}
          >
            <PersonOff sx={{ fontSize: 28 }} /> Class-wise Absentees
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and export consolidated absentee lists for{" "}
            <strong>{formattedSelectedDate}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color={copiedAll ? "success" : "primary"}
            startIcon={<ContentCopy />}
            onClick={handleCopyAll}
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold" }}
          >
            {copiedAll ? "Copied Report!" : "Copy Report"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownload />}
            onClick={handleDownloadReport}
            disabled={loading || totalAbsenteesCount === 0}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: "bold" }}
          >
            Download TXT
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Date and Search Filters */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="date"
            label="Selected Date"
            value={dateString}
            onChange={(e) => {
              if (e.target.value) {
                onDateChange(parseISO(e.target.value));
              }
            }}
            fullWidth
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontWeight: "medium",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            placeholder="Filter classes (e.g. Grade 1, CBSE...)"
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Overall Stat Summary Banner */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2.5,
          bgcolor: "action.hover",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
          Total Absentees on this date:{" "}
          <Box component="span" sx={{ fontWeight: "bold", color: "error.main", fontSize: "1.1rem" }}>
            {totalAbsenteesCount}
          </Box>
        </Typography>

        {totalAbsenteesCount === 0 && !loading && (
          <Chip
            icon={<CheckCircleOutlined />}
            label="Perfect Attendance Recorded!"
            color="success"
            variant="filled"
            sx={{ fontWeight: "bold" }}
          />
        )}
      </Box>

      {/* Class List Accordions */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredClassWiseAbsentees.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
            No classes found matching search criteria.
          </Typography>
        ) : (
          filteredClassWiseAbsentees.map((item) => {
            const hasAbsentees = item.absentees.length > 0;
            return (
              <Accordion
                key={item.classId}
                disableGutters
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px !important",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.light",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    px: 2,
                    minHeight: 52,
                    bgcolor: hasAbsentees ? "rgba(211, 47, 47, 0.02)" : "rgba(46, 125, 50, 0.01)",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontWeight: "bold" }} color="text.primary">
                      {item.className}
                    </Typography>
                    <Chip
                      size="small"
                      label={hasAbsentees ? `${item.absentees.length} Absent` : "All Present"}
                      color={hasAbsentees ? "error" : "success"}
                      variant={hasAbsentees ? "filled" : "outlined"}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  {/* Actions inside accordion header (must stopPropagation to prevent accordion toggle) */}
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}
                  >
                    <Tooltip title={`Copy Absentees for ${item.className}`}>
                      <Button
                        size="small"
                        variant="text"
                        color={copiedClassId === item.classId ? "success" : "primary"}
                        onClick={() => handleCopyClassAbsentees(item.className, item.absentees, item.classId)}
                        startIcon={<ContentCopy sx={{ fontSize: 14 }} />}
                        sx={{
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          borderRadius: 2,
                        }}
                      >
                        {copiedClassId === item.classId ? "Copied Class!" : "Copy"}
                      </Button>
                    </Tooltip>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, py: 2, bgcolor: "background.paper" }}>
                  {!hasAbsentees ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
                      <CheckCircleOutlined color="success" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Every student is accounted for and present in class today!
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: "bold" }}>
                        Names of Absent Students ({item.absentees.length}):
                      </Typography>
                      <Grid container spacing={1.5}>
                        {item.absentees.map((student, index) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={student.id}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                bgcolor: "rgba(211, 47, 47, 0.01)",
                                borderLeft: "4px solid",
                                borderLeftColor: "error.main",
                              }}
                            >
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                  {index + 1}. {student.firstName} {student.lastName}
                                </Typography>
                                {student.rollNumber && (
                                  <Typography variant="caption" color="text.secondary">
                                    Roll No: {student.rollNumber}
                                  </Typography>
                                )}
                              </Box>
                              {student.boarderType && (
                                <Chip
                                  size="small"
                                  label={student.boarderType}
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.65rem",
                                    height: 18,
                                    borderColor: "divider",
                                    color: "text.secondary",
                                  }}
                                />
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Box>
    </Paper>
  );
};
