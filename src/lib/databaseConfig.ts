import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";

/**
 * DATABASE AND MULTI-TENANT CONFIGURATION SERVICE
 * 
 * This module is designed to support dynamic connection to different Firestore databases or
 * separate Firebase projects per school in the future.
 * 
 * To add a new Firestore database or external database details for a school, insert its
 * details into the `SCHOOL_DATABASE_REGISTRY` below, and the app will automatically fetch
 * and route operations for that school through the correct connection.
 */

// Interface for database connection configuration
export interface DatabaseConnectionConfig {
  schoolId: string;
  schoolName: string;
  provider: "firebase" | "mongodb" | "postgres"; // Future-proof provider support
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    firestoreDatabaseId?: string; // Specify custom databaseId for Firestore multi-database instances
  };
  customEndpoint?: string; // In case of REST/GraphQL or other databases
}

// Registry containing database configurations for schools
const SCHOOL_DATABASE_REGISTRY: Record<string, DatabaseConnectionConfig> = {
  /*
  // TEMPLATE FOR CONNECTING A SCHOOL TO A SEPARATE FIRESTORE DATABASE
  school_example123: {
    schoolId: "school_example123",
    schoolName: "Example Academy",
    provider: "firebase",
    firebaseConfig: {
      apiKey: "AIzaSyD-YourApiKey...",
      authDomain: "example-academy.firebaseapp.com",
      projectId: "example-academy-project-id",
      storageBucket: "example-academy.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:abcdef123456",
      firestoreDatabaseId: "(default)", // or "school-db-id"
    }
  },
  
  // TEMPLATE FOR CONNECTING TO AN EXTERNAL REST / SQL ENDPOINT IN FUTURE
  school_external99: {
    schoolId: "school_external99",
    schoolName: "Metro High School",
    provider: "postgres",
    customEndpoint: "https://api.metrohigh.edu/v1/attendance"
  }
  */
};

// Cache for initialized secondary firestore instances to prevent re-initialization
const initializedFirestoreCache: Record<string, Firestore> = {};

/**
 * Returns the correct database instance (Firestore instance or service wrapper)
 * associated with a specific school.
 * 
 * @param schoolId The school identifier
 * @returns The active Firestore connection instance for that school
 */
export function getDbInstanceForSchool(schoolId: string | null | undefined, defaultDb: Firestore): Firestore {
  if (!schoolId || schoolId === "default_school") {
    return defaultDb;
  }

  // Check if a custom connection is registered for this school
  const config = SCHOOL_DATABASE_REGISTRY[schoolId];
  if (!config || config.provider !== "firebase" || !config.firebaseConfig) {
    // If no config, fall back to default Firestore database instance
    return defaultDb;
  }

  // Return cached instance if already initialized
  if (initializedFirestoreCache[schoolId]) {
    return initializedFirestoreCache[schoolId];
  }

  try {
    // Initialize secondary Firebase app and Firestore instance dynamically
    const secondaryApp = initializeApp(config.firebaseConfig, `App_${schoolId}`);
    const secondaryDb = initializeFirestore(secondaryApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
      experimentalForceLongPolling: true,
    }, config.firebaseConfig.firestoreDatabaseId || "(default)");

    initializedFirestoreCache[schoolId] = secondaryDb;
    return secondaryDb;
  } catch (error) {
    console.error(`Failed to initialize custom database for school ${schoolId}. Falling back to default database.`, error);
    return defaultDb;
  }
}
