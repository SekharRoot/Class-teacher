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

const Login = React.lazy(() => import("./pages/Login"));
const Attendance = React.lazy(() => import("./pages/Attendance"));
const Classes = React.lazy(() => import("./pages/Classes"));
const Profiles = React.lazy(() => import("./pages/Profiles"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Testing = React.lazy(() => import("./pages/Testing"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel"));
const Leaves = React.lazy(() => import("./pages/Leaves"));
const InactiveProfiles = React.lazy(() => import("./pages/InactiveProfiles"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Export = React.lazy(() => import("./pages/Export"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

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
