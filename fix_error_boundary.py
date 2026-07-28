import re

with open("src/components/ErrorBoundary.tsx", "r") as f:
    content = f.read()

# Replace the specific chunk error handling with a generic one
start_marker = "    // Check if the error is related to dynamic chunk loading failure"
end_marker = "  private handleReset = async () => {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

replacement = """    // We extend the automated recovery to handle ANY unexpected crash (including React Minified Errors).
    // This provides a powerful workaround for data-handling bugs by purging corrupted local caches automatically.
    console.warn("Crash detected in ErrorBoundary. Attempting automated page recovery...");
    const lastReloadStr = localStorage.getItem("last_crash_recovery_time");
    const now = Date.now();
    
    // Only auto-reload if we haven't crashed in the last 30 seconds to prevent infinite reload loops.
    // This allows the app to self-heal from corrupted local caches or transient React Hook errors.
    if (!lastReloadStr || now - parseInt(lastReloadStr, 10) > 30000) {
      localStorage.setItem("last_crash_recovery_time", now.toString());
      
      (async () => {
        try {
          // Comprehensive data purge
          localStorage.removeItem("cached_user_profile");
          localStorage.removeItem("cached_auth_uid");
          localStorage.removeItem("last_global_sync");
          sessionStorage.clear();
          
          if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          }
          
          if ("caches" in window) {
            const keys = await window.caches.keys();
            for (const key of keys) {
              await window.caches.delete(key);
            }
          }
          
          // Force a hard reload with a cache-busting timestamp
          const url = new URL(window.location.href);
          url.searchParams.set("t", Date.now().toString());
          window.location.replace(url.toString());
        } catch (e) {
          console.error("Failed during ErrorBoundary force recovery:", e);
          window.location.reload();
        }
      })();
    }
  }

"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open("src/components/ErrorBoundary.tsx", "w") as f:
    f.write(new_content)

print("Fixed ErrorBoundary")
