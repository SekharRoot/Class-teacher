const workerCode = `
self.onmessage = (event) => {
  const { type, payload } = event.data;
  
  if (type === 'CALCULATE_HISTORY') {
    const { docs, classStudentIds, selectedClassId } = payload;
    const datesList = [];
    const studentSet = classStudentIds ? new Set(classStudentIds) : null;

    for (const doc of docs) {
      const { id, data } = doc;
      let present = 0;
      let absent = 0;
      let leave = 0;

      for (const [studentId, val] of Object.entries(data)) {
        const isObj = typeof val === 'object' && val !== null;
        const status = (isObj ? val.status : val || '').toLowerCase();
        const recordClassId = isObj ? val.classId : null;

        if (selectedClassId) {
          if (recordClassId) {
            if (recordClassId !== selectedClassId) continue;
          } else {
            if (studentSet && !studentSet.has(studentId)) continue;
          }
        }

        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else if (status === 'leave') { leave++; absent++; }
      }

      datesList.push({ date: id, present, absent, leave });
    }
    
    datesList.sort((a, b) => b.date.localeCompare(a.date));
    self.postMessage({ payload: datesList });
  }

  if (type === 'CALCULATE_LOCAL_HISTORY') {
     const { localStorageItems, classStudentIds, selectedClassId } = payload;
     const datesList = [];
     const studentSet = classStudentIds ? new Set(classStudentIds) : null;
     
     for (const [key, recordDataStr] of Object.entries(localStorageItems)) {
        if (key.startsWith('attendance_')) {
          const dateStr = key.replace('attendance_', '');
          const recordData = JSON.parse(recordDataStr || '{}');
          
          let present = 0;
          let absent = 0;
          let leave = 0;
          
          for (const [studentId, val] of Object.entries(recordData)) {
            const isObj = typeof val === 'object' && val !== null;
            const status = (isObj ? val.status : val || '').toLowerCase();
            const recordClassId = isObj ? val.classId : null;

            if (selectedClassId) {
              if (recordClassId) {
                 if (recordClassId !== selectedClassId) continue;
              } else {
                 if (studentSet && !studentSet.has(studentId)) continue;
              }
            }

            if (status === 'present') present++;
            else if (status === 'absent') absent++;
            else if (status === 'leave') { leave++; absent++; }
          }

          datesList.push({
            date: dateStr,
            present,
            absent,
            leave
          });
        }
     }
     datesList.sort((a, b) => b.date.localeCompare(a.date));
     self.postMessage({ payload: datesList });
  }

  
  if (type === 'CALCULATE_SUMMARY') {
    const { students, attendance, selectedClassId } = payload;
    const classStudents = students.filter(st => 
      (!selectedClassId || st.classId === selectedClassId) && 
      st.isActive !== false
    );
    
    const totalCount = classStudents.length;
    const totalDayScholar = classStudents.filter(st => st.boarderType === 'Day Scholar').length;
    const totalDayBoarder = classStudents.filter(st => st.boarderType === 'Day Boarder').length;
    const totalFullBoarder = classStudents.filter(st => st.boarderType === 'Full Boarder').length;

    const presentStudents = classStudents.filter(st => {
      const val = attendance[st.id];
      const status = (typeof val === 'object' && val !== null ? val.status : val || '').toLowerCase();
      return status === 'present';
    });
    const presentCount = presentStudents.length;
    const presentDayScholar = presentStudents.filter(st => st.boarderType === 'Day Scholar').length;
    const presentDayBoarder = presentStudents.filter(st => st.boarderType === 'Day Boarder').length;
    const presentFullBoarder = presentStudents.filter(st => st.boarderType === 'Full Boarder').length;

    const absentStudents = classStudents.filter(st => {
      const val = attendance[st.id];
      const status = (typeof val === 'object' && val !== null ? val.status : val || '').toLowerCase();
      return status === 'absent' || status === 'leave';
    });
    const absentCount = absentStudents.length;
    const absentDayScholar = absentStudents.filter(st => st.boarderType === 'Day Scholar').length;
    const absentDayBoarder = absentStudents.filter(st => st.boarderType === 'Day Boarder').length;
    const absentFullBoarder = absentStudents.filter(st => st.boarderType === 'Full Boarder').length;

    const leaveStudents = classStudents.filter(st => {
      const val = attendance[st.id];
      const status = (typeof val === 'object' && val !== null ? val.status : val || '').toLowerCase();
      return status === 'leave';
    });
    const leaveCount = leaveStudents.length;
    const leaveDayScholar = leaveStudents.filter(st => st.boarderType === 'Day Scholar').length;
    const leaveDayBoarder = leaveStudents.filter(st => st.boarderType === 'Day Boarder').length;
    const leaveFullBoarder = leaveStudents.filter(st => st.boarderType === 'Full Boarder').length;

    self.postMessage({
      payload: {
        totalCount, totalDayScholar, totalDayBoarder, totalFullBoarder,
        presentCount, presentDayScholar, presentDayBoarder, presentFullBoarder,
        absentCount, absentDayScholar, absentDayBoarder, absentFullBoarder,
        leaveCount, leaveDayScholar, leaveDayBoarder, leaveFullBoarder
      }
    });
  }

  if (type === 'CALCULATE_DASHBOARD_STATS') {
    const { classes, students, authorizedClassIds, todayRecords } = payload;
    
    const filteredClasses = classes.filter((c) =>
      authorizedClassIds.includes(c.id)
    );
    const filteredStudents = students.filter(
      (s) => s.classId && authorizedClassIds.includes(s.classId) && s.isActive !== false
    );

    const classesCount = filteredClasses.length;
    const studentsCount = filteredStudents.length;

    let todayPresent = 0;
    let todayTotalMarked = 0;

    if (todayRecords) {
      Object.keys(todayRecords).forEach((studentId) => {
        const belongsToScope = filteredStudents.some((s) => s.id === studentId);
        if (!belongsToScope) return;

        const val = todayRecords[studentId];
        let status = "";
        if (typeof val === "object" && val !== null) {
          status = val.status || "";
        } else {
          status = String(val);
        }
        if (status) {
          todayTotalMarked++;
          const lowerStatus = status.toLowerCase();
          if (lowerStatus === "present") {
            todayPresent++;
          }
        }
      });
    }

    const attendanceRate =
      todayTotalMarked > 0
        ? Math.round((todayPresent / todayTotalMarked) * 100)
        : null;

    const classStats = filteredClasses.map((cls) => {
      const classStudents = filteredStudents.filter((s) => s.classId === cls.id);
      const total = classStudents.length;

      let present = 0;
      let absent = 0;
      let leave = 0;
      let marked = 0;

      classStudents.forEach((student) => {
        const record = todayRecords ? todayRecords[student.id] : null;
        let status = "";
        if (record) {
          if (typeof record === "object" && record !== null) {
            status = record.status || "";
          } else {
            status = String(record);
          }
        }

        if (status) {
          marked++;
          const lowerStatus = status.toLowerCase();
          if (lowerStatus === "present") {
            present++;
          } else if (lowerStatus === "absent") {
            absent++;
          } else if (lowerStatus === "leave") {
            leave++;
          }
        }
      });

      const rate = marked > 0 ? Math.round((present / marked) * 100) : null;

      return {
        classId: cls.id,
        className: cls.classStandard + " " + cls.section + " (" + cls.board + ")",
        totalStudents: total,
        presentCount: present,
        absentCount: absent,
        leaveCount: leave,
        markedCount: marked,
        attendanceRate: rate,
      };
    });

    self.postMessage({
      payload: {
        stats: {
          totalClasses: classesCount,
          totalStudents: studentsCount,
          todayAttendanceRate: attendanceRate,
          todayPresentCount: todayPresent,
          todayTotalMarked: todayTotalMarked,
        },
        classStats,
      },
    });
  }

  if (type === 'CALCULATE_MONTHLY_REPORT') {
    const { docs, month, classId, students } = payload;
    const reportEntries = [];
    const classStudents = students.filter(s => s.classId === classId && s.isActive !== false);
    
    // docs is an array of { id, data } where id is date YYYY-MM-DD
    const monthDocs = docs.filter(doc => doc.id.startsWith(month));
    const totalWorkingDays = monthDocs.length;

    for (const student of classStudents) {
      let present = 0;
      let absent = 0;
      let leave = 0;

      for (const doc of monthDocs) {
        const val = doc.data[student.id];
        if (!val) continue;

        const status = (typeof val === 'object' ? val.status : val || '').toLowerCase();
        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else if (status === 'leave') { leave++; absent++; }
      }

      const totalAttended = present;
      const percentage = totalWorkingDays > 0 ? (totalAttended / totalWorkingDays) * 100 : 0;

      reportEntries.push({
        studentId: student.id,
        studentName: student.firstName + ' ' + student.lastName,
        rollNumber: student.rollNumber,
        present,
        absent,
        leave,
        totalDays: totalWorkingDays,
        attendancePercentage: Math.round(percentage * 10) / 10
      });
    }

    self.postMessage({ 
      payload: {
        month,
        classId,
        entries: reportEntries
      }
    });
  }
};
`;

