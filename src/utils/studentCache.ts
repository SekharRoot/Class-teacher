import { cache } from "../lib/cache";
import { Student } from "../types";

export const studentCache = {
  async getAll(): Promise<Student[]> {
    const list = await cache.get("offline_students");
    return list || [];
  },

  async setBatch(students: Student[]) {
    const all = await this.getAll();
    const map = new Map(all.map((s) => [s.id, s]));
    for (const student of students) {
      map.set(student.id, student);
    }
    const updatedList = Array.from(map.values());
    await cache.set("offline_students", updatedList);
  },

  async clearAndSet(students: Student[]) {
    await cache.set("offline_students", students);
  },

  async deleteBatch(ids: string[]) {
    const all = await this.getAll();
    const filtered = all.filter((s) => !ids.includes(s.id));
    await cache.set("offline_students", filtered);
  },

  async searchLocal(query: string): Promise<Student[]> {
    const students = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(lowerQuery) ||
        s.lastName.toLowerCase().includes(lowerQuery) ||
        s.rollNumber?.toLowerCase().includes(lowerQuery)
    );
  }
};
