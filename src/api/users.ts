import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { UserProfile, UserRole } from "../types";

export const usersApi = {
  /**
   * Fetches all user profiles.
   */
  async getAll(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const list: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "users");
      return [];
    }
  },

  /**
   * Fetches a specific user profile by UID.
   */
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  /**
   * Saves or updates a user profile.
   */
  async saveProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(
        docRef,
        {
          uid,
          ...profile,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  },

  /**
   * Deletes a user profile.
   */
  async deleteProfile(uid: string): Promise<void> {
    try {
      const docRef = doc(db, "users", uid);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
    }
  },

  /**
   * Seeds demo users in firestore so roles can be easily assigned, tested, or loaded.
   */
  async seedDemoUsers(existingClasses: string[] = []): Promise<void> {
    const defaultClassId = existingClasses[0] || "demo-class-id";

    // We create structural profiles in Firestore
    // When a user logs in with these emails, their profile will match!
    const demoProfiles: Partial<UserProfile>[] = [
      {
        uid: "demo_admin",
        email: "admin@classroom.com",
        displayName: "Sekhar (Admin)",
        role: "admin",
        status: "active",
      },
      {
        uid: "demo_principal",
        email: "principal@classroom.com",
        displayName: "Dr. Sharma (Principal)",
        role: "principal",
        status: "active",
      },
      {
        uid: "demo_coordinator_1",
        email: "coord1@classroom.com",
        displayName: "Amit Roy (Academic Coordinator 1)",
        role: "academic_coordinator",
        status: "active",
        principalId: "demo_principal",
      },
      {
        uid: "demo_coordinator_2",
        email: "coord2@classroom.com",
        displayName: "Sita Sen (Academic Coordinator 2)",
        role: "academic_coordinator",
        status: "active",
        principalId: "demo_principal",
      },
      {
        uid: "demo_teacher_1",
        email: "teacher1@classroom.com",
        displayName: "Sunita Nair (Class Teacher 1)",
        role: "class_teacher",
        status: "active",
        assignedClassId: defaultClassId,
        coordinatorIds: ["demo_coordinator_1"],
      },
      {
        uid: "demo_teacher_2",
        email: "teacher2@classroom.com",
        displayName: "John Doe (Class Teacher 2)",
        role: "class_teacher",
        status: "active",
        assignedClassId: defaultClassId,
        coordinatorIds: ["demo_coordinator_1"],
      },
    ];

    try {
      for (const profile of demoProfiles) {
        if (profile.uid) {
          await this.saveProfile(profile.uid, profile);
        }
      }
    } catch (error) {
      console.error("Failed to seed demo users:", error);
    }
  },
};