export const runCalculationWorker = async (
  type: string,
  payload: any,
): Promise<any> => {
  const THRESHOLD = 50; // Threshold for splitting work

  if (
    type === "CALCULATE_MONTHLY_REPORT" &&
    payload.students &&
    payload.students.length > THRESHOLD
  ) {
    const mid = Math.floor(payload.students.length / 2);
    const students1 = payload.students.slice(0, mid);
    const students2 = payload.students.slice(mid);

    const [res1, res2] = await Promise.all([
      runSingleWorker(type, { ...payload, students: students1 }),
      runSingleWorker(type, { ...payload, students: students2 }),
    ]);

    return {
      month: res1.month,
      classId: res1.classId,
      entries: [...res1.entries, ...res2.entries],
    };
  }

  if (
    type === "CALCULATE_HISTORY" &&
    payload.docs &&
    payload.docs.length > THRESHOLD
  ) {
    const mid = Math.floor(payload.docs.length / 2);
    const docs1 = payload.docs.slice(0, mid);
    const docs2 = payload.docs.slice(mid);

    const [res1, res2] = await Promise.all([
      runSingleWorker(type, { ...payload, docs: docs1 }),
      runSingleWorker(type, { ...payload, docs: docs2 }),
    ]);

    const combined = [...res1, ...res2];
    combined.sort((a, b) => b.date.localeCompare(a.date));
    return combined;
  }

  if (type === "CALCULATE_LOCAL_HISTORY" && payload.localStorageItems) {
    const keys = Object.keys(payload.localStorageItems);
    if (keys.length > THRESHOLD) {
      const mid = Math.floor(keys.length / 2);
      const items1: any = {};
      const items2: any = {};
      keys
        .slice(0, mid)
        .forEach((k) => (items1[k] = payload.localStorageItems[k]));
      keys
        .slice(mid)
        .forEach((k) => (items2[k] = payload.localStorageItems[k]));

      const [res1, res2] = await Promise.all([
        runSingleWorker(type, { ...payload, localStorageItems: items1 }),
        runSingleWorker(type, { ...payload, localStorageItems: items2 }),
      ]);
      const combined = [...res1, ...res2];
      combined.sort((a, b) => b.date.localeCompare(a.date));
      return combined;
    }
  }

  if (
    type === "CALCULATE_SUMMARY" &&
    payload.students &&
    payload.students.length > THRESHOLD
  ) {
    const mid = Math.floor(payload.students.length / 2);
    const students1 = payload.students.slice(0, mid);
    const students2 = payload.students.slice(mid);

    const [res1, res2] = await Promise.all([
      runSingleWorker(type, { ...payload, students: students1 }),
      runSingleWorker(type, { ...payload, students: students2 }),
    ]);

    return {
      totalCount: res1.totalCount + res2.totalCount,
      totalDayScholar: res1.totalDayScholar + res2.totalDayScholar,
      totalDayBoarder: res1.totalDayBoarder + res2.totalDayBoarder,
      totalFullBoarder: res1.totalFullBoarder + res2.totalFullBoarder,

      presentCount: res1.presentCount + res2.presentCount,
      presentDayScholar: res1.presentDayScholar + res2.presentDayScholar,
      presentDayBoarder: res1.presentDayBoarder + res2.presentDayBoarder,
      presentFullBoarder: res1.presentFullBoarder + res2.presentFullBoarder,

      absentCount: res1.absentCount + res2.absentCount,
      absentDayScholar: res1.absentDayScholar + res2.absentDayScholar,
      absentDayBoarder: res1.absentDayBoarder + res2.absentDayBoarder,
      absentFullBoarder: res1.absentFullBoarder + res2.absentFullBoarder,

      leaveCount: res1.leaveCount + res2.leaveCount,
      leaveDayScholar: res1.leaveDayScholar + res2.leaveDayScholar,
      leaveDayBoarder: res1.leaveDayBoarder + res2.leaveDayBoarder,
      leaveFullBoarder: res1.leaveFullBoarder + res2.leaveFullBoarder,
    };
  }

  return runSingleWorker(type, payload);
};

const runSingleWorker = (type: string, payload: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = (event) => {
      worker.terminate();
      resolve(event.data.payload);
    };
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
    worker.postMessage({ type, payload });
  });
};
