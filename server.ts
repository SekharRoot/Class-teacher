import express from "express";
import path from "path";
import fs from "fs";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

async function startServer() {
  const app = express();

  // Cloud Run / container port configuration (defaults strictly to 3000)
  const PORT = 3000;

  const isProduction =
    process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;

  console.log(
    `Starting server in ${
      isProduction ? "production" : "development"
    } mode on port ${PORT}...`
  );

  // Health check routes FIRST for Cloud Run & platform probes
  app.get(
    [
      "/api/health",
      "/health",
      "/_health",
      "/_ah/health",
      "/_ah/liveness",
      "/_ah/readiness",
    ],
    (req, res) => {
      res.json({
        status: "ok",
        mode: isProduction ? "production" : "development",
        timestamp: new Date().toISOString(),
      });
    }
  );

  // Body parser for JSON
  app.use(express.json());

  // Vite middleware for development vs static files for production
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distCandidates = [
      path.join(process.cwd(), "dist"),
      typeof __dirname !== "undefined" ? __dirname : "",
      "/app/applet/dist",
      "/app/dist",
    ].filter(Boolean);

    let distPath = path.join(process.cwd(), "dist");
    for (const candidate of distCandidates) {
      if (fs.existsSync(path.join(candidate, "index.html"))) {
        distPath = candidate;
        break;
      }
    }
    const indexPath = path.join(distPath, "index.html");

    console.log(`Production mode: Serving static files from: ${distPath}`);

    app.use(express.static(distPath));

    // SPA fallback
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application index file not found.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

