import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile, UserRole } from "../types";
import { usersApi } from "../api/users";
import { LoadingOverlay } from "../components/navigation/LoadingOverlay";

import { getActiveSchoolId, setActiveSchoolId } from "../lib/activeSchoolHelper";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  activeSchoolId: string;
  activeSchoolName: string;
  setActiveSchool: (schoolId: string, schoolName: string) => void;
  authResolved: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  reloadProfile: async () => {},
  activeSchoolId: "default_school",
  activeSchoolName: "Default School",
  setActiveSchool: () => {},
  authResolved: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const normalizeProfile = (p: any): UserProfile | null => {
    if (!p || typeof p !== "object") return null;
    const isOwnerEmail = p.email === "sekhar.root@gmail.com";
    return {
      uid: p.uid || "",
      email: p.email || "",
      displayName: p.displayName || (p.email ? p.email.split("@")[0] : "User"),
      role: isOwnerEmail ? "owner" : (p.role || "class_teacher"),
      status: p.status || "active",
      schoolId: p.schoolId || "default_school",
      schoolName: p.schoolName || "Default School",
      assignedClassId: p.assignedClassId || null,
      assignedClassId2: p.assignedClassId2 || null,
      alternateClassIds: Array.isArray(p.alternateClassIds) ? p.alternateClassIds : [],
      coordinatorIds: Array.isArray(p.coordinatorIds) ? p.coordinatorIds : [],
      coordinatorId: p.coordinatorId || null,
      principalId: p.principalId || null,
      hasLeaveFeatureAccess: !!p.hasLeaveFeatureAccess,
    };
  };

  const hasCachedProfile = () => {
    try {
      return !!(localStorage.getItem("cached_user_profile") && localStorage.getItem("cached_auth_uid"));
    } catch {
      return false;
    }
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const cachedUid = localStorage.getItem("cached_auth_uid");
      const cachedProfile = localStorage.getItem("cached_user_profile");
      if (cachedUid && cachedProfile) {
        const p = JSON.parse(cachedProfile);
        return {
          uid: cachedUid,
          email: p.email || "",
          displayName: p.displayName || "",
        } as unknown as User;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem("cached_user_profile");
      return cached ? normalizeProfile(JSON.parse(cached)) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!hasCachedProfile());
  const [initialLoad, setInitialLoad] = useState(!hasCachedProfile());
  const [authResolved, setAuthResolved] = useState(false);

  const fetchAndSyncProfile = async (user: User) => {
    try {
      let profile = await usersApi.getProfile(user.uid);
      const isOwnerEmail = user.email === "sekhar.root@gmail.com";

      if (!profile) {
        // Check if there's a pre-configured profile by email
        const allUsers = await usersApi.getAll();
        const preConfigured = allUsers.find(
          (u) => u.email === user.email && u.uid.startsWith("pre_"),
        );

        if (preConfigured) {
          // Adopt pre-configured profile
          profile = {
            ...preConfigured,
            uid: user.uid,
            status: "active", // They signed in, so we can activate them
          };
          try {
            // Delete old one
            await usersApi.deleteProfile(preConfigured.uid);
            await usersApi.saveProfile(user.uid, profile);
          } catch (e) {
            console.warn("Could not adopt pre-configured profile fully", e);
          }
        } else {
          // Create new profile for first-time user
          const isFirstUser = allUsers.length === 0;
          const isAdminEmail =
            user.email === "admin@classroom.com" ||
            user.email?.startsWith("admin@");

          let assignedRole: UserRole = "class_teacher";
          let assignedStatus: "active" | "pending" = "active";
          let assignedDisplayName =
            user.displayName || user.email?.split("@")[0] || "Unknown User";
          let assignedSchoolId = "default_school";
          let assignedSchoolName = "Default School";

          const pendingRegStr = localStorage.getItem("pendingRegistration");
          if (pendingRegStr) {
            try {
              const pendingReg = JSON.parse(pendingRegStr);
              assignedRole = pendingReg.role;
              assignedStatus = pendingReg.status;
              assignedDisplayName =
                pendingReg.displayName || assignedDisplayName;
              assignedSchoolId = pendingReg.schoolId || "default_school";
              assignedSchoolName = pendingReg.schoolName || "Default School";
              localStorage.removeItem("pendingRegistration");
            } catch (e) {
              console.error("Failed to parse pendingRegistration", e);
            }
          } else {
            if (isOwnerEmail) {
              assignedRole = "owner";
            } else if (isFirstUser || isAdminEmail) {
              assignedRole = "admin";
            } else {
              assignedStatus = "pending";
            }
          }

          profile = {
            uid: user.uid,
            email: user.email,
            displayName: assignedDisplayName,
            role: assignedRole,
            status: assignedStatus,
            schoolId: assignedSchoolId,
            schoolName: assignedSchoolName,
            assignedClassId: null,
            coordinatorIds: [],
            principalId: null,
          };

          try {
            await usersApi.saveProfile(user.uid, profile);
          } catch (e) {
            console.warn(
              "Could not save new profile, but continuing with local state",
              e,
            );
          }
        }
      } else if (isOwnerEmail && (profile.role !== "owner" || profile.status !== "active")) {
        // Force update existing profile for sekhar.root@gmail.com to owner and active status
        profile.role = "owner";
        profile.status = "active";
        try {
          await usersApi.saveProfile(user.uid, profile);
        } catch (e) {
          console.warn(
            "Could not update owner profile, but continuing with local state",
            e,
          );
        }
      }
      const normalized = normalizeProfile(profile);
      setUserProfile(normalized);
      if (normalized) {
        try {
          localStorage.setItem("cached_user_profile", JSON.stringify(normalized));
          localStorage.setItem("cached_auth_uid", user.uid);
        } catch (e) {
          console.warn("Could not save profile to localStorage cache", e);
        }
      }
    } catch (err) {
      console.error("Error fetching or syncing user profile:", err);
    }
  };

  const [activeSchoolId, setLocalActiveSchoolId] = useState<string>(() => {
    return localStorage.getItem("activeSchoolId") || localStorage.getItem("adminSelectedSchoolId") || "default_school";
  });
  const [activeSchoolName, setActiveSchoolName] = useState<string>(() => {
    return localStorage.getItem("activeSchoolName") || localStorage.getItem("adminSelectedSchoolName") || "Default School";
  });

  useEffect(() => {
    if (userProfile) {
      const isOwnerOrAdmin =
        userProfile.role === "owner" ||
        userProfile.role === "admin" ||
        userProfile.email === "sekhar.root@gmail.com";
      if (isOwnerOrAdmin) {
        const storedId = localStorage.getItem("activeSchoolId") || localStorage.getItem("adminSelectedSchoolId") || "default_school";
        const storedName = localStorage.getItem("activeSchoolName") || localStorage.getItem("adminSelectedSchoolName") || "Default School";
        setLocalActiveSchoolId(storedId);
        setActiveSchoolName(storedName);
        setActiveSchoolId(storedId);
      } else {
        const profileSchoolId = userProfile.schoolId || "default_school";
        const profileSchoolName = userProfile.schoolName || "Default School";
        setLocalActiveSchoolId(profileSchoolId);
        setActiveSchoolName(profileSchoolName);
        setActiveSchoolId(profileSchoolId);
      }
    } else if (!loading && !currentUser) {
      setLocalActiveSchoolId("default_school");
      setActiveSchoolName("Default School");
      setActiveSchoolId("default_school");
    }
  }, [userProfile, loading, currentUser]);

  const setActiveSchool = (schoolId: string, schoolName: string) => {
    setLocalActiveSchoolId(schoolId);
    setActiveSchoolName(schoolName);
    setActiveSchoolId(schoolId);
    localStorage.setItem("activeSchoolId", schoolId);
    localStorage.setItem("activeSchoolName", schoolName);
    localStorage.setItem("adminSelectedSchoolId", schoolId);
    localStorage.setItem("adminSelectedSchoolName", schoolName);
    
    // Invalidate the cache to ensure we fetch fresh data on the next load
    window.dispatchEvent(new CustomEvent("force-sync"));
    
    // Reload the page to reset all memory variables and fetch fresh data from the chosen tenant database cleanly
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Request durable persistent storage from the browser to prevent cache eviction
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        if (persistent) {
          console.log("Durable storage granted! Browser will not clear cached student profiles.");
        } else {
          console.log("Storage is best-effort. Browser may evict local cache under storage pressure.");
        }
      });
    }
  }, []);

  useEffect(() => {
    let profileUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthResolved(true);

      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      // If we don't have a cached profile, show loading while resolving auth
      if (!hasCachedProfile()) {
        setLoading(true);
      }
      setCurrentUser(user);

      if (user) {
        try {
          localStorage.setItem("cached_auth_uid", user.uid);
          sessionStorage.removeItem("is_logging_out");
        } catch {}

        await fetchAndSyncProfile(user);

        // Attach real-time snapshot listener for live permission/class assignment updates
        profileUnsub = onSnapshot(
          doc(db, "users", user.uid),
          (snapshot) => {
            if (snapshot.exists()) {
              const liveData = snapshot.data();
              const normalized = normalizeProfile({ uid: snapshot.id, ...liveData });
              if (normalized) {
                setUserProfile(normalized);
                try {
                  localStorage.setItem("cached_user_profile", JSON.stringify(normalized));
                } catch {}
              }
            }
          },
          (err) => {
            console.warn("Real-time profile listener notice:", err);
          }
        );
      } else {
        setUserProfile(null);
        try {
          localStorage.removeItem("cached_user_profile");
          localStorage.removeItem("cached_auth_uid");
          sessionStorage.removeItem("is_logging_out");
        } catch {}
      }
      setLoading(false);
      setInitialLoad(false);
    });

    return () => {
      if (profileUnsub) profileUnsub();
      unsubscribe();
    };
  }, []);

  const reloadProfile = async () => {
    if (currentUser) {
      await fetchAndSyncProfile(currentUser);
    }
  };

  const signOut = async () => {
    try {
      sessionStorage.setItem("is_logging_out", "true");
      localStorage.removeItem("cached_user_profile");
      localStorage.removeItem("cached_auth_uid");
    } catch {}
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signOut,
        reloadProfile,
        activeSchoolId,
        activeSchoolName,
        setActiveSchool,
        authResolved,
      }}
    >
      {initialLoad ? (
        <LoadingOverlay />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
