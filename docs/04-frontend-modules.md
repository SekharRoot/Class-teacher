# Chapter 4: Building Responsive Material UI Interfaces

In this chapter, you will learn how to design the visual layer of the Classroom Manager using **Material UI (MUI)**. 

Material UI is a comprehensive component library designed around Google's Material Design system. It is perfect for developers because it provides high-quality, pre-styled, accessible buttons, text fields, cards, tables, and dialogs out of the box.

---

## 🎨 Theme Configuration

We establish a clean, professional, and readable theme. Add this configuration to your root layout (`app/layout.tsx` or `src/theme.ts`):

```typescript
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Trustworthy Academic Blue
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#4caf50", // Positive Attendance Green
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f", // Absent Red
    },
    warning: {
      main: "#ed6c02", // Leave Amber
    },
    background: {
      default: "#f4f6f8", // Warm Soft Gray background
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.2rem", fontWeight: 700 },
    h2: { fontSize: "1.8rem", fontWeight: 600 },
    subtitle1: { fontSize: "1rem", fontWeight: 500 },
    body1: { fontSize: "0.95rem" },
    button: { textTransform: "none", fontWeight: 500 }, // No forced uppercase
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", // Soft shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
        },
      },
    },
  },
});
```

---

## 📊 1. The Dashboard View

The dashboard displays high-level stats widgets. We lay them out in a responsive **Grid** container.

```tsx
import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { People, Class, EventAvailable, CloudOff } from "@mui/icons-material";

interface StatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatProps> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: `${color}15`, p: 1.5, borderRadius: 3, color }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardGrid = ({ offline }: { offline: boolean }) => {
  return (
    <Box sx={{ p: 3 }}>
      {offline && (
        <Card sx={{ mb: 3, bgcolor: "#ffe0b2", border: "1px solid #ffe0b2" }}>
          <CardContent sx={{ py: "12px !important", display: "flex", alignItems: "center", gap: 1 }}>
            <CloudOff color="warning" />
            <Typography variant="body2" color="warning.dark">
              Running Offline. Profiles and attendance edits will cache locally.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={145} icon={<People />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Classes" value={8} icon={<Class />} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Attendance Today" value="94.2%" icon={<EventAvailable />} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Leave Requests" value={4} icon={<People />} color="#ff9800" />
        </Grid>
      </Grid>
    </Box>
  );
};
```

---

## 📅 2. The Attendance Roster Grid

The core activity is taking daily attendance. It must be blazing fast. We build a clean table with instant, single-click toggle actions for **Present**, **Absent**, and **Leave** states.

```tsx
import React from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Avatar, ButtonGroup, Button, Typography, Chip 
} from "@mui/material";
import { CheckCircle, Cancel, FlightTakeoff } from "@mui/icons-material";
import { Student, AttendanceStatus } from "../types";

interface Props {
  students: Student[];
  attendanceState: Record<string, AttendanceStatus>; // studentId -> status
  onStatusChange: (studentId: string, newStatus: AttendanceStatus) => void;
}

export const AttendanceTable: React.FC<Props> = ({ students, attendanceState, onStatusChange }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Table aria-label="attendance roster table">
        <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Roll No.</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Boarder Type</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Mark Attendance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => {
            const currentStatus = attendanceState[student.id] || "present";
            return (
              <TableRow key={student.id} hover>
                <TableCell>{student.rollNumber || "-"}</TableCell>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={student.image} alt={student.firstName}>
                    {student.firstName[0]}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {`${student.firstName} ${student.lastName}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={student.boarderType || "Day Scholar"} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="contained" aria-label="outlined button group">
                    <Button
                      color={currentStatus === "present" ? "secondary" : "inherit"}
                      sx={{ opacity: currentStatus === "present" ? 1 : 0.6 }}
                      onClick={() => onStatusChange(student.id, "present")}
                      startIcon={<CheckCircle />}
                    >
                      Present
                    </Button>
                    <Button
                      color={currentStatus === "absent" ? "error" : "inherit"}
                      sx={{ opacity: currentStatus === "absent" ? 1 : 0.6 }}
                      onClick={() => onStatusChange(student.id, "absent")}
                      startIcon={<Cancel />}
                    >
                      Absent
                    </Button>
                    <Button
                      color={currentStatus === "leave" ? "warning" : "inherit"}
                      sx={{ opacity: currentStatus === "leave" ? 1 : 0.6 }}
                      onClick={() => onStatusChange(student.id, "leave")}
                      startIcon={<FlightTakeoff />}
                    >
                      Leave
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

---

## 👤 3. Student Profile Manager (Creation Dialog Form)

The profile form handles input validation, select fields, and submits clean JSON structures. We wrap it inside a responsive **Dialog** container.

```tsx
import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, Grid, MenuItem, Box 
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  classes: Array<{ id: string; name: string }>;
}

export const StudentFormDialog: React.FC<Props> = ({ open, onClose, onSave, classes }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [boarderType, setBoarderType] = useState("Day Scholar");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !classId) return;

    onSave({
      studentName: `${firstName} ${lastName}`.trim(),
      rollNumber,
      classId,
      boarderType,
      imageUrl: "",
    });
    
    // Reset fields
    setFirstName("");
    setLastName("");
    setRollNumber("");
    setClassId("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>Create Student Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                variant="outlined"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Assigned Class"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Boarding Type"
                value={boarderType}
                onChange={(e) => setBoarderType(e.target.value)}
              >
                <MenuItem value="Day Scholar">Day Scholar</MenuItem>
                <MenuItem value="Day Boarder">Day Boarder</MenuItem>
                <MenuItem value="Full Boarder">Full Boarder</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Create Student</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

---

## 📬 4. The Leave Requests Manager

Leave requests are tracked inside a timeline card list. Administrators can approve or reject leaves directly, triggering automatic attendance record updates in the database.

```tsx
import React from "react";
import { Card, CardContent, Typography, Box, Button, Chip } from "@mui/material";
import { Check, Close, Event } from "@mui/icons-material";

interface LeaveRequest {
  id: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface LeaveCardProps {
  request: LeaveRequest;
  onResolve: (id: string, action: "approve" | "reject") => void;
}

export const LeaveRequestCard: React.FC<LeaveCardProps> = ({ request, onResolve }) => {
  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "error";
      default: return "warning";
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {request.studentName}
          </Typography>
          <Chip label={request.status} size="small" color={getStatusChipColor(request.status)} />
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mb: 2 }}>
          <Event fontSize="small" />
          <Typography variant="body2">
            {`${request.startDate} to ${request.endDate}`}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <strong>Reason:</strong> {request.reason}
        </Typography>

        {request.status === "pending" && (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Close />}
              onClick={() => onResolve(request.id, "reject")}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Check />}
              onClick={() => onResolve(request.id, "approve")}
            >
              Approve
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
```

---

Excellent! Your visual components are professional and responsive. Head over to **[Chapter 5: Next.js App Router Integration](./05-full-stack-integration.md)** to tie everything together and deploy your creation.
