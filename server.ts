import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();

  const isProduction =
    process.env.NODE_ENV === "production" ||
    (!!process.env.K_SERVICE && process.env.NODE_ENV !== "development");

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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
    // Since this file (server.cjs) is inside 'dist/', __dirname is the 'dist' directory.
    const distPath = __dirname;
    console.log(`Production mode: Serving static files from: ${distPath}`);
    
    // Verify dist directory and index.html
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      console.error(`CRITICAL ERROR: index.html NOT found at ${indexPath}`);
      // Also check one level up just in case of different build structure
      const altPath = path.join(process.cwd(), "dist", "index.html");
      console.log(`Checking alternate path: ${altPath}`);
      if (fs.existsSync(altPath)) {
        console.log("Found index.html at alternate path!");
      }
    } else {
      console.log("Confirmed: index.html exists.");
    }

    app.use(express.static(distPath));
    
    // SPA fallback
    app.get("*", (req, res) => {
      // If it's an API route that reached here, return 404
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
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
