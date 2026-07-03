import { Student, ClassItem } from "../types";
import { classesApi } from "../api";

export const parseCSVLine = (line: string) => {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const processProfileImport = async (
  text: string,
  classes: ClassItem[],
  existingStudents: Student[],
  offlineMode: boolean
): Promise<{ newStudents: Student[]; importedCount: number }> => {
  const rows = text.split(/\r?\n/).filter((row) => row.trim());
  if (rows.length < 2) {
    throw new Error("CSV file is empty or missing data rows.");
  }

  const classNameToIdMap: Record<string, string> = {};
  classes.forEach((c) => {
    const fullName = `${c.board} ${c.classStandard} ${c.section}`
      .toLowerCase()
      .trim();
    classNameToIdMap[fullName] = c.id;
    classNameToIdMap[c.id.toLowerCase()] = c.id;
  });

  let newStudents: Student[] = [];
  const existingRollNumbers = new Set(
    existingStudents.map((s) => `${s.classId}_${s.rollNumber.toUpperCase()}`)
  );

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVLine(rows[i]);
    if (values.length < 3) continue;

    const rollNumber = values[0].toUpperCase();
    const firstName = values[1];
    const lastName = values[2] || ".";
    let classId = values[3] || "";

    const classLookup = classId.toLowerCase().trim();
    if (classNameToIdMap[classLookup]) {
      classId = classNameToIdMap[classLookup];
    } else if (classLookup) {
      const parts = classId.split(/\s+/);
      const board = parts[0] || "CBSE";
      const standard = parts[1] || "Unknown";
      const section = parts.slice(2).join(" ") || "A";

      const newClassId = `cls_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newClass: ClassItem = {
        id: newClassId,
        board,
        classStandard: standard,
        section,
        createdAt: new Date().toISOString(),
      };

      try {
        if (!offlineMode) {
          await classesApi.create(newClass);
        }
        classNameToIdMap[classLookup] = newClassId;
        classId = newClassId;
      } catch (err) {
        console.error("Error creating class during import:", err);
      }
    }

    if (!firstName || !classId || !rollNumber) continue;

    if (existingRollNumbers.has(`${classId}_${rollNumber}`)) {
      continue;
    }

    const gender = (values[4] || "Male") as any;
    const phoneNumber = values[5] || "";
    const boarderType = (values[6] || "Day Scholar") as any;

    const studentId = `std_${Date.now()}_${i}_${Math.random()
      .toString(36)
      .substr(2, 5)}`;

    const savedStudent: Student = {
      id: studentId,
      firstName,
      lastName,
      rollNumber,
      classId,
      gender,
      fatherName: "",
      motherName: "",
      phoneNumber,
      boarderType,
      image: "",
    };

    newStudents.push(savedStudent);
    existingRollNumbers.add(`${classId}_${rollNumber}`);
  }

  return { newStudents, importedCount: newStudents.length };
};
