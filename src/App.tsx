/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import { Box, CircularProgress, Typography } from "@mui/material";

import AppShell from "./layouts/AppShell";

const lazyWithRetry = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(async () => {
    const hasRetriedKey = "chunk_retry_occurred";
    try {
      const component = await componentImport();
      localStorage.removeItem(hasRetriedKey);
      return component;
    } catch (error) {
      console.error("Chunk loading failed. Attempting to reload page to get latest assets...", error);
      const hasRetried = localStorage.getItem(hasRetriedKey);
      if (!hasRetried) {
        localStorage.setItem(hasRetriedKey, "true");
        window.location.reload();
      }
      throw error;
    }
  });
};

const Login = lazyWithRetry(() => import("./pages/Login"));
const Attendance = lazyWithRetry(() => import("./pages/Attendance"));
const Classes = lazyWithRetry(() => import("./pages/Classes"));
const Profiles = lazyWithRetry(() => import("./pages/Profiles"));
const Reports = lazyWithRetry(() => import("./pages/Reports"));
const Testing = lazyWithRetry(() => import("./pages/Testing"));
const AdminPanel = lazyWithRetry(() => import("./pages/AdminPanel"));
const Leaves = lazyWithRetry(() => import("./pages/Leaves"));
const InactiveProfiles = lazyWithRetry(() => import("./pages/InactiveProfiles"));
const Settings = lazyWithRetry(() => import("./pages/Settings"));
const Export = lazyWithRetry(() => import("./pages/Export"));
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"));

const FallbackLoader = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
    <CircularProgress />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Loading module...</Typography>
  </Box>
);

export default function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <Suspense fallback={<FallbackLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<AppShell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="attendance/:classId?" element={<Attendance />} />
                  <Route path="class" element={<Classes />} />
                  <Route path="profiles" element={<Profiles />} />
                  <Route path="admin" element={<AdminPanel />} />
                  <Route path="leaves" element={<Leaves />} />
                  <Route path="inactive-profiles" element={<InactiveProfiles />} />
                  <Route path="reports/:classId?/:month?" element={<Reports />} />
                  <Route path="export" element={<Export />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="testing" element={<Testing />} />
                </Route>
              </Routes>
            </Suspense>
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
