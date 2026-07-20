# Analytics Dashboards and Web Worker Offloading
## Material UI Grid, Recharts Integration, and Background Thread Processing

To build a high-performance analytics dashboard, you must understand a key limitation of the browser runtime: **JavaScript is single-threaded.** 

If you loop through thousands of daily attendance records to aggregate monthly metrics, calculate streak records, and filter boarder types on the main thread, the browser will freeze. This results in lagging clicks, choppy transitions, or "Page Unresponsive" alerts.

In this tutorial, you will design a responsive executive dashboard using **Material UI Cards** and **Recharts**, and offload heavy aggregation calculations to a dedicated browser **Web Worker**.

---

## 1. Executive Dashboard UI Layout

We design our dashboard using a standard grid containing key KPI cards, followed by responsive visual charts.

```tsx
"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2"; // MUI v6 standard
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LoadingButton from "@mui/lab/LoadingButton";
import AttendanceTrendChart from "@/components/dashboard/AttendanceTrendChart";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    activeStreak: 0,
  });
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 2 }}>
      <h1 className="font-sans font-medium tracking-tight text-3xl text-slate-900 mb-4">
        Analytics Dashboard
      </h1>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.light", width: 56, height: 56 }}>
                <GroupIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Enrolled</Typography>
                <Typography variant="h4">{metrics.totalStudents} Students</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "success.light", width: 56, height: 56 }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Today's Attendance Rate</Typography>
                <Typography variant="h4">{metrics.attendanceRate}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "warning.light", width: 56, height: 56 }}>
                <ShowChartIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Highest Class Streak</Typography>
                <Typography variant="h4">{metrics.activeStreak} Days</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Visualizations Container */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontFamily: "Space Grotesk" }}>
              Monthly Attendance Trends
            </Typography>
            <Box sx={{ height: 350 }}>
              <AttendanceTrendChart />
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Crucial Layout Spacer Guard */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} aria-hidden="true" />
    </Box>
  );
}
```

---

## 2. Coding the Background Web Worker

A Web Worker runs on an isolated background thread, executing long-running calculations without impacting UI responsiveness.

Create a worker file named `src/workers/calculator.worker.ts`:

```typescript
// Define self typed as a Worker global scope context
const ctx: Worker = self as any;

ctx.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "CALCULATE_METRICS") {
    const { students, attendanceRecords } = payload;
    
    // Perform intensive, nested aggregations on background thread
    const totalStudents = students.length;
    
    // Filter active student IDs
    const activeStudentIds = new Set(
      students.filter((s: any) => s.is_active).map((s: any) => s.id)
    );

    let totalWorkingDays = 0;
    let totalPresentsCount = 0;

    // Aggregate attendance rate percentages
    attendanceRecords.forEach((record: any) => {
      if (activeStudentIds.has(record.student_id)) {
        totalWorkingDays++;
        if (record.status === "present") {
          totalPresentsCount++;
        }
      }
    });

    const attendanceRate = totalWorkingDays > 0 
      ? Math.round((totalPresentsCount / totalWorkingDays) * 100) 
      : 0;

    // Calculate maximum present streak
    let activeStreak = 0;
    let tempStreak = 0;
    
    // Sort records sequentially by calendar date
    const sortedRecords = [...attendanceRecords].sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    );

    sortedRecords.forEach((record: any) => {
      if (record.status === "present") {
        tempStreak++;
        if (tempStreak > activeStreak) {
          activeStreak = tempStreak;
        }
      } else if (record.status === "absent") {
        tempStreak = 0; // Reset streak on absence
      }
    });

    // Send computed metrics payload back to main UI thread
    ctx.postMessage({
      type: "METRICS_CALCULATED",
      payload: {
        totalStudents,
        attendanceRate,
        activeStreak,
      },
    });
  }
};
```

---

## 3. Integrating the Web Worker inside React Hooks

To instantiate and communicate with the Web Worker in Next.js safely, initialize the worker inside a standard `useEffect` loop.

```tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Student, AttendanceRecord } from "@/types";

export function useAggregatedMetrics(
  students: Student[],
  attendanceRecords: AttendanceRecord[]
) {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    activeStreak: 0,
  });
  const [calculating, setCalculating] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // 1. Instantiate the background Web Worker thread using Webpack/Vite native constructor
    workerRef.current = new Worker(
      new URL("../workers/calculator.worker.ts", import.meta.url)
    );

    // 2. Set up listener to receive calculated metrics from background thread
    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === "METRICS_CALCULATED") {
        setMetrics(payload);
        setCalculating(false);
      }
    };

    return () => {
      // Clean up worker resources when the component unmounts
      workerRef.current?.terminate();
    };
  }, []);

  // Trigger recalculations when source database records change
  useEffect(() => {
    if (students.length > 0 && workerRef.current) {
      setCalculating(true);
      
      // Dispatch payload to background thread
      workerRef.current.postMessage({
        type: "CALCULATE_METRICS",
        payload: { students, attendanceRecords },
      });
    }
  }, [students, attendanceRecords]);

  return { metrics, calculating };
}
```

---

## 4. Visualizing Trends with Recharts

Using the metrics returned by our background thread, let's render a smooth, responsive area trend line using Recharts:

```tsx
"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample aggregated trend data
const trendData = [
  { date: "Mon", rate: 92 },
  { date: "Tue", rate: 94 },
  { date: "Wed", rate: 89 },
  { date: "Thu", rate: 95 },
  { date: "Fri", rate: 96 },
];

export default function AttendanceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={trendData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          style={{ fontSize: "0.75rem", fontFamily: "Inter", fill: "#64748b" }}
        />
        <YAxis
          domain={[60, 100]}
          tickLine={false}
          axisLine={false}
          style={{ fontSize: "0.75rem", fontFamily: "Inter", fill: "#64748b" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontFamily: "Inter",
          }}
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#0f172a"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRate)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## 5. Architectural Tips for the Learner

1. **Avoid Frequent Worker Instantiations:** Notice that the `Worker` constructor is placed inside a `useEffect` loop with an empty dependency array `[]`. We instantiate the background thread only once when the component is created, and reuse it for all subsequent calculation requests.
2. **Always Terminate Workers on Cleanup:** The cleanup function `return () => { workerRef.current?.terminate(); }` is vital. Failing to terminate background workers when components unmount causes memory leaks in the browser.
3. **Responsive Chart Container:** Wrapping your Recharts configuration inside `<ResponsiveContainer>` ensures that charts resize fluidly when the user rotates their screen or resizes the browser window.
