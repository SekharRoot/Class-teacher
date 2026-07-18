import{W as k,V as j,a1 as x,aa as w,X as F,Q as b,R as z,a5 as G,a2 as J,T as P,U as Q}from"./firebase-vendor-D-4sD5tx.js";import{g as p,e as y,o as I,O as g,h as R,d as V}from"./index-RH04ZdG7.js";const at=`
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
    
    // docs is an array of { id, data } where id is date YYYY-MM-DD
    const monthDocs = docs.filter(doc => doc.id.startsWith(month));
    const totalWorkingDays = monthDocs.length;

    // Collect all student IDs who have attendance records in this class during this month
    const studentIdsInDocs = new Set();
    monthDocs.forEach(doc => {
      if (doc.data) {
        Object.entries(doc.data).forEach(([studentId, val]) => {
          const isObj = typeof val === 'object' && val !== null;
          const recordClassId = isObj ? val.classId : null;
          if (recordClassId === classId || (!recordClassId && students.find(s => s.id === studentId)?.classId === classId)) {
            studentIdsInDocs.add(studentId);
          }
        });
      }
    });

    // We want to list all active students of this class, PLUS any student who has attendance logs in this class for this month (even if inactive/deleted)
    const activeClassStudents = students.filter(s => s.classId === classId && s.isActive !== false);
    const activeStudentIds = new Set(activeClassStudents.map(s => s.id));
    
    // Combine active students and student IDs found in attendance records
    const allUniqueStudentIds = Array.from(new Set([...Array.from(studentIdsInDocs), ...Array.from(activeStudentIds)]));

    for (const studentId of allUniqueStudentIds) {
      // Find student in our list (even if inactive)
      const student = students.find(s => s.id === studentId);
      
      let present = 0;
      let absent = 0;
      let leave = 0;
      let hasAnyRecord = false;

      for (const doc of monthDocs) {
        const val = doc.data[studentId];
        if (!val) continue;

        hasAnyRecord = true;
        const status = (typeof val === 'object' ? val.status : val || '').toLowerCase();
        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else if (status === 'leave') { leave++; absent++; }
      }

      // If they are inactive (soft-deleted) AND they have no records for this month, skip them to keep the list clean.
      // But if they are active, OR they are inactive but have attendance records, include them!
      const isActive = student ? (student.isActive !== false) : false;
      if (!isActive && !hasAnyRecord) {
        continue;
      }

      let studentName = "";
      let rollNumber = "";
      if (student) {
        const baseName = student.firstName + ' ' + student.lastName;
        if (student.isActive === false) {
          studentName = baseName + ' (Profile Removed)';
        } else {
          studentName = baseName;
        }
        rollNumber = student.rollNumber || "";
      } else {
        studentName = '[Profile Removed]';
        rollNumber = "-";
      }

      const totalAttended = present;
      const percentage = totalWorkingDays > 0 ? (totalAttended / totalWorkingDays) * 100 : 0;

      reportEntries.push({
        studentId: studentId,
        studentName: studentName,
        rollNumber: rollNumber,
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
`,X=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),r=t.students.slice(0,s),l=t.students.slice(s),[e,n]=await Promise.all([m(a,{...t,students:r}),m(a,{...t,students:l})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...n.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const s=Math.floor(t.docs.length/2),r=t.docs.slice(0,s),l=t.docs.slice(s),[e,n]=await Promise.all([m(a,{...t,docs:r}),m(a,{...t,docs:l})]),u=[...e,...n];return u.sort((f,o)=>o.date.localeCompare(f.date)),u}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const s=Object.keys(t.localStorageItems);if(s.length>50){const r=Math.floor(s.length/2),l={},e={};s.slice(0,r).forEach(o=>l[o]=t.localStorageItems[o]),s.slice(r).forEach(o=>e[o]=t.localStorageItems[o]);const[n,u]=await Promise.all([m(a,{...t,localStorageItems:l}),m(a,{...t,localStorageItems:e})]),f=[...n,...u];return f.sort((o,c)=>c.date.localeCompare(o.date)),f}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),r=t.students.slice(0,s),l=t.students.slice(s),[e,n]=await Promise.all([m(a,{...t,students:r}),m(a,{...t,students:l})]);return{totalCount:e.totalCount+n.totalCount,totalDayScholar:e.totalDayScholar+n.totalDayScholar,totalDayBoarder:e.totalDayBoarder+n.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+n.totalFullBoarder,presentCount:e.presentCount+n.presentCount,presentDayScholar:e.presentDayScholar+n.presentDayScholar,presentDayBoarder:e.presentDayBoarder+n.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+n.presentFullBoarder,absentCount:e.absentCount+n.absentCount,absentDayScholar:e.absentDayScholar+n.absentDayScholar,absentDayBoarder:e.absentDayBoarder+n.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+n.absentFullBoarder,leaveCount:e.leaveCount+n.leaveCount,leaveDayScholar:e.leaveDayScholar+n.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+n.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+n.leaveFullBoarder}}return m(a,t)},m=(a,t)=>new Promise((d,s)=>{const r=new Blob([at],{type:"application/javascript"}),l=new Worker(URL.createObjectURL(r));l.onmessage=e=>{l.terminate(),d(e.data.payload)},l.onerror=e=>{l.terminate(),s(e)},l.postMessage({type:a,payload:t})}),rt={async getByDate(a,t){try{const d=p();let s=[];t&&t.length>0?s=t:s=["unassigned",...(await R.getAll()).map(u=>u.id)];const r=s.map(async n=>{const u=b(y,"schools",d,"classes",n,"attendance",a),f=await Q(u);return f.exists()?f.data()||{}:{}}),l=await Promise.all(r),e={};return l.forEach(n=>{Object.assign(e,n)}),e}catch(d){return I(d,g.GET,`attendance/${a}`),{}}},async saveByDate(a,t,d=!1){try{const s=p(),r=o=>Array.isArray(o)?o.map(r):o!==null&&typeof o=="object"?Object.entries(o).reduce((c,[i,S])=>(S!==void 0&&(c[i]=r(S)),c),{}):o,l=r(t),e=await V.getAll(),n={};e.forEach(o=>{n[o.id]=o.classId||"unassigned"});const u={};Object.entries(l).forEach(([o,c])=>{let i=c&&typeof c=="object"?c.classId:null;i||(i=n[o]||"unassigned"),u[i]||(u[i]={}),u[i][o]=c});const f=Object.entries(u).map(async([o,c])=>{const i=b(y,"schools",s,"classes",o,"attendance",a);await P(i,c,{merge:!0})});await Promise.all(f),d||await this.generateAndSaveSummary(a,l)}catch(s){I(s,g.WRITE,`attendance/${a}`)}},async saveSummaryOnly(a,t,d){try{const s=p(),r=b(y,"schools",s,"attendance_summaries",a);await P(r,{date:a,schoolId:s,stats:t,classStats:d,updatedAt:new Date().toISOString()},{merge:!0})}catch(s){console.warn("Direct summary write failed:",s)}},async getSummaryByDate(a){try{const t=p(),d=b(y,"schools",t,"attendance_summaries",a),s=await Q(d);return s.exists()?s.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const d=p(),r={...await this.getByDate(a),...t},l=await R.getAll(!0),n=(await V.getAll(!0)).filter(v=>v.isActive!==!1),u=l.length,f=n.length;let o=0,c=0,i=0,S=0;const N=l.map(v=>{const C=n.filter(h=>h.classId===v.id),_=C.length,Z=C.filter(h=>h.boarderType==="Day Boarder").length,tt=C.filter(h=>h.boarderType==="Day Scholar").length,et=C.filter(h=>h.boarderType==="Full Boarder").length;let B=0,H=0,U=0,Y=0,O=0,W=0,$=0,q=0,E=0,T=0;C.forEach(h=>{const D=r[h.id];let A="";if(D&&(typeof D=="object"&&D!==null?A=D.status||"":A=String(D)),A){T++,c++;const M=A.toLowerCase();M==="present"?(B++,o++,h.boarderType==="Day Boarder"?H++:h.boarderType==="Day Scholar"?U++:h.boarderType==="Full Boarder"&&Y++):M==="absent"?(O++,i++,h.boarderType==="Day Boarder"?W++:h.boarderType==="Day Scholar"?$++:h.boarderType==="Full Boarder"&&q++):M==="leave"&&(E++,S++)}});const st=T>0?Math.round(B/T*100):null;return{classId:v.id,className:`${v.classStandard} ${v.section} (${v.board})`,totalStudents:_,total:_,totalDB:Z,totalDS:tt,totalBoarder:et,present:B,presentCount:B,presentDB:H,presentDS:U,presentBoarder:Y,absent:O,absentCount:O,absentDB:W,absentDS:$,absentBoarder:q,leave:E,leaveCount:E,markedCount:T,attendanceRate:st}}),L=c>0?Math.round(o/c*100):null,K=b(y,"schools",d,"attendance_summaries",a);await P(K,{date:a,schoolId:d,stats:{totalClasses:u,totalStudents:f,todayAttendanceRate:L,todayPresentCount:o,todayTotalMarked:c,todayAbsentCount:i,todayLeaveCount:S},classStats:N,updatedAt:new Date().toISOString()})}catch(d){console.error("Error pre-computing and saving attendance summary:",d)}},async getHistory(a,t,d=30){try{const s=p();let r=[];if(t){const e=k(y,"schools",s,"classes",t,"attendance"),n=j(e,G(w(),"desc"),J(d));r=(await F(n)).docs.map(f=>({id:f.id,data:f.data()}))}else{const u=["unassigned",...(await R.getAll()).map(c=>c.id)].map(async c=>{const i=k(y,"schools",s,"classes",c,"attendance"),S=j(i,G(w(),"desc"),J(d));return(await F(S)).docs.map(L=>({date:L.id,data:L.data()}))}),f=await Promise.all(u),o={};f.forEach(c=>{c.forEach(({date:i,data:S})=>{o[i]||(o[i]={}),Object.assign(o[i],S)})}),r=Object.entries(o).map(([c,i])=>({id:c,data:i}))}return await X("CALCULATE_HISTORY",{docs:r,classStudentIds:a,selectedClassId:t})}catch(s){return I(s,g.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=p(),r=["unassigned",...(await R.getAll()).map(e=>e.id)].map(async e=>{const n=b(y,"schools",t,"classes",e,"attendance",a);await z(n)}),l=b(y,"schools",t,"attendance_summaries",a);r.push(z(l)),await Promise.all(r)}catch(t){I(t,g.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,d){try{const s=p(),r=k(y,"schools",s,"classes",t,"attendance"),l=j(r,x(w(),">=",`${a}-01`),x(w(),"<=",`${a}-31`)),n=(await F(l)).docs.map(f=>({id:f.id,data:f.data()}));return await X("CALCULATE_MONTHLY_REPORT",{docs:n,month:a,classId:t,students:d})}catch(s){I(s,g.LIST,"attendance")}}};export{rt as a,X as r};
