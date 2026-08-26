import React from "react";
import { Grid, Paper, Typography, Button, Box, Stack } from "@mui/material";
import { TrendingUp, Group, FileDownload, PictureAsPdf } from "@mui/icons-material";

interface ReportSummaryCardsProps {
  workingDays: number;
  totalStudents: number;
  onDownloadCSV: () => void;
  onDownloadPdf?: () => void;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  workingDays,
  totalStudents,
  onDownloadCSV,
  onDownloadPdf,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 3.5 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: "10px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(25, 118, 210, 0.16)"
                : "primary.main",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(25, 118, 210, 0.35)"
                : "none",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? "primary.light"
                : "primary.contrastText",
          }}
        >
          <TrendingUp sx={{ fontSize: 36, mb: 1 }} />
          <Typography variant="h6">Working Days</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            {workingDays}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3.5 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: "10px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(46, 125, 50, 0.16)"
                : "success.main",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(46, 125, 50, 0.35)"
                : "none",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? "success.light"
                : "success.contrastText",
          }}
        >
          <Group sx={{ fontSize: 36, mb: 1 }} />
          <Typography variant="h6">Total Students</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            {totalStudents}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={1.5} sx={{ height: "100%", justifyContent: "center" }}>
          {onDownloadPdf && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PictureAsPdf />}
              onClick={onDownloadPdf}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: 2,
              }}
            >
              Download PDF Report
            </Button>
          )}
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            startIcon={<FileDownload />}
            onClick={onDownloadCSV}
            sx={{
              py: 1,
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
            }}
          >
            Download CSV Report
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

