# Student Leaves Request and Trigger Engine
## Form Validation, Approval Pipelines, and Automated PostgreSQL Overrides

In many school systems, parents or teachers submit student leave requests in advance. If a student is granted leave for a date range, teachers shouldn't need to manually change their attendance status to "Leave" every day.

The database should automatically write the `"leave"` status to the attendance register for those dates as soon as the request is approved.

In this tutorial, you will build the Leave Request Dialog Form, set up approval state managers, and write a PostgreSQL trigger in Supabase to handle automated daily overrides.

---

## 1. The Leaves Form Dialog Modal

When submitting a leave request, you must validate that:
- The **Start Date** is today or in the future.
- The **End Date** is after or equal to the **Start Date**.
- A reason is provided (at least 10 characters).

```tsx
"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { Student } from "@/types";

interface LeaveRequestDialogProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  onSubmit: (payload: {
    studentId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<void>;
}

export default function LeaveRequestDialog({
  open,
  onClose,
  students,
  onSubmit,
}: LeaveRequestDialogProps) {
  const [studentId, setStudentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!studentId || !startDate || !endDate || !reason) {
      setError("Please complete all fields.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("The end date cannot be earlier than the start date.");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Please provide a reason with at least 10 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ studentId, startDate, endDate, reason });
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: "Space Grotesk", fontWeight: 600 }}>
        Apply for Leave
      </DialogTitle>
      <form onSubmit={handleFormSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            select
            label="Select Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            fullWidth
            required
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.firstName} {student.lastName} (Roll: {student.rollNumber})
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              required
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              required
            />
          </Box>

          <TextField
            label="Reason for Leave"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Submit Request
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
```

---

## 2. Automated Leave-to-Attendance Sync Trigger

To avoid manual updates by teachers, we write a PostgreSQL trigger inside our Supabase database.

**Business Requirement:**
- Whenever a record in `leave_requests` has its status changed to `'approved'`, we generate days representing the leave window `(start_date to end_date)` and upsert them as `'leave'` status inside the `attendance_records` table.
- If the leave request is modified or cancelled later, we clean up the records accordingly.

Execute this PL/pgSQL function in your Supabase SQL Editor:

```sql
create or replace function sync_approved_leave_to_attendance()
returns trigger as $$
declare
  current_day date;
begin
  -- Trigger executes when a leave request is updated to 'approved'
  if (NEW.status = 'approved'::leave_status_enum) then
    current_day := NEW.start_date;
    
    -- Loop through all dates in the leave window
    while current_day <= NEW.end_date loop
      
      -- Atomic upsert: Update to 'leave' or insert new row
      insert into attendance_records (student_id, date, status, updated_at)
      values (NEW.student_id, current_day, 'leave'::attendance_status_enum, now())
      on conflict (student_id, date)
      do update set 
        status = 'leave'::attendance_status_enum,
        updated_at = now();
        
      current_day := current_day + 1;
    end loop;
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Bind the trigger to update operations on our table
create trigger on_leave_request_approved
  after update on leave_requests
  for each row
  when (OLD.status IS DISTINCT FROM NEW.status)
  execute function sync_approved_leave_to_attendance();
```

---

## 3. Designing the Teacher Approvals Pipeline Interface

For academic heads, we construct an intuitive review card that displays the pending leave requests along with action triggers.

```tsx
"use client";

import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LeaveRequest, Student } from "@/types";

interface LeaveApprovalCardProps {
  request: LeaveRequest;
  student: Student;
  onResolve: (requestId: string, action: "approved" | "rejected") => Promise<void>;
}

export default function LeaveApprovalCard({
  request,
  student,
  onResolve,
}: LeaveApprovalCardProps) {
  return (
    <Card sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Box>
          <h4 className="font-sans font-medium text-slate-900 text-base">
            {student.firstName} {student.lastName}
          </h4>
          <span className="font-sans text-xs text-slate-500">
            Applied by {request.appliedBy}
          </span>
        </Box>
        <Chip label={request.status.toUpperCase()} size="small" color="warning" />
      </Box>

      {/* Date Window Display */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "text.secondary" }}>
        <CalendarTodayIcon sx={{ fontSize: 16 }} />
        <span className="font-sans text-sm font-medium">
          {request.startDate} to {request.endDate}
        </span>
      </Box>

      {/* Reason Description */}
      <p className="font-sans text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-2">
        {request.reason}
      </p>

      {/* Approval CTA Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<CloseIcon />}
          onClick={() => onResolve(request.id, "rejected")}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<CheckIcon />}
          onClick={() => onResolve(request.id, "approved")}
        >
          Approve Leave
        </Button>
      </Box>
    </Card>
  );
}
```

---

## 4. Architectural Tips for the Learner

1. **Leverage Database Triggers:** Notice how we write the leave sync logic using a PostgreSQL trigger. This is a common design pattern for data consistency. It guarantees that regardless of how a leave is approved (whether through the web dashboard, a mobile client, or raw database mutations), the attendance tables remain perfectly in sync.
2. **Implement Input Date Constraints:** Setting `slotProps={{ inputLabel: { shrink: true } }}` on the MUI `TextField` ensures that native browser calendar selectors behave correctly and render clean input labels.
3. **Optimistic UI Updates:** When a coordinator approves a leave request, update the local React state immediately (optimistic UI) before waiting for the database response. This keeps the application feeling fast and responsive.
