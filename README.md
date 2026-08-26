# Classroom Manager

A full-stack modern React web application for comprehensive school attendance and classroom management.

## Features Overview

- **Role-Based Access Control**: Different views and capabilities for Teachers, Principals, and Admins.
- **Monthly Attendance Sheets**: View, track, and modify attendance in a detailed monthly spreadsheet-style view with smooth vertical and horizontal scrolling.
- **Fast Attendance Taking**: Dedicated 'Take Attendance' mode for teachers to quickly mark students present, absent, or on leave for any specific date.
- **Rich Dashboard & Reports**: Daily status reports, class-wise absentee exports, and real-time statistics generation.
- **PDF Export**: Generate visually rich, styled Monthly Attendance PDF reports natively from the client with custom branding and colored cells.
- **Offline / Demo Mode**: Caches data to IndexedDB enabling offline functionality and preview mode when database connection is unavailable.
- **Performance Optimized**: Built using memoized React components and optimized cell rendering, scaling smoothly even with classes containing 100+ students and tracking 31 days.

## Application Architecture

- **Frontend Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 and Material UI (MUI) v9
- **Database & Backend Services**: Firebase Auth and Firestore (via `@firebase/app`, `@firebase/firestore`).
- **Development Server**: Express + Vite middleware, bundled by ESBuild into a single `dist/server.cjs` for robust deployment.
- **PDF Generation**: `jspdf` and `jspdf-autotable`.
- **State Management & Caching**: Custom React Hooks and IndexedDB via `idb-keyval` for offline persistence.

## Setup & Installation

Follow these steps to set up the project on your own machine after forking the repository:

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm or yarn
- A Firebase project with Firestore and Authentication enabled

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/classroom-manager.git
cd classroom-manager
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory using `.env.example` as a template and provide your Firebase configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start Development Server
```bash
npm run dev
```
The server runs concurrently, serving the Vite development environment on `http://localhost:3000`.

### 6. Production Build
```bash
npm run build
npm start
```
This generates optimized static files in `/dist` and bundles the Express server, running the final app as a production Node.js service.

## Modification & Feature History

- **v1.0.0 (Initial Setup)**: Bootstrapped React + Vite application with Tailwind CSS and MUI layout.
- **v1.1.0 (Firebase Integration)**: Connected Firebase Auth and Firestore database to persist class and student data.
- **v1.2.0 (Offline Mode)**: Integrated `idb-keyval` to support offline caching and simulated data mode when the connection is unavailable.
- **v1.3.0 (Monthly Attendance Engine)**: Added a massive grid-view table allowing users to see and edit student attendance throughout the month.
- **v1.4.0 (Performance Overhaul)**: Refactored the `MonthlyAttendanceSheet` to use memoized components (`MemoizedAttendanceCell`) reducing render times significantly when processing 1,000+ status dropdowns, preventing UI freezing.
- **v1.5.0 (Modular Refactor)**: Decomposed massive monolithic `.tsx` files (e.g., `Attendance.tsx` and `MonthlyAttendanceSheet.tsx`) into small, maintainable, sub-200 line modules under `src/components/attendance/` and `src/components/monthlyAttendance/`.
- **v1.6.0 (Pagination & Load More)**: Added a "Load Older Attendance Data" button to the attendance history view, allowing for historical log retrieval dynamically.
- **v1.7.0 (PDF Export Styling)**: Enhanced `jspdf` generation so that PDF exports feature vibrant, color-coded cells (`P` as Leaf Green Dark, `A` as Dark Red, `L` as Dark Yellow) matching the web interface.
