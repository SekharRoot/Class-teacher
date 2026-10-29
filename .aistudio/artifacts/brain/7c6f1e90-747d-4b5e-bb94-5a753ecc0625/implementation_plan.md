# School Management System — Industry-Standard Bug Remediation Plan

This plan details the root-cause analysis and non-breaking, industry-standard engineering fixes for critical bugs across attendance aggregation, offline cache synchronization, Firestore atomic transactions, monthly report computation, and dashboard state resolution—while strictly preserving existing workflows, navigation structures, and performance optimizations.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> All confirmed choices below preserve existing workflows, bottom navigation hierarchy, deferred report calculations, and multi-tenant data isolation without introducing schema changes or altering user-facing layouts.

- **Confirmed Decision 1 — Comprehensive Scope**: Remediate all identified bugs across the Firestore API layer, local/offline cache synchronization, report calculation engines, and UI state hooks.
- **Confirmed Decision 2 — Unsynced Local Edit Protection**: When switching between the Attendance and Dashboard views with unsynced daily attendance marks, preserve unsynced local edits (`unsynced_<date>`) in both `localStorage` and IndexedDB until the user explicitly syncs to the server.
- **Confirmed Decision 3 — Background Summary Sync on Monthly Edits**: When saving cell modifications in the Monthly Attendance Sheet, automatically trigger background daily summary recalculation for affected dates so the Oversight Dashboard and Daily Status Report remain immediately accurate.

---

## 1. Overview & Core Concept

- **What It Does**: Eliminates silent data loss, race conditions, stale dashboard metrics, and batch write limit overflows across daily attendance marking, monthly sheet editing, student profile lifecycle management, and historical reporting.
- **Target Audience / Persona**: School Administrators, Principals, Academic Coordinators, and Class Teachers relying on accurate real-time and offline-capable attendance registers and cumulative academic reports.
- **Key Value**: Guarantees deterministic data integrity between IndexedDB, `localStorage`, and Firestore without sacrificing the 100ms instant-mount cache architecture or existing query optimizations.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Daily Attendance & Tab Switching**: A teacher marks attendance (online or offline). Both `localStorage` and IndexedDB immediately store the enriched state alongside an `unsynced_<date>` marker. Switching to the Dashboard reflects the teacher's latest local marks rather than overwriting them with stale server data. When `Sync` is triggered, all pending offline dates are snapshotted safely and committed atomically.
  2. **Monthly Attendance Sheet Cell Editing**: When a teacher or administrator modifies cells in the Monthly Attendance Sheet and saves, the daily class attendance documents update in a batch and trigger background summary recalculation for each modified date, ensuring school-wide KPIs and absentee exports stay in sync.
  3. **Student Lifecycle & Class Transfers**: Moving a student between classes or schools, or deactivating/restoring a student profile, executes via atomic Firestore `writeBatch` commits with accurate `deactivatedAt` timestamps so historical monthly reports (`active_entire_month`, `active_in_month`, `inactive`) classify students accurately.
  4. **Oversight Dashboard & Leave Counts**: Opening the Dashboard lazy-loads the leave requests collection if not yet hydrated and removes duplicate action buttons, ensuring accurate pending leave counters on first render.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean, high-craftsmanship enterprise educational dashboard preserving the existing Material UI light/dark theme architecture.
  - *Color Palette & Mood*: Preserves theme-aware surface tokens (`--background`, `--primary`, `--accent`) and strict attendance semantic standards:
    - **Present (P)**: Leaf Green (`#1b5e20` light / `#81c784` dark)
    - **Absent (A)**: Dark Red (`#b71c1c` light / `#ef5350` dark)
    - **Leave (L)**: Warm Orange (`#e65100` light / `#ffb74d` dark)
    - **Unmarked (-)**: Neutral grey / disabled tone
  - *Typography & Hierarchy*: Retains `Plus Jakarta Sans` and `Outfit` display/body pairings with `tabular-nums` alignment across attendance counters, roll numbers, and percentage matrices.
  - *Component Styling & Layout*: Single-elevation bordered cards (`10px` radius), strict 3-tab primary bottom navigation (**Dashboard**, **Attendance**, **Profiles**), and a mandatory `120px–160px` bottom spacing buffer across all scrollable views.
