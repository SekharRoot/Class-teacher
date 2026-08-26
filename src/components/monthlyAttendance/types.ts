import React from "react";
import { Student, ClassItem } from "../../types";

export interface ModifiedCell {
  studentId: string;
  date: string;
  originalStatus: string;
  currentStatus: string;
}

export interface CellMenuState {
  anchorEl: HTMLElement | null;
  studentId: string;
  dateStr: string;
  currentStatus: string;
  studentName: string;
}

export interface MonthlyAttendanceSheetProps {
  selectedClassId: string | null;
  classes?: ClassItem[];
  students: Student[];
  showToast?: (
    msg: string,
    severity?: "success" | "error" | "warning" | "info",
  ) => void;
  onNavigateSettings?: () => void;
  currentMonthDate?: Date;
  onMonthChange?: (date: Date) => void;
  readOnly?: boolean;
  allowEditOld?: boolean;
  onSaveSuccess?: () => void;
}

export interface AttendanceCellProps {
  studentId: string;
  dateStr: string;
  status: string;
  isPastDate: boolean;
  allowEditOld: boolean;
  isModified: boolean;
  modifiedOriginalStatus?: string;
  isDarkMode: boolean;
  studentName: string;
  readOnly: boolean;
  onClick: (
    e: React.MouseEvent<HTMLElement>,
    studentId: string,
    dateStr: string,
    status: string,
    studentName: string,
  ) => void;
}
