import React from "react";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Grid,
} from "@mui/material";
import {
  Check,
  Close,
  Delete,
  Event,
  AccountCircle,
  School,
  Warning,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";
import { format } from "date-fns";
import { LeaveRequest, LeaveStatus, Student, ClassItem } from "../../types";

interface LeaveCardProps {
  leave: LeaveRequest;
  student: Student | undefined;
  cls: ClassItem | undefined;
  isReadOnly: boolean;
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
  onDelete: (id: string) => void;
  getStatusChipColor: (status: LeaveStatus) => any;
  getStatusIcon: (status: LeaveStatus) => React.ReactElement<any>;
}

export function LeaveCard({
  leave,
  student,
  cls,
  isReadOnly,
  onUpdateStatus,
  onDelete,
  getStatusChipColor,
  getStatusIcon,
}: LeaveCardProps) {
  const isPending = leave.status === "pending";

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: isPending ? "warning.light" : "divider",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: isPending
                    ? "warning.light"
                    : leave.status === "approved"
                      ? "success.light"
                      : "error.light",
                  color: isPending
                    ? "warning.main"
                    : leave.status === "approved"
                      ? "success.main"
                      : "error.main",
                  width: 48,
                  height: 48,
                }}
              >
                {student ? student.firstName.charAt(0) : <AccountCircle />}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                  {student
                    ? `${student.firstName} ${student.lastName}`
                    : "Unknown Student"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  <School fontSize="small" />
                  <Typography variant="body2">
                    {cls
                      ? `${cls.classStandard} ${cls.section}`
                      : "Unknown Class"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={leave.status.toUpperCase()}
              color={getStatusChipColor(leave.status)}
              icon={getStatusIcon(leave.status) as any}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "action.hover",
              p: 1.5,
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Event color="action" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {(() => {
                try {
                  const startStr = leave.startDate ? format(new Date(leave.startDate), "MMM d, yyyy") : "N/A";
                  const endStr = leave.endDate ? format(new Date(leave.endDate), "MMM d, yyyy") : "N/A";
                  return `${startStr} - ${endStr}`;
                } catch (e) {
                  return "Invalid date range";
                }
              })()}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}
          >
            "{leave.reason}"
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ display: "block" }}
                color="text.secondary"
              >
                Applied by: {leave.appliedBy}
              </Typography>
              {leave.resolvedBy && (
                <Typography
                  variant="caption"
                  sx={{ display: "block" }}
                  color="text.secondary"
                >
                  Resolved by: {leave.resolvedBy}
                </Typography>
              )}
            </Box>

            {!isReadOnly && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {isPending && (
                  <>
                    <Tooltip title="Approve Leave">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => onUpdateStatus(leave.id, "approved")}
                        sx={{
                          bgcolor: "success.light",
                          "&:hover": {
                            bgcolor: "success.main",
                            color: "white",
                          },
                        }}
                      >
                        <Check fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject Leave">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onUpdateStatus(leave.id, "rejected")}
                        sx={{
                          bgcolor: "error.light",
                          "&:hover": { bgcolor: "error.main", color: "white" },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Delete Record">
                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => onDelete(leave.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
