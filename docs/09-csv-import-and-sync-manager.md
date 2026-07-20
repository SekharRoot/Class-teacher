# CSV Importing and Offline Synchronization
## Client-Side CSV Parsing, Interactive Field Mapping, and Offline Transaction Managers

To onboard entire classes of students quickly, administrators need a robust **CSV Bulk Import wizard**. This wizard should let them upload any standard Excel or CSV file and visually map custom column headers to our system's database schema.

Additionally, to ensure the application remains functional in areas with poor internet connection, we need a reliable **Offline Synchronization pipeline** to queue mutations locally and sync them to Supabase once connection is restored.

In this final tutorial, you will implement a user-friendly CSV Import mapping component, design a localized mutation log using IndexedDB, and code a state synchronizer.

---

## 1. CSV Parsing & Column Mapping Interface

An advanced CSV importer allows users to map their own file columns to our database fields. This avoids forcing administrators to modify their spreadsheets to match a rigid system format.

Create an interactive CSV parsing wizard component:

```tsx
"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface CSVMappingProps {
  onImportComplete: (mappedStudents: any[]) => void;
}

export default function CSVImporter({ onImportComplete }: CSVMappingProps) {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({
    firstName: "",
    lastName: "",
    rollNumber: "",
    boarderType: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Handle local CSV reading and simple line splitting
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

      if (lines.length < 2) {
        setError("Your CSV file must contain a header row and at least one student data row.");
        return;
      }

      // Extract raw column headers
      const headers = lines[0].split(",").map((h) => h.replace(/['"]+/g, "").trim());
      const rows = lines.slice(1).map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim()));

      setCsvHeaders(headers);
      setCsvRows(rows);
    };

    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    // Validate that required fields are mapped
    if (!mappings.firstName || !mappings.rollNumber) {
      setError("You must map at least the 'First Name' and 'Roll Number' fields.");
      return;
    }

    // Convert CSV rows into student objects based on the user's mapping configuration
    const parsedStudents = csvRows.map((row) => {
      const student: Record<string, any> = {};
      
      Object.entries(mappings).forEach(([dbField, headerName]) => {
        if (headerName) {
          const columnIndex = csvHeaders.indexOf(headerName);
          if (columnIndex !== -1) {
            student[dbField] = row[columnIndex];
          }
        }
      });

      return {
        firstName: student.firstName || "Unknown",
        lastName: student.lastName || "",
        rollNumber: student.rollNumber || "0",
        boarderType: student.boarderType || "Day Scholar",
        isActive: true,
      };
    });

    onImportComplete(parsedStudents);
  };

  return (
    <Card sx={{ p: 3, border: "2px dashed", borderColor: "divider", bgcolor: "background.default" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {csvHeaders.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Upload your student spreadsheet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Supports .csv files only</Typography>
          <Button variant="contained" component="label">
            Select CSV File
            <input type="file" accept=".csv" onChange={handleFileChange} hidden />
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6">Map Column Headers to Database Fields</Typography>
          
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              select
              label="First Name Field"
              value={mappings.firstName}
              onChange={(e) => setMappings({ ...mappings, firstName: e.target.value })}
              fullWidth
            >
              {csvHeaders.map((header) => (
                <MenuItem key={header} value={header}>{header}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Roll Number Field"
              value={mappings.rollNumber}
              onChange={(e) => setMappings({ ...mappings, rollNumber: e.target.value })}
              fullWidth
            >
              {csvHeaders.map((header) => (
                <MenuItem key={header} value={header}>{header}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Button variant="contained" color="success" onClick={handleApplyImport} fullWidth sx={{ py: 1.5 }}>
            Apply and Import {csvRows.length} Students
          </Button>
        </Box>
      )}
    </Card>
  );
}
```

---

## 2. Designing the Offline Transaction Queue Manager

When offline, any profile additions, status changes, or deletions must be written to a localized transaction log instead of failing. We use IndexedDB to buffer these actions securely.

