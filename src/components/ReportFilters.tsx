import React, { useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Checkbox,
  Box,
  Typography,
  Collapse,
  Divider,
} from "@mui/material";
import { Refresh, FilterList, Tune, ExpandMore, ExpandLess } from "@mui/icons-material";
import { ClassItem, StudentStatusFilter } from "../types";

interface ReportFiltersProps {
  classes: ClassItem[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  studentStatus: StudentStatusFilter;
  onStatusChange: (status: StudentStatusFilter) => void;
  ignoreSundays: boolean;
  onIgnoreSundaysChange: (val: boolean) => void;
  ignoreSaturdays: boolean;
  onIgnoreSaturdaysChange: (val: boolean) => void;
  onGenerateReport: () => void;
  loading: boolean;
  // Advanced PDF/Report Calculation Options
  schoolName?: string;
  onSchoolNameChange?: (val: string) => void;
  academicYear?: string;
  onAcademicYearChange?: (val: string) => void;
  termStartMonth?: string;
  onTermStartMonthChange?: (val: string) => void;
  useCustomWd?: boolean;
  onUseCustomWdChange?: (val: boolean) => void;
  customWd?: number;
  onCustomWdChange?: (val: number) => void;
  useCustomTotalWd?: boolean;
  onUseCustomTotalWdChange?: (val: boolean) => void;
  customTotalWd?: number;
  onCustomTotalWdChange?: (val: number) => void;
  includeTa?: boolean;
  onIncludeTaChange?: (val: boolean) => void;
  includeTaPercent?: boolean;
  onIncludeTaPercentChange?: (val: boolean) => void;
  includePca?: boolean;
  onIncludePcaChange?: (val: boolean) => void;
  includeTca?: boolean;
  onIncludeTcaChange?: (val: boolean) => void;
  includeTcaPercent?: boolean;
  onIncludeTcaPercentChange?: (val: boolean) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  selectedMonth,
  onMonthChange,
  studentStatus,
  onStatusChange,
  ignoreSundays,
  onIgnoreSundaysChange,
  ignoreSaturdays,
  onIgnoreSaturdaysChange,
  onGenerateReport,
  loading,
  schoolName,
  onSchoolNameChange,
  academicYear,
  onAcademicYearChange,
  termStartMonth,
  onTermStartMonthChange,
  useCustomWd = false,
  onUseCustomWdChange,
  customWd = 22,
  onCustomWdChange,
  useCustomTotalWd = false,
  onUseCustomTotalWdChange,
  customTotalWd = 100,
  onCustomTotalWdChange,
  includeTa = true,
  onIncludeTaChange,
  includeTaPercent = true,
  onIncludeTaPercentChange,
  includePca = true,
  onIncludePcaChange,
  includeTca = true,
  onIncludeTcaChange,
  includeTcaPercent = true,
  onIncludeTcaPercentChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            label="Select Class"
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            variant="outlined"
            size="small"
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.board} - {cls.classStandard} {cls.section}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            type="month"
            label="Select Month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            label="Student Profiles"
            value={studentStatus}
            onChange={(e) =>
              onStatusChange(e.target.value as StudentStatusFilter)
            }
            variant="outlined"
            size="small"
          >
            <MenuItem value="active">Active Students (Currently)</MenuItem>
            <MenuItem value="active_entire_month">Active Entire Month</MenuItem>
            <MenuItem value="active_in_month">Active / Recorded During Month</MenuItem>
            <MenuItem value="inactive">Inactive Students Only</MenuItem>
            <MenuItem value="all">All Students (Active & Inactive)</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pt: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <FilterList fontSize="small" /> Weekend Rules:
          </Typography>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={ignoreSundays}
                onChange={(e) => onIgnoreSundaysChange(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Ignore Sunday
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={ignoreSaturdays}
                onChange={(e) => onIgnoreSaturdaysChange(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Ignore Saturday
              </Typography>
            }
          />

          <Button
            size="small"
            startIcon={<Tune />}
            endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ textTransform: "none", fontWeight: 600, ml: 1 }}
          >
            {showAdvanced ? "Hide Advanced Options" : "More PDF & Calculation Options"}
          </Button>
        </Box>

        <Button
          variant="contained"
          size="medium"
          startIcon={<Refresh />}
          onClick={onGenerateReport}
          disabled={loading || !selectedClassId}
          sx={{
            borderRadius: "8px",
            fontWeight: "bold",
            px: 3,
            py: 1,
            textTransform: "none",
            minWidth: 160,
          }}
        >
          {loading ? "Generating..." : "Generate Report"}
        </Button>
      </Box>

      {/* Advanced PDF & Report Options Panel */}
      <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
        <Box
          sx={{
            p: 2.5,
            mt: 1,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
            School & PDF Header Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="School / Institution Name"
                value={schoolName || ""}
                onChange={(e) => onSchoolNameChange && onSchoolNameChange(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Academic Year"
                placeholder="e.g. 2026 - 2027"
                value={academicYear || ""}
                onChange={(e) => onAcademicYearChange && onAcademicYearChange(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="month"
                size="small"
                label="Term Start Month"
                value={termStartMonth || ""}
                onChange={(e) => onTermStartMonthChange && onTermStartMonthChange(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 0.5 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Working Days (WD) Overrides
          </Typography>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={useCustomWd}
                      onChange={(e) => onUseCustomWdChange && onUseCustomWdChange(e.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">Override Month Working Days (WD)</Typography>}
                />
                {useCustomWd && (
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 90 }}
                    value={customWd}
                    onChange={(e) => onCustomWdChange && onCustomWdChange(parseInt(e.target.value, 10) || 0)}
                  />
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={useCustomTotalWd}
                      onChange={(e) => onUseCustomTotalWdChange && onUseCustomTotalWdChange(e.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">Override Total Cumulative WD</Typography>}
                />
                {useCustomTotalWd && (
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 90 }}
                    value={customTotalWd}
                    onChange={(e) => onCustomTotalWdChange && onCustomTotalWdChange(parseInt(e.target.value, 10) || 0)}
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 0.5 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
            PDF Report Calculation Columns
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeTa}
                  onChange={(e) => onIncludeTaChange && onIncludeTaChange(e.target.checked)}
                />
              }
              label={<Typography variant="body2">Total Attendance (TA)</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeTaPercent}
                  onChange={(e) => onIncludeTaPercentChange && onIncludeTaPercentChange(e.target.checked)}
                />
              }
              label={<Typography variant="body2">% TA</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includePca}
                  onChange={(e) => onIncludePcaChange && onIncludePcaChange(e.target.checked)}
                />
              }
              label={<Typography variant="body2">Previous Cumulative (PCA)</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeTca}
                  onChange={(e) => onIncludeTcaChange && onIncludeTcaChange(e.target.checked)}
                />
              }
              label={<Typography variant="body2">Total Cumulative (TCA)</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeTcaPercent}
                  onChange={(e) => onIncludeTcaPercentChange && onIncludeTcaPercentChange(e.target.checked)}
                />
              }
              label={<Typography variant="body2">% TCA</Typography>}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