- **Interactive Feedback & Motion**: Preserves instant local state updates, clear toast feedback on sync completion or fallback queueing, and non-blocking background summary updates.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Awaiting Class-Level Summary Promises & Filtering Metadata Keys**
  - *Chosen Approach*: Explicitly `await Promise.all(classSummaryPromises)` before committing class-level summary batches and aggregating school-wide totals, while filtering reserved metadata fields (`_meta`, `dayReason`, `dayReasonType`, `isHoliday`, `updatedAt`, `date`, `classId`) out of student ID iterations.
  - *Why*: Previously, `classSummaryPromises` was mapped asynchronously without being awaited before reading `newlyComputedClassStats`, causing class summary writes to be skipped due to a race condition and allowing metadata keys to be misclassified as `"unassigned"` students.
  - *Alternatives Considered*: Synchronous sequential per-class reads were rejected because parallel `Promise.all` preserves fast execution while fixing the race condition.

- **Decision 2: Unified Dual-Layer Cache Synchronization & Safe Key Iteration**
  - *Chosen Approach*: Mirror unsynced daily attendance updates to both `localStorage` (`attendance_<date>`) and IndexedDB, guard Dashboard background fetches from overwriting dates flagged with `unsynced_<date>`, and snapshot `Object.keys(localStorage)` before iterating and removing synced keys.
  - *Why*: Previously, marking attendance wrote only to IndexedDB while offline readers and sync loops read from `localStorage`, and mutating `localStorage` inside a live `for (let i = 0; i < localStorage.length; i++)` loop shifted key indices and skipped pending offline registers.
  - *Alternatives Considered*: Relying solely on IndexedDB was passed over because synchronous `localStorage` reads power the zero-flicker initial mount in the daily attendance hook.

