import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "classroom-manager-image-cache";
const STORE_NAME = "profile-images";
const DB_VERSION = 1;

interface ImageEntry {
  url: string;
  data: string; // Base64 or Blob
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "url" });
        }
      },
    });
  }
  return dbPromise;
};

export const imageCache = {
  async get(url: string): Promise<string | null> {
    if (!url) return null;
    try {
      const db = await getDB();
      const entry = await db.get(STORE_NAME, url);
      if (entry) {
        return entry.data;
      }
    } catch (error) {
      console.error("Cache get error:", error);
    }
    return null;
  },

  async set(url: string, data: string) {
    if (!url || !data) return;
    try {
      const db = await getDB();
      await db.put(STORE_NAME, {
        url,
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  },

  async cleanup() {
    const lastCleanup = localStorage.getItem("last_image_cleanup");
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    if (lastCleanup && now - parseInt(lastCleanup) < ONE_WEEK) {
      return;
    }

    try {
      const db = await getDB();
      // Simple cleanup: delete everything older than 30 days
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      let cursor = await store.openCursor();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

      while (cursor) {
        if (now - cursor.value.timestamp > THIRTY_DAYS) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }
      localStorage.setItem("last_image_cleanup", now.toString());
      console.log("Image cache cleanup completed.");
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  },
};

export const fetchAndCacheImage = async (url: string): Promise<string> => {
  const cached = await imageCache.get(url);
  if (cached) return cached;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Compress image before caching
    const compressedBase64 = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Target dimensions (max 300px for profiles)
        let width = img.width;
        let height = img.height;
        const maxDim = 300;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        URL.revokeObjectURL(img.src);
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load image for compression"));
      };
    });

    await imageCache.set(url, compressedBase64);
    return compressedBase64;
  } catch (error) {
    console.error("Fetch image error:", error);
    return url; // Fallback to original URL
  }
};
