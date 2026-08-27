var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});
async function startServer() {
  const app = (0, import_express.default)();
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  console.log(
    `Starting server in ${isProduction ? "production" : "development"} mode on port ${PORT}...`
  );
  app.get(
    [
      "/api/health",
      "/health",
      "/_health",
      "/_ah/health",
      "/_ah/liveness",
      "/_ah/readiness"
    ],
    (req, res) => {
      res.json({
        status: "ok",
        mode: isProduction ? "production" : "development",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  );
  app.use(import_express.default.json());
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distCandidates = [
      import_path.default.join(process.cwd(), "dist"),
      typeof __dirname !== "undefined" ? __dirname : "",
      "/app/applet/dist",
      "/app/dist"
    ].filter(Boolean);
    let distPath = import_path.default.join(process.cwd(), "dist");
    for (const candidate of distCandidates) {
      if (import_fs.default.existsSync(import_path.default.join(candidate, "index.html"))) {
        distPath = candidate;
        break;
      }
    }
    const indexPath = import_path.default.join(distPath, "index.html");
    console.log(`Production mode: Serving static files from: ${distPath}`);
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      if (import_fs.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application index file not found.");
      }
    });
  }
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  const shutdown = (signal) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Forcing shutdown after timeout");
      process.exit(1);
    }, 1e4).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
