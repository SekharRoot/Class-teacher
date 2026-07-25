import firebaseConfig from "../../firebase-applet-config.json";

// Helper function to fetch with a strict timeout to prevent blocking the UI
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs = 1500,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Attempts to delegate heavy calculations to Firebase Cloud Functions if available
 * (e.g. after upgrading to the Blaze plan and deploying the function).
 * Falls back silently to client-side execution if the cloud function is not deployed
 * or is unreachable.
 */
export async function tryCloudCalculation(
  type: string,
  payload: any,
): Promise<any> {
  const projectId = firebaseConfig?.projectId;
  if (!projectId) {
    return null;
  }

  // Standard endpoint format for HTTP Cloud Functions
  const region = "us-central1";
  const cloudFunctionUrl = `https://${region}-${projectId}.cloudfunctions.net/heavyCalculator`;

  try {
    console.log(`[Cloud Fallback] Checking/Executing cloud task: ${type}...`);
    const response = await fetchWithTimeout(
      cloudFunctionUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, payload }),
      },
      1500, // Fast 1.5s timeout: if under Spark (free) plan, fetch will fail or timeout immediately
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`[Cloud Fallback] Cloud execution successful for: ${type}`);
      return data.result;
    } else {
      console.warn(
        `[Cloud Fallback] Cloud returned non-ok status: ${response.status}. Falling back to local execution.`,
      );
    }
  } catch (error) {
    // Silent fallback to avoid disruption
    console.info(
      `[Cloud Fallback] Cloud execution unavailable (unreachable endpoint or Spark free plan). Details:`,
      error instanceof Error ? error.message : String(error),
    );
  }

  return null;
}
