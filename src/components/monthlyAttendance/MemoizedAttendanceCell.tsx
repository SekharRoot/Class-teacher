import React, { useMemo } from "react";
import { TableCell, Tooltip, Box } from "@mui/material";
import { AttendanceCellProps } from "./types";

export const MemoizedAttendanceCell: React.FC<AttendanceCellProps> = React.memo(
  ({
    studentId,
    dateStr,
    status,
    isPastDate,
    allowEditOld,
    isModified,
    modifiedOriginalStatus,
    isDarkMode,
    studentName,
    readOnly,
    onClick,
  }) => {
    const isCellDisabled = readOnly || (isPastDate && !allowEditOld);

    const statusStyle = useMemo(() => {
      if (status === "present") {
        return {
          color: isDarkMode ? "#81c784" : "#1b5e20",
          bgcolor: isDarkMode ? "rgba(46, 125, 50, 0.25)" : "#e8f5e9",
          borderColor: isDarkMode ? "#388e3c" : "#81c784",
          label: "P",
        };
      } else if (status === "absent") {
        return {
          color: isDarkMode ? "#ef5350" : "#b71c1c",
          bgcolor: isDarkMode ? "rgba(198, 40, 40, 0.25)" : "#ffebee",
          borderColor: isDarkMode ? "#d32f2f" : "#ef9a9a",
          label: "A",
        };
      } else if (status === "leave") {
        return {
          color: isDarkMode ? "#ffb74d" : "#e65100",
          bgcolor: isDarkMode ? "rgba(230, 81, 0, 0.25)" : "#fff3e0",
          borderColor: isDarkMode ? "#f57c00" : "#ffb74d",
          label: "L",
        };
      }
      return {
        color: "text.disabled",
        bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "action.hover",
        borderColor: "transparent",
        label: "-",
      };
    }, [status, isDarkMode]);

    return (
      <TableCell
        align="center"
        sx={{
          p: 0.25,
          bgcolor: isModified ? "info.50" : undefined,
          border: isModified ? "1px solid" : undefined,
          borderColor: isModified ? "info.main" : undefined,
          width: 48,
          minWidth: 48,
        }}
      >
        <Tooltip
          title={
            isCellDisabled
              ? "Read-only / Locked"
              : isModified
                ? `Modified: was ${modifiedOriginalStatus || "NA"}`
                : `${studentName}: ${status ? status.toUpperCase() : "Unmarked"}`
          }
          arrow
        >
          <Box
            component="button"
            onClick={(e) =>
              !isCellDisabled && onClick(e, studentId, dateStr, status, studentName)
            }
            disabled={isCellDisabled}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 28,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: statusStyle.borderColor,
              bgcolor: statusStyle.bgcolor,
              color: statusStyle.color,
              fontWeight: "800",
              fontSize: "0.75rem",
              cursor: isCellDisabled ? "default" : "pointer",
              opacity: isCellDisabled ? 0.7 : 1,
              outline: "none",
              userSelect: "none",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              "&:hover": {
                transform: isCellDisabled ? "none" : "scale(1.1)",
                boxShadow: isCellDisabled ? "none" : 1,
              },
              "&:active": {
                transform: isCellDisabled ? "none" : "scale(0.95)",
              },
            }}
          >
            {statusStyle.label}
          </Box>
        </Tooltip>
      </TableCell>
    );
  },
);

MemoizedAttendanceCell.displayName = "MemoizedAttendanceCell";
