import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { School } from "../types";

export const schoolsApi = {
  /**
   * Fetches all schools ordered by name.
   */
  async getAll(): Promise<School[]> {
    try {
      const q = query(collection(db, "schools"));
      const querySnapshot = await getDocs(q);
      const list: School[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as School);
      });
      // Sort alphabetically in memory or let query orderBy handle it (needs index if orderBy has other fields, so in-memory is safest)
      return list.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "schools");
      return [];
    }
  },

  /**
   * Adds a new school.
   */
  async addSchool(name: string, address?: string): Promise<School> {
    try {
      const schoolId = "school_" + Math.random().toString(36).substr(2, 9);
      const docRef = doc(db, "schools", schoolId);
      const newSchool: School = {
        id: schoolId,
        name,
        address: address || "",
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      await setDoc(docRef, newSchool);
      return newSchool;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "schools");
      throw error;
    }
  },

  /**
   * Updates a school (e.g. toggling active state or name/address).
   */
  async updateSchool(schoolId: string, data: Partial<School>): Promise<void> {
    try {
      const docRef = doc(db, "schools", schoolId);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schools/${schoolId}`);
      throw error;
    }
  },

  /**
   * Deletes a school.
   */
  async deleteSchool(schoolId: string): Promise<void> {
    try {
      const docRef = doc(db, "schools", schoolId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}`);
      throw error;
    }
  },
};
