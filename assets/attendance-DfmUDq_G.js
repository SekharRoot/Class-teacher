import{j as O,q as E,y as $,z as B,k as M,d as m,e as q,m as z,n as x,f as G,h as J}from"./firebase-vendor-BRsGfb52.js";import{g as b,e as h,n as g,O as I,h as T,d as K}from"./index-BbsZ7vb9.js";const tt=`
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
`,Q=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),c=t.students.slice(0,o),l=t.students.slice(o),[e,s]=await Promise.all([p(a,{...t,students:c}),p(a,{...t,students:l})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...s.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const o=Math.floor(t.docs.length/2),c=t.docs.slice(0,o),l=t.docs.slice(o),[e,s]=await Promise.all([p(a,{...t,docs:c}),p(a,{...t,docs:l})]),i=[...e,...s];return i.sort((n,r)=>r.date.localeCompare(n.date)),i}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const o=Object.keys(t.localStorageItems);if(o.length>50){const c=Math.floor(o.length/2),l={},e={};o.slice(0,c).forEach(r=>l[r]=t.localStorageItems[r]),o.slice(c).forEach(r=>e[r]=t.localStorageItems[r]);const[s,i]=await Promise.all([p(a,{...t,localStorageItems:l}),p(a,{...t,localStorageItems:e})]),n=[...s,...i];return n.sort((r,d)=>d.date.localeCompare(r.date)),n}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),c=t.students.slice(0,o),l=t.students.slice(o),[e,s]=await Promise.all([p(a,{...t,students:c}),p(a,{...t,students:l})]);return{totalCount:e.totalCount+s.totalCount,totalDayScholar:e.totalDayScholar+s.totalDayScholar,totalDayBoarder:e.totalDayBoarder+s.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+s.totalFullBoarder,presentCount:e.presentCount+s.presentCount,presentDayScholar:e.presentDayScholar+s.presentDayScholar,presentDayBoarder:e.presentDayBoarder+s.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+s.presentFullBoarder,absentCount:e.absentCount+s.absentCount,absentDayScholar:e.absentDayScholar+s.absentDayScholar,absentDayBoarder:e.absentDayBoarder+s.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+s.absentFullBoarder,leaveCount:e.leaveCount+s.leaveCount,leaveDayScholar:e.leaveDayScholar+s.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+s.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+s.leaveFullBoarder}}return p(a,t)},p=(a,t)=>new Promise((u,o)=>{const c=new Blob([tt],{type:"application/javascript"}),l=new Worker(URL.createObjectURL(c));l.onmessage=e=>{l.terminate(),u(e.data.payload)},l.onerror=e=>{l.terminate(),o(e)},l.postMessage({type:a,payload:t})}),ot={async getByDate(a){try{const t=b(),c=["unassigned",...(await T.getAll()).map(s=>s.id)].map(async s=>{const i=m(h,"schools",t,"classes",s,"attendance",a),n=await J(i);return n.exists()?n.data()||{}:{}}),l=await Promise.all(c),e={};return l.forEach(s=>{Object.assign(e,s)}),e}catch(t){return g(t,I.GET,`attendance/${a}`),{}}},async saveByDate(a,t){try{const u=b(),o=n=>Array.isArray(n)?n.map(o):n!==null&&typeof n=="object"?Object.entries(n).reduce((r,[d,y])=>(y!==void 0&&(r[d]=o(y)),r),{}):n,c=o(t),l=await K.getAll(),e={};l.forEach(n=>{e[n.id]=n.classId||"unassigned"});const s={};Object.entries(c).forEach(([n,r])=>{let d=r&&typeof r=="object"?r.classId:null;d||(d=e[n]||"unassigned"),s[d]||(s[d]={}),s[d][n]=r});const i=Object.entries(s).map(async([n,r])=>{const d=m(h,"schools",u,"classes",n,"attendance",a);await G(d,r,{merge:!0})});await Promise.all(i),await this.generateAndSaveSummary(a,c)}catch(u){g(u,I.WRITE,`attendance/${a}`)}},async getSummaryByDate(a){try{const t=b(),u=m(h,"schools",t,"attendance_summaries",a),o=await J(u);return o.exists()?o.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const u=b(),o=await T.getAll(!0),l=(await K.getAll(!0)).filter(S=>S.isActive!==!1),e=o.length,s=l.length;let i=0,n=0,r=0,d=0;const y=o.map(S=>{const C=l.filter(f=>f.classId===S.id),F=C.length,V=C.filter(f=>f.boarderType==="Day Boarder").length,X=C.filter(f=>f.boarderType==="Day Scholar").length,Z=C.filter(f=>f.boarderType==="Full Boarder").length;let A=0,j=0,P=0,_=0,H=0,U=0,Y=0,N=0,W=0,w=0;C.forEach(f=>{const D=t[f.id];let L="";if(D&&(typeof D=="object"&&D!==null?L=D.status||"":L=String(D)),L){w++,n++;const R=L.toLowerCase();R==="present"?(A++,i++,f.boarderType==="Day Boarder"?j++:f.boarderType==="Day Scholar"?P++:f.boarderType==="Full Boarder"&&_++):R==="absent"?(H++,r++,f.boarderType==="Day Boarder"?U++:f.boarderType==="Day Scholar"?Y++:f.boarderType==="Full Boarder"&&N++):R==="leave"&&(W++,d++)}});const et=w>0?Math.round(A/w*100):null;return{classId:S.id,className:`${S.classStandard} ${S.section} (${S.board})`,totalStudents:F,total:F,totalDB:V,totalDS:X,totalBoarder:Z,present:A,presentDB:j,presentDS:P,presentBoarder:_,absent:H,absentDB:U,absentDS:Y,absentBoarder:N,leave:W}}),v=n>0?Math.round(i/n*100):null,k=m(h,"schools",u,"attendance_summaries",a);await G(k,{date:a,schoolId:u,stats:{totalClasses:e,totalStudents:s,todayAttendanceRate:v,todayPresentCount:i,todayTotalMarked:n,todayAbsentCount:r,todayLeaveCount:d},classStats:y,updatedAt:new Date().toISOString()})}catch(u){console.error("Error pre-computing and saving attendance summary:",u)}},async getHistory(a,t,u=30){try{const o=b();let c=[];if(t){const e=O(h,"schools",o,"classes",t,"attendance"),s=E(e,z(B(),"desc"),x(u));c=(await M(s)).docs.map(n=>({id:n.id,data:n.data()}))}else{const i=["unassigned",...(await T.getAll()).map(d=>d.id)].map(async d=>{const y=O(h,"schools",o,"classes",d,"attendance"),v=E(y,z(B(),"desc"),x(u));return(await M(v)).docs.map(S=>({date:S.id,data:S.data()}))}),n=await Promise.all(i),r={};n.forEach(d=>{d.forEach(({date:y,data:v})=>{r[y]||(r[y]={}),Object.assign(r[y],v)})}),c=Object.entries(r).map(([d,y])=>({id:d,data:y}))}return await Q("CALCULATE_HISTORY",{docs:c,classStudentIds:a,selectedClassId:t})}catch(o){return g(o,I.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=b(),c=["unassigned",...(await T.getAll()).map(e=>e.id)].map(async e=>{const s=m(h,"schools",t,"classes",e,"attendance",a);await q(s)}),l=m(h,"schools",t,"attendance_summaries",a);c.push(q(l)),await Promise.all(c)}catch(t){g(t,I.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,u){try{const o=b(),c=O(h,"schools",o,"classes",t,"attendance"),l=E(c,$(B(),">=",`${a}-01`),$(B(),"<=",`${a}-31`)),s=(await M(l)).docs.map(n=>({id:n.id,data:n.data()}));return await Q("CALCULATE_MONTHLY_REPORT",{docs:s,month:a,classId:t,students:u})}catch(o){g(o,I.LIST,"attendance")}}};export{ot as a,Q as r};
