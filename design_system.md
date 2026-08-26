# School Management System - Design System & Architecture

## Overview

A modular, scalable React application for managing student profiles, class rosters, attendance, leave requests, and academic coordination.

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
- **PWA Configuration**: `vite-plugin-pwa` is configured with dynamic `start_url` and `scope` to ensure proper relative path serving on both cloud servers and subdirectory-based static hosts like GitHub Pages. This prevents 404 errors when opening the installed application.

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
3. **Phase 3 (Completed & Integrated)**:
   - Monthly attendance reports generation.
   - Export to CSV/PDF functionality.
4. **Phase 4 (Database Administration)**:
   - **Databases Management Tab**: Located within the **Admin Panel**, allowing administrators to monitor document metrics, export full school backups (as `.json` downloads), import/merge backups, and safely execute multi-step database deletion purges.
   - **Dynamic Multi-tenant Support**: Restricts school administrators to viewing and managing only their respective school records, while allowing platform-wide owner roles (including the developer user `sekhar.root@gmail.com`) to manage all school database tenants, including the **Default School**.

## UI/UX Guidelines

- **Mobile First**: All views must be responsive and optimized for mobile touch interactions (large buttons, readable text).
- **Floating Navigation Safety**: All content-rendering screens MUST preserve a generous bottom spacing margin (at least 120px to 160px) or include a dedicated vertical spacing element at the bottom to ensure no interactive elements, tables, forms, or actions get hidden under the floating bottom navigation bar.
- **Color Palette & Attendance Tokens**:
  - Theme: Modern MUI palette with full Dark Mode and Light Mode support.
  - Present (P): Leaf Green (`#1b5e20` light / `#81c784` dark).
  - Absent (A): Dark Red (`#b71c1c` light / `#ef5350` dark).
  - Leave (L): Warm Orange (`#e65100` light / `#ffb74d` dark).
  - Unmarked (-): Neutral grey / disabled background.
- **Typography**: Roboto and system font stack for clean readability and high contrast (WCAG AA).
- **Reports & PDF Exports**: Consolidated under the Reports tab with deferred on-demand calculation and modular metric toggles (TA, % TA, PCA, TCA, % TCA).
- **Workflow Reference**: For full change-control rules and operational standards, refer to `WORKFLOW.md` and `AGENTS.md`.

