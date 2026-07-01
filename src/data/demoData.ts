import { Student, AttendanceStatus } from "../types";
import { format, subDays } from "date-fns";

export const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    firstName: "Alice",
    lastName: "Smith",
    rollNumber: "101",
    classId: "CBSE_XII_PCB3",
    boarderType: "Day Scholar",
    gender: "Female",
  },
  {
    id: "s2",
    firstName: "Bob",
    lastName: "Johnson",
    rollNumber: "102",
    classId: "CBSE_XII_PCB3",
    boarderType: "Day Boarder",
    gender: "Male",
  },
  {
    id: "s3",
    firstName: "Charlie",
    lastName: "Brown",
    rollNumber: "103",
    classId: "CBSE_XII_PCB3",
    boarderType: "Full Boarder",
    gender: "Male",
  },
  {
    id: "s4",
    firstName: "Diana",
    lastName: "Prince",
    rollNumber: "104",
    classId: "ICSE_X_A",
    boarderType: "Day Scholar",
    gender: "Female",
  },
  {
    id: "s5",
    firstName: "Ethan",
    lastName: "Hunt",
    rollNumber: "105",
    classId: "ICSE_X_A",
    boarderType: "Day Boarder",
    gender: "Male",
  },
  {
    id: "s6",
    firstName: "Fiona",
    lastName: "Gallagher",
    rollNumber: "106",
    classId: "ICSE_X_A",
    boarderType: "Full Boarder",
    gender: "Female",
  },
  {
    id: "s7",
    firstName: "George",
    lastName: "Weasley",
    rollNumber: "107",
    classId: "ICSE_X_A",
    boarderType: "Day Scholar",
    gender: "Male",
  },
  {
    id: "s8",
    firstName: "Hannah",
    lastName: "Abbott",
    rollNumber: "108",
    classId: "CBSE_XII_PCB3",
    boarderType: "Full Boarder",
    gender: "Female",
  },
];
export const generateMockLeaves = () => {
  const today = new Date();
  const dateStr = format(today, "yyyy-MM-dd");
  const pastDateStr = format(subDays(today, 2), "yyyy-MM-dd");
  const futureDateStr = format(subDays(today, -3), "yyyy-MM-dd");

  return [
    {
      id: "mock_leave_1",
      studentId: "s1", // Alice Smith (CBSE_XII_PCB3)
      classId: "CBSE_XII_PCB3",
      startDate: pastDateStr,
      endDate: dateStr,
      reason: "Recovering from fever. Medical certificate attached.",
      status: "approved" as const,
      appliedBy: "Principal Teacher",
      appliedById: "mock_uid_1",
      appliedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      resolvedBy: "Principal Admin",
      resolvedById: "mock_uid_admin",
      resolvedAt: new Date(Date.now() - 2.5 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "mock_leave_2",
      studentId: "s5", // Ethan Hunt (ICSE_X_A)
      classId: "ICSE_X_A",
      startDate: dateStr,
      endDate: futureDateStr,
      reason: "Attending elder sister marriage ceremony in hometown.",
      status: "pending" as const,
      appliedBy: "Class Teacher",
      appliedById: "mock_uid_2",
      appliedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
  ];
};

export const generateMockHistory = (): Record<string, Record<string, any>> => {
  const history: Record<string, Record<string, any>> = {};
  const today = new Date();

  // Generate historical data for the last 5 school days
  for (let i = 0; i < 5; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");

    const dayAttendance: Record<string, any> = {};
    MOCK_STUDENTS.forEach((student, index) => {
      // Deterministic but varied distribution: mostly present, some absent, some leave
      const val = (index * 3 + i * 7) % 10;
      let status: AttendanceStatus = "present";
      if (val === 2) {
        status = "absent";
      } else if (val === 5 || val === 8) {
        status = "leave";
      }
      dayAttendance[student.id] = {
        status,
        classId: student.classId,
        boarderType: student.boarderType,
      };
    });

    history[dateStr] = dayAttendance;
  }

  return history;
};
