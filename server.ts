import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000; // MUST be 3000 for AI Studio Cloud Run infrastructure

  const isProduction =
    process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;

  console.log(
    `Starting server in ${
      isProduction ? "production" : "development"
    } mode on port ${PORT}...`
  );

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mode: isProduction ? "production" : "development",
    });
  });

  // Vite middleware for development
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, we serve from the 'dist' directory
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static files from: ${distPath}`);
    
    // Verify dist directory exists
    if (!fs.existsSync(distPath)) {
      console.error(`CRITICAL: dist directory NOT found at ${distPath}`);
    } else {
      const indexPath = path.join(distPath, "index.html");
      if (!fs.existsSync(indexPath)) {
        console.error(`CRITICAL: index.html NOT found at ${indexPath}`);
      } else {
        console.log("Found index.html, ready to serve.");
      }
    }

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Application Error: Build artifacts not found.");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
