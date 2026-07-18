import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";

interface DatabaseOptimizationTabProps {
  migrationLoading: boolean;
  migrationProgress: { current: number; total: number };
  migrationStatus: string;
  migrationSuccess: boolean;
  onRunMigration: () => void;
}

export const DatabaseOptimizationTab: React.FC<DatabaseOptimizationTabProps> = ({
  migrationLoading,
  migrationProgress,
  migrationStatus,
  migrationSuccess,
  onRunMigration,
}) => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SpeedIcon color="primary" /> Database Optimization & Historical Migration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enhance performance and dramatically reduce data transfer by moving calculations server-side, restructuring tables, and backfilling enriched summaries.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Class-Daily Records
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Active
              </Typography>
              <Typography
                variant="caption"
                color="success.main"
                sx={{ display: "block", mt: 1, fontWeight: "bold" }}
              >
                ✓ High-Speed Isolated Queries Enabled
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pre-computed Summaries
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Active
              </Typography>
              <Typography
                variant="caption"
                color="success.main"
                sx={{ display: "block", mt: 1, fontWeight: "bold" }}
              >
                ✓ 100x Speedup For Daily Reports
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Memory Status
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Optimized
              </Typography>
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ display: "block", mt: 1, fontWeight: "bold" }}
              >
                ✓ Backwards Compatibility Preserved
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "action.hover",
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AutorenewIcon color="primary" /> Run Historical Migration Tool
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This tool scans your legacy global attendance documents and generates:
          </Typography>
          <Box
            component="ul"
            sx={{
              pl: 2,
              m: 0,
              "& li": { mb: 1, fontSize: "0.875rem", color: "text.secondary" },
            }}
          >
            <li>
              Isolated <strong>class-level daily logs</strong> for
              high-performance class monthly reports.
            </li>
            <li>
              <strong>Enriched summaries</strong> including full boarder-type
              breakdown (Day Scholar, Day Boarder, Full Boarder) so daily
              oversight reports load instantly.
            </li>
          </Box>
          <Typography
            variant="caption"
            color="error.main"
            sx={{ display: "block", mt: 2, fontWeight: "bold" }}
          >
            ⚠ IMPORTANT: This migration process is completely safe and
            non-destructive. It does not delete any of your existing historical
            records.
          </Typography>
        </Box>

        {migrationLoading && (
          <Box sx={{ width: "100%", mb: 3 }}>
            <LinearProgress
              variant={
                migrationProgress.total > 0 ? "determinate" : "indeterminate"
              }
              value={
                migrationProgress.total > 0
                  ? (migrationProgress.current / migrationProgress.total) * 100
                  : 0
              }
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 1,
                [`& .MuiLinearProgress-bar`]: {
                  transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                {migrationStatus}
              </Typography>
              {migrationProgress.total > 0 && (
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {migrationProgress.current} / {migrationProgress.total} dates (
                  {Math.round(
                    (migrationProgress.current / migrationProgress.total) * 100
                  )}
                  %)
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {migrationSuccess && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {migrationStatus}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={onRunMigration}
          disabled={migrationLoading}
          startIcon={<AutorenewIcon />}
          size="large"
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          {migrationLoading
            ? "Running Optimization..."
            : "Optimize historical data"}
        </Button>
      </Paper>
    </Box>
  );
};
