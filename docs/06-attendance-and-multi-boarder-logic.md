# Attendance Ledger and Multi-Boarding Type Rules
## Interactive Status Grid, Boarding Types business rules, and PostgreSQL Constraints

The primary business requirement of this application is checking, logging, and reporting the daily attendance of students. 

What makes this system unique is that students are categorized into three distinct **Boarding Types**, each with its own attendance validation rules:
- **Day Scholar:** Standard students who travel to school and back home daily.
- **Day Boarder:** Students who attend school classes and stay on campus for extended afternoon activities.
- **Full Boarder:** Residential students living in the school dormitory 24/7.

In this tutorial, you will implement the Daily Attendance Register UI, program the different boarding type rules, and enforce data consistency using PostgreSQL.

---

## 1. Boarding Type Business Logic Matrix

Your backend reporting and aggregation filters must handle boarding types differently depending on the calendar day:

| Boarding Type | Mon - Fri (Working Days) | Saturday (Weekend) | Sunday (Weekend) |
| :--- | :--- | :--- | :--- |
| **Day Scholar** | Required check | Not Required | Not Required |
| **Day Boarder** | Required check | Not Required | Not Required |
| **Full Boarder** | Required check | Required check | Required check (Dormitory Check) |

### Impact on Calculation Metrics
- When generating attendance percentage trends, weekends are excluded from calculations for **Day Scholars** and **Day Boarders** so they aren't penalized.
- For **Full Boarders**, weekend checks are included in metrics because dormitory attendance is mandatory.

---

## 2. Interactive Attendance Ledger UI

We build the Attendance ledger as a list of student rows, with a segmented control containing three visual choices: **Present** (Green), **Absent** (Red), and **Leave** (Yellow).

Create `src/components/attendance/AttendanceList.tsx` using Material UI grid components:

```tsx
"use client";

import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Chip from "@mui/material/Chip";
import { Student, AttendanceStatus } from "@/types";

interface AttendanceListProps {
  students: Student[];
  currentAttendance: Record<string, AttendanceStatus>; // studentId -> status
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
}

export default function AttendanceList({
  students,
  currentAttendance,
  onStatusChange,
}: AttendanceListProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {students.map((student) => {
        const status = currentAttendance[student.id] || "";

        return (
          <Card
            key={student.id}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              borderRadius: 2,
              "&:hover": {
                borderColor: "primary.light",
              },
            }}
          >
            {/* Student Info Left Side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={student.image}
                sx={{ width: 44, height: 44, bgcolor: "secondary.light" }}
                referrerPolicy="no-referrer"
              >
                {student.firstName[0]}
                {student.lastName[0]}
              </Avatar>
              <Box>
                <h3 className="font-sans font-medium text-slate-900 text-base">
                  {student.firstName} {student.lastName}
                </h3>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                  <Chip
                    label={`Roll #${student.rollNumber}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.75rem" }}
                  />
                  <Chip
                    label={student.boarderType}
                    size="small"
                    color={
                      student.boarderType === "Full Boarder"
                        ? "primary"
                        : student.boarderType === "Day Boarder"
                        ? "secondary"
                        : "default"
                    }
                    sx={{ height: 20, fontSize: "0.75rem", fontWeight: 500 }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Attendance Toggle Selector Controls */}
            <ToggleButtonGroup
              value={status}
              exclusive
              onChange={(_, value) => {
                if (value) onStatusChange(student.id, value as AttendanceStatus);
              }}
              aria-label="Student attendance status"
              size="medium"
              sx={{
                alignSelf: { xs: "center", sm: "auto" },
                "& .MuiToggleButton-root": {
                  px: { xs: 3, sm: 4 },
                  py: 1,
                  borderRadius: "8px !important",
                  border: "1px solid",
                  borderColor: "divider",
                  fontWeight: 500,
                  "&.Mui-selected": {
                    boxShadow: "0 2px 4px rgb(0 0 0 / 0.05)",
                  },
                },
              }}
            >
              <ToggleButton
                value="present"
                sx={{
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#2e7d32 !important",
                    backgroundColor: "#e8f5e9 !important",
                    borderColor: "#a5d6a7 !important",
                  },
                }}
              >
                Present
              </ToggleButton>
              <ToggleButton
                value="absent"
                sx={{
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#d32f2f !important",
                    backgroundColor: "#ffebee !important",
                    borderColor: "#ef9a9a !important",
                  },
                }}
              >
                Absent
              </ToggleButton>
              <ToggleButton
                value="leave"
                sx={{
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "#ed6c02 !important",
                    backgroundColor: "#fff3e0 !important",
                    borderColor: "#ffe0b2 !important",
                  },
                }}
              >
                Leave
              </ToggleButton>
            </ToggleButtonGroup>
          </Card>
        );
      })}
    </Box>
  );
}
```

---

## 3. Saving Daily Attendance to Supabase with Conflict Resolution

On submission, we upsert our localized map array to PostgreSQL using Supabase’s multi-row payload support. 

Because we configured a composite unique constraint on `(student_id, date)` in Tutorial 02, any duplicate submittals automatically update existing rows instead of adding duplicate records.

```typescript
import { createClient } from "@supabase/supabase-js";
import { AttendanceStatus } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BatchAttendancePayload {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

/**
 * Saves a batch of student attendance records for a specific day.
 * Enforces atomic upserts to avoid data corruption.
 */
export async function saveDailyAttendance(
  records: BatchAttendancePayload[]
): Promise<void> {
  if (records.length === 0) return;

  // 1. Map frontend types to snake_case schema naming conventions
  const upsertRows = records.map((record) => ({
    student_id: record.studentId,
    date: record.date,
    status: record.status,
    updated_at: new Date().toISOString(),
  }));

  // 2. Perform upsert in a single network transaction
  const { error } = await supabase
    .from("attendance_records")
    .upsert(upsertRows, {
      onConflict: "student_id,date", // Relies on unique database constraint
    });

  if (error) {
    throw new Error(`Failed to save attendance ledger: ${error.message}`);
  }
}
```

---

## 4. Architectural Tips for the Learner

1. **Avoid Multiple Table Updates in Loops:** In the code above, we save the entire attendance list with a single `.upsert()` database call. Never run loops containing individual `.insert()` or `.update()` calls. Sending dozens of database requests sequentially causes massive visual latency on the client and unnecessary database load.
2. **Use Native Segmented Selectors:** The standard Material UI `ToggleButtonGroup` is the best choice for touch-friendly status selections. Using simple native checkboxes for a three-state option (Present, Absent, Leave) makes for a confusing user experience.
3. **Handle Weekend Validations:** On weekends (Saturdays & Sundays), your page can display a helper alert reminding teachers that "Attendance checks are optional today except for Full Boarder residential students." This matches the boarding type logic matrix.
