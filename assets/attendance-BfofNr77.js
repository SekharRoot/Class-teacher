import{j as E,q as M,y as q,z as T,k,d as v,e as x,m as z,n as G,f as J,h as K}from"./firebase-vendor-BRsGfb52.js";import{g as b,e as S,n as g,O as I,h as A,d as Q}from"./index-BulJyBc7.js";const st=`
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
`,V=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),l=t.students.slice(0,o),c=t.students.slice(o),[e,s]=await Promise.all([h(a,{...t,students:l}),h(a,{...t,students:c})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...s.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const o=Math.floor(t.docs.length/2),l=t.docs.slice(0,o),c=t.docs.slice(o),[e,s]=await Promise.all([h(a,{...t,docs:l}),h(a,{...t,docs:c})]),u=[...e,...s];return u.sort((n,r)=>r.date.localeCompare(n.date)),u}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const o=Object.keys(t.localStorageItems);if(o.length>50){const l=Math.floor(o.length/2),c={},e={};o.slice(0,l).forEach(r=>c[r]=t.localStorageItems[r]),o.slice(l).forEach(r=>e[r]=t.localStorageItems[r]);const[s,u]=await Promise.all([h(a,{...t,localStorageItems:c}),h(a,{...t,localStorageItems:e})]),n=[...s,...u];return n.sort((r,d)=>d.date.localeCompare(r.date)),n}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),l=t.students.slice(0,o),c=t.students.slice(o),[e,s]=await Promise.all([h(a,{...t,students:l}),h(a,{...t,students:c})]);return{totalCount:e.totalCount+s.totalCount,totalDayScholar:e.totalDayScholar+s.totalDayScholar,totalDayBoarder:e.totalDayBoarder+s.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+s.totalFullBoarder,presentCount:e.presentCount+s.presentCount,presentDayScholar:e.presentDayScholar+s.presentDayScholar,presentDayBoarder:e.presentDayBoarder+s.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+s.presentFullBoarder,absentCount:e.absentCount+s.absentCount,absentDayScholar:e.absentDayScholar+s.absentDayScholar,absentDayBoarder:e.absentDayBoarder+s.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+s.absentFullBoarder,leaveCount:e.leaveCount+s.leaveCount,leaveDayScholar:e.leaveDayScholar+s.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+s.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+s.leaveFullBoarder}}return h(a,t)},h=(a,t)=>new Promise((i,o)=>{const l=new Blob([st],{type:"application/javascript"}),c=new Worker(URL.createObjectURL(l));c.onmessage=e=>{c.terminate(),i(e.data.payload)},c.onerror=e=>{c.terminate(),o(e)},c.postMessage({type:a,payload:t})}),rt={async getByDate(a,t){try{const i=b();let o=[];t&&t.length>0?o=t:o=["unassigned",...(await A.getAll()).map(u=>u.id)];const l=o.map(async s=>{const u=v(S,"schools",i,"classes",s,"attendance",a),n=await K(u);return n.exists()?n.data()||{}:{}}),c=await Promise.all(l),e={};return c.forEach(s=>{Object.assign(e,s)}),e}catch(i){return g(i,I.GET,`attendance/${a}`),{}}},async saveByDate(a,t){try{const i=b(),o=n=>Array.isArray(n)?n.map(o):n!==null&&typeof n=="object"?Object.entries(n).reduce((r,[d,y])=>(y!==void 0&&(r[d]=o(y)),r),{}):n,l=o(t),c=await Q.getAll(),e={};c.forEach(n=>{e[n.id]=n.classId||"unassigned"});const s={};Object.entries(l).forEach(([n,r])=>{let d=r&&typeof r=="object"?r.classId:null;d||(d=e[n]||"unassigned"),s[d]||(s[d]={}),s[d][n]=r});const u=Object.entries(s).map(async([n,r])=>{const d=v(S,"schools",i,"classes",n,"attendance",a);await J(d,r,{merge:!0})});await Promise.all(u),await this.generateAndSaveSummary(a,l)}catch(i){g(i,I.WRITE,`attendance/${a}`)}},async getSummaryByDate(a){try{const t=b(),i=v(S,"schools",t,"attendance_summaries",a),o=await K(i);return o.exists()?o.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const i=b(),l={...await this.getByDate(a),...t},c=await A.getAll(!0),s=(await Q.getAll(!0)).filter(p=>p.isActive!==!1),u=c.length,n=s.length;let r=0,d=0,y=0,m=0;const F=c.map(p=>{const C=s.filter(f=>f.classId===p.id),j=C.length,Z=C.filter(f=>f.boarderType==="Day Boarder").length,tt=C.filter(f=>f.boarderType==="Day Scholar").length,et=C.filter(f=>f.boarderType==="Full Boarder").length;let w=0,P=0,_=0,H=0,U=0,Y=0,N=0,W=0,$=0,R=0;C.forEach(f=>{const D=l[f.id];let B="";if(D&&(typeof D=="object"&&D!==null?B=D.status||"":B=String(D)),B){R++,d++;const O=B.toLowerCase();O==="present"?(w++,r++,f.boarderType==="Day Boarder"?P++:f.boarderType==="Day Scholar"?_++:f.boarderType==="Full Boarder"&&H++):O==="absent"?(U++,y++,f.boarderType==="Day Boarder"?Y++:f.boarderType==="Day Scholar"?N++:f.boarderType==="Full Boarder"&&W++):O==="leave"&&($++,m++)}});const at=R>0?Math.round(w/R*100):null;return{classId:p.id,className:`${p.classStandard} ${p.section} (${p.board})`,totalStudents:j,total:j,totalDB:Z,totalDS:tt,totalBoarder:et,present:w,presentDB:P,presentDS:_,presentBoarder:H,absent:U,absentDB:Y,absentDS:N,absentBoarder:W,leave:$}}),L=d>0?Math.round(r/d*100):null,X=v(S,"schools",i,"attendance_summaries",a);await J(X,{date:a,schoolId:i,stats:{totalClasses:u,totalStudents:n,todayAttendanceRate:L,todayPresentCount:r,todayTotalMarked:d,todayAbsentCount:y,todayLeaveCount:m},classStats:F,updatedAt:new Date().toISOString()})}catch(i){console.error("Error pre-computing and saving attendance summary:",i)}},async getHistory(a,t,i=30){try{const o=b();let l=[];if(t){const e=E(S,"schools",o,"classes",t,"attendance"),s=M(e,z(T(),"desc"),G(i));l=(await k(s)).docs.map(n=>({id:n.id,data:n.data()}))}else{const u=["unassigned",...(await A.getAll()).map(d=>d.id)].map(async d=>{const y=E(S,"schools",o,"classes",d,"attendance"),m=M(y,z(T(),"desc"),G(i));return(await k(m)).docs.map(L=>({date:L.id,data:L.data()}))}),n=await Promise.all(u),r={};n.forEach(d=>{d.forEach(({date:y,data:m})=>{r[y]||(r[y]={}),Object.assign(r[y],m)})}),l=Object.entries(r).map(([d,y])=>({id:d,data:y}))}return await V("CALCULATE_HISTORY",{docs:l,classStudentIds:a,selectedClassId:t})}catch(o){return g(o,I.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=b(),l=["unassigned",...(await A.getAll()).map(e=>e.id)].map(async e=>{const s=v(S,"schools",t,"classes",e,"attendance",a);await x(s)}),c=v(S,"schools",t,"attendance_summaries",a);l.push(x(c)),await Promise.all(l)}catch(t){g(t,I.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,i){try{const o=b(),l=E(S,"schools",o,"classes",t,"attendance"),c=M(l,q(T(),">=",`${a}-01`),q(T(),"<=",`${a}-31`)),s=(await k(c)).docs.map(n=>({id:n.id,data:n.data()}));return await V("CALCULATE_MONTHLY_REPORT",{docs:s,month:a,classId:t,students:i})}catch(o){g(o,I.LIST,"attendance")}}};export{rt as a,V as r};
