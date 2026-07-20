# Database Schema Guide: Modeling relational tables in Supabase
## Migrating from document collections (Firestore) to relational PostgreSQL

When building a production-grade application, moving from a document-based NoSQL database like Firestore to a relational database like PostgreSQL in Supabase is a massive upgrade. It allows you to enforce **data integrity**, build complex relationships, use native database constraints, and set up robust Row-Level Security (RLS) directly inside the engine.

In this tutorial, you will write the complete relational schema, custom enums, compound unique constraints, indexes, and RLS policies for your Next.js + Supabase backend.

---

## 1. PostgreSQL Schema Mapping Diagram

Here is how our tables relate to one another:

```
  ┌─────────────────┐             ┌─────────────────┐
  │     schools     │             │  user_profiles  │
  ├─────────────────┤             ├─────────────────┤
  │ PK id (text)   ◄┼───┐   ┌────►│ PK id (uuid)    │
  │    name         │   │   │     │    role (enum)  │
  └─────────────────┘   │   │     │    school_id ──┼───┐
                        │   │     └─────────────────┘   │
  ┌─────────────────┐   │   │                           │
  │     classes     │   │   │                           │
  ├─────────────────┤   │   │                           │
  │ PK id (uuid)    │   │   │                           │
  │    school_id ───────┼───┼──┐                        │
  └────────▲────────┘   │   │  │                        │
           │            │   │  │                        │
  ┌────────┴────────┐   │   │  │                        │
  │    students     │   │   │  │                        │
  ├─────────────────┤   │   │  │                        │
  │ PK id (uuid)    │   │   │  │                        │
  │    class_id ────┼───┼───┼──┘                        │
  │    school_id ───┼───┘   │                           │
  └────────▲──▲─────┘       │                           │
           │  │             │                           │
  ┌────────┴──┼─────┐       │     ┌─────────────────┐   │
  │attendance_rec   │       │     │ leave_requests  │   │
  ├─────────────────┤       │     ├─────────────────┤   │
  │ PK id (uuid)    │       └────►│ PK id (uuid)    │   │
  │ student_id ─────┼────────────►│ student_id      │   │
  │ date (date)     │             │ class_id ───────┼───┘
  └─────────────────┘             └─────────────────┘
```

---

## 2. PostgreSQL DDL Script

Create these tables in your Supabase SQL Editor. We use `uuid` with standard generation defaults, set up cascading deletes, and create enums for bounded variables.

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. DEFINE RELATIONAL ENUMS
-- ==========================================
create type user_role_enum as enum (
  'owner',
  'admin',
  'school_admin',
  'academic_coordinator',
  'principal',
  'class_teacher'
);

create type attendance_status_enum as enum (
  'present',
  'absent',
  'leave'
);

create type boarder_type_enum as enum (
  'Day Scholar',
  'Day Boarder',
  'Full Boarder'
);

create type leave_status_enum as enum (
  'pending',
  'approved',
  'rejected'
);

create type user_status_enum as enum (
  'active',
  'pending'
);

create type gender_enum as enum (
  'Male',
  'Female',
  'Transgender'
);

-- ==========================================
-- 2. CREATE PRIMARY DATABASE TABLES
-- ==========================================

-- A. Schools Table
create table schools (
  id text primary key, -- Use a human-friendly string identifier or UUID
  name text not null,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true not null
);

