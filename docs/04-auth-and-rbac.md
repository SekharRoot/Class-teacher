# User Authentication and Role-Based Access Control (RBAC)
## Secure Session Handling, RBAC Next.js Middleware, and Scoped Query Rules

In a multi-tenant or multi-school application, authentication goes beyond knowing *who* is logged in. You must enforce what they can *see* and *modify*. This is accomplished with Role-Based Access Control (RBAC).

In this tutorial, you will implement user session management with Supabase Auth, construct Next.js Middleware to protect system routes, and understand role scopes to filter database results.

---

## 1. System Role Hierarchy & Clearances

Our application supports six distinct roles. Each role has specific access restrictions:

| Role | Hierarchy Level | Database Permissions Scope |
| :--- | :--- | :--- |
| **owner** | 1 (Highest) | Full global read/write access across all schools. |
| **admin** | 1 (Highest) | Full global read/write access across all schools. |
| **school_admin** | 2 | Full read/write access limited to their specific `school_id`. |
| **principal** | 2 | Full read access limited to their specific `school_id`. |
| **academic_coordinator** | 3 | Full read/write access over classes in their school, manages multiple class teachers. |
| **class_teacher** | 4 (Lowest) | Restricted read/write access strictly for students in their `assigned_class_id` or `alternate_class_ids`. |

---

## 2. Next.js Middleware Session Guard (`middleware.ts`)

Next.js Middleware intercepts all incoming requests before they render a page. This allows you to verify authentication tokens on the server.

Create a file named `middleware.ts` in your project's root folder:

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Initialize the Supabase Client safely inside Next.js Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 2. Fetch the active user session
  const { data: { session } } = await supabase.auth.getSession();

  // If user is not authenticated and is trying to access dashboard/app pages, redirect to login
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isPublicAsset = request.nextUrl.pathname.startsWith("/_next") || 
                        request.nextUrl.pathname.startsWith("/api") ||
                        request.nextUrl.pathname.match(/\.(png|jpg|ico)$/);

  if (!session && !isAuthPage && !isPublicAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated user is visiting login page, redirect back to home dashboard
  if (session && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

---

## 3. Creating the Client Auth Provider Context (`AuthContext.tsx`)

This client-side context parses the session JWT, retrieves the custom profile details (role, assigned school, classes) from the `user_profiles` database table, and provides them to all React components.

```tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types";
import { useRouter } from "next/navigation";

// Initialize client-side Supabase instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Fetch active session and profile
    const bootstrapAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          
          // Fetch custom user attributes from metadata tables
          const { data: profileData, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && profileData) {
            setProfile(profileData as UserProfile);
          }
        }
      } catch (err) {
        console.error("Auth bootstrapping failed:", err);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();

    // 2. Set up listener for live auth state events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profileData) setProfile(profileData as UserProfile);
        } else {
          setUser(null);
          setProfile(null);
          router.push("/login");
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Helper method to enforce permissions in page routes
  const hasAccess = (allowedRoles: UserRole[]) => {
    if (!profile) return false;
    return allowedRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

---

## 4. Writing Role-Scoped Database Query Rules (The Repository Layer)

Now, let's write scoped queries so your app filters data securely. You must never assume the database client will return correct scoped rows automatically; enforce your query filters based on active profile states.

Here is how you query the **students** database table filtered strictly by the user's roles inside a repository layer:

```typescript
import { createClient } from "@supabase/supabase-js";
import { Student, UserProfile } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchStudentsByScope(profile: UserProfile): Promise<Student[]> {
  // Base query Builder
  let query = supabase.from("students").select("*");

  // Filter based on active role hierarchy
  switch (profile.role) {
    case "owner":
    case "admin":
      // Owners can read everything - do not apply further filters
      break;

    case "school_admin":
    case "principal":
      // Scoped entirely to their respective school organization
      if (!profile.schoolId) return [];
      query = query.eq("school_id", profile.schoolId);
      break;

    case "academic_coordinator":
      // Scoped to classes within their assigned school
      if (!profile.schoolId) return [];
      query = query.eq("school_id", profile.schoolId);
      break;

    case "class_teacher":
      // Restricted to students matching their assigned primary/secondary or alternate classes
      const assignedClasses: string[] = [];
      if (profile.assignedClassId) assignedClasses.push(profile.assignedClassId);
      if (profile.assignedClassId2) assignedClasses.push(profile.assignedClassId2);
      if (profile.alternateClassIds && profile.alternateClassIds.length > 0) {
        assignedClasses.push(...profile.alternateClassIds);
      }

      if (assignedClasses.length === 0) {
        return []; // Teacher has no assigned classes
      }
      query = query.in("class_id", assignedClasses);
      break;

    default:
      return []; // Unsupported role, return empty list
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Database error fetching students: ${error.message}`);
  }

  return data as Student[];
}
```

---

## 5. Architectural Tips for the Learner

1. **Verify Role Scopes on the Server:** Don't rely purely on client-side routing guards (like hiding buttons). An expert developer always enforces validation checks inside API endpoints or DB-level RLS policies.
2. **Combine RLS and Query Scopes:** Query filters like `.eq('school_id', profile.schoolId)` are used to reduce query overhead and request data efficiently. The database RLS policy sits underneath as a secure fallback in case a query is constructed incorrectly.
3. **Handle Empty Scopes Gracefully:** If a teacher has not yet been assigned to a class, the repository returns an empty list `[]` instead of throwing a database syntax error.
