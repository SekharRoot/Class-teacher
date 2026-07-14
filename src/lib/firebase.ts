import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  setLogLevel,
  getFirestore,
} from "firebase/firestore";

// Suppress harmless Firebase SDK clock skew warnings that can happen under rapid updates or local clock mismatches
const originalError = console.error;
const originalWarn = console.warn;

console.error = function (...args: any[]) {
  const msg = args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(" ");
  if (msg.includes("Detected an update time that is in the future")) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = function (...args: any[]) {
  const msg = args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(" ");
  if (msg.includes("Detected an update time that is in the future")) {
    return;
  }
  originalWarn.apply(console, args);
};

// Get config from generated firebase-applet-config.json via import or fetch.
// In the AI Studio preview environment, this is injected by the platform.
import firebaseConfig from "../../firebase-applet-config.json";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { firebaseConfig };

const firestoreInstanceCache: Record<string, any> = {};

export function getFirestoreForDbId(databaseId: string): any {
  const cacheKey = databaseId || "(default)";
  if (firestoreInstanceCache[cacheKey]) {
    return firestoreInstanceCache[cacheKey];
  }
  try {
    const secondaryDb = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, cacheKey);
    firestoreInstanceCache[cacheKey] = secondaryDb;
    return secondaryDb;
  } catch (error) {
    console.warn(`Dynamic initialization of firestore for DB ID '${cacheKey}' failed or already exists. Attempting fallback.`, error);
    // Fallback: use getFirestore to retrieve or create it
    try {
      const instance = getFirestore(app, cacheKey);
      firestoreInstanceCache[cacheKey] = instance;
      return instance;
    } catch (fallbackError) {
      console.error("Fallback getFirestore failed", fallbackError);
      return rawDb;
    }
  }
}

// Use custom databaseId if specified in config, otherwise default
export const rawDb = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    experimentalForceLongPolling: true,
  },
  (firebaseConfig as any).firestoreDatabaseId || "(default)",
);

import { getDbInstanceForSchool } from "./databaseConfig";
import { getActiveSchoolId } from "./activeSchoolHelper";

export const db = getDbInstanceForSchool(getActiveSchoolId(), rawDb);

setLogLevel("error");

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let rtdbInstance: any = null;

export function getRtdb(): any {
  if (rtdbInstance) return rtdbInstance;
  try {
    const dbUrl = (firebaseConfig as any).databaseURL || `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com/`;
    rtdbInstance = getDatabase(app, dbUrl);
    return rtdbInstance;
  } catch (err) {
    console.error("Failed to initialize Realtime Database with custom URL:", err);
    try {
      rtdbInstance = getDatabase(app);
      return rtdbInstance;
    } catch (err2) {
      console.error("Fallback initialization of Realtime Database failed:", err2);
      return null;
    }
  }
}

