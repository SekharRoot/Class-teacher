import { ref as rtdbRef, set as rtdbSet, get as rtdbGet, remove as rtdbRemove } from "firebase/database";
import { getRtdb } from "../../lib/firebase";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, defaultValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(defaultValue), timeoutMs))
  ]);
}

export async function saveStudentImageInRtdb(schoolId: string, studentId: string, base64Image: string): Promise<void> {
  const rtdb = getRtdb();
  if (!rtdb) throw new Error("Realtime Database not initialized");
  const path = `schools/${schoolId}/students/${studentId}/image`;
  // Timeout in 3.5 seconds to prevent hanging
  await withTimeout(rtdbSet(rtdbRef(rtdb, path), base64Image), 3500, undefined);
}

export async function getStudentImageFromRtdb(schoolId: string, studentId: string): Promise<string> {
  const rtdb = getRtdb();
  if (!rtdb) return "";
  const path = `schools/${schoolId}/students/${studentId}/image`;
  try {
    const snapshot = await withTimeout(rtdbGet(rtdbRef(rtdb, path)), 3500, null as any);
    return snapshot ? (snapshot.val() || "") : "";
  } catch (err) {
    console.warn(`Failed to get student image from RTDB for student ${studentId}:`, err);
    return "";
  }
}

export async function deleteStudentImageFromRtdb(schoolId: string, studentId: string): Promise<void> {
  const rtdb = getRtdb();
  if (!rtdb) return;
  const path = `schools/${schoolId}/students/${studentId}/image`;
  try {
    await withTimeout(rtdbRemove(rtdbRef(rtdb, path)), 3500, undefined);
  } catch (err) {
    console.warn(`Failed to delete student image from RTDB for student ${studentId}:`, err);
  }
}
