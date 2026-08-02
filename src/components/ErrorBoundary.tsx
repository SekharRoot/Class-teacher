import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // If the error occurred during a logout transition, bypass error UI and redirect to login
    if (typeof window !== "undefined" && sessionStorage.getItem("is_logging_out") === "true") {
      console.log("ErrorBoundary caught transient error during logout transition. Redirecting to login...");
      this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
      window.location.replace("/login");
      return;
    }

    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Automated recovery attempt if we haven't recovered recently
    const lastReloadStr = localStorage.getItem("last_crash_recovery_time");
    const now = Date.now();
    
    if (!lastReloadStr || now - parseInt(lastReloadStr, 10) > 30000) {
      localStorage.setItem("last_crash_recovery_time", now.toString());
      
      (async () => {
        try {
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

  private handleReset = async () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem("last_global_sync");
      localStorage.removeItem("cached_user_profile");
      localStorage.removeItem("cached_auth_uid");
      
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await window.caches.keys();
        for (const key of keys) {
          await window.caches.delete(key);
        }
      }
      
      window.location.reload();
    } catch (e) {
      console.error("Failed during light cache clear:", e);
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            backgroundColor: "#f4f6f8",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "#1f2937",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              borderRadius: "16px",
              textAlign: "center",
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 12px 0", color: "#dc2626" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: "0 0 24px 0", lineHeight: 1.5 }}>
              An unexpected runtime error occurred causing the application to halt. You can reload the page or reset cached session data to recover.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap" }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "1px solid #f87171",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Reset Cache & Reload
              </button>
            </div>

            {this.state.error && (
              <div
                style={{
                  textAlign: "left",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f9fafb",
                }}
              >
                <button
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    color: "#374151",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Error Details: {this.state.error.message}</span>
                  <span>{this.state.showDetails ? "▲" : "▼"}</span>
                </button>
                {this.state.showDetails && (
                  <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        maxHeight: "200px",
                        overflowY: "auto",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      {this.state.error.stack || "No stack trace available"}
                      {"\n\n"}
                      {this.state.errorInfo?.componentStack || "No component stack trace available"}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

