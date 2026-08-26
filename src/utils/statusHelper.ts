/**
 * Safely extracts a canonical status string ("present", "absent", "leave", or "")
 * from any attendance value, even if wrapped or nested in objects.
 */
export function unwrapStatus(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object" && val !== null) {
    if ("status" in val && val.status !== undefined) {
      return unwrapStatus(val.status);
    }
  }
  return "";
}
