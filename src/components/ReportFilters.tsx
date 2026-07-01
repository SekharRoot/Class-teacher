import React from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { ClassItem } from "../types";

interface ReportFiltersProps {
  classes: ClassItem[];
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onGenerateReport: () => void;
  loading: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  classes,
  selectedClassId,
  onClassChange,
  selectedMonth,
  onMonthChange,
  onGenerateReport,
  loading,
}) => {
  return (
    <Grid container spacing={3} sx={{ alignItems: "flex-end" }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          select
          fullWidth
          label="Select Class"
          value={selectedClassId}
          onChange={(e) => onClassChange(e.target.value)}
          variant="outlined"
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
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Refresh />}
          onClick={onGenerateReport}
          disabled={loading || !selectedClassId}
          sx={{ height: 56, borderRadius: 2, fontWeight: "bold" }}
        >
          Generate Report
        </Button>
      </Grid>
    </Grid>
  );
};
