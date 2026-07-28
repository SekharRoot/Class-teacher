// Clean helper stubs for student image operations (using Firebase Firestore as primary storage)

export async function saveStudentImageInRtdb(_schoolId: string, _studentId: string, _base64Image: string): Promise<boolean> {
  // Images are stored directly in Firestore
  return true;
}

export async function getStudentImageFromRtdb(_schoolId: string, _studentId: string): Promise<string> {
  return "";
}

export async function deleteStudentImageFromRtdb(_schoolId: string, _studentId: string): Promise<void> {
  return;
}

