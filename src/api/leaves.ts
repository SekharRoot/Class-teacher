import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { LeaveRequest } from "../types";

let leavesCache: LeaveRequest[] | null = null;
let leavesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const leavesApi = {
  /**
   * Fetches all leave requests from Firestore.
   */
  async getAll(forceRefresh = false): Promise<LeaveRequest[]> {
    if (
      !forceRefresh &&
      leavesCache &&
      Date.now() - leavesCacheTime < CACHE_DURATION
    ) {
      return leavesCache;
    }
    try {
      const q = query(collection(db, "leaves"));
      const querySnapshot = await getDocs(q);
      const list: LeaveRequest[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as LeaveRequest);
      });

      // Sort by appliedAt descending
      list.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

      leavesCache = list;
      leavesCacheTime = Date.now();
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "leaves");
      return [];
    }
  },

  invalidateCache() {
    leavesCache = null;
  },

  /**
   * Creates a new leave request.
   */
  async create(leave: LeaveRequest): Promise<void> {
    try {
      const docRef = doc(db, "leaves", leave.id);
      await setDoc(docRef, {
        ...leave,
        appliedAt: leave.appliedAt || new Date().toISOString(),
      });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `leaves/${leave.id}`);
    }
  },

  /**
   * Updates an existing leave request (e.g., status, approval).
   */
  async update(leaveId: string, leave: Partial<LeaveRequest>): Promise<void> {
    try {
      const docRef = doc(db, "leaves", leaveId);
      await updateDoc(docRef, {
        ...leave,
        updatedAt: new Date().toISOString(),
      });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `leaves/${leaveId}`);
    }
  },

  /**
   * Deletes a leave request.
   */
  async delete(leaveId: string): Promise<void> {
    try {
      const docRef = doc(db, "leaves", leaveId);
      await deleteDoc(docRef);
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leaves/${leaveId}`);
    }
  },
};
