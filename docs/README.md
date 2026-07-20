# Learner's Roadmap: Rebuilding the Classroom Manager App

Welcome to the builder's roadmap! Since this application was "vibe coded" dynamically, this documentation serves as your structured, fully fledged educational blueprint. It is designed specifically for someone new to programming to rebuild this exact application from scratch using a modern, industry-standard tech stack.

## 🎯 Rebuilding Stack
We will transition from our current React/Vite (client-side + Firestore) architecture to a robust, professional full-stack architecture:
- **Frontend Framework**: **Next.js** (React) with App Router.
- **Database & Backend**: **Supabase** (PostgreSQL) for relational query power and authentication.
- **UI & Styling Library**: **Material UI (MUI)** for clean, corporate, accessible layouts.
- **Design Patterns**: Multi-tenant database design, Optimistic UI updates, and robust Offline-First synchronizations.

---

## 🗺️ Roadmap Modules

This documentation is split into self-contained, sequential learning chapters. Each chapter contains detailed code explanations, complete schemas, and architectural patterns:

### [1. Database Architecture & Schema Design](./01-architecture-and-schema.md)
*Learn how to map our nested Firestore structure into a relational PostgreSQL database on Supabase.*
- Comparative review of Document vs. Relational models.
- Complete `SQL DDL` scripts for all tables: `schools`, `classes`, `students`, `attendance_records`, `leave_requests`, and `user_profiles`.
- Foreign key relations, Cascade Deletes, and indexing strategies.

### [2. Authentication, Roles, & Multi-Tenancy](./02-auth-and-multi-tenancy.md)
*Set up secure accounts, school-specific boundaries, and role-based permissions.*
- Setting up Supabase Auth.
- Defining application-wide user roles: `Owner`, `Admin`, `Academic Coordinator`, `Class Teacher`.
- Writing Row-Level Security (RLS) policies in PostgreSQL to restrict data view boundaries cleanly.
- Implementing a multi-tenant tenant selector in React.

### [3. The Offline-First Sync Engine](./03-offline-sync-engine.md)
*Master the crown jewel of our architecture: how to keep the app 100% usable in offline school environments.*
- Setting up local browser storage caches with IndexedDB and `idb`.
- Designing an offline change queue to queue student creations, updates, and deletions.
- Implementing a conflict resolution engine with automated reconciliation strategies.
- Merging local pending modifications with background database refreshes (preventing reload data loss).

### [4. Building Responsive Material UI Interfaces](./04-frontend-modules.md)
*Translate our custom Tailwind interfaces into gorgeous, professional Material UI components.*
- Setting up a Material UI Theme (colors, margins, and typography).
- Rebuilding the main views:
  1. **Dashboard**: Daily status charts, stats widgets, and PWA quick metrics.
  2. **Attendance Grid**: Custom status toggle selectors (Present/Absent/Leave) with optimistic state management.
  3. **Student Profile Manager**: Fully featured forms, paginated profiles, search, and image storage.
  4. **Leave Requests Panel**: Apply and approve/reject leave requests.

### [5. Next.js App Router Integration](./05-full-stack-integration.md)
*Tie it all together into a production-ready server-side rendered application.*
- Creating Next.js Server Actions and API routes.
- Connecting client-side React components to Supabase.
- Packaging as a progressive web app (PWA) with background service workers.
- Deployment best practices on Vercel and Supabase.

---

## 🚀 How to Use this Roadmap
1. Read **Chapter 1** to provision your database inside Supabase.
2. Build your Next.js project skeleton and configure authentication as shown in **Chapter 2**.
3. Implement the Offline/Online state synchronizer of **Chapter 3** to handle reliable caching.
4. Design your UI layout using Material UI in **Chapter 4**.
5. Hook up live API handlers and deploy your creation using **Chapter 5**.

Let's begin the journey! Move on to [Chapter 1: Database Architecture & Schema Design](./01-architecture-and-schema.md).
