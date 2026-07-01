import React from "react";
import { Grid, Paper, Typography, Button, Box } from "@mui/material";
import { TrendingUp, Group, FileDownload } from "@mui/icons-material";

interface ReportSummaryCardsProps {
  workingDays: number;
  totalStudents: number;
  onDownloadCSV: () => void;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  workingDays,
  totalStudents,
  onDownloadCSV,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6">Working Days</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            {workingDays}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "success.light",
            color: "success.contrastText",
          }}
        >
          <Group sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6">Total Students</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            {totalStudents}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<FileDownload />}
            onClick={onDownloadCSV}
            sx={{
              height: 80,
              borderRadius: 3,
              borderStyle: "dashed",
              borderWidth: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Download CSV Report
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
