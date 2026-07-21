export function calculateHistory(payload: any): any[] {
  const { docs, classStudentIds, selectedClassId } = payload;
  const datesList: any[] = [];
  const studentSet = classStudentIds ? new Set(classStudentIds) : null;

  for (const doc of docs) {
    const { id, data } = doc;
    let present = 0;
    let absent = 0;
    let leave = 0;

    if (data) {
      for (const [studentId, val] of Object.entries(data)) {
        const isObj = typeof val === "object" && val !== null;
        const status = (isObj ? (val as any).status : val || "").toLowerCase();
        const recordClassId = isObj ? (val as any).classId : null;

        if (selectedClassId) {
          if (recordClassId) {
            if (recordClassId !== selectedClassId) continue;
          } else {
            if (studentSet && !studentSet.has(studentId)) continue;
          }
        }

        if (status === "present") present++;
        else if (status === "absent") absent++;
        else if (status === "leave") {
          leave++;
          absent++;
        }
      }
    }

    datesList.push({ date: id, present, absent, leave });
  }

  datesList.sort((a, b) => b.date.localeCompare(a.date));
  return datesList;
}

export function calculateLocalHistory(payload: any): any[] {
  const { localStorageItems, classStudentIds, selectedClassId } = payload;
  const datesList: any[] = [];
  const studentSet = classStudentIds ? new Set(classStudentIds) : null;

  for (const [key, recordDataStr] of Object.entries(localStorageItems)) {
    if (key.startsWith("attendance_")) {
      const dateStr = key.replace("attendance_", "");
      const recordData = JSON.parse((recordDataStr as string) || "{}");

      let present = 0;
      let absent = 0;
      let leave = 0;

      for (const [studentId, val] of Object.entries(recordData)) {
        const isObj = typeof val === "object" && val !== null;
        const status = (isObj ? (val as any).status : val || "").toLowerCase();
        const recordClassId = isObj ? (val as any).classId : null;

        if (selectedClassId) {
          if (recordClassId) {
            if (recordClassId !== selectedClassId) continue;
          } else {
            if (studentSet && !studentSet.has(studentId)) continue;
          }
        }

        if (status === "present") present++;
        else if (status === "absent") absent++;
        else if (status === "leave") {
          leave++;
          absent++;
        }
      }

      datesList.push({
        date: dateStr,
        present,
        absent,
        leave,
      });
    }
  }
  datesList.sort((a, b) => b.date.localeCompare(a.date));
  return datesList;
}
