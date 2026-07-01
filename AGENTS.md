# AI Agent Instructions

## Build Configuration & Artifacts

- **CRITICAL**: Do NOT add `dist/` or `build/` directories to `.gitignore`. The platform's artifact upload process respects `.gitignore`, so ignoring these directories will cause the deployment to fail with "Build artifacts are empty."
- **Dependency & Type Safety**: Ensure all required packages, particularly type definitions (such as `@types/react`, `@types/react-dom`, and `@types/node`), are properly registered in `package.json`. Missing dependencies or incorrect type declarations can cause build-time compilation or type-checking failures, resulting in empty or invalid build artifacts.
- **Dependency Population**: If you encounter a build artifact failure or missing packages during compilation, always run `install_applet_dependencies` to ensure the Node environment is fully and cleanly populated before running a build.
- Ensure `package.json` contains the correct build script for a full-stack application (e.g. `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`).
- Ensure `server.ts` handles serving static files correctly in production mode. Use `process.env.NODE_ENV === 'production' || !!process.env.K_SERVICE` to detect production mode in Cloud Run.

## Multi-Platform Development

- **Flutter Frontend**: A mobile application located in the `/flutter` directory.
- **Backend/API**: The application primarily uses Firebase (Cloud Firestore) for data persistence. Both the React web app and Flutter mobile app share the same database structure.
- **Future Changes**: Any changes to the database schema or attendance logic should be synchronized across both the `src/api` (React) and `flutter/lib/services` (Flutter) modules.
- **API Endpoints**: If new REST endpoints are added to `server.ts`, the `FirebaseService` in Flutter should be updated to use the `http` package for communication.

## CI/CD & GitHub Pages Deployment

- **GitHub Pages Base Path**: The `vite.config.ts` uses dynamic detection (`process.env.GITHUB_ACTIONS === "true"`) to set the `base` path to `/${repoName}/` for GitHub Pages. Do NOT change this back to a hardcoded string or a simple `./` as it will break assets and assets loading on GitHub Pages.
- **GitHub Pages Deploy Action (CRITICAL)**: In `.github/workflows/deploy.yml`, the deploy action (`JamesIves/github-pages-deploy-action`) MUST deploy the static build to the `gh-pages` branch. **NEVER** change the target branch to `main` or `master` because doing so will completely overwrite the source repository's history with compiled build assets, destroying the source code.
- **TypeScript Configuration for Builds**: The `tsconfig.json` includes `src/**/*` and excludes output directories (`dist`, `output`, `out`, `**/*.cjs`). Keep these exclusions in place so that the linter/TypeScript compiler doesn't attempt to scan compiled/minified assets in output folders, which avoids breaking builds due to external asset issues.