- **Decision 3: Atomic Student Class/School Transfers & Operation-Aware Batch Chunking**
  - *Chosen Approach*: Replace sequential `deleteDoc` + `setDoc` calls during class/school transfers and profile updates with atomic `writeBatch` commits, and size batch chunks by actual write operation count ($\le 225$ student moves per batch, well under Firestore's 500-write ceiling).
  - *Why*: Sequential delete-then-create risks permanent student record loss if connectivity drops mid-flight, and a 500-student loop where each class move emits 2 operations (`delete` + `set`) exceeds Firestore's 500-operation batch limit.
  - *Alternatives Considered*: Firestore `runTransaction` per student was rejected for bulk operations because `writeBatch` supports up to 500 operations in a single network round-trip.

- **Decision 4: Parallel Class Lookup & Lifecycle Timestamp Integrity**
  - *Chosen Approach*: Replace the invalid single-segment `collectionGroup` `documentId() == studentId` query with parallel `Promise.all` document lookups across the school's class subcollections (after checking the in-memory cache), and record/clear `deactivatedAt` consistently across soft-delete, batch-delete, and restore operations.
  - *Why*: Firestore requires a full document path when filtering `collectionGroup` by `documentId()`, causing the previous query to throw an exception on every cache miss and fall back to a slow sequential loop. Setting `deactivatedAt` on soft-delete ensures historical monthly reports accurately include or exclude students by deactivation date.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        UI & View Layer (React + MUI)                    │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  │
│  │  Oversight &        │  │  Daily & Monthly    │  │  Student        │  │
│  │  Teacher Dashboards │  │  Attendance Views   │  │  Profiles &     │  │
│  │  (Lazy Leave Sync,  │  │  (Unsynced Guard,   │  │  Reports Engine │  │
│  │   Deduped Actions)  │  │   Safe Key Loop)    │  │  (WD Overrides) │  │
│  └──────────┬──────────┘  └──────────┬──────────┘  └────────┬────────┘  │
└─────────────┼────────────────────────┼──────────────────────┼───────────┘
              │                        │                      │
              ▼                        ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    State & Hook Coordination Layer                      │
│  ┌──────────────────────────────┐    ┌───────────────────────────────┐  │
│  │  Attendance Data & Actions   │    │  DataContext & Profile Hooks  │  │
│  │  • Dual Cache Write (IDB+LS) │    │  • Atomic Offline Queue Sync  │  │
│  │  • Unsynced Guard on Fetch   │    │  • Debounced Search & Filter  │  │
│  └──────────────┬───────────────┘    └───────────────┬───────────────┘  │
└─────────────────┼────────────────────────────────────┼──────────────────┘
                  │                                    │
                  ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 Firestore API & Calculation Engine Layer                │
│  ┌──────────────────────────────┐    ┌───────────────────────────────┐  │
│  │  Attendance & Report Engine  │    │  Student Lifecycle & Lookup   │  │
│  │  • Await Promise.all(stats)  │    │  • Atomic Move (Delete + Set) │  │
│  │  • Metadata Key Exclusion    │    │  • Op-Count Batch Chunking    │  │
│  │  • Monthly Edit Summary Sync │    │  • Parallel Class Resolution  │  │
│  │  • Entry-Level WD Override   │    │  • Consistent deactivatedAt   │  │
│  └──────────────────────────────┘    └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Daily Attendance Cache (`attendance_<YYYY-MM-DD>` & `unsynced_<YYYY-MM-DD>`)**:
  - Synchronized across both `localStorage` and IndexedDB whenever attendance is marked locally.
  - Protected by the `unsynced_<YYYY-MM-DD>` flag so background reads in the Dashboard or Attendance tabs never clobber pending local edits before server synchronization.
- **Attendance Summaries (`attendance_summaries/{date}`, `absentee_summaries/{date}`, `classes/{classId}/attendance_summary/{date}`)**:
  - Computed only after `await Promise.all(classSummaryPromises)` resolves all per-class merges, strictly excluding reserved document metadata keys (`_meta`, `dayReason`, `dayReasonType`, `isHoliday`, `updatedAt`, `date`, `classId`).
  - Triggered in the background when monthly sheet cell modifications are saved so daily summaries stay consistent with monthly grid edits.
- **Student Lifecycle Records (`schools/{schoolId}/classes/{classId}/students/{studentId}`)**:
  - Soft deletion (`deleteStudent`, `batchDelete`) stamps `isActive: false` and `deactivatedAt: <ISO timestamp>`.
  - Restoration (`restore`) stamps `isActive: true` and clears `deactivatedAt: null`.
  - Class or school transfers execute `batch.delete(oldRef)` and `batch.set(newRef, mergedData)` within the same atomic `writeBatch`, chunked safely so total operations per batch never exceed 450.

### Interactive Component & State Mapping

1. **Attendance Marking & Offline Sync Flow**:
   - *Interaction*: User marks individual or batch student attendance, or clicks `Sync`.
   - *State Mutation*: `updateLocalCache` writes enriched records to both `cache.set` and `localStorage.setItem` and flags `unsynced_<date>`. On `syncAttendance`, pending `unsynced_*` keys are snapshotted into a static array prior to iteration, synced via `saveByDate`, and cleaned up without index shifting.
2. **Monthly Sheet Modification Flow**:
   - *Interaction*: User modifies attendance cells in the Monthly Attendance Sheet and saves changes.
   - *State Mutation*: `saveMonthlyModifications` commits the modified dates to Firestore, updates the monthly sheet cache, and invokes `generateAndSaveSummary` for each modified date so dashboard metrics and absentee exports reflect the changes immediately.
3. **Monthly Report & Worker Calculation Flow**:
   - *Interaction*: User triggers `Calculate & Preview` or `Download PDF Report` in the Reports tab (with optional Working Days override).
   - *State Mutation*: `calculateMonthlyReport` excludes empty/revoked-holiday documents that have zero actual student marks from Working Days, and applies any custom `overrideTotalWd` prior to computing per-student `totalDays` and `attendancePercentage`.
4. **Dashboard Initialization & Quick Actions Flow**:
   - *Interaction*: User opens the Dashboard as a Teacher, Coordinator, Principal, or Admin.
   - *State Mutation*: Dashboard invokes `ensureLeavesLoaded()` on mount so pending leave badges reflect real Firestore state immediately, checks `unsynced_<today>` before overwriting local attendance cache, and renders clean, non-duplicated quick action buttons in the Oversight Dashboard.
