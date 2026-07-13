import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const currentFilename = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : (typeof __filename !== 'undefined' ? __filename : '');
const currentDirname = currentFilename ? path.dirname(currentFilename) : (typeof __dirname !== 'undefined' ? __dirname : process.cwd());

async function startServer() {
  const app = express();

  const isProduction =
    process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;

  const PORT = 3000;

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
    // We try to find index.html in several plausible locations to be resilient to different deployment structures
    const possiblePaths = [
      path.join(process.cwd(), "dist"),
      path.join(currentDirname), // Often /app/dist
      path.join(process.cwd(), "applet", "dist"),
    ];

    let indexPath = "";
    for (const p of possiblePaths) {
      const candidate = path.join(p, "index.html");
      if (fs.existsSync(candidate)) {
        indexPath = candidate;
        break;
      }
    }

    if (!indexPath) {
      indexPath = path.join(process.cwd(), "dist", "index.html");
    }

    const distPath = path.dirname(indexPath);
    console.log(`Production mode: Serving static files from: ${distPath}`);
    console.log(`Resolved index.html path: ${indexPath}`);

    // Verify index.html exists
    if (!indexPath || !fs.existsSync(indexPath)) {
      console.error(`CRITICAL ERROR: index.html NOT found at ${indexPath}`);
    } else {
      console.log("Confirmed: index.html exists.");
    }

    app.use(express.static(distPath, { index: false }));
    
    // SPA fallback
    app.get("*", (req, res) => {
      // If it's an API route that reached here, return 404
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      if (!fs.existsSync(indexPath)) {
        return res.status(500).send(`Application Error: Build artifacts not found at ${indexPath}. Please rebuild.`);
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
          res.status(500).send("Application Error: Failed to serve index.html.");
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
