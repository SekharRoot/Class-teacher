# AI Agent Instructions & Operating Directives

## 1. Strict Change Control & Workflow Preservation (CRITICAL)

- **Preserve Existing Workflows**: The AI agent MUST NEVER break, delete, or drastically rewrite existing working workflows, navigation hierarchies, UI layouts, calculation models, or database structures without explicit prior confirmation from the user.
- **Ask Before Breaking Changes**: If a user request implies or requires a breaking architectural change (e.g., altering database schemas, deleting collections, changing attendance aggregation logic, removing existing tabs, or replacing UI frameworks), the AI MUST explain the trade-offs and seek explicit confirmation before proceeding.
- **Adherence to Modification Scope**: Always adhere strictly to the specific modifications and workflow requested. Deliver precisely what is requested with high craftsmanship—do not introduce unsolicited features, synthetic complexity, or unrequested secondary modules.
- **No Unnecessary / Extraneous Data**: Do NOT inject unnecessary mock datasets, dummy records, superfluous schema fields, fake telemetry, or placeholder UI components into the production database or codebase. Keep data structures lean, intentional, and strictly aligned with user specifications.
- **Backward Compatibility**: Any modifications to APIs, hooks, or utilities must remain backward-compatible with existing React components and the Flutter mobile client in `/flutter`.

## 2. Project Architecture & Navigation Rules (CRITICAL)

- **Primary vs. Secondary Navigation**: The floating navigation bar in `src/components/navigation/BottomNavBar.tsx` MUST strictly contain ONLY three primary tabs: **Dashboard**, **Attendance**, and **Profiles**. All other tabs (Class Management, Reports, Settings, User Admin, Leaves, Inactive Profiles, Database Backup/Purge, etc.) MUST remain exclusively inside the collapsed secondary ("More") navigation menu.
- **Bottom Spacing & Layout Safety**: Every view, dashboard, report table, and form MUST preserve a generous vertical spacing buffer at the bottom (at least 120px to 160px padding/margin or an explicit `<Box sx={{ height: { xs: 120, sm: 160 } }} />` spacer at the end of scrollable containers). This prevents interactive elements, table rows, and submit buttons from being hidden beneath the floating bottom navigation bar.
- **Component Modularization**:
  - Profile state & mutations: Managed via `src/hooks/useProfilesData.ts` and `src/hooks/useProfileActions.ts`.
  - Attendance management: Split into daily marking, monthly sheets, and report engines.
  - CSV & data imports: Centralized in `src/utils/csvImport.ts`.
  - Specialized report modules: Located in `src/components/dashboard/` and `src/components/monthlyReport/`.

## 3. Reports & PDF Generation Workflow

- **Centralized Location**: Monthly Attendance PDF exports and full-matrix calculations belong exclusively in the **Reports** tab (`src/pages/Reports.tsx`), keeping daily and monthly attendance editing sheets focused and uncluttered.
- **Deferred Calculation Flow**: Heavy attendance aggregations (TA, PCA, TCA, percentages, and working days) must NOT run on component mount or dialog open. Calculations must execute only when the user explicitly triggers **Calculate & Preview** or **Download PDF Report**.
- **Modular Calculation Options**: Preserve individual toggle controls for calculating and printing **TA (Total Attendance)**, **% TA**, **PCA (Previous Cumulative Attendance)**, **TCA (Total Cumulative Attendance)**, and **% TCA**, along with custom Working Days (WD) overrides.
- **Clean Labeling**: Maintain professional, standardized naming across dialogs and buttons (avoid internal technical labels like "(LaTeX)").

## 4. Theme & Visual Consistency

- **Dark & Light Mode Support**: All components, cards, tables, popovers, and preview panels must properly support both light and dark themes using theme-aware MUI styling (`theme.palette.mode === 'dark' ? ... : ...`).
- **Attendance Color Standards**:
  - **Present (P)**: Leaf Green (`#1b5e20` in light mode, `#81c784` in dark mode).
  - **Absent (A)**: Dark Red (`#b71c1c` in light mode, `#ef5350` in dark mode).
  - **Leave (L)**: Warm Orange (`#e65100` in light mode, `#ffb74d` in dark mode).
  - **Unmarked (-)**: Neutral grey / disabled tone.

## 5. Build Configuration, Artifacts & CI/CD

- **Artifact Preservation**: Do NOT add `dist/` or `build/` to `.gitignore`. Excluding these directories breaks platform deployments with "Build artifacts are empty."
- **Full-Stack Server Build**: `package.json` must maintain the bundled production build script: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
- **Cloud Run Production Detection**: `server.ts` must detect production mode using `process.env.NODE_ENV === 'production' || !!process.env.K_SERVICE`.
- **GitHub Actions Deployment (`.github/workflows/deploy.yml`)**:
  - The deploy action (`JamesIves/github-pages-deploy-action`) MUST deploy ONLY to the `gh-pages` branch.
  - **NEVER** change the deploy branch to `main` or `master`, which would overwrite source code with build artifacts.
- **Subdirectory Base Path & Dynamic PWA**:
  - `vite.config.ts` uses dynamic detection (`process.env.GITHUB_ACTIONS === "true" ? "/${repoName}/" : "/"`) for GitHub Pages hosting.
  - `vite-plugin-pwa` manifest `start_url` and `scope` are set dynamically to the base path to prevent 404 launch errors.
- **TypeScript Compiler Exclusions**: `tsconfig.json` must exclude build/output folders (`dist`, `output`, `out`, `**/*.cjs`) to prevent external asset scan failures during linting.

## 6. Multi-Platform & Multi-Tenant Rules

- **Flutter Sync**: Maintain schema parity with the mobile app in `/flutter`. Synchronize Firestore field changes across `src/api` (React) and `flutter/lib/services` (Flutter).
- **Tenant Isolation**: School administrators may only view and manage records associated with their assigned school. Universal multi-school access and database maintenance are reserved for platform owner accounts (`sekhar.root@gmail.com`).
- **Attendance Metrics**: Daily status reports and attendance rates are calculated based on boarder types (Day Scholar, Day Boarder, Full Boarder). Preserve this classification logic across all reporting modules.

