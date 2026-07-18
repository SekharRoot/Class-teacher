export interface Student {
  id: string;
  profileId?: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  classId?: string;
  schoolId?: string | null;
  gender?: "Male" | "Female" | "Transgender";
  fatherName?: string;
  motherName?: string;
  phoneNumber?: string;
  image?: string; // base64 Data URL
  boarderType?: "Day Boarder" | "Day Scholar" | "Full Boarder";
  isActive?: boolean;
}

export type AttendanceStatus = "present" | "absent" | "leave";

export interface AttendanceRecord {
  id: string; // usually combination of date and studentId or a unique doc id
  studentId: string;
  date: string; // ISO date string YYYY-MM-DD
  status: AttendanceStatus;
}

export type UserRole =
  | "owner"
  | "admin"
  | "school_admin"
  | "academic_coordinator"
  | "principal"
  | "class_teacher";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  schoolId?: string | null; // Selected school ID
  schoolName?: string | null; // Selected school name
  assignedClassId?: string | null; // For class_teacher
  assignedClassId2?: string | null; // Second assigned class for class_teacher
  alternateClassIds?: string[]; // For alternate/temporary class assignments (substitute teachers)
  coordinatorIds?: string[]; // Links class_teacher -> multiple academic_coordinators
  coordinatorId?: string | null; // @deprecated: Links class_teacher -> academic_coordinator
  principalId?: string | null; // Links academic_coordinator -> principal
  status: "active" | "pending";
  hasLeaveFeatureAccess?: boolean;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface ClassItem {
  id: string;
  board: string;
  classStandard: string;
  section: string;
  schoolId?: string | null;
  createdAt?: string;
}

export interface MonthlyReportEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  present: number;
  absent: number;
  leave: number;
  totalDays: number;
  attendancePercentage: number;
}

export interface MonthlyReport {
  month: string; // YYYY-MM
  classId: string;
  entries: MonthlyReportEntry[];
}

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  studentId: string;
  classId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  appliedBy: string; // user profile display name or email
  appliedById: string; // user profile uid
  appliedAt: string; // ISO date-time string
  resolvedBy?: string; // profile display name who approved/rejected
  resolvedById?: string; // profile uid who approved/rejected
  resolvedAt?: string; // ISO date-time string
}
