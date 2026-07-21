import{W as q,V as x,a1 as Z,ab as H,X as z,Q as M,R as tt,a6 as et,a2 as st,T as J,U as at}from"./firebase-vendor-CtvHyiMR.js";import{g as k,e as R,o as N,O as P,h as Y,d as nt}from"./index-DpU2Wtu1.js";const it=`
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
`,ot=async(n,t)=>{if(n==="CALCULATE_MONTHLY_REPORT"&&t.students&&t.students.length>50){const a=Math.floor(t.students.length/2),o=t.students.slice(0,a),r=t.students.slice(a),[e,s]=await Promise.all([E(n,{...t,students:o}),E(n,{...t,students:r})]);return{month:e.month,classId:e.classId,entries:[...e.entries,...s.entries]}}if(n==="CALCULATE_HISTORY"&&t.docs&&t.docs.length>50){const a=Math.floor(t.docs.length/2),o=t.docs.slice(0,a),r=t.docs.slice(a),[e,s]=await Promise.all([E(n,{...t,docs:o}),E(n,{...t,docs:r})]),d=[...e,...s];return d.sort((h,l)=>l.date.localeCompare(h.date)),d}if(n==="CALCULATE_LOCAL_HISTORY"&&t.localStorageItems){const a=Object.keys(t.localStorageItems);if(a.length>50){const o=Math.floor(a.length/2),r={},e={};a.slice(0,o).forEach(l=>r[l]=t.localStorageItems[l]),a.slice(o).forEach(l=>e[l]=t.localStorageItems[l]);const[s,d]=await Promise.all([E(n,{...t,localStorageItems:r}),E(n,{...t,localStorageItems:e})]),h=[...s,...d];return h.sort((l,i)=>i.date.localeCompare(l.date)),h}}if(n==="CALCULATE_SUMMARY"&&t.students&&t.students.length>50){const a=Math.floor(t.students.length/2),o=t.students.slice(0,a),r=t.students.slice(a),[e,s]=await Promise.all([E(n,{...t,students:o}),E(n,{...t,students:r})]);return{totalCount:e.totalCount+s.totalCount,totalDayScholar:e.totalDayScholar+s.totalDayScholar,totalDayBoarder:e.totalDayBoarder+s.totalDayBoarder,totalFullBoarder:e.totalFullBoarder+s.totalFullBoarder,presentCount:e.presentCount+s.presentCount,presentDayScholar:e.presentDayScholar+s.presentDayScholar,presentDayBoarder:e.presentDayBoarder+s.presentDayBoarder,presentFullBoarder:e.presentFullBoarder+s.presentFullBoarder,absentCount:e.absentCount+s.absentCount,absentDayScholar:e.absentDayScholar+s.absentDayScholar,absentDayBoarder:e.absentDayBoarder+s.absentDayBoarder,absentFullBoarder:e.absentFullBoarder+s.absentFullBoarder,leaveCount:e.leaveCount+s.leaveCount,leaveDayScholar:e.leaveDayScholar+s.leaveDayScholar,leaveDayBoarder:e.leaveDayBoarder+s.leaveDayBoarder,leaveFullBoarder:e.leaveFullBoarder+s.leaveFullBoarder}}return E(n,t)},E=(n,t)=>new Promise(f=>{try{const a=new Blob([it],{type:"application/javascript"}),o=new Worker(URL.createObjectURL(a));o.onmessage=r=>{o.terminate(),f(r.data.payload)},o.onerror=r=>{console.warn("Web worker error. Falling back to main-thread calculation.",r),o.terminate();try{const e=lt(n,t);f(e)}catch(e){console.error("Local main-thread calculation fallback failed:",e),f(rt(n))}},o.postMessage({type:n,payload:t})}catch(a){console.warn("Failed to initialize Web Worker (sandboxing/CSP restriction?). Falling back to main-thread calculation.",a);try{const o=lt(n,t);f(o)}catch(o){console.error("Local main-thread calculation fallback failed:",o),f(rt(n))}}}),rt=n=>n==="CALCULATE_HISTORY"||n==="CALCULATE_LOCAL_HISTORY"?[]:n==="CALCULATE_SUMMARY"?{totalCount:0,totalDayScholar:0,totalDayBoarder:0,totalFullBoarder:0,presentCount:0,presentDayScholar:0,presentDayBoarder:0,presentFullBoarder:0,absentCount:0,absentDayScholar:0,absentDayBoarder:0,absentFullBoarder:0,leaveCount:0,leaveDayScholar:0,leaveDayBoarder:0,leaveFullBoarder:0}:n==="CALCULATE_DASHBOARD_STATS"?{stats:{totalClasses:0,totalStudents:0,todayAttendanceRate:null,todayPresentCount:0,todayTotalMarked:0},classStats:[]}:n==="CALCULATE_MONTHLY_REPORT"?{month:"",classId:"",entries:[]}:null;function lt(n,t){if(n==="CALCULATE_HISTORY"){const{docs:f,classStudentIds:a,selectedClassId:o}=t,r=[],e=a?new Set(a):null;for(const s of f){const{id:d,data:h}=s;let l=0,i=0,S=0;if(h)for(const[y,u]of Object.entries(h)){const b=typeof u=="object"&&u!==null,p=(b?u.status:u||"").toLowerCase(),C=b?u.classId:null;if(o){if(C){if(C!==o)continue}else if(e&&!e.has(y))continue}p==="present"?l++:p==="absent"?i++:p==="leave"&&(S++,i++)}r.push({date:d,present:l,absent:i,leave:S})}return r.sort((s,d)=>d.date.localeCompare(s.date)),r}if(n==="CALCULATE_LOCAL_HISTORY"){const{localStorageItems:f,classStudentIds:a,selectedClassId:o}=t,r=[],e=a?new Set(a):null;for(const[s,d]of Object.entries(f))if(s.startsWith("attendance_")){const h=s.replace("attendance_",""),l=JSON.parse(d||"{}");let i=0,S=0,y=0;for(const[u,b]of Object.entries(l)){const p=typeof b=="object"&&b!==null,C=(p?b.status:b||"").toLowerCase(),I=p?b.classId:null;if(o){if(I){if(I!==o)continue}else if(e&&!e.has(u))continue}C==="present"?i++:C==="absent"?S++:C==="leave"&&(y++,S++)}r.push({date:h,present:i,absent:S,leave:y})}return r.sort((s,d)=>d.date.localeCompare(s.date)),r}if(n==="CALCULATE_SUMMARY"){const{students:f,attendance:a,selectedClassId:o}=t,r=f.filter(c=>(!o||c.classId===o)&&c.isActive!==!1),e=r.length,s=r.filter(c=>c.boarderType==="Day Scholar").length,d=r.filter(c=>c.boarderType==="Day Boarder").length,h=r.filter(c=>c.boarderType==="Full Boarder").length,l=r.filter(c=>{const m=a[c.id];return(typeof m=="object"&&m!==null?m.status:m||"").toLowerCase()==="present"}),i=l.length,S=l.filter(c=>c.boarderType==="Day Scholar").length,y=l.filter(c=>c.boarderType==="Day Boarder").length,u=l.filter(c=>c.boarderType==="Full Boarder").length,b=r.filter(c=>{const m=a[c.id],F=(typeof m=="object"&&m!==null?m.status:m||"").toLowerCase();return F==="absent"||F==="leave"}),p=b.length,C=b.filter(c=>c.boarderType==="Day Scholar").length,I=b.filter(c=>c.boarderType==="Day Boarder").length,O=b.filter(c=>c.boarderType==="Full Boarder").length,D=r.filter(c=>{const m=a[c.id];return(typeof m=="object"&&m!==null?m.status:m||"").toLowerCase()==="leave"}),w=D.length,L=D.filter(c=>c.boarderType==="Day Scholar").length,T=D.filter(c=>c.boarderType==="Day Boarder").length,g=D.filter(c=>c.boarderType==="Full Boarder").length;return{totalCount:e,totalDayScholar:s,totalDayBoarder:d,totalFullBoarder:h,presentCount:i,presentDayScholar:S,presentDayBoarder:y,presentFullBoarder:u,absentCount:p,absentDayScholar:C,absentDayBoarder:I,absentFullBoarder:O,leaveCount:w,leaveDayScholar:L,leaveDayBoarder:T,leaveFullBoarder:g}}if(n==="CALCULATE_DASHBOARD_STATS"){const{classes:f,students:a,authorizedClassIds:o,todayRecords:r}=t,e=f.filter(u=>o.includes(u.id)),s=a.filter(u=>u.classId&&o.includes(u.classId)&&u.isActive!==!1),d=e.length,h=s.length;let l=0,i=0;r&&Object.keys(r).forEach(u=>{if(!s.some(I=>I.id===u))return;const p=r[u];let C="";typeof p=="object"&&p!==null?C=p.status||"":C=String(p),C&&(i++,C.toLowerCase()==="present"&&l++)});const S=i>0?Math.round(l/i*100):null,y=e.map(u=>{const b=s.filter(L=>L.classId===u.id),p=b.length;let C=0,I=0,O=0,D=0;b.forEach(L=>{const T=r?r[L.id]:null;let g="";if(T&&(typeof T=="object"&&T!==null?g=T.status||"":g=String(T)),g){D++;const c=g.toLowerCase();c==="present"?C++:c==="absent"?I++:c==="leave"&&O++}});const w=D>0?Math.round(C/D*100):null;return{classId:u.id,className:u.classStandard+" "+u.section+" ("+u.board+")",totalStudents:p,presentCount:C,absentCount:I,leaveCount:O,markedCount:D,attendanceRate:w}});return{stats:{totalClasses:d,totalStudents:h,todayAttendanceRate:S,todayPresentCount:l,todayTotalMarked:i},classStats:y}}if(n==="CALCULATE_MONTHLY_REPORT"){const{docs:f,month:a,classId:o,students:r}=t,e=[],s=f.filter(y=>y.id.startsWith(a)),d=s.length,h=new Set;s.forEach(y=>{y.data&&Object.entries(y.data).forEach(([u,b])=>{var I;const C=typeof b=="object"&&b!==null?b.classId:null;(C===o||!C&&((I=r.find(O=>O.id===u))==null?void 0:I.classId)===o)&&h.add(u)})});const l=r.filter(y=>y.classId===o&&y.isActive!==!1),i=new Set(l.map(y=>y.id)),S=Array.from(new Set([...Array.from(h),...Array.from(i)]));for(const y of S){const u=r.find(g=>g.id===y);let b=0,p=0,C=0,I=!1;for(const g of s){const c=g.data[y];if(!c)continue;I=!0;const m=(typeof c=="object"?c.status:c||"").toLowerCase();m==="present"?b++:m==="absent"?p++:m==="leave"&&(C++,p++)}if(!(u?u.isActive!==!1:!1)&&!I)continue;let D="",w="";if(u){const g=u.firstName+" "+u.lastName;u.isActive===!1?D=g+" (Profile Removed)":D=g,w=u.rollNumber||""}else D="[Profile Removed]",w="-";const L=b,T=d>0?L/d*100:0;e.push({studentId:y,studentName:D,rollNumber:w,present:b,absent:p,leave:C,totalDays:d,attendancePercentage:Math.round(T*10)/10})}return{month:a,classId:o,entries:e}}throw new Error(`Unknown calculation type: ${n}`)}const ht={async getByDate(n,t){try{const f=k();let a=[];t&&t.length>0?a=t:a=["unassigned",...(await Y.getAll()).map(d=>d.id)];const o=a.map(async s=>{const d=M(R,"schools",f,"classes",s,"attendance",n),h=await at(d);return h.exists()?h.data()||{}:{}}),r=await Promise.all(o),e={};return r.forEach(s=>{Object.assign(e,s)}),e}catch(f){return N(f,P.GET,`attendance/${n}`),{}}},async saveByDate(n,t,f=!1){try{const a=k(),o=l=>Array.isArray(l)?l.map(o):l!==null&&typeof l=="object"?Object.entries(l).reduce((i,[S,y])=>(y!==void 0&&(i[S]=o(y)),i),{}):l,r=o(t),e=await nt.getAll(),s={};e.forEach(l=>{s[l.id]=l.classId||"unassigned"});const d={};Object.entries(r).forEach(([l,i])=>{let S=i&&typeof i=="object"?i.classId:null;S||(S=s[l]||"unassigned"),d[S]||(d[S]={}),d[S][l]=i});const h=Object.entries(d).map(async([l,i])=>{const S=M(R,"schools",a,"classes",l,"attendance",n);await J(S,i,{merge:!0})});await Promise.all(h),f||await this.generateAndSaveSummary(n,r)}catch(a){N(a,P.WRITE,`attendance/${n}`)}},async saveSummaryOnly(n,t,f){try{const a=k(),o=M(R,"schools",a,"attendance_summaries",n);await J(o,{date:n,schoolId:a,stats:t,classStats:f,updatedAt:new Date().toISOString()},{merge:!0})}catch(a){console.warn("Direct summary write failed:",a)}},async getSummaryByDate(n){try{const t=k(),f=M(R,"schools",t,"attendance_summaries",n),a=await at(f);return a.exists()?a.data():null}catch(t){return console.warn("Summary fetch failed or skipped:",t),null}},async generateAndSaveSummary(n,t){try{const f=k(),o={...await this.getByDate(n),...t},r=await Y.getAll(!0),e=await nt.getAll(!0);let s=0,d=0,h=0,l=0;const i=r.map(p=>{const C=e.filter(v=>v.classId===p.id&&v.isActive!==!1),I=new Set;Object.entries(o).forEach(([v,A])=>{var _;const B=typeof A=="object"&&A!==null?A.classId:null;(B===p.id||!B&&((_=e.find(dt=>dt.id===v))==null?void 0:_.classId)===p.id)&&I.add(v)});const O=new Set(C.map(v=>v.id)),D=Array.from(new Set([...Array.from(I),...Array.from(O)])),w=D.length,L=(v,A)=>{const j=e.find(B=>B.id===v);return j?j.boarderType:A&&typeof A=="object"&&A.boarderType?A.boarderType:"Day Scholar"},T=D.filter(v=>L(v,o[v])==="Day Boarder").length,g=D.filter(v=>L(v,o[v])==="Day Scholar").length,c=D.filter(v=>L(v,o[v])==="Full Boarder").length;let m=0,F=0,G=0,Q=0,W=0,V=0,X=0,K=0,$=0,U=0;D.forEach(v=>{const A=o[v];let j="";A&&(typeof A=="object"&&A!==null?j=A.status||"":j=String(A));const B=L(v,A);if(j){U++,d++;const _=j.toLowerCase();_==="present"?(m++,s++,B==="Day Boarder"?F++:B==="Day Scholar"?G++:B==="Full Boarder"&&Q++):_==="absent"?(W++,h++,B==="Day Boarder"?V++:B==="Day Scholar"?X++:B==="Full Boarder"&&K++):_==="leave"&&($++,l++)}});const ct=U>0?Math.round(m/U*100):null;return{classId:p.id,className:`${p.classStandard} ${p.section} (${p.board})`,totalStudents:w,total:w,totalDB:T,totalDS:g,totalBoarder:c,present:m,presentCount:m,presentDB:F,presentDS:G,presentBoarder:Q,absent:W,absentCount:W,absentDB:V,absentDS:X,absentBoarder:K,leave:$,leaveCount:$,markedCount:U,attendanceRate:ct}}),S=d>0?Math.round(s/d*100):null,y=r.length,u=i.reduce((p,C)=>p+C.totalStudents,0),b=M(R,"schools",f,"attendance_summaries",n);await J(b,{date:n,schoolId:f,stats:{totalClasses:y,totalStudents:u,todayAttendanceRate:S,todayPresentCount:s,todayTotalMarked:d,todayAbsentCount:h,todayLeaveCount:l},classStats:i,updatedAt:new Date().toISOString()})}catch(f){console.error("Error pre-computing and saving attendance summary:",f)}},async getHistory(n,t,f=30){try{const a=k();let o=[];if(t){const e=q(R,"schools",a,"classes",t,"attendance"),s=x(e,et(H(),"desc"),st(f));o=(await z(s)).docs.map(h=>({id:h.id,data:h.data()}))}else{const d=["unassigned",...(await Y.getAll()).map(i=>i.id)].map(async i=>{const S=q(R,"schools",a,"classes",i,"attendance"),y=x(S,et(H(),"desc"),st(f));return(await z(y)).docs.map(b=>({date:b.id,data:b.data()}))}),h=await Promise.all(d),l={};h.forEach(i=>{i.forEach(({date:S,data:y})=>{l[S]||(l[S]={}),Object.assign(l[S],y)})}),o=Object.entries(l).map(([i,S])=>({id:i,data:S}))}return await ot("CALCULATE_HISTORY",{docs:o,classStudentIds:n,selectedClassId:t})}catch(a){return N(a,P.LIST,"attendance"),[]}},async deleteRecord(n){try{const t=k(),o=["unassigned",...(await Y.getAll()).map(e=>e.id)].map(async e=>{const s=M(R,"schools",t,"classes",e,"attendance",n);await tt(s)}),r=M(R,"schools",t,"attendance_summaries",n);o.push(tt(r)),await Promise.all(o)}catch(t){N(t,P.DELETE,`attendance/${n}`)}},async getMonthlyReport(n,t,f){try{const a=k(),o=q(R,"schools",a,"classes",t,"attendance"),r=x(o,Z(H(),">=",`${n}-01`),Z(H(),"<=",`${n}-31`)),s=(await z(r)).docs.map(h=>({id:h.id,data:h.data()}));return await ot("CALCULATE_MONTHLY_REPORT",{docs:s,month:n,classId:t,students:f})}catch(a){N(a,P.LIST,"attendance")}}};export{ht as a,ot as r};
