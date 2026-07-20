# Next.js App Router and Material UI Setup Guide
## Bootstrap the Frontend, Custom Typography, and Layout Safety Spacers

Combining Next.js (App Router) with Material UI (MUI v6) can sometimes be challenging for developers due to the separation between server-side rendered components (RSC) and client-side styling (Emotion).

In this tutorial, you will configure a seamless Next.js + MUI template, set up an elegant dark/light theme, and implement our floating navigation bar layout with custom spacing safeguards.

---

## 1. Directory Structure

Your frontend layout under `src/app/` (or Next.js standard directories) should be structured as follows:

```
src/
├── app/
│   ├── layout.tsx         # Root layout (Html structure, metadata, fonts)
│   ├── providers.tsx      # Client-side Theme & Cache wrappers
│   ├── page.tsx           # Dashboard view
│   ├── profiles/
│   │   └── page.tsx       # Student Profiles view
│   ├── attendance/
│   │   └── page.tsx       # Attendance Ledger view
│   └── leaves/
│       └── page.tsx       # Leaves Approval view
├── components/
│   └── navigation/
│       └── BottomNavBar.tsx  # Interactive navigation component
└── theme/
    └── index.ts           # Custom Material UI theme definition
```

---

## 2. Bootstrapping Material UI in Next.js App Router

Because Emotion (MUI's default style engine) relies on runtime-generated classes, we must wrap client-side paths with an Emotion Cache provider. This prevents Flash of Unstyled Content (FOUC).

### A. Creating the App Registry and Providers
Create `src/app/providers.tsx` to handle theme injection and cache initialization safely:

```tsx
"use client";

import React, { useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";

// Define a unified Slate design palette (minimalist, high-contrast, professional)
const getCustomTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#0f172a", // Deep slate
        light: "#334155",
        dark: "#020617",
      },
      secondary: {
        main: "#475569",
        light: "#64748b",
        dark: "#1e293b",
      },
      background: {
        default: mode === "light" ? "#f8fafc" : "#090d16",
        paper: mode === "light" ? "#ffffff" : "#0f172a",
      },
      text: {
        primary: mode === "light" ? "#0f172a" : "#f1f5f9",
        secondary: mode === "light" ? "#475569" : "#94a3b8",
      },
    },
    typography: {
      fontFamily: '"Inter", "Space Grotesk", sans-serif',
      h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, letterSpacing: "-0.02em" },
      h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, letterSpacing: "-0.015em" },
      h6: { fontFamily: '"Inter", sans-serif', fontWeight: 500 },
      button: { textTransform: "none", fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === "light" 
              ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
            border: `1px solid ${mode === "light" ? "#e2e8f0" : "#1e293b"}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
    },
  });

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode] = useState<PaletteMode>("light"); // Default static theme as per instructions
  const theme = getCustomTheme(mode);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

---

## 3. The Root Layout and Custom Google Fonts

Let's write `src/app/layout.tsx`. Here we import **Inter** and **Space Grotesk** directly using Google Fonts and configure our main application containers.

```tsx
import React from "react";
import { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import Box from "@mui/material/Box";

// Import fonts with optimized subsets
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Classroom Manager",
  description: "Advanced student profiling, leave trackers, and boarding status monitoring dashboard.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          {/* Main Content Area Wrapper */}
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
              {children}
            </Box>
            
            {/* The Floating Bottom Navigation Bar */}
            <BottomNavBar />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
```

---

## 4. The Bottom Navigation Bar and Crucial Spacing Rules

### A. The Bottom Spacing Guard Rule (MANDATORY)
Our floating bottom navigation bar has a fixed height and is docked at the bottom of the viewport using `position: fixed`. This layout design presents a potential issue: **on scrollable views (such as large lists of students), the navigation bar will obscure the lowest contents, buttons, or checkboxes.**

To resolve this issue, you must guarantee that:
- **Every primary route view** ends with a dedicated spacing buffer of at least **120px to 160px**!
- We represent this cleanly using an explicit MUI `<Box>` spacer or margin classes on the scrollable container.

```tsx
{/* Place this at the absolute bottom of every page's scrollable container */}
<Box sx={{ height: { xs: 120, sm: 160 } }} aria-hidden="true" />
```

### B. Creating the Floating Navigation Bar Component
Create `src/components/navigation/BottomNavBar.tsx` as a polished, responsive bottom navigation component:

```tsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import SettingsIcon from "@mui/icons-material/Settings";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // If the user is on the login screen, do not show the navigation bar
  if (pathname === "/login") return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 24 },
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "calc(100% - 32px)", sm: "500px" },
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        zIndex: 1000,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(_, newValue) => {
          router.push(newValue);
        }}
        sx={{
          height: 64,
          backgroundColor: "background.paper",
          "& .MuiBottomNavigationAction-root": {
            color: "text.secondary",
            padding: "8px 0",
            minWidth: "auto",
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          value="/"
          icon={<DashboardIcon sx={{ fontSize: 22 }} />}
        />
        <BottomNavigationAction
          label="Profiles"
          value="/profiles"
          icon={<PeopleIcon sx={{ fontSize: 22 }} />}
        />
        <BottomNavigationAction
          label="Attendance"
          value="/attendance"
          icon={<CheckCircleIcon sx={{ fontSize: 22 }} />}
        />
        <BottomNavigationAction
          label="Leaves"
          value="/leaves"
          icon={<TimeToLeaveIcon sx={{ fontSize: 22 }} />}
        />
        <BottomNavigationAction
          label="Settings"
          value="/settings"
          icon={<SettingsIcon sx={{ fontSize: 22 }} />}
        />
      </BottomNavigation>
    </Paper>
  );
}
```

---

## 5. Architectural Tips for the Learner

1. **Avoid In-App Theme Toggles:** For clean, professional code, avoid creating multiple theme options. Choose a polished theme that matches the application's mood (like this minimal, off-white Slate and Slate-light theme) and stick with it.
2. **Handle Dynamic Viewports:** Notice that the navigation bar matches the width of the screen on small devices but shrinks to a maximum width of `500px` on tablets and desktops. This is a common design pattern for mobile-optimized layouts.
3. **Respect Layout Margins:** When constructing pages like `/profiles` or `/attendance`, never forget the layout spacer box at the bottom. This preserves vertical scrolling height so users can reach the last elements on mobile screens.
