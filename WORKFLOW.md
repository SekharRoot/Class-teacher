# Application Architecture & Development Workflow

This document defines the standardized workflows, change-control policies, and architectural standards for the School Classroom Attendance & Management System. All automated agents and developers must strictly adhere to these workflows.

---

## 1. Non-Breaking Change Policy & Verification Protocols

### Core Principles
1. **Preserve Functionality by Default**: Existing screens, tabs, calculation pipelines, and user configurations must not be broken, removed, or rewritten unless explicitly instructed by the user.
2. **Prior Confirmation for Architectural Changes**: Before introducing breaking schema changes, deleting API endpoints, altering calculation formulas, or changing the navigation layout, the AI assistant MUST outline the proposed change and ask for explicit user confirmation.
3. **Zero Unsolicited Data**: Do not generate dummy records, synthetic sample lists, unnecessary mock fields, or extraneous UI controls that pollute the database or UI.
4. **Scope Discipline**: Execute only the requested modification cleanly, adhering to established design patterns and theme tokens.

---

## 2. Navigation & View Hierarchy

The application employs a bottom-docked navigation paradigm with strict hierarchy rules:

```
+-------------------------------------------------------------------------+
|                              Main Viewport                              |
|                                                                         |
| (Active Screen Content with ≥ 120-160px bottom padding / spacing buffer) |
+-------------------------------------------------------------------------+
|                  Floating Bottom Navigation Bar                         |
|   [ 📊 Dashboard ]     [ 📅 Attendance ]     [ 👥 Profiles ]    [ ⋯ More ] |
+-------------------------------------------------------------------------+
                                                                  |
                                                                  v (Drawer)
                                             +----------------------------+
                                             | • 🏫 Class Management      |
                                             | • 📈 Reports & PDF Export  |
                                             | • 📝 Leave Management      |
                                             | • 🚫 Inactive Profiles     |
                                             | • ⚙️ Settings               |
                                             | • 🛡️ Admin Panel & Backup  |
                                             +----------------------------+
```

### Critical Rules
- **Primary Tabs (Strictly 3)**: Only `Dashboard`, `Attendance`, and `Profiles` appear as root items in `src/components/navigation/BottomNavBar.tsx`.
- **Secondary Drawer**: All administrative, reporting, and secondary tools live in the "More" popover/drawer.
- **Bottom Safety Buffer**: Every page, dialog, or scrollable table MUST end with a spacer `<Box sx={{ height: { xs: 120, sm: 160 } }} />` or equivalent padding to ensure no content is concealed behind the floating navigation bar.

---

## 3. Attendance & Reporting Workflow

### Daily Attendance Flow
1. **Marking**: Daily attendance marks students as `Present (P)`, `Absent (A)`, `Leave (L)`, or `- (Unmarked)`.
2. **Color Coding**:
   - `Present`: Leaf Green (`#1b5e20` light / `#81c784` dark).
   - `Absent`: Dark Red (`#b71c1c` light / `#ef5350` dark).
   - `Leave`: Amber/Orange (`#e65100` light / `#ffb74d` dark).
3. **Boarder Classification**: Metrics categorize students into **Day Scholar**, **Day Boarder**, and **Full Boarder**.

### Monthly Report & PDF Export Flow
1. **Centralization**: The PDF export engine is hosted in the **Reports** tab (`src/pages/Reports.tsx`).
2. **Deferred Calculation**: Complex data aggregation across academic terms (Term Start to current month) runs on-demand via **Calculate & Preview** or **Download PDF Report** to conserve Firestore read quotas.
3. **Modular Computation Toggles**:
   - `includeTa`: Total Attendance for the selected month.
   - `includeTaPercent`: Monthly attendance percentage (`TA / Working Days * 100`).
   - `includePca`: Prior Cumulative Attendance from academic term start month.
   - `includeTca`: Total Cumulative Attendance (`TA + PCA`).
   - `includeTcaPercent`: Total cumulative attendance percentage (`TCA / Total Working Days * 100`).
   - `overrideWd` & `overrideTotalWd`: Custom overrides for monthly/total academic working days.

---

## 4. Multi-Tenant & Multi-Platform Synchronization

### Multi-Tenant Model
- **Tenant Scoping**: All student, class, and attendance documents are partitioned under their respective `schoolId`.
- **School Admins**: Scoped strictly to their own school's roster and records.
- **Platform Owners (`sekhar.root@gmail.com`)**: Have cross-tenant permissions, database snapshot utilities, and global administrative access.

### Multi-Platform Parity
- **React Frontend**: Web client located in `/src`.
- **Flutter Frontend**: Mobile client located in `/flutter`.
- **Firestore Schema**: Both frontends consume and mutate the same shared Firestore collections. Any schema modification must maintain cross-platform compatibility.

---

## 5. CI/CD & Production Deployment Workflow

### Build System
- **Single Build Command**: `npm run build` runs `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
- **Output Preservation**: `dist/` and `build/` must NEVER be placed in `.gitignore`.
- **Node Production Server**: `server.ts` binds to port `3000` (host `0.0.0.0`) and serves bundled static assets from `dist/`.

### GitHub Pages Deployment (`.github/workflows/deploy.yml`)
1. Pull requests and commits to `main` or `master` trigger `deploy.yml`.
2. Steps execute: checkout $\rightarrow$ Node 20 setup $\rightarrow$ `npm install` $\rightarrow$ `npm run lint` $\rightarrow$ `npm run build`.
3. Static files are deployed strictly to the `gh-pages` branch.
4. Dynamic `base` in `vite.config.ts` ensures proper path resolution in both standalone and GitHub Pages environments.

---

## 6. Pre-Commit / Pre-Completion Verification Checklist

Before completing any development turn or pull request, the developer or AI agent MUST verify:
- [ ] `npm run lint` passes without errors (`tsc --noEmit`).
- [ ] `npm run build` succeeds, generating both client static files and `dist/server.cjs`.
- [ ] Navigation tabs strictly conform to the 3-primary-tab standard.
- [ ] Bottom spacing buffer ($\ge 120\text{px}$) is present on all modified views.
- [ ] Dark and light theme contrast passes WCAG AA standards.
- [ ] No extraneous mock data or temporary debug scaffolding remains.
