# Chapter 2: Authentication, Roles, & Multi-Tenancy

In this chapter, you will learn how to secure your classroom manager application. Schools handle sensitive child details, so ensuring a teacher from School A cannot read student profiles from School B is a critical legal and architectural requirement. We achieve this through **Multi-Tenancy** and **Row Level Security (RLS)**.

---

## 🔐 The Multi-Tenant Strategy

In a **Multi-Tenant** app, a "tenant" is a customer (in our case, a school).
Instead of deploying a separate backend database for every school, we use a shared database where every row is tagged with a `school_id`.

To select their active school, administrators and teachers use a dropdown menu in the UI. When a school is chosen, we:
1. Save the selected `schoolId` to `localStorage` or session cookies.
2. Invalidate the cached student roster.
3. Fetch fresh student data filtered exactly by that school ID.

---

## 👥 Roles and Permissions Hierarchy

This application defines four logical roles with increasing level of access:

| Role | Target User | Allowed Actions |
|---|---|---|
| **Class Teacher** | Classroom Teachers | Take attendance for assigned classes; view and submit leave requests for their own students. |
| **Academic Coordinator** | Head of Departments / Year Heads | View statistics and leave requests for multiple classes; manage teacher profiles. |
| **Principal** | School Principals | View school-wide analytics, manage classes, approve high-priority leaves. |
| **Owner / Admin** | System Superusers | Manage schools, database tables, billing, and assign roles globally. |

---

## 🛡️ PostgreSQL Row Level Security (RLS)

In Firestore, security was handled by `firestore.rules`.
In Supabase/PostgreSQL, we use **Row Level Security (RLS)**. RLS is a database feature that automatically filters query results before sending them to the client, based on who is logged in.

Run this SQL script in your Supabase Editor to enable RLS and write the security policies.

```sql
-- 1. Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Helper Functions for Auth Queries

-- Check if logged-in user is a super-admin or owner
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE uid = auth.uid() 
        AND (role = 'owner'::user_role OR role = 'admin'::user_role OR email = 'sekhar.root@gmail.com')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Retrieve the active school ID of the logged-in user
CREATE OR REPLACE FUNCTION get_user_school_id() 
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT school_id FROM user_profiles WHERE uid = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. WRITE POLICIES

-- SCHOOLS POLICIES
CREATE POLICY "Anyone can read active schools list" ON schools
    FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins/owners can create or update schools" ON schools
    FOR ALL USING (is_admin());


-- CLASSES POLICIES
CREATE POLICY "Users can view classes in their school" ON classes
    FOR SELECT USING (school_id = get_user_school_id() OR is_admin());

CREATE POLICY "Admins/owners can manage classes" ON classes
    FOR ALL USING (school_id = get_user_school_id() OR is_admin());


-- STUDENTS POLICIES
CREATE POLICY "Users can view students in their school" ON students
    FOR SELECT USING (school_id = get_user_school_id() OR is_admin());

CREATE POLICY "Teachers and admins can insert or update students" ON students
    FOR ALL USING (school_id = get_user_school_id() OR is_admin());


-- ATTENDANCE RECORDS POLICIES
CREATE POLICY "Users can read attendance in their school" ON attendance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = attendance_records.student_id 
            AND (students.school_id = get_user_school_id() OR is_admin())
        )
    );

CREATE POLICY "Teachers and admins can take attendance" ON attendance_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE students.id = attendance_records.student_id 
            AND (students.school_id = get_user_school_id() OR is_admin())
        )
    );


-- USER PROFILES POLICIES
CREATE POLICY "Profiles can be viewed by school members" ON user_profiles
    FOR SELECT USING (school_id = get_user_school_id() OR uid = auth.uid() OR is_admin());

CREATE POLICY "Only admins can update roles" ON user_profiles
    FOR ALL USING (is_admin());
```

---

## 💻 Building the Frontend School Selector

Here is how you can build a simple, clean **School Selector** component in React using Material UI components:

```tsx
import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import { supabase } from "../lib/supabaseClient";

interface School {
  id: string;
  name: string;
}

export const SchoolTenantSelector = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState<string>(
    localStorage.getItem("activeSchoolId") || ""
  );

  useEffect(() => {
    // Fetch active schools from Supabase
    const loadSchools = async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name")
        .eq("is_active", true);

      if (!error && data) {
        setSchools(data);
        if (!activeSchoolId && data.length > 0) {
          handleSchoolChange(data[0].id);
        }
      }
    };
    loadSchools();
  }, []);

  const handleSchoolChange = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    localStorage.setItem("activeSchoolId", schoolId);
    
    // Dispatch custom event to notify other components to refresh
    window.dispatchEvent(new CustomEvent("tenant-changed", { detail: schoolId }));
    
    // Refresh page to reset cached stores and fetch fresh data from tenant
    window.location.reload();
  };

  return (
    <Box sx={{ minWidth: 200, py: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="school-select-label">Active Campus</InputLabel>
        <Select
          labelId="school-select-label"
          id="school-select"
          value={activeSchoolId}
          label="Active Campus"
          onChange={(e) => handleSchoolChange(e.target.value as string)}
        >
          {schools.map((school) => (
            <MenuItem key={school.id} value={school.id}>
              {school.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
```

Excellent! You have now secured your relational tenant database. Let's move on to **[Chapter 3: The Offline-First Sync Engine](./03-offline-sync-engine.md)** to learn how we can keep our database fully functioning offline.