-- B. Classes Table
create table classes (
  id uuid primary key default uuid_generate_v4(),
  board text not null, -- E.g. 'CBSE', 'ICSE'
  class_standard text not null, -- E.g. 'Class 10', 'Class 12'
  section text not null, -- E.g. 'Section A', 'Section B'
  school_id text references schools(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- C. User Profiles Table (Linked to Supabase auth.users)
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role user_role_enum default 'class_teacher'::user_role_enum not null,
  school_id text references schools(id) on delete set null,
  assigned_class_id uuid references classes(id) on delete set null,
  assigned_class_id2 uuid references classes(id) on delete set null,
  alternate_class_ids uuid[] default '{}'::uuid[] not null,
  coordinator_ids uuid[] default '{}'::uuid[] not null,
  principal_id uuid references auth.users(id) on delete set null,
  status user_status_enum default 'pending'::user_status_enum not null,
  has_leave_feature_access boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- D. Students Table
create table students (
  id uuid primary key default uuid_generate_v4(),
  profile_id text, -- Custom identifier if needed
  first_name text not null,
  last_name text not null,
  roll_number text not null,
  class_id uuid references classes(id) on delete set null,
  school_id text references schools(id) on delete cascade,
  gender gender_enum,
  father_name text,
  mother_name text,
  phone_number text,
  image_url text, -- Store URL returned by Supabase Storage Bucket
  boarder_type boarder_type_enum default 'Day Scholar'::boarder_type_enum not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- E. Attendance Records Table
create table attendance_records (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade not null,
  date date not null, -- Format YYYY-MM-DD represented as a SQL date
  status attendance_status_enum not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- CRITICAL: Prevent duplicate attendance records for a student on the same calendar day
  constraint unique_student_date_attendance unique (student_id, date)
);

-- F. Leave Requests Table
create table leave_requests (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  reason text not null,
  status leave_status_enum default 'pending'::leave_status_enum not null,
  applied_by text not null, -- Submitter Name
  applied_by_id uuid references auth.users(id) not null,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_by text,
  resolved_by_id uuid references auth.users(id),
  resolved_at timestamp with time zone,
  
  -- Date check to ensure logical start/end parameters
  constraint check_leave_dates check (start_date <= end_date)
);
```

---

## 3. Database Indexes for High-Performance Queries

Indexing is key to speed up querying. In an school app, we frequently query attendance logs by date ranges and fetch active students in specific classes.

```sql
-- Indexes for students lookup
create index idx_students_class_active on students(class_id, is_active);
create index idx_students_school on students(school_id);

-- Speed up daily attendance checks and compound search
create index idx_attendance_student_date on attendance_records(student_id, date);
create index idx_attendance_date on attendance_records(date);

-- Speed up class retrieval filtered by schools
create index idx_classes_school on classes(school_id);

-- Speed up pending leave requests lookup for teachers
create index idx_leaves_class_status on leave_requests(class_id, status);
create index idx_leaves_student_date on leave_requests(student_id, start_date, end_date);
```

---

## 4. Designing Supabase Row-Level Security (RLS) Policies

Row-Level Security allows you to specify exactly who can view or modify records in your tables based on their profile data.

Let's enable RLS on all tables:

```sql
alter table schools enable row level security;
alter table classes enable row level security;
alter table user_profiles enable row level security;
alter table students enable row level security;
alter table attendance_records enable row level security;
alter table leave_requests enable row level security;
```

### Writing a Helper Function to Fetch Current User Profile
To write fast and dry RLS policies, create a PostgreSQL function that cache-reads the role and school of the active authentication session:

```sql
create or replace function get_my_profile()
returns table (
  profile_id uuid,
  user_role user_role_enum,
  school_id text,
  assigned_class_id uuid,
  assigned_class_id2 uuid,
  alternate_class_ids uuid[]
) security definer as $$
begin
  return query
  select 
    id as profile_id,
    role as user_role,
    user_profiles.school_id,
    user_profiles.assigned_class_id,
    user_profiles.assigned_class_id2,
    user_profiles.alternate_class_ids
  from user_profiles
  where id = auth.uid();
end;
$$ language plpgsql;
```

### Implementing RLS Policies

#### A. School Policies
Owners and global admins can manage anything. School heads can view their own school.

```sql
create policy "Allow everyone to read their own active school"
  on schools for select
  using (
    id = (select school_id from get_my_profile()) 
    or (select user_role from get_my_profile()) in ('owner', 'admin')
  );

create policy "Admins can insert/update schools"
  on schools for all
  using ((select user_role from get_my_profile()) in ('owner', 'admin'));
```

#### B. Students Table Policies
Let's construct a policy for the students table.
- Teachers can view and update students assigned to their school.
- Academic coordinators/Principals can view any student in their school.

```sql
create policy "Users can view students in their own school"
  on students for select
  using (
    school_id = (select school_id from get_my_profile())
    or (select user_role from get_my_profile()) in ('owner', 'admin')
  );

create policy "Class teachers can edit profiles within their school"
  on students for all
  using (
    school_id = (select school_id from get_my_profile())
    and (select user_role from get_my_profile()) in ('school_admin', 'class_teacher', 'academic_coordinator')
  );
```

#### C. Attendance Records Table Policies
Attendance records must be restrictively read and written.

```sql
create policy "Users can view attendance for their school"
  on attendance_records for select
  using (
    exists (
      select 1 from students 
      where students.id = attendance_records.student_id 
      and students.school_id = (select school_id from get_my_profile())
    )
    or (select user_role from get_my_profile()) in ('owner', 'admin')
  );

create policy "Authorized teachers can record or modify attendance"
  on attendance_records for all
  using (
    exists (
      select 1 from students 
      where students.id = attendance_records.student_id 
      and students.school_id = (select school_id from get_my_profile())
      and (
        -- If class_teacher, make sure they are authorized for the class standard
        (select user_role from get_my_profile()) != 'class_teacher'
        or students.class_id = (select assigned_class_id from get_my_profile())
        or students.class_id = (select assigned_class_id2 from get_my_profile())
        or students.class_id = any((select alternate_class_ids from get_my_profile()))
      )
    )
  );
```

---

## 5. Architectural Tips for the Learner

1. **Keep Audit Logs:** Note how tables like `attendance_records` contain both `created_at` and `updated_at` timestamps. It is vital to track when records are updated to audit manual corrections.
2. **Referential Integrity:** In PostgreSQL, we set `students.class_id` to `on delete set null` and `attendance_records.student_id` to `on delete cascade`. This means if a class is deleted, students are preserved as "unassigned", but if a student is deleted, their raw historical attendance details are cleared, keeping the database tidy.
3. **Use Composite Constraints:** The unique constraint `unique_student_date_attendance` on student ID and date is a critical safeguard. This prevents race conditions or dual submission bugs on the frontend from inserting duplicate rows for the same child on the same calendar day.
