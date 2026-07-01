/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";

import AppShell from "./layouts/AppShell";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";
import Profiles from "./pages/Profiles";
import Reports from "./pages/Reports";
import PlaceholderPage from "./pages/PlaceholderPage";
import Testing from "./pages/Testing";
import AdminPanel from "./pages/AdminPanel";
import Leaves from "./pages/Leaves";

import Settings from "./pages/Settings";
import Export from "./pages/Export";

import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="attendance/:classId?" element={<Attendance />} />
                <Route path="class" element={<Classes />} />
                <Route path="profiles" element={<Profiles />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="leaves" element={<Leaves />} />
                <Route path="reports/:classId?/:month?" element={<Reports />} />
                <Route path="export" element={<Export />} />
                <Route path="settings" element={<Settings />} />
                <Route path="testing" element={<Testing />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
