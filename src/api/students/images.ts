import { ref as rtdbRef, set as rtdbSet, get as rtdbGet, remove as rtdbRemove } from "firebase/database";
import { getRtdb } from "../../lib/firebase";

function withTimeoutAndReject<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function saveStudentImageInRtdb(schoolId: string, studentId: string, base64Image: string): Promise<boolean> {
  const rtdb = getRtdb();
  if (!rtdb) {
    console.warn("[saveStudentImageInRtdb] Realtime Database not initialized.");
    return false;
  }
  const path = `schools/${schoolId}/students/${studentId}/image`;
  try {
    await withTimeoutAndReject(
      rtdbSet(rtdbRef(rtdb, path), base64Image),
      3000,
      "Realtime Database set operation timed out"
    );
    console.log(`[saveStudentImageInRtdb] Successfully saved image to RTDB at ${path}`);
    return true;
  } catch (err) {
    console.warn(`[saveStudentImageInRtdb] Failed to save student image to RTDB path ${path}:`, err);
    return false;
  }
}

export async function getStudentImageFromRtdb(schoolId: string, studentId: string): Promise<string> {
  const rtdb = getRtdb();
  if (!rtdb) return "";
  const path = `schools/${schoolId}/students/${studentId}/image`;
  try {
    const snapshot = await withTimeoutAndReject(
      rtdbGet(rtdbRef(rtdb, path)),
      3000,
      "Realtime Database get operation timed out"
    );
    return snapshot ? (snapshot.val() || "") : "";
  } catch (err) {
    console.warn(`[getStudentImageFromRtdb] Failed to get student image from RTDB for student ${studentId}:`, err);
    return "";
  }
}

export async function deleteStudentImageFromRtdb(schoolId: string, studentId: string): Promise<void> {
  const rtdb = getRtdb();
  if (!rtdb) return;
  const path = `schools/${schoolId}/students/${studentId}/image`;
  try {
    await withTimeoutAndReject(
      rtdbRemove(rtdbRef(rtdb, path)),
      3000,
      "Realtime Database remove operation timed out"
    );
  } catch (err) {
    console.warn(`[deleteStudentImageFromRtdb] Failed to delete student image from RTDB for student ${studentId}:`, err);
  }
}
