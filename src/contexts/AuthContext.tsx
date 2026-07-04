import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserProfile, UserRole } from "../types";
import { usersApi } from "../api/users";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  reloadProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

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

          const pendingRegStr = localStorage.getItem("pendingRegistration");
          if (pendingRegStr) {
            try {
              const pendingReg = JSON.parse(pendingRegStr);
              assignedRole = pendingReg.role;
              assignedStatus = pendingReg.status;
              assignedDisplayName =
                pendingReg.displayName || assignedDisplayName;
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
      } else if (isOwnerEmail && profile.role !== "owner") {
        // Force update existing profile for sekhar.root@gmail.com to owner
        profile.role = "owner";
        try {
          await usersApi.saveProfile(user.uid, profile);
        } catch (e) {
          console.warn(
            "Could not update owner profile, but continuing with local state",
            e,
          );
        }
      }
      setUserProfile(profile);
    } catch (err) {
      console.error("Error fetching or syncing user profile:", err);
      // In case of complete failure, we don't want to leave userProfile null if we could have made one.
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        await fetchAndSyncProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setInitialLoad(false);
    });

    return unsubscribe;
  }, []);

  const reloadProfile = async () => {
    if (currentUser) {
      await fetchAndSyncProfile(currentUser);
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userProfile, loading, signOut, reloadProfile }}
    >
      {initialLoad ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
          <div
            style={{
              marginTop: "16px",
              color: "#6b7280",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            Starting Classroom Manager...
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
