# Chapter 1: Database Architecture & Schema Design

As a beginner, moving from a NoSQL document database (Firestore) to a relational database (PostgreSQL in Supabase) is one of the most powerful milestones you will cross. This guide teaches you how our data is organized, how to translate it, and provides the exact SQL script to configure your database.

---

## 🗺️ NoSQL vs. Relational: Mental Mapping

Our current Firestore database is **document-oriented**. It uses nested subcollections:
`schools/{schoolId}/classes/{classId}/students/{studentId}`

While nested structures make individual reads simple, they make complex queries (such as counting students across all classes, or running school-wide attendance metrics) slow and difficult.

In a **Relational PostgreSQL database**, we flatten this hierarchy. We create independent **tables** that link together using **foreign keys**.

### The Entity Relationship Mapping

```
+------------------+         +------------------+
|     schools      | <-----+ |     classes      |
|  - id (PK)       |         |  - id (PK)       |
|  - name          |         |  - school_id (FK)|
+------------------+         +------------------+
         ^                            ^
         |                            |
         |                   +--------+
         |                   |
         |         +-------------------+
         +-------+ |     students      | <-----+
                   |  - id (PK)        |       |
                   |  - class_id (FK)  |       |
                   |  - school_id (FK) |       |
                   +-------------------+       |
                             ^                 |
                             |                 |
                   +---------+--------+        |
                   |                  |        |
         +--------------------+     +--------------------+
         | attendance_records |     |   leave_requests   |
         |  - id (PK)         |     |  - id (PK)         |
         |  - student_id (FK) |     |  - student_id (FK) |
         +--------------------+     +--------------------+
```

---

## 💾 The Supabase PostgreSQL DDL Script

Copy and paste the following SQL script directly into the **SQL Editor** of your Supabase dashboard. It sets up all tables, data constraints, and auto-updated timestamps automatically.

```sql
-- 1. Create UUID generator extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHOOLS TABLE
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 3. CLASSES TABLE
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    board VARCHAR(100) NOT NULL, -- e.g., CBSE, ICSE, State Board
    class_standard VARCHAR(50) NOT NULL, -- e.g., Class 10, Class 12
    section VARCHAR(50) NOT NULL, -- e.g., Section A, Section B
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. STUDENTS (PROFILES) TABLE
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Transgender');
CREATE TYPE boarder_type AS ENUM ('Day Boarder', 'Day Scholar', 'Full Boarder');

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id VARCHAR(50) UNIQUE, -- PRFL-XXXXXX identifier for human-readable IDs
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL, -- Can be null (unassigned)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) DEFAULT '.' NOT NULL,
    roll_number VARCHAR(50),
    gender gender_type DEFAULT 'Male' NOT NULL,
    father_name VARCHAR(255) DEFAULT '',
    mother_name VARCHAR(255) DEFAULT '',
    phone_number VARCHAR(50) DEFAULT '',
    image_url TEXT, -- Base64 storage path or Supabase storage CDN link
    boarder_type boarder_type DEFAULT 'Day Scholar' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ATTENDANCE RECORDS TABLE
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave');

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL, -- Format: YYYY-MM-DD
    status attendance_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent multiple attendance records for the same student on the same day
    CONSTRAINT unique_student_date_attendance UNIQUE (student_id, date)
);

-- 6. LEAVE REQUESTS TABLE
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'pending' NOT NULL,
    applied_by VARCHAR(255) NOT NULL, -- User display name
    applied_by_id UUID NOT NULL, -- User UID
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_by VARCHAR(255),
    resolved_by_id UUID,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. USER PROFILES TABLE
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'school_admin', 'academic_coordinator', 'principal', 'class_teacher');

CREATE TABLE user_profiles (
    uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    role user_role DEFAULT 'class_teacher' NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    school_name VARCHAR(255),
    assigned_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    assigned_class_id_2 UUID REFERENCES classes(id) ON DELETE SET NULL,
    alternate_class_ids UUID[] DEFAULT '{}'::UUID[], -- Substitute assignments
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- e.g., active, pending
    has_leave_feature_access BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 🔍 Key Relational Design Patterns

When building your first relational schema, pay attention to these three core principles:

### 1. Referential Integrity (Foreign Keys)
A **Foreign Key** is a field that references the primary key of another table. For example:
`school_id UUID NOT NULL REFERENCES schools(id)`
This ensures that you cannot create a class or a student inside a school that doesn't exist. The database strictly enforces this!

### 2. Cascade Deletes vs. Set Null
What happens when a school or class is deleted?
- `ON DELETE CASCADE`: If a school is deleted, all classes and students belonging to that school are automatically deleted.
- `ON DELETE SET NULL`: If a class is deleted, we don't want to delete our students! We set `class_id` to `NULL` so they simply become unassigned.

### 3. Unique Constraints
`CONSTRAINT unique_student_date_attendance UNIQUE (student_id, date)`
This unique key is critical. It guarantees that even if a network request repeats, a student can never have two attendance marks for the same day. It prevents data corruption.

---

## ⚡ Performance Optimization with Indexes

As your student roster grows, database queries can slow down. **Indexes** are like an index in a book—they allow PostgreSQL to find records instantly without scanning the entire table.

Run these index creation scripts inside your SQL Editor:

```sql
-- Index on student class for fast attendance roster loading
CREATE INDEX idx_students_class_id ON students(class_id);

-- Index on schoolId for multi-tenant isolation query speed
CREATE INDEX idx_students_school_id ON students(school_id);

-- Compound index on attendance date and status
CREATE INDEX idx_attendance_date_status ON attendance_records(date, status);

-- Index on leave request status
CREATE INDEX idx_leaves_status ON leave_requests(status);
```

Now that you have your database tables created and optimized, head over to **[Chapter 2: Authentication, Roles, & Multi-Tenancy](./02-auth-and-multi-tenancy.md)** to secure your data and handle logins.
