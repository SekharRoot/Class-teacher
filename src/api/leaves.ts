import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
import { LeaveRequest } from "../types";
import { classesApi } from "./classes";

let leavesCache: LeaveRequest[] | null = null;
let leavesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const leavesApi = {
  /**
   * Fetches all leave requests from Firestore.
   */
  async getAll(
    forceRefresh = false,
    fetchLimit = 50,
  ): Promise<LeaveRequest[]> {
    if (
      !forceRefresh &&
      leavesCache &&
      leavesCache.length >= fetchLimit &&
      Date.now() - leavesCacheTime < CACHE_DURATION
    ) {
      return leavesCache;
    }
    try {
      const activeSchoolId = getActiveSchoolId();
      const classesList = await classesApi.getAll();
      const classIds = ["unassigned", ...classesList.map(c => c.id)];

      const promises = classIds.map(async (cId) => {
        const q = query(
          collection(db, "schools", activeSchoolId, "classes", cId, "leaves"),
          orderBy("appliedAt", "desc"),
          limit(fetchLimit)
        );
        const snapshot = await getDocs(q);
        const subList: LeaveRequest[] = [];
        snapshot.forEach((doc) => {
          subList.push({ id: doc.id, ...doc.data() } as LeaveRequest);
        });
        return subList;
      });

      const results = await Promise.all(promises);
      const list = results.flat();

      // Sort by appliedAt desc
      list.sort((a, b) => {
        const dateA = a.appliedAt || "";
        const dateB = b.appliedAt || "";
        return dateB.localeCompare(dateA);
      });

      leavesCache = list.slice(0, fetchLimit);
      leavesCacheTime = Date.now();
      return leavesCache;
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
      const activeSchoolId = (leave as any).schoolId || getActiveSchoolId();
      const cId = leave.classId || "unassigned";
      const docRef = doc(db, "schools", activeSchoolId, "classes", cId, "leaves", leave.id);
      await setDoc(docRef, {
        schoolId: activeSchoolId,
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
      const activeSchoolId = (leave as any).schoolId || getActiveSchoolId();
      let cId = leave.classId;
      if (!cId) {
        const cached = leavesCache?.find(l => l.id === leaveId);
        if (cached) {
          cId = cached.classId || "unassigned";
        } else {
          const classesList = await classesApi.getAll();
          const classIds = ["unassigned", ...classesList.map(c => c.id)];
          for (const cid of classIds) {
            const ref = doc(db, "schools", activeSchoolId, "classes", cid, "leaves", leaveId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              cId = cid;
              break;
            }
          }
        }
      }

      if (!cId) {
        cId = "unassigned";
      }

      const docRef = doc(db, "schools", activeSchoolId, "classes", cId, "leaves", leaveId);
      await updateDoc(docRef, {
        schoolId: activeSchoolId,
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
      const activeSchoolId = getActiveSchoolId();
      let cId = "";
      const cached = leavesCache?.find(l => l.id === leaveId);
      if (cached) {
        cId = cached.classId || "unassigned";
      } else {
        const classesList = await classesApi.getAll();
        const classIds = ["unassigned", ...classesList.map(c => c.id)];
        for (const cid of classIds) {
          const ref = doc(db, "schools", activeSchoolId, "classes", cid, "leaves", leaveId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            cId = cid;
            break;
          }
        }
      }

      if (!cId) cId = "unassigned";

      const docRef = doc(db, "schools", activeSchoolId, "classes", cId, "leaves", leaveId);
      await deleteDoc(docRef);
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leaves/${leaveId}`);
    }
  },
};
