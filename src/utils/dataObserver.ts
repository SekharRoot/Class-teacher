import { Student, ClassItem, LeaveRequest, UserProfile } from "../types";
import { cache } from "../lib/cache";
import { studentCache } from "./studentCache";

export type Topic = "students" | "classes" | "leaves" | "users";
export type ObserverCallback<T = any> = (data: T) => void;

class DataObserver {
  private observers: Map<Topic, Set<ObserverCallback>> = new Map();

  constructor() {
    this.observers.set("students", new Set());
    this.observers.set("classes", new Set());
    this.observers.set("leaves", new Set());
    this.observers.set("users", new Set());
  }

  /**
   * Subscribe an observer function to a specific topic
   */
  public subscribe<T = any>(topic: Topic, callback: ObserverCallback<T>): () => void {
    if (!this.observers.has(topic)) {
      this.observers.set(topic, new Set());
    }
    const set = this.observers.get(topic)!;
    set.add(callback as ObserverCallback);

    return () => {
      set.delete(callback as ObserverCallback);
    };
  }

  /**
   * Silently merge new/updated items into cache and notify observers without UI flash
   */
  public async notifyAndCache<T = any>(topic: Topic, freshData: T): Promise<void> {
    // 1. Silently update local IndexedDB cache
    try {
      if (topic === "students") {
        const students = freshData as unknown as Student[];
        await cache.set("offline_students", students);
        await studentCache.clearAndSet(students);
      } else if (topic === "classes") {
        await cache.set("offline_classes", freshData as unknown as ClassItem[]);
      } else if (topic === "leaves") {
        await cache.set("offline_leaves", freshData as unknown as LeaveRequest[]);
      } else if (topic === "users") {
        await cache.set("offline_users", freshData as unknown as UserProfile[]);
      }
    } catch (err) {
      console.warn(`DataObserver: Cache update failed for topic ${topic}:`, err);
    }

    // 2. Notify all registered observers
    const callbacks = this.observers.get(topic);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(freshData);
        } catch (err) {
          console.error(`DataObserver: Error in callback for ${topic}:`, err);
        }
      });
    }
  }

  /**
   * Merges a subset of updated items silently into existing cached items for a topic
   */
  public async silentMerge<T extends { id: string }>(
    topic: Topic,
    currentItems: T[],
    updates: T[],
    deletions?: string[]
  ): Promise<T[]> {
    const itemMap = new Map<string, T>(currentItems.map((item) => [item.id, item]));

    // Apply updates
    updates.forEach((item) => {
      itemMap.set(item.id, { ...itemMap.get(item.id), ...item });
    });

    // Apply deletions
    if (deletions && deletions.length > 0) {
      deletions.forEach((delId) => {
        itemMap.delete(delId);
      });
    }

    const merged = Array.from(itemMap.values());
    await this.notifyAndCache(topic, merged);
    return merged;
  }
}

export const dataObserver = new DataObserver();
