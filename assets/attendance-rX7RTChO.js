import{W as P,V as N,a1 as Q,aa as E,X as _,Q as D,R as V,a5 as X,a2 as K,T as H,U as Z}from"./firebase-vendor-D-4sD5tx.js";import{g as C,e as m,o as B,O as L,h as j,d as tt}from"./index-Dmc5wXOw.js";const ct=`
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
`,et=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),o=t.students.slice(0,s),l=t.students.slice(s),[e,n]=await Promise.all([v(a,{...t,students:o}),v(a,{...t,students:l})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...n.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const s=Math.floor(t.docs.length/2),o=t.docs.slice(0,s),l=t.docs.slice(s),[e,n]=await Promise.all([v(a,{...t,docs:o}),v(a,{...t,docs:l})]),d=[...e,...n];return d.sort((f,r)=>r.date.localeCompare(f.date)),d}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const s=Object.keys(t.localStorageItems);if(s.length>50){const o=Math.floor(s.length/2),l={},e={};s.slice(0,o).forEach(r=>l[r]=t.localStorageItems[r]),s.slice(o).forEach(r=>e[r]=t.localStorageItems[r]);const[n,d]=await Promise.all([v(a,{...t,localStorageItems:l}),v(a,{...t,localStorageItems:e})]),f=[...n,...d];return f.sort((r,i)=>i.date.localeCompare(r.date)),f}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),o=t.students.slice(0,s),l=t.students.slice(s),[e,n]=await Promise.all([v(a,{...t,students:o}),v(a,{...t,students:l})]);return{totalCount:e.totalCount+n.totalCount,totalDayScholar:e.totalDayScholar+n.totalDayScholar,totalDayBoarder:e.totalDayBoarder+n.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+n.totalFullBoarder,presentCount:e.presentCount+n.presentCount,presentDayScholar:e.presentDayScholar+n.presentDayScholar,presentDayBoarder:e.presentDayBoarder+n.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+n.presentFullBoarder,absentCount:e.absentCount+n.absentCount,absentDayScholar:e.absentDayScholar+n.absentDayScholar,absentDayBoarder:e.absentDayBoarder+n.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+n.absentFullBoarder,leaveCount:e.leaveCount+n.leaveCount,leaveDayScholar:e.leaveDayScholar+n.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+n.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+n.leaveFullBoarder}}return v(a,t)},v=(a,t)=>new Promise((c,s)=>{const o=new Blob([ct],{type:"application/javascript"}),l=new Worker(URL.createObjectURL(o));l.onmessage=e=>{l.terminate(),c(e.data.payload)},l.onerror=e=>{l.terminate(),s(e)},l.postMessage({type:a,payload:t})}),ut={async getByDate(a,t){try{const c=C();let s=[];t&&t.length>0?s=t:s=["unassigned",...(await j.getAll()).map(d=>d.id)];const o=s.map(async n=>{const d=D(m,"schools",c,"classes",n,"attendance",a),f=await Z(d);return f.exists()?f.data()||{}:{}}),l=await Promise.all(o),e={};return l.forEach(n=>{Object.assign(e,n)}),e}catch(c){return B(c,L.GET,`attendance/${a}`),{}}},async saveByDate(a,t,c=!1){try{const s=C(),o=r=>Array.isArray(r)?r.map(o):r!==null&&typeof r=="object"?Object.entries(r).reduce((i,[h,b])=>(b!==void 0&&(i[h]=o(b)),i),{}):r,l=o(t),e=await tt.getAll(),n={};e.forEach(r=>{n[r.id]=r.classId||"unassigned"});const d={};Object.entries(l).forEach(([r,i])=>{let h=i&&typeof i=="object"?i.classId:null;h||(h=n[r]||"unassigned"),d[h]||(d[h]={}),d[h][r]=i});const f=Object.entries(d).map(async([r,i])=>{const h=D(m,"schools",s,"classes",r,"attendance",a);await H(h,i,{merge:!0})});await Promise.all(f),c||await this.generateAndSaveSummary(a,l)}catch(s){B(s,L.WRITE,`attendance/${a}`)}},async saveSummaryOnly(a,t,c){try{const s=C(),o=D(m,"schools",s,"attendance_summaries",a);await H(o,{date:a,schoolId:s,stats:t,classStats:c,updatedAt:new Date().toISOString()},{merge:!0})}catch(s){console.warn("Direct summary write failed:",s)}},async getSummaryByDate(a){try{const t=C(),c=D(m,"schools",t,"attendance_summaries",a),s=await Z(c);return s.exists()?s.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const c=C(),o={...await this.getByDate(a),...t},l=await j.getAll(!0),e=await tt.getAll(!0);let n=0,d=0,f=0,r=0;const i=l.map(p=>{const M=e.filter(u=>u.classId===p.id&&u.isActive!==!1),Y=new Set;Object.entries(o).forEach(([u,y])=>{var g;const S=typeof y=="object"&&y!==null?y.classId:null;(S===p.id||!S&&((g=e.find(lt=>lt.id===u))==null?void 0:g.classId)===p.id)&&Y.add(u)});const st=new Set(M.map(u=>u.id)),A=Array.from(new Set([...Array.from(Y),...Array.from(st)])),W=A.length,T=(u,y)=>{const I=e.find(S=>S.id===u);return I?I.boarderType:y&&typeof y=="object"&&y.boarderType?y.boarderType:"Day Scholar"},at=A.filter(u=>T(u,o[u])==="Day Boarder").length,nt=A.filter(u=>T(u,o[u])==="Day Scholar").length,ot=A.filter(u=>T(u,o[u])==="Full Boarder").length;let R=0,$=0,q=0,x=0,k=0,z=0,G=0,J=0,F=0,O=0;A.forEach(u=>{const y=o[u];let I="";y&&(typeof y=="object"&&y!==null?I=y.status||"":I=String(y));const S=T(u,y);if(I){O++,d++;const g=I.toLowerCase();g==="present"?(R++,n++,S==="Day Boarder"?$++:S==="Day Scholar"?q++:S==="Full Boarder"&&x++):g==="absent"?(k++,f++,S==="Day Boarder"?z++:S==="Day Scholar"?G++:S==="Full Boarder"&&J++):g==="leave"&&(F++,r++)}});const rt=O>0?Math.round(R/O*100):null;return{classId:p.id,className:`${p.classStandard} ${p.section} (${p.board})`,totalStudents:W,total:W,totalDB:at,totalDS:nt,totalBoarder:ot,present:R,presentCount:R,presentDB:$,presentDS:q,presentBoarder:x,absent:k,absentCount:k,absentDB:z,absentDS:G,absentBoarder:J,leave:F,leaveCount:F,markedCount:O,attendanceRate:rt}}),h=d>0?Math.round(n/d*100):null,b=l.length,U=i.reduce((p,M)=>p+M.totalStudents,0),w=D(m,"schools",c,"attendance_summaries",a);await H(w,{date:a,schoolId:c,stats:{totalClasses:b,totalStudents:U,todayAttendanceRate:h,todayPresentCount:n,todayTotalMarked:d,todayAbsentCount:f,todayLeaveCount:r},classStats:i,updatedAt:new Date().toISOString()})}catch(c){console.error("Error pre-computing and saving attendance summary:",c)}},async getHistory(a,t,c=30){try{const s=C();let o=[];if(t){const e=P(m,"schools",s,"classes",t,"attendance"),n=N(e,X(E(),"desc"),K(c));o=(await _(n)).docs.map(f=>({id:f.id,data:f.data()}))}else{const d=["unassigned",...(await j.getAll()).map(i=>i.id)].map(async i=>{const h=P(m,"schools",s,"classes",i,"attendance"),b=N(h,X(E(),"desc"),K(c));return(await _(b)).docs.map(w=>({date:w.id,data:w.data()}))}),f=await Promise.all(d),r={};f.forEach(i=>{i.forEach(({date:h,data:b})=>{r[h]||(r[h]={}),Object.assign(r[h],b)})}),o=Object.entries(r).map(([i,h])=>({id:i,data:h}))}return await et("CALCULATE_HISTORY",{docs:o,classStudentIds:a,selectedClassId:t})}catch(s){return B(s,L.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=C(),o=["unassigned",...(await j.getAll()).map(e=>e.id)].map(async e=>{const n=D(m,"schools",t,"classes",e,"attendance",a);await V(n)}),l=D(m,"schools",t,"attendance_summaries",a);o.push(V(l)),await Promise.all(o)}catch(t){B(t,L.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,c){try{const s=C(),o=P(m,"schools",s,"classes",t,"attendance"),l=N(o,Q(E(),">=",`${a}-01`),Q(E(),"<=",`${a}-31`)),n=(await _(l)).docs.map(f=>({id:f.id,data:f.data()}));return await et("CALCULATE_MONTHLY_REPORT",{docs:n,month:a,classId:t,students:c})}catch(s){B(s,L.LIST,"attendance")}}};export{ut as a,et as r};