Create a synchronizer module named `src/utils/studentSyncManager.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import { Student } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface OfflineChange {
  id: string; // Unique queue task identifier
  type: "create" | "update" | "delete";
  studentId: string;
  studentData?: Partial<Student>;
  timestamp: string;
}

/**
 * Sync manager responsible for queueing mutations during network outages
 * and flushing them sequentially to Supabase on reconnection.
 */
class StudentSyncManager {
  private queueKey = "offline_student_mutations";

  // 1. Queue a mutation locally
  public async queueChange(change: Omit<OfflineChange, "id" | "timestamp">) {
    const queue = this.getQueue();
    const newChange: OfflineChange = {
      ...change,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    queue.push(newChange);
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  // 2. Read queued mutations
  private getQueue(): OfflineChange[] {
    const raw = localStorage.getItem(this.queueKey);
    return raw ? JSON.parse(raw) : [];
  }

  // 3. Clear queue
  private clearQueue() {
    localStorage.removeItem(this.queueKey);
  }

  // 4. Synchronize transactions to the server sequentially
  public async synchronizeQueue(): Promise<{ success: boolean; syncedCount: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { success: true, syncedCount: 0 };

    let syncedCount = 0;

    try {
      for (const change of queue) {
        if (change.type === "create") {
          const { error } = await supabase
            .from("students")
            .insert({
              id: change.studentId,
              ...change.studentData,
            });
          if (error) throw error;

        } else if (change.type === "update") {
          const { error } = await supabase
            .from("students")
            .update(change.studentData)
            .eq("id", change.studentId);
          if (error) throw error;

        } else if (change.type === "delete") {
          const { error } = await supabase
            .from("students")
            .delete()
            .eq("id", change.studentId);
          if (error) throw error;
        }

        syncedCount++;
      }

      // Success! Flush completed actions
      this.clearQueue();
      return { success: true, syncedCount };

    } catch (err) {
      console.error("Synchronization pipeline failed mid-flight:", err);
      // Remove successfully synced records, leave failed ones to retry later
      const remaining = queue.slice(syncedCount);
      localStorage.setItem(this.queueKey, JSON.stringify(remaining));
      return { success: false, syncedCount };
    }
  }
}

export const studentSyncManager = new StudentSyncManager();
```

---

## 3. Registering Online/Offline Reconnection Listeners in React

To trigger the synchronization pipeline automatically when connection is restored, register a global connection listener inside your root layout:

```tsx
"use client";

import React, { useEffect } from "react";
import { studentSyncManager } from "@/utils/studentSyncManager";

export function useOfflineSyncTrigger() {
  useEffect(() => {
    const handleReconnection = async () => {
      console.log("Network connection restored. Syncing offline changes...");
      
      const result = await studentSyncManager.synchronizeQueue();
      if (result.syncedCount > 0) {
        // Trigger a custom event to update list states across active views
        window.dispatchEvent(new CustomEvent("database-synced"));
      }
    };

    // Register native browser network state listeners
    window.addEventListener("online", handleReconnection);

    return () => {
      window.removeEventListener("online", handleReconnection);
    };
  }, []);
}
```

---

## 4. Architectural Tips for the Learner

1. **Sequential Queue Processing:** Notice that we sync the local offline queue using a `for...of` loop rather than running them in parallel with `Promise.all()`. Sequential execution is critical for offline syncing; creating and then immediately updating a student profile must happen in order to avoid relational key constraints failures.
2. **Handle Conflicts Gracefully:** If a student profile is deleted on the server while an offline user is editing it, Supabase will return a `404` or foreign key error during synchronization. You can add logic to skip conflicting changes or prompt the user with a visual reconciliation dialog.
3. **Use Simple CSV Parsing for Education:** While parsing libraries like `PapaParse` handle complex formatting like quoted commas, a simple line split by `\n` and column split by `,` is a lightweight, easy-to-understand alternative for learning project imports.
