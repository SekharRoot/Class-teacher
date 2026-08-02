# System Remix Guide: Porting from Firebase to Supabase

This guide serves as a highly detailed, comprehensive system-prompt for an AI Coding Agent to refactor and migrate the entire **Classroom Manager** codebase from **Firebase (Firestore & Firebase Auth)** to **Supabase (PostgreSQL, Supabase Client, & Supabase Auth)**.

---

## 1. Target Database Schema Mapping (PostgreSQL)

Firestore's nested subcollection design translates into a highly structured, relational SQL schema. Run this SQL block in the Supabase SQL Editor to provision the database:

```sql
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'teacher', -- 'admin', 'teacher', etc.
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Schools Table
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Classes Table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    section TEXT,
    stream TEXT, -- e.g. PCB, PCM, Commerce, Arts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Students / Profiles Table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT,
    boarder_type TEXT, -- 'Day Scholar', 'Day Boarder', 'Full Boarder'
    profile_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'deleted' (for soft-deletes/restores)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, roll_number)
);

-- 5. Leaves Table
CREATE TABLE public.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Attendance Records Table
CREATE TABLE public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Index optimization for fast range queries, month counts, and class filters
CREATE INDEX idx_attendance_date ON public.attendance_records(date);
CREATE INDEX idx_attendance_class_date ON public.attendance_records(class_id, date);
CREATE INDEX idx_students_class_status ON public.students(class_id, status);
CREATE INDEX idx_leaves_class_range ON public.leaves(class_id, start_date, end_date);
```

### Row-Level Security (RLS) Enablement
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies where authenticated users can read/write data associated with their active schools
-- example user/school mapping or allowing general authenticated user operations:
CREATE POLICY "Allow authenticated full access" 
ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" 
ON public.schools FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" 
ON public.classes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" 
ON public.students FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" 
ON public.leaves FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" 
ON public.attendance_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 2. Refactoring Phase & Action Steps

Implement the migration methodically by following these exact steps:

### Step 2.1: Dependencies & Configuration
1. Uninstall Firebase dependencies and install `@supabase/supabase-js`:
   ```bash
   npm uninstall firebase
   npm install @supabase/supabase-js
   ```
2. Update `.env.example` and add:
   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
3. Create `/src/lib/supabaseClient.ts`:
   ```typescript
   import { createClient } from "@supabase/supabase-js";

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error("Missing Supabase configuration environment variables.");
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

### Step 2.2: Refactor Auth Context (`src/contexts/AuthContext.tsx`)
*   Replace Firebase auth listeners (`onAuthStateChanged`, `signInWithEmailAndPassword`, `signOut`) with Supabase client equivalents:
    ```typescript
    // To listen to state changes:
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // To sign in:
    await supabase.auth.signInWithPassword({ email, password });

    // To sign out:
    await supabase.auth.signOut();
    ```

### Step 2.3: Rewrite API Services (`src/api/*`)
Replace the firestore query mechanisms within the API layer files:

1.  **`src/api/schools.ts`**: Use `.select()` from table `schools`.
2.  **`src/api/classes.ts`**: Use `.select().eq('school_id', activeSchoolId)`.
3.  **`src/api/students.ts`**:
    *   Query students filtering by `class_id` and `status` ('active').
    *   Implement `.insert()`, `.update()`, and soft deletes using `.update({ status: 'deleted' })`.
4.  **`src/api/leaves.ts`**: Query and insert from the `leaves` table.
5.  **`src/api/attendance.ts`**:
    *   Save/Upsert attendance records using:
        ```typescript
        const upsertData = Object.entries(attendanceData).map(([studentId, status]) => ({
          class_id: classId,
          student_id: studentId,
          date: date,
          status: status.toLowerCase(),
        }));
        await supabase.from("attendance_records").upsert(upsertData, { onConflict: "student_id,date" });
        ```
    *   Retrieve records for a given date:
        ```typescript
        const { data } = await supabase
          .from("attendance_records")
          .select("student_id, status")
          .eq("class_id", classId)
          .eq("date", date);
        ```
    *   Fetch monthly records:
        ```typescript
        const { data } = await supabase
          .from("attendance_records")
          .select("student_id, date, status")
          .in("class_id", classIds)
          .gte("date", `${month}-01`)
          .lte("date", `${month}-31`);
        ```

### Step 2.4: Storage & Assets (Optional Profile Pictures)
*   Replace Realtime Database (RTDB) / Firebase Storage calls with Supabase Storage bucket operations (e.g., uploading to a bucket named `profile-images`).
    ```typescript
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(`${studentId}/avatar.png`, file, { cacheControl: "3600", upsert: true });
    ```

### Step 2.5: Build, Validate, and Verify
1. Run linter checks to resolve type-checking disparities:
   ```bash
   npm run lint
   ```
2. Build the application successfully:
   ```bash
   npm run build
   ```

---

## 3. Best Practices for the Migration
*   **Keep Frontend Interfaces Untouched**: Keep UI components (`Export.tsx`, `Attendance.tsx`, `Profiles.tsx`) decoupled from database modifications. The API layers (`src/api/*`) must retain identical signatures and return the exact same TypeScript structures (`Student`, `Class`, etc.) so that zero changes are required in presentation pages.
*   **Database Transactions**: For bulk imports or class transfers, utilize PostgreSQL RPC (Stored Procedures) or batch queries directly on the Supabase client.
*   **Maintain Status Casing**: Firestore implementation utilizes capital status keywords (`Present`, `Absent`, `Leave`). Normalize these values using `.toLowerCase()` inside database calls and uppercase them on API output boundaries, or keep them consistent with the Postgres check constraints.
