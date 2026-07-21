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

const forceRecovery = async (): Promise<void> => {
  try {
    // 1. Unregister any service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    
    // 2. Clear all cache storage (Vite PWA / Workbox cache)
    if ("caches" in window) {
      const keys = await window.caches.keys();
      for (const key of keys) {
        await window.caches.delete(key);
      }
    }
    
    // 3. Clear sessionStorage
    sessionStorage.clear();
    
    // 4. Force reload the page bypassing the cache with a cache buster parameter
    const now = Date.now();
    const url = new URL(window.location.href);
    url.searchParams.set("t", now.toString());
    window.location.replace(url.toString());
  } catch (e) {
    console.error("Failed during forceRecovery:", e);
    // Fallback: simple reload
    window.location.reload();
  }
};

const lazyWithRetry = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(async () => {
    const retries = 2;
    for (let i = 0; i <= retries; i++) {
      try {
        const component = await componentImport();
        return component;
      } catch (error) {
        if (i === retries) {
          console.error("Chunk loading failed after retries. Attempting page recovery...", error);
          
          // Use a timestamp-based reload gate to avoid infinite loops, but allow future retries
          const lastReloadStr = localStorage.getItem("last_chunk_retry_time");
          const now = Date.now();
          if (!lastReloadStr || now - parseInt(lastReloadStr, 10) > 10000) {
            localStorage.setItem("last_chunk_retry_time", now.toString());
            await forceRecovery();
          }
          throw error;
        }
        // Wait 500ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    return componentImport();
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
