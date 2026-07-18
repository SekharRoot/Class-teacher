import{W as k,V as F,a1 as q,aa as A,X as j,Q as v,R as z,a5 as G,a2 as J,T as _,U as Q}from"./firebase-vendor-D-4sD5tx.js";import{g as b,e as S,o as g,O as I,h as R,d as V}from"./index-BJbRsS_c.js";const at=`
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
`,X=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),r=t.students.slice(0,s),l=t.students.slice(s),[e,o]=await Promise.all([p(a,{...t,students:r}),p(a,{...t,students:l})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...o.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const s=Math.floor(t.docs.length/2),r=t.docs.slice(0,s),l=t.docs.slice(s),[e,o]=await Promise.all([p(a,{...t,docs:r}),p(a,{...t,docs:l})]),i=[...e,...o];return i.sort((f,n)=>n.date.localeCompare(f.date)),i}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const s=Object.keys(t.localStorageItems);if(s.length>50){const r=Math.floor(s.length/2),l={},e={};s.slice(0,r).forEach(n=>l[n]=t.localStorageItems[n]),s.slice(r).forEach(n=>e[n]=t.localStorageItems[n]);const[o,i]=await Promise.all([p(a,{...t,localStorageItems:l}),p(a,{...t,localStorageItems:e})]),f=[...o,...i];return f.sort((n,c)=>c.date.localeCompare(n.date)),f}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const s=Math.floor(t.students.length/2),r=t.students.slice(0,s),l=t.students.slice(s),[e,o]=await Promise.all([p(a,{...t,students:r}),p(a,{...t,students:l})]);return{totalCount:e.totalCount+o.totalCount,totalDayScholar:e.totalDayScholar+o.totalDayScholar,totalDayBoarder:e.totalDayBoarder+o.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+o.totalFullBoarder,presentCount:e.presentCount+o.presentCount,presentDayScholar:e.presentDayScholar+o.presentDayScholar,presentDayBoarder:e.presentDayBoarder+o.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+o.presentFullBoarder,absentCount:e.absentCount+o.absentCount,absentDayScholar:e.absentDayScholar+o.absentDayScholar,absentDayBoarder:e.absentDayBoarder+o.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+o.absentFullBoarder,leaveCount:e.leaveCount+o.leaveCount,leaveDayScholar:e.leaveDayScholar+o.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+o.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+o.leaveFullBoarder}}return p(a,t)},p=(a,t)=>new Promise((d,s)=>{const r=new Blob([at],{type:"application/javascript"}),l=new Worker(URL.createObjectURL(r));l.onmessage=e=>{l.terminate(),d(e.data.payload)},l.onerror=e=>{l.terminate(),s(e)},l.postMessage({type:a,payload:t})}),rt={async getByDate(a,t){try{const d=b();let s=[];t&&t.length>0?s=t:s=["unassigned",...(await R.getAll()).map(i=>i.id)];const r=s.map(async o=>{const i=v(S,"schools",d,"classes",o,"attendance",a),f=await Q(i);return f.exists()?f.data()||{}:{}}),l=await Promise.all(r),e={};return l.forEach(o=>{Object.assign(e,o)}),e}catch(d){return g(d,I.GET,`attendance/${a}`),{}}},async saveByDate(a,t,d=!1){try{const s=b(),r=n=>Array.isArray(n)?n.map(r):n!==null&&typeof n=="object"?Object.entries(n).reduce((c,[u,h])=>(h!==void 0&&(c[u]=r(h)),c),{}):n,l=r(t),e=await V.getAll(),o={};e.forEach(n=>{o[n.id]=n.classId||"unassigned"});const i={};Object.entries(l).forEach(([n,c])=>{let u=c&&typeof c=="object"?c.classId:null;u||(u=o[n]||"unassigned"),i[u]||(i[u]={}),i[u][n]=c});const f=Object.entries(i).map(async([n,c])=>{const u=v(S,"schools",s,"classes",n,"attendance",a);await _(u,c,{merge:!0})});await Promise.all(f),d||await this.generateAndSaveSummary(a,l)}catch(s){g(s,I.WRITE,`attendance/${a}`)}},async saveSummaryOnly(a,t,d){try{const s=b(),r=v(S,"schools",s,"attendance_summaries",a);await _(r,{date:a,schoolId:s,stats:t,classStats:d,updatedAt:new Date().toISOString()},{merge:!0})}catch(s){console.warn("Direct summary write failed:",s)}},async getSummaryByDate(a){try{const t=b(),d=v(S,"schools",t,"attendance_summaries",a),s=await Q(d);return s.exists()?s.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const d=b(),r={...await this.getByDate(a),...t},l=await R.getAll(!0),o=(await V.getAll(!0)).filter(m=>m.isActive!==!1),i=l.length,f=o.length;let n=0,c=0,u=0,h=0;const P=l.map(m=>{const C=o.filter(y=>y.classId===m.id),H=C.length,Z=C.filter(y=>y.boarderType==="Day Boarder").length,tt=C.filter(y=>y.boarderType==="Day Scholar").length,et=C.filter(y=>y.boarderType==="Full Boarder").length;let B=0,U=0,Y=0,N=0,O=0,W=0,$=0,x=0,E=0,T=0;C.forEach(y=>{const D=r[y.id];let w="";if(D&&(typeof D=="object"&&D!==null?w=D.status||"":w=String(D)),w){T++,c++;const M=w.toLowerCase();M==="present"?(B++,n++,y.boarderType==="Day Boarder"?U++:y.boarderType==="Day Scholar"?Y++:y.boarderType==="Full Boarder"&&N++):M==="absent"?(O++,u++,y.boarderType==="Day Boarder"?W++:y.boarderType==="Day Scholar"?$++:y.boarderType==="Full Boarder"&&x++):M==="leave"&&(E++,h++)}});const st=T>0?Math.round(B/T*100):null;return{classId:m.id,className:`${m.classStandard} ${m.section} (${m.board})`,totalStudents:H,total:H,totalDB:Z,totalDS:tt,totalBoarder:et,present:B,presentCount:B,presentDB:U,presentDS:Y,presentBoarder:N,absent:O,absentCount:O,absentDB:W,absentDS:$,absentBoarder:x,leave:E,leaveCount:E,markedCount:T,attendanceRate:st}}),L=c>0?Math.round(n/c*100):null,K=v(S,"schools",d,"attendance_summaries",a);await _(K,{date:a,schoolId:d,stats:{totalClasses:i,totalStudents:f,todayAttendanceRate:L,todayPresentCount:n,todayTotalMarked:c,todayAbsentCount:u,todayLeaveCount:h},classStats:P,updatedAt:new Date().toISOString()})}catch(d){console.error("Error pre-computing and saving attendance summary:",d)}},async getHistory(a,t,d=30){try{const s=b();let r=[];if(t){const e=k(S,"schools",s,"classes",t,"attendance"),o=F(e,G(A(),"desc"),J(d));r=(await j(o)).docs.map(f=>({id:f.id,data:f.data()}))}else{const i=["unassigned",...(await R.getAll()).map(c=>c.id)].map(async c=>{const u=k(S,"schools",s,"classes",c,"attendance"),h=F(u,G(A(),"desc"),J(d));return(await j(h)).docs.map(L=>({date:L.id,data:L.data()}))}),f=await Promise.all(i),n={};f.forEach(c=>{c.forEach(({date:u,data:h})=>{n[u]||(n[u]={}),Object.assign(n[u],h)})}),r=Object.entries(n).map(([c,u])=>({id:c,data:u}))}return await X("CALCULATE_HISTORY",{docs:r,classStudentIds:a,selectedClassId:t})}catch(s){return g(s,I.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=b(),r=["unassigned",...(await R.getAll()).map(e=>e.id)].map(async e=>{const o=v(S,"schools",t,"classes",e,"attendance",a);await z(o)}),l=v(S,"schools",t,"attendance_summaries",a);r.push(z(l)),await Promise.all(r)}catch(t){g(t,I.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,d){try{const s=b(),r=k(S,"schools",s,"classes",t,"attendance"),l=F(r,q(A(),">=",`${a}-01`),q(A(),"<=",`${a}-31`)),o=(await j(l)).docs.map(f=>({id:f.id,data:f.data()}));return await X("CALCULATE_MONTHLY_REPORT",{docs:o,month:a,classId:t,students:d})}catch(s){g(s,I.LIST,"attendance")}}};export{rt as a,X as r};
