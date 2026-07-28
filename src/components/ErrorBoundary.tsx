import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // If the error occurred during a logout transition, bypass error UI and redirect to login
    if (typeof window !== "undefined" && sessionStorage.getItem("is_logging_out") === "true") {
      console.log("ErrorBoundary caught transient error during logout transition. Redirecting to login...");
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.replace("/login");
      return;
    }

    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // We extend the automated recovery to handle ANY unexpected crash (including React Minified Errors).
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

  private handleReset = async () => {
    try {
      // Clear session keys while keeping offline IndexedDB data intact
      sessionStorage.clear();
      localStorage.removeItem("last_global_sync");
      
      // Clear HTTP service worker caches
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await window.caches.keys();
        for (const key of keys) {
          await window.caches.delete(key);
        }
      }
      
      // Reload page
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 3,
            bgcolor: "#f4f6f8",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              maxWidth: 600,
              width: "100%",
              borderRadius: 4,
              textAlign: "center",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "error.main" }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected runtime error has occurred, causing the application to crash. You can attempt to reload the page or clear local cache.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={this.handleReset}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
              >
                Reset Cache & Reload
              </Button>
            </Box>

            {this.state.error && (
              <Accordion sx={{ boxShadow: "none", border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", textAlign: "left" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="caption" sx={{ fontWeight: "bold", fontFamily: "monospace" }}>
                    Error Details: {this.state.error.message}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "grey.50", p: 2 }}>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      display: "block",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      color: "text.secondary",
                    }}
                  >
                    {this.state.error.stack || "No stack trace available"}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack || "No component stack trace available"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
