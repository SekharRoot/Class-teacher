import { Student, ClassItem } from "../types";

export interface ParsedStudentPreview {
  rollNumber: string;
  firstName: string;
  lastName: string;
  rawClassName: string;
  parsedClass: {
    board: string;
    classStandard: string;
    section: string;
    formattedName: string;
  };
  gender: "Male" | "Female" | "Transgender";
  phoneNumber: string;
  boarderType: "Day Boarder" | "Day Scholar" | "Full Boarder";
  fatherName: string;
  motherName: string;
  status: "new" | "duplicate" | "invalid";
  statusReason?: string;
}

export const parseCSVLine = (line: string): string[] => {
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

export function parseClassName(classStr: string): {
  board: string;
  classStandard: string;
  section: string;
  formattedName: string;
} {
  const input = classStr.trim();
  const parts = input.split(/\s+/).filter(Boolean);
  
  let board = "CBSE";
  let standard = "Unknown";
  let section = "A";

  if (parts.length >= 3) {
    board = parts[0];
    standard = parts[1];
    section = parts.slice(2).join(" ");
  } else if (parts.length === 2) {
    const firstIsBoard = ["cbse", "icse", "state", "ib", "igcse"].includes(parts[0].toLowerCase());
    if (firstIsBoard) {
      board = parts[0].toUpperCase();
      standard = parts[1];
      section = "A";
    } else {
      board = "CBSE";
      standard = parts[0];
      section = parts[1];
    }
  } else if (parts.length === 1 && parts[0]) {
    const splitParts = parts[0].split(/[-/]/).filter(Boolean);
    if (splitParts.length >= 2) {
      board = "CBSE";
      standard = splitParts[0];
      section = splitParts.slice(1).join(" ");
    } else {
      board = "CBSE";
      standard = parts[0];
      section = "A";
    }
  }

  board = board.toUpperCase();
  
  return {
    board,
    classStandard: standard,
    section,
    formattedName: `${board} ${standard} ${section}`
  };
}

/**
 * Parses CSV text to generate a preview of student profiles and identify any validation or duplication warnings.
 */
export const previewProfileImport = (
  text: string,
  classes: ClassItem[],
  existingStudents: Student[]
): ParsedStudentPreview[] => {
  const rows = text.split(/\r?\n/).filter((row) => row.trim());
  if (rows.length < 2) {
    throw new Error("CSV file is empty or missing data rows.");
  }

  const classNameToIdMap: Record<string, string> = {};
  classes.forEach((c) => {
    const fullName = `${c.board} ${c.classStandard} ${c.section}`.toLowerCase().trim();
    classNameToIdMap[fullName] = c.id;
    classNameToIdMap[c.id.toLowerCase()] = c.id;
  });

  const parsedPreviews: ParsedStudentPreview[] = [];
  const processedRollNumbers = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVLine(rows[i]);
    if (values.length < 2 || !values[0] || !values[1]) continue;

    const rollNumber = values[0].toUpperCase();
    const firstName = values[1];
    const lastName = values[2] || "";
    const rawClassName = values[3] || "";
    const rawGender = values[4] || "Male";
    const phoneNumber = values[5] || "";
    const rawBoarderType = values[6] || "";
    const fatherName = values[7] || "";
    const motherName = values[8] || "";

    // Parse class standard or match unique 4-digit class ID directly
    const normalizedRawClass = rawClassName.trim().toLowerCase();
    const directClassId = classNameToIdMap[normalizedRawClass];
    let parsedClass;
    if (directClassId) {
      const matchedClass = classes.find((c) => c.id === directClassId);
      if (matchedClass) {
        parsedClass = {
          board: matchedClass.board,
          classStandard: matchedClass.classStandard,
          section: matchedClass.section,
          formattedName: `${matchedClass.board} ${matchedClass.classStandard} ${matchedClass.section}`,
        };
      } else {
        parsedClass = parseClassName(rawClassName);
      }
    } else {
      parsedClass = parseClassName(rawClassName);
    }

    // Resolve gender
    let gender: "Male" | "Female" | "Transgender" = "Male";
    const gLower = rawGender.toLowerCase();
    if (gLower.startsWith("f")) gender = "Female";
    else if (gLower.startsWith("t")) gender = "Transgender";

    // Resolve Boarder Type - defaulting to "Full Boarder" if missing
    let boarderType: "Day Boarder" | "Day Scholar" | "Full Boarder" = "Full Boarder";
    if (rawBoarderType.trim()) {
      const bLower = rawBoarderType.toLowerCase();
      if (bLower.includes("full")) boarderType = "Full Boarder";
      else if (bLower.includes("day board")) boarderType = "Day Boarder";
      else if (bLower.includes("day schol") || bLower.includes("scholar")) boarderType = "Day Scholar";
    }

    // Determine status
    let status: "new" | "duplicate" | "invalid" = "new";
    let statusReason = "";

    if (!firstName || !rawClassName || !rollNumber) {
      status = "invalid";
      statusReason = "Missing name, class, or roll number";
    } else {
      // Find matching existing class
      const classId = directClassId || classNameToIdMap[parsedClass.formattedName.toLowerCase()];
      const rollKey = `${classId || "new"}_${rollNumber}`;
      
      const isDuplicateInCSV = processedRollNumbers.has(rollKey);
      const isDuplicateInDb = existingStudents.some(
        (s) => s.classId === classId && s.rollNumber.toUpperCase() === rollNumber && s.isActive !== false
      );

      if (isDuplicateInCSV || isDuplicateInDb) {
        status = "duplicate";
        statusReason = isDuplicateInCSV ? "Duplicate roll number in CSV" : "Student already registered in database";
      } else {
        processedRollNumbers.add(rollKey);
      }
    }

    parsedPreviews.push({
      rollNumber,
      firstName,
      lastName,
      rawClassName,
      parsedClass,
      gender,
      phoneNumber,
      boarderType,
      fatherName,
      motherName,
      status,
      statusReason,
    });
  }

  return parsedPreviews;
};
