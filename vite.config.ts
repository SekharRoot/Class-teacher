import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
  const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
  const isCloudRun = !!process.env.K_SERVICE;
  const base = (isGitHubActions && repoName && !isCloudRun) ? `/${repoName}/` : "/";

  return {
    base,
    plugins: [
      react(), 
      tailwindcss(),
      // VitePWA({
      //   registerType: "autoUpdate",
      //   manifest: {
      //     name: "Classroom Manager by Sekhar",
      //     short_name: "Classroom",
      //     description: "Attendance and Classroom Management System",
      //     theme_color: "#ffffff",
      //     background_color: "#ffffff",
      //     display: "standalone",
      //     start_url: base,
      //     scope: base,
      //     icons: [
      //       {
      //         src: "https://cdn-icons-png.flaticon.com/512/3587/3587091.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //         purpose: "any maskable"
      //       },
      //     ],
      //   },
      //   workbox: {
      //     cleanupOutdatedCaches: true,
      //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      //     maximumFileSizeToCacheInBytes: 10000000,
      //   },
      // })
    ],
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@mui") || id.includes("@emotion")) {
                return "mui-vendor";
              }
              if (id.includes("firebase")) {
                return "firebase-vendor";
              }
              if (id.includes("jspdf") || id.includes("html2canvas")) {
                return "pdf-vendor";
              }
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "react-vendor";
              }
              return "vendor";
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve("."),
      },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
