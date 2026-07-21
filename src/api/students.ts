import { Student } from "../types";
import { clearStudentsCache } from "./students/core";
import {
  getAll,
  getPaginated,
  search,
  getAllInParallelChunks,
  getByClass,
  getStudentFromServer,
} from "./students/getters";
import {
  saveStudentImageInRtdb,
  getStudentImageFromRtdb,
  deleteStudentImageFromRtdb,
} from "./students/images";
import {
  create,
  update,
  deleteStudent,
  batchDelete,
  restore,
  permanentlyDelete,
  batchCreate,
  seedDemo,
} from "./students/mutations";
import {
  transferStudents,
  transferSchool,
} from "./students/transfers";
import {
  assignMissingProfileIds,
  syncProfiles,
} from "./students/sync";

export const studentsApi = {
  getAll,
  getPaginated,
  search,
  getAllInParallelChunks,
  getByClass,
  getStudentFromServer,
  saveStudentImageInRtdb,
  getStudentImageFromRtdb,
  deleteStudentImageFromRtdb,
  create,
  update,
  delete: deleteStudent,
  batchDelete,
  restore,
  permanentlyDelete,
  batchCreate,
  seedDemo,
  transferStudents,
  transferSchool,
  assignMissingProfileIds,
  syncProfiles,
  invalidateCache: clearStudentsCache,
};
