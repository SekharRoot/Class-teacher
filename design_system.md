# Classroom Manager - Design System & Architecture

## Overview

A modular, scalable React application for class teachers to manage students, track attendance, and handle leave requests.

## Architecture

- **Framework**: React 18+ with Vite
- **UI Library**: Material UI (MUI) - specifically requested for clean, intuitive Google-like design.
- **Styling**: MUI's `sx` prop and styled components, augmented with Tailwind CSS for utility classes if needed.
- **Database**: Firebase Firestore (NoSQL cloud database)
- **Authentication**: Firebase Auth (Email & Password)
- **Routing**: React Router v6

## Build & Deployment (Critical rules)

- **Build Output**: The application is compiled into a bundled `dist` folder.
- **Artifacts**: Do NOT add `dist/` or `build/` to `.gitignore`. Excluding these causes the AI Studio artifact uploader to fail, returning "Build artifacts are empty."

## Directory Structure

```
/src
  /assets         # Static assets (images, icons)
  /components     # Reusable UI components (Buttons, Modals, Cards)
  /contexts       # React Context providers (AuthContext)
  /features       # Feature-based modules
    /auth         # Login, Registration
    /attendance   # Attendance tracking, lists
    /students     # Student management
  /hooks          # Custom React hooks
  /layouts        # Page layouts (App shell, Navigation)
  /lib            # Utility functions and configurations (Firebase config)
  /pages          # Route components (Home, Login, Dashboard)
  /types          # TypeScript interfaces and types
```

## Features Roadmap

1. **Phase 1 (Current)**:
   - Firebase setup & App structure.
   - Authentication (Email/Password Login).
   - Clean, intuitive Attendance tracking interface for today's date.
   - Class Management (Add/Edit/Remove classes) with cascading delete option.
   - Global Settings page for application preferences.
2. **Phase 2 (Upcoming)**:
   - Leave requests management.
   - Student roster management (Add/Edit/Remove students).
3. **Phase 3 (Upcoming)**:
   - Monthly attendance reports generation.
   - Export to CSV/PDF functionality.

## UI/UX Guidelines

- **Mobile First**: All views must be responsive and optimized for mobile touch interactions (large buttons, readable text).
- **Color Palette**: MUI default theme (Primary: Blue, Secondary: Pink/Purple), customized for a professional academic look.
- **Typography**: Roboto (MUI default) for clean readability.
- **Components**: Use MUI's DataGrid or List components for student rosters. Use Cards for dashboard summaries.
