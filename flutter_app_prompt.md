# Comprehensive Flutter Companion App Development Prompt

Copy the prompt below to instruct an AI assistant or a professional Flutter developer to build the exact mobile companion application for the Classroom and Attendance Management System.

---

```markdown
# Flutter Implementation Prompt: Classroom & Attendance Companion App

## 1. Project Vision & Architecture Overview
You are tasked with building a production-ready, highly reliable, offline-first Android Companion Application using **Flutter** and **Firebase**. This app serves as the mobile companion to an existing multi-tenant School Classroom & Attendance Management System. It must share the exact same Firestore schema, user roles, security constraints, and business logic while offering a beautifully tailored, space-optimized user interface for vertical-screen smartphone and tablet devices.

### Shared Firebase Connection Parameters (CRITICAL):
To ensure real-time synchronization with the existing active school system, initialize your Flutter Firebase configuration using these exact credentials:
- **Project ID**: `gen-lang-client-0585042587`
- **App ID**: `1:726047687888:web:9485a56a4231bce2850ad5`
- **API Key**: `AIzaSyAdx22IS8TqEGXRLHTcFZEgI9Nd7HQFACs`
- **Auth Domain**: `gen-lang-client-0585042587.firebaseapp.com`
- **Storage Bucket**: `gen-lang-client-0585042587.firebasestorage.app`
- **Messaging Sender ID**: `726047687888`
- **Primary Firestore Database ID (MUST USE)**: `ai-studio-classroommanager-8aa49b14-f5c6-4205-880f-741ed7c2c80a` 
  *(Note: This application utilizes multiple named databases. You MUST explicitly point the Firestore instance in Flutter to this specific database ID, rather than defaulting to `(default)`, to ensure that student profiles, classes, summaries, and logs match up perfectly with the web client).*

### Core Architectural Pillars:
1. **Language & Framework**: Dart 3.x, Flutter SDK (targeting Android native, optimized for touch-targets).
2. **State Management**: Use **BLoC** (Business Logic Component) or **Provider** paired with clean architecture separation (Data Layer, Domain Layer, UI Layer).
3. **Database Integration**: Firebase Firestore for real-time remote data persistence, and Firebase Authentication for secure multi-tenant user access.
4. **Offline-First Synchronization (Critical)**: Local cached storage (using **SQLite** or **Hive**) representing a sync queue. The app must allow teachers to take attendance completely offline and queue changes, which synchronize automatically with Firestore when internet access is restored.
5. **Background Calculations**: Utilize **Dart Isolates** for processing heavy calculations (e.g., statistical rollups, filtering, CSV imports, and report parsing) to prevent any UI stutter (60+ FPS performance target).

---

## 2. Shared Firestore Database Schema
The mobile companion app must read and write to the exact same Firestore database structure as the React web app. Ensure all model definitions strictly map to these document types:

### A. School Metadata & Settings
* Path: `/schools/{schoolId}`
* Fields:
  ```json
  {
    "id": "string",
    "name": "string",
    "address": "string",
    "createdAt": "timestamp"
  }
  ```

### B. Student Profiles
* Path: `/schools/{schoolId}/students/{studentId}`
* Fields:
  ```json
  {
    "id": "string",
    "name": "string",
    "rollNumber": "string",
    "classId": "string",
    "isActive": "boolean",
    "boarderType": "string", // "Day Scholar" | "Day Boarder" | "Full Boarder"
    "schoolId": "string"
  }
  ```

### C. Class Documents
* Path: `/schools/{schoolId}/classes/{classId}`
* Fields:
  ```json
  {
    "id": "string",
    "name": "string", // e.g., "CBSE XII PCB3(D)"
    "section": "string",
    "schoolId": "string"
  }
  ```

### D. Class Attendance Log (Daily Record)
* Path: `/schools/{schoolId}/classes/{classId}/attendance/{dateString}` (where `dateString` is `YYYY-MM-DD`)
* Fields (Map of studentId to attendance status detail):
  ```json
  {
    "student_id_123": {
      "status": "string", // "present" | "absent" | "leave"
      "boarderType": "string", // "Day Scholar" | "Day Boarder" | "Full Boarder"
      "timestamp": "timestamp"
    },
    "student_id_456": {
      "status": "string",
      "boarderType": "string",
      "timestamp": "timestamp"
    }
  }
  ```

### E. Class Attendance Daily Summary (Pre-computed Metrics)
* Path: `/schools/{schoolId}/classes/{classId}/attendance_summary/{dateString}`
* Fields:
  ```json
  {
    "classId": "string",
    "date": "string", // YYYY-MM-DD
    "totalCount": "number",
    "markedCount": "number",
    "presentCount": "number",
    "presentDayScholar": "number",
    "presentDayBoarder": "number",
    "presentFullBoarder": "number",
    "absentCount": "number",
    "absentDayScholar": "number",
    "absentDayBoarder": "number",
    "absentFullBoarder": "number",
    "leaveCount": "number",
    "leaveDS": "number",
    "leaveDB": "number",
    "leaveBoarder": "number",
    "attendanceRate": "number", // Float percentage (0 to 100) or null
    "timestamp": "timestamp"
  }
  ```

### F. School-Wide Aggregated Attendance Summary
* Path: `/schools/{schoolId}/attendance_summaries/{dateString}`
* Fields (School-wide aggregation of all classes):
  ```json
  {
    "date": "string", // YYYY-MM-DD
    "totalStudents": "number",
    "totalMarked": "number",
    "totalPresent": "number",
    "totalAbsent": "number",
    "totalLeave": "number",
    "presentDS": "number",
    "presentDB": "number",
    "presentBoarder": "number",
    "absentDS": "number",
    "absentDB": "number",
    "absentBoarder": "number",
    "leaveDS": "number",
    "leaveDB": "number",
    "leaveBoarder": "number",
    "schoolAttendanceRate": "number",
    "timestamp": "timestamp"
  }
  ```

---

## 3. Role-Based Scope & Navigation UI Workflows
The app must support identical role-based restrictions based on the signed-in user's profile metadata (`role` field):

1. **Administrator (Principal / Director)**:
   - Full visibility across all classes in the school.
   - Receives the **Oversight Dashboard** showing complete aggregated statistics, daily attendance summaries, and daily status reports (including interactive table views of attendance rates for boarders and day scholars).
   - Read-only attendance sheet access.
2. **Academic Coordinator (Oversight / Block Head)**:
   - Access to multiple assigned classes (e.g., `CBSE XII PCB1`, `CBSE XII PCB2`).
   - Receives the **Oversight Dashboard** but scoped strictly to authorized class IDs.
3. **Teacher**:
   - Access strictly mapped to their designated classes.
   - Receives the **Teacher Dashboard** focusing on Class Selection, active Student Attendance rosters, and Leave Approvals.
   - Fully authorized to write, update, and sync daily class attendance sheets.
4. **Student**:
   - Read-only dashboard showing their personal profiles, academic status, current school notices, and personal historical attendance logs.

---

## 4. Key Functional Modules to Implement

### A. Space-Optimized Multi-Tenant Login & School Selector
- Implement safe login via email and password using Firebase Authentication.
- Fetch user profiles from `/users/{uid}` containing roles and associated `schoolId`.
- Support multiple schools if the user is a super-admin or manager, allowing seamless swapping of active school IDs dynamically.

### B. Offline Attendance Sheets with Edit Verification
- Provide a responsive list/grid of student cards showing Roll Number, Name, Boarder Type, and status selection button groups (Present / Absent / Leave).
- **Attendance Sheet Lock Logic**:
  - Load the school's historical edit locking rules from the central configuration.
  - Check the Setting: **"Allow Editing Old Attendance Data"**. If disabled, editing past dates is locked (read-only mode), and a message is shown indicating past attendance editing is locked. If enabled, past date updates are allowed.
- Auto-calculate and show live statistics in small chips at the top of the take attendance screen:
  - *Total Students*, *Present* (Day Scholar, Day Boarder, Full Boarder counts), *Absent* (Day Scholar, Day Boarder, Full Boarder counts).
- Ensure that the local database counts remain accurate even when inactive/active students are updated, by validating attendance mapping against the master student roster dynamically.

### C. Offline-First Sync Engine & Conflict Resolution
- Store un-synced operations in a local queue database (SQLite or Hive).
- Use `ConnectivityPlus` to listen to network changes.
- Upon reconnection, push queued operations via batch Firestore writes.
- Implement conflict-resolution logic: If a record has been modified on another device (e.g., by the coordinator) before the local device synced, the record with the latest `timestamp` wins. Maintain detailed local syncing logs.

### D. Specialized Analytics & Reports Exporters
- **Daily Status Report**: A beautifully designed tabular dashboard view displaying each class name, its total strength, present/absent counts mapped by boarder types, and overall class attendance rate.
- **CSV & PDF Exporter**: Integrate native Android sharing/printing APIs. Write utility classes to generate highly structured CSV tables and beautiful PDF documents for monthly records, class-wise absentee records, and custom reports.

### E. Leaves Management
- Form to submit leaves on behalf of students with custom dates.
- Leave status mapping: Once a leave is approved for a given date, that student's daily attendance row is pre-filled with the "Leave" status and highlighted in gold/amber.

---

## 5. UI/UX Design Guidelines (Mobile-First, "Anti-Slop")
Your layout and visual style must be clean, deliberate, and optimized for dense vertical mobile viewport constraints:

### Layout Optimization for Mobile Viewports:
- **No Overflow/Cut-Offs**: Design all student card components to occupy a single line or a compact vertical block. Use responsive horizontal layouts with auto-scaling text or `Flexible`/`Expanded` boundaries to ensure label text never wraps awkwardly or hyphens mid-word inside chips/pills.
- **Bottom Navigation Safe Zones**: Maintain a vertical padding buffer of at least `120px` to `160px` at the end of all scrollable lists. This ensures content, submit buttons, and roster rows are never obscured by floating action buttons, bottom navigation bars, or system bars.
- **Space Optimization with Bottom Sheets**: To maximize vertical viewing space for student rosters and daily status reports, avoid persistent sidebars, nested containers, or heavy header cards. 
- **Action Consolidation**: Consolidate secondary configuration options, class filters, and export buttons under an elegant, slide-up **Bottom Sheet** or **Hamburger Drawer Menu** triggered by a single action button.
- **Tappable Controls**: Set minimum touch targets for all interactive elements to at least `48x48` logical pixels, ensuring safe, error-free tapping on mobile screens.

### Styling & Visual Identity:
- **Color Palette (Warm Refined Light Theme)**: 
  - Background Canvas: Subtle warm off-white (`Color(0xFFFCFBF9)`).
  - Main Surface: Soft warm-gray (`Color(0xFFF4F1EC)`).
  - Primary Accent: Rich amber-orange (`Color(0xFFE05A10)`).
  - Success Indicator: Sophisticated sage green (`Color(0xFF2E7D32)`).
  - Error/Absent Indicator: Clean crimson red (`Color(0xFFC62828)`).
- **Typography & Scale**: Pair display headings using a refined display font (e.g., Playfair Display / Georgia) with clean, high-contrast, highly legible sans-serif body fonts (e.g., Plus Jakarta Sans / Roboto). Apply step scaling mathematically to avoid oversized, dramatic text sizes in dense UI components.
- **Nested Border Radius**: Maintain optical corner nesting balance (Inner Radius = Outer Radius - Padding) for all custom cards, ensuring a flawless visual balance on modern rounded mobile displays.
```

---

## How to Utilize this Prompt
1. Copy the code block above containing the comprehensive instruction set.
2. Paste it directly into your Flutter workspace builder or hand it over to your engineering team to establish a unified codebase roadmap.
3. This prompt ensures that all state configurations, models, logic workflows, and UI constraints perfectly mirror the high performance of this Web client.
