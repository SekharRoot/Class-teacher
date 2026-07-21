import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  responsiveFontSizes,
  CssBaseline,
  useMediaQuery,
  Box,
} from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  translucencyEnabled: boolean;
  toggleTranslucency: () => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
  translucencyEnabled: false,
  toggleTranslucency: () => {},
  zoomLevel: 100,
  setZoomLevel: () => {},
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "light" || savedMode === "dark") {
      return savedMode;
    }
    return prefersDarkMode ? "dark" : "light";
  });

  const [translucencyEnabled, setTranslucencyEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("translucencyEnabled");
    return saved === "true";
  });

  const [zoomLevel, setZoomLevelState] = useState<number>(() => {
    const saved = localStorage.getItem("pageZoomLevel");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 50 && parsed <= 200) {
        return parsed;
      }
    }
    return 100;
  });

  const setZoomLevel = (zoom: number) => {
    const clamped = Math.max(50, Math.min(200, zoom));
    setZoomLevelState(clamped);
    localStorage.setItem("pageZoomLevel", clamped.toString());
  };

  useEffect(() => {
    const docEl = document.documentElement;
    if (docEl) {
      (docEl.style as any).zoom = `${zoomLevel}%`;
    }
  }, [zoomLevel]);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("translucencyEnabled", translucencyEnabled ? "true" : "false");
  }, [translucencyEnabled]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleTranslucency = () => {
    setTranslucencyEnabled((prev) => !prev);
  };

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode,
            primary: {
              main: mode === "light" ? "#1976d2" : "#90caf9",
            },
            background: {
              default: mode === "light" ? "#f4f6f8" : "#121212",
              paper: mode === "light" ? "#ffffff" : "#1e1e1e",
            },
          },
          typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
          components: {
            MuiPaper: {
              styleOverrides: {
                root: {
                  transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  ...(translucencyEnabled && {
                    backdropFilter: "blur(16px) saturate(140%)",
                    WebkitBackdropFilter: "blur(16px) saturate(140%)",
                    backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(30, 30, 30, 0.45)",
                    backgroundImage: "none",
                    border: mode === "light" ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: mode === "light" ? "0 8px 32px 0 rgba(31, 38, 135, 0.06)" : "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                  }),
                },
              },
            },
            MuiAppBar: {
              styleOverrides: {
                root: {
                  transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  ...(translucencyEnabled && {
                    backdropFilter: "blur(16px) saturate(140%)",
                    WebkitBackdropFilter: "blur(16px) saturate(140%)",
                    backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(18, 18, 18, 0.45)",
                    color: mode === "light" ? "#121212" : "#ffffff",
                    backgroundImage: "none",
                    borderBottom: mode === "light" ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "none",
                  }),
                },
              },
            },
            MuiDrawer: {
              styleOverrides: {
                paper: {
                  transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
                  ...(translucencyEnabled && {
                    backdropFilter: "blur(16px) saturate(140%)",
                    WebkitBackdropFilter: "blur(16px) saturate(140%)",
                    backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.45)" : "rgba(18, 18, 18, 0.45)",
                    backgroundImage: "none",
                    borderRight: mode === "light" ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                  }),
                },
              },
            },
          },
        }),
      ),
    [mode, translucencyEnabled],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, translucencyEnabled, toggleTranslucency, zoomLevel, setZoomLevel }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {translucencyEnabled && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              overflow: "hidden",
              pointerEvents: "none",
              background: mode === "light"
                ? "radial-gradient(circle at 50% 50%, #f4f6f8 0%, #e9edf1 100%)"
                : "radial-gradient(circle at 50% 50%, #121212 0%, #0a0a0a 100%)",
            }}
          >
            {/* Top-Right Blob */}
            <Box
              sx={{
                position: "absolute",
                top: "-15%",
                right: "-15%",
                width: { xs: "350px", sm: "600px" },
                height: { xs: "350px", sm: "600px" },
                borderRadius: "50%",
                background: mode === "light"
                  ? "radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0) 70%)"
                  : "radial-gradient(circle, rgba(144, 202, 249, 0.15) 0%, rgba(144, 202, 249, 0) 70%)",
                filter: "blur(70px)",
              }}
            />
            {/* Bottom-Left Blob */}
            <Box
              sx={{
                position: "absolute",
                bottom: "-15%",
                left: "-15%",
                width: { xs: "350px", sm: "600px" },
                height: { xs: "350px", sm: "600px" },
                borderRadius: "50%",
                background: mode === "light"
                  ? "radial-gradient(circle, rgba(156, 39, 176, 0.12) 0%, rgba(156, 39, 176, 0) 70%)"
                  : "radial-gradient(circle, rgba(206, 147, 216, 0.12) 0%, rgba(206, 147, 216, 0) 70%)",
                filter: "blur(70px)",
              }}
            />
            {/* Mid-Right Warm Accent Blob */}
            <Box
              sx={{
                position: "absolute",
                top: "35%",
                right: "10%",
                width: { xs: "300px", sm: "500px" },
                height: { xs: "300px", sm: "500px" },
                borderRadius: "50%",
                background: mode === "light"
                  ? "radial-gradient(circle, rgba(255, 152, 0, 0.08) 0%, rgba(255, 152, 0, 0) 70%)"
                  : "radial-gradient(circle, rgba(255, 171, 64, 0.08) 0%, rgba(255, 171, 64, 0) 70%)",
                filter: "blur(60px)",
              }}
            />
          </Box>
        )}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
