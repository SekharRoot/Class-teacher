import{aR as C,O as i,aS as p,aT as v,aU as h,aV as D,aW as f,aX as S,K as b,aY as m,aZ as L,a_ as T,a$ as B,b0 as R}from"./index-Cx3RLrCK.js";const A=`
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
`,I=async(s,t)=>{if(s==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const a=Math.floor(t.students.length/2),r=t.students.slice(0,a),o=t.students.slice(a),[e,n]=await Promise.all([u(s,{...t,students:r}),u(s,{...t,students:o})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...n.entries]}}if(s==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const a=Math.floor(t.docs.length/2),r=t.docs.slice(0,a),o=t.docs.slice(a),[e,n]=await Promise.all([u(s,{...t,docs:r}),u(s,{...t,docs:o})]),d=[...e,...n];return d.sort((y,c)=>c.date.localeCompare(y.date)),d}if(s==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const a=Object.keys(t.localStorageItems);if(a.length>50){const r=Math.floor(a.length/2),o={},e={};a.slice(0,r).forEach(c=>o[c]=t.localStorageItems[c]),a.slice(r).forEach(c=>e[c]=t.localStorageItems[c]);const[n,d]=await Promise.all([u(s,{...t,localStorageItems:o}),u(s,{...t,localStorageItems:e})]),y=[...n,...d];return y.sort((c,g)=>g.date.localeCompare(c.date)),y}}if(s==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const a=Math.floor(t.students.length/2),r=t.students.slice(0,a),o=t.students.slice(a),[e,n]=await Promise.all([u(s,{...t,students:r}),u(s,{...t,students:o})]);return{totalCount:e.totalCount+n.totalCount,totalDayScholar:e.totalDayScholar+n.totalDayScholar,totalDayBoarder:e.totalDayBoarder+n.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+n.totalFullBoarder,presentCount:e.presentCount+n.presentCount,presentDayScholar:e.presentDayScholar+n.presentDayScholar,presentDayBoarder:e.presentDayBoarder+n.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+n.presentFullBoarder,absentCount:e.absentCount+n.absentCount,absentDayScholar:e.absentDayScholar+n.absentDayScholar,absentDayBoarder:e.absentDayBoarder+n.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+n.absentFullBoarder,leaveCount:e.leaveCount+n.leaveCount,leaveDayScholar:e.leaveDayScholar+n.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+n.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+n.leaveFullBoarder}}return u(s,t)},u=(s,t)=>new Promise((l,a)=>{const r=new Blob([A],{type:"application/javascript"}),o=new Worker(URL.createObjectURL(r));o.onmessage=e=>{o.terminate(),l(e.data.payload)},o.onerror=e=>{o.terminate(),a(e)},o.postMessage({type:s,payload:t})}),w={async getByDate(s){try{const t=b(i,"attendance",s),l=await R(t);return l.exists()?l.data():{}}catch(t){f(t,S.GET,`attendance/${s}`)}},async saveByDate(s,t){try{const l=b(i,"attendance",s),a=o=>Array.isArray(o)?o.map(a):o!==null&&typeof o=="object"?Object.entries(o).reduce((e,[n,d])=>(d!==void 0&&(e[n]=a(d)),e),{}):o,r=a(t);await B(l,r,{merge:!0})}catch(l){f(l,S.WRITE,`attendance/${s}`)}},async getHistory(s,t,l=30){try{const a=C(i,"attendance"),r=p(a,L(h(),"desc"),T(l)),e=(await D(r)).docs.map(d=>({id:d.id,data:d.data()}));return await I("CALCULATE_HISTORY",{docs:e,classStudentIds:s,selectedClassId:t})}catch(a){f(a,S.LIST,"attendance")}},async deleteRecord(s){try{const t=b(i,"attendance",s);await m(t)}catch(t){f(t,S.DELETE,`attendance/${s}`)}},async getMonthlyReport(s,t,l){try{const a=C(i,"attendance"),r=p(a,v(h(),">=",`${s}-01`),v(h(),"<=",`${s}-31`)),e=(await D(r)).docs.map(d=>({id:d.id,data:d.data()}));return await I("CALCULATE_MONTHLY_REPORT",{docs:e,month:s,classId:t,students:l})}catch(a){f(a,S.LIST,"attendance")}}};export{w as a,I as r};
