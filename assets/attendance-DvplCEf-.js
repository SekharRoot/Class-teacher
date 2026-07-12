import{aA as b,at as M,Y as h,av as k,aw as $,bc as A,as as F,bd as g,be as I,_ as w,W as v,ax as q,bf as x,bg as z,Z as G,au as J,bh as Z}from"./index-BfjB8gvN.js";const et=`
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
`,K=async(a,t)=>{if(a==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),c=t.students.slice(0,o),l=t.students.slice(o),[e,s]=await Promise.all([p(a,{...t,students:c}),p(a,{...t,students:l})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...s.entries]}}if(a==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const o=Math.floor(t.docs.length/2),c=t.docs.slice(0,o),l=t.docs.slice(o),[e,s]=await Promise.all([p(a,{...t,docs:c}),p(a,{...t,docs:l})]),i=[...e,...s];return i.sort((n,r)=>r.date.localeCompare(n.date)),i}if(a==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const o=Object.keys(t.localStorageItems);if(o.length>50){const c=Math.floor(o.length/2),l={},e={};o.slice(0,c).forEach(r=>l[r]=t.localStorageItems[r]),o.slice(c).forEach(r=>e[r]=t.localStorageItems[r]);const[s,i]=await Promise.all([p(a,{...t,localStorageItems:l}),p(a,{...t,localStorageItems:e})]),n=[...s,...i];return n.sort((r,d)=>d.date.localeCompare(r.date)),n}}if(a==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const o=Math.floor(t.students.length/2),c=t.students.slice(0,o),l=t.students.slice(o),[e,s]=await Promise.all([p(a,{...t,students:c}),p(a,{...t,students:l})]);return{totalCount:e.totalCount+s.totalCount,totalDayScholar:e.totalDayScholar+s.totalDayScholar,totalDayBoarder:e.totalDayBoarder+s.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+s.totalFullBoarder,presentCount:e.presentCount+s.presentCount,presentDayScholar:e.presentDayScholar+s.presentDayScholar,presentDayBoarder:e.presentDayBoarder+s.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+s.presentFullBoarder,absentCount:e.absentCount+s.absentCount,absentDayScholar:e.absentDayScholar+s.absentDayScholar,absentDayBoarder:e.absentDayBoarder+s.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+s.absentFullBoarder,leaveCount:e.leaveCount+s.leaveCount,leaveDayScholar:e.leaveDayScholar+s.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+s.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+s.leaveFullBoarder}}return p(a,t)},p=(a,t)=>new Promise((u,o)=>{const c=new Blob([et],{type:"application/javascript"}),l=new Worker(URL.createObjectURL(c));l.onmessage=e=>{l.terminate(),u(e.data.payload)},l.onerror=e=>{l.terminate(),o(e)},l.postMessage({type:a,payload:t})}),at={async getByDate(a){try{const t=b(),c=["unassigned",...(await w.getAll()).map(s=>s.id)].map(async s=>{const i=v(h,"schools",t,"classes",s,"attendance",a),n=await Z(i);return n.exists()?n.data()||{}:{}}),l=await Promise.all(c),e={};return l.forEach(s=>{Object.assign(e,s)}),e}catch(t){return g(t,I.GET,`attendance/${a}`),{}}},async saveByDate(a,t){try{const u=b(),o=n=>Array.isArray(n)?n.map(o):n!==null&&typeof n=="object"?Object.entries(n).reduce((r,[d,y])=>(y!==void 0&&(r[d]=o(y)),r),{}):n,c=o(t),l=await G.getAll(),e={};l.forEach(n=>{e[n.id]=n.classId||"unassigned"});const s={};Object.entries(c).forEach(([n,r])=>{let d=r&&typeof r=="object"?r.classId:null;d||(d=e[n]||"unassigned"),s[d]||(s[d]={}),s[d][n]=r});const i=Object.entries(s).map(async([n,r])=>{const d=v(h,"schools",u,"classes",n,"attendance",a);await J(d,r,{merge:!0})});await Promise.all(i),await this.generateAndSaveSummary(a,c)}catch(u){g(u,I.WRITE,`attendance/${a}`)}},async getSummaryByDate(a){try{const t=b(),u=v(h,"schools",t,"attendance_summaries",a),o=await Z(u);return o.exists()?o.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(a,t){try{const u=b(),o=await w.getAll(!0),l=(await G.getAll(!0)).filter(S=>S.isActive!==!1),e=o.length,s=l.length;let i=0,n=0,r=0,d=0;const y=o.map(S=>{const m=l.filter(f=>f.classId===S.id),_=m.length,Q=m.filter(f=>f.boarderType==="Day Boarder").length,V=m.filter(f=>f.boarderType==="Day Scholar").length,X=m.filter(f=>f.boarderType==="Full Boarder").length;let L=0,P=0,H=0,U=0,R=0,Y=0,N=0,W=0,O=0,B=0;m.forEach(f=>{const D=t[f.id];let T="";if(D&&(typeof D=="object"&&D!==null?T=D.status||"":T=String(D)),T){B++,n++;const E=T.toLowerCase();E==="present"?(L++,i++,f.boarderType==="Day Boarder"?P++:f.boarderType==="Day Scholar"?H++:f.boarderType==="Full Boarder"&&U++):E==="absent"?(R++,r++,f.boarderType==="Day Boarder"?Y++:f.boarderType==="Day Scholar"?N++:f.boarderType==="Full Boarder"&&W++):E==="leave"&&(O++,d++)}});const tt=B>0?Math.round(L/B*100):null;return{classId:S.id,className:`${S.classStandard} ${S.section} (${S.board})`,totalStudents:_,total:_,totalDB:Q,totalDS:V,totalBoarder:X,presentCount:L,present:L,presentDB:P,presentDS:H,presentBoarder:U,absentCount:R,absent:R,absentDB:Y,absentDS:N,absentBoarder:W,leaveCount:O,leave:O,markedCount:B,attendanceRate:tt}}),C=n>0?Math.round(i/n*100):null,j=v(h,"schools",u,"attendance_summaries",a);await J(j,{date:a,schoolId:u,stats:{totalClasses:e,totalStudents:s,todayAttendanceRate:C,todayPresentCount:i,todayTotalMarked:n,todayAbsentCount:r,todayLeaveCount:d},classStats:y,updatedAt:new Date().toISOString()})}catch(u){console.error("Error pre-computing and saving attendance summary:",u)}},async getHistory(a,t,u=30){try{const o=b();let c=[];if(t){const e=M(h,"schools",o,"classes",t,"attendance"),s=k(e,x(A(),"desc"),z(u));c=(await F(s)).docs.map(n=>({id:n.id,data:n.data()}))}else{const i=["unassigned",...(await w.getAll()).map(d=>d.id)].map(async d=>{const y=M(h,"schools",o,"classes",d,"attendance"),C=k(y,x(A(),"desc"),z(u));return(await F(C)).docs.map(S=>({date:S.id,data:S.data()}))}),n=await Promise.all(i),r={};n.forEach(d=>{d.forEach(({date:y,data:C})=>{r[y]||(r[y]={}),Object.assign(r[y],C)})}),c=Object.entries(r).map(([d,y])=>({id:d,data:y}))}return await K("CALCULATE_HISTORY",{docs:c,classStudentIds:a,selectedClassId:t})}catch(o){return g(o,I.LIST,"attendance"),[]}},async deleteRecord(a){try{const t=b(),c=["unassigned",...(await w.getAll()).map(e=>e.id)].map(async e=>{const s=v(h,"schools",t,"classes",e,"attendance",a);await q(s)}),l=v(h,"schools",t,"attendance_summaries",a);c.push(q(l)),await Promise.all(c)}catch(t){g(t,I.DELETE,`attendance/${a}`)}},async getMonthlyReport(a,t,u){try{const o=b(),c=M(h,"schools",o,"classes",t,"attendance"),l=k(c,$(A(),">=",`${a}-01`),$(A(),"<=",`${a}-31`)),s=(await F(l)).docs.map(n=>({id:n.id,data:n.data()}));return await K("CALCULATE_MONTHLY_REPORT",{docs:s,month:a,classId:t,students:u})}catch(o){g(o,I.LIST,"attendance")}}};export{at as a,K as r};
