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
var currentDirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();
async function startServer() {
  const app = (0, import_express.default)();
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  console.log(
    `Starting server in ${isProduction ? "production" : "development"} mode on port ${PORT}...`
  );
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mode: isProduction ? "production" : "development"
    });
  });
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const possibleIndexLocations = [
      import_path.default.join(process.cwd(), "dist", "index.html"),
      import_path.default.join(process.cwd(), "index.html"),
      import_path.default.join(currentDirname, "index.html"),
      import_path.default.join(currentDirname, "..", "index.html"),
      import_path.default.join("/app/applet/dist/index.html"),
      import_path.default.join("/app/dist/index.html")
    ];
    let indexPath = "";
    for (const loc of possibleIndexLocations) {
      console.log(`Checking for index.html at: ${loc}`);
      if (import_fs.default.existsSync(loc)) {
        indexPath = loc;
        console.log(`Found index.html at: ${loc}`);
        break;
      }
    }
    if (!indexPath) {
      indexPath = import_path.default.join(process.cwd(), "dist", "index.html");
      console.warn(`Could not find index.html in any known location. Defaulting to: ${indexPath}`);
    }
    const distPath = import_path.default.dirname(indexPath);
    console.log(`Production mode: Serving static files from: ${distPath}`);
    if (!indexPath || !import_fs.default.existsSync(indexPath)) {
      console.error(`CRITICAL ERROR: index.html NOT found at ${indexPath}`);
      try {
        console.log(`Current Working Directory: ${process.cwd()}`);
        console.log(`Directory contents of ${process.cwd()}: ${import_fs.default.readdirSync(process.cwd()).join(", ")}`);
        const distDir = import_path.default.join(process.cwd(), "dist");
        if (import_fs.default.existsSync(distDir)) {
          console.log(`Directory contents of ${distDir}: ${import_fs.default.readdirSync(distDir).join(", ")}`);
        }
      } catch (err) {
        console.error("Error listing directories:", err);
      }
    } else {
      console.log("Confirmed: index.html exists.");
    }
    app.use(import_express.default.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      if (!import_fs.default.existsSync(indexPath)) {
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
//# sourceMappingURL=server.cjs.map
