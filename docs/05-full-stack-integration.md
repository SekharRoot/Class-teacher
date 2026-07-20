# Chapter 5: Next.js App Router Integration

You have designed your database, configured security, created the offline engine, and designed beautiful UI elements. In this final chapter, we will tie everything together inside **Next.js** using the **App Router**, set up Progressive Web App capabilities, and deploy our system.

---

## 🚀 Client-Side vs. Server-Side Supabase Clients

In Next.js, some components run on the **Server** (Server Components) and some run in the **Browser** (Client Components). We must initialize Supabase differently depending on the context:

Install the Supabase helper packages:
`npm install @supabase/ssr @supabase/supabase-js`

### 1. Browser Client (Client Components)
Use this client inside files that begin with `"use client"`.

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### 2. Server Client (Server Actions & Route Handlers)
Use this client for backend API routes and server-side components. It handles secure browser cookies automatically.

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `remove` method was called from a Server Component.
          }
        },
      },
    }
  );
};
```

---

## ⚡ Next.js Server Actions

**Server Actions** are asynchronous functions that run on the server but can be called directly from your client-side React buttons! They replace traditional REST API controller files.

Here is how to write a server action to save student attendance:

```typescript
// app/actions/attendance.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { AttendanceStatus } from "@/types";

export async function recordAttendance(
  studentId: string, 
  date: string, 
  status: AttendanceStatus
) {
  const supabase = createClient();

  // 1. Upsert attendance record (inserts new, or updates existing on conflict)
  const { data, error } = await supabase
    .from("attendance_records")
    .upsert(
      { 
        student_id: studentId, 
        date, 
        status, 
        updated_at: new Date().toISOString() 
      },
      { onConflict: "student_id,date" } // Match unique constraint
    );

  if (error) {
    console.error("Database upsert failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

---

## 📱 Packaging as a Progressive Web App (PWA)

To make this app installable on teachers' mobile phones and work completely offline, we package it as a **PWA**.

### 1. Create a Manifest File
Create a public file named `public/manifest.json`:

```json
{
  "name": "Classroom Manager",
  "short_name": "Classroom",
  "description": "Offline-First School Attendance & Profile Manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1976d2",
  "theme_color": "#1976d2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Configure Service Workers
Service workers run in the background to serve assets directly from the cache when the user has no internet access. 

Using Next.js, the easiest way to configure this is by using `@ducanh2912/next-pwa` in your `next.config.js`:

```javascript
// next.config.js
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

---

## 🚀 Deploying the Stack

Congratulations! You have written a fully featured, multi-tenant, offline-first, professional educational platform. Here is how to launch it:

### Step 1: Deploy the Database to Supabase
1. Go to [Supabase](https://supabase.com/) and create a free project.
2. Navigate to the **SQL Editor**, paste the DDL scripts from **Chapter 1**, and hit **Run**.
3. Go to **Project Settings -> API** and copy your `Project URL` and `Anon API key`.

### Step 2: Configure Environment Variables
Create a file named `.env.local` in your Next.js project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-api-key
```

### Step 3: Deploy the Frontend to Vercel
1. Push your Next.js project code to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and import your project.
3. Paste your environment variables in the settings.
4. Click **Deploy**. Vercel will bundle your static files, configure Serverless API handlers, and launch your application globally!

---

## 🎉 The Journey is Complete

You started with a "vibe coded" client application and have successfully explored:
- Designing schemas and unique constraints in relational databases.
- Implementing multi-tenant access control lists.
- Coding high-performance IndexedDB local storage structures.
- Syncing and merging queues dynamically to prevent page reload data loss.
- Creating accessible Material UI dashboards.
- Deploying Next.js server actions.

This knowledge forms the foundation of modern senior web development. Keep coding, keep building, and continue expanding your toolkit!
