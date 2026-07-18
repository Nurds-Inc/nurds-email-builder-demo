import { defineConfig } from "vite";
import path from "path";
import svgr from "vite-plugin-svgr";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import dotenv from "dotenv";
import { easyEmailTokenApiPlugin } from "./vite.easy-email-token-api";

const env = dotenv.config();
const emailBuilderTokenApiOrigin =
  process.env.EMAIL_BUILDER_TOKEN_API_ORIGIN || "https://api.nurds.com";
const emailBuilderClientId =
  env.parsed?.CLIENT_ID || process.env.CLIENT_ID || "NURDS_STAGING";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    easyEmailTokenApiPlugin(emailBuilderTokenApiOrigin),
    svgr({ exportAsDefault: true }) as any,
    monacoEditorPlugin({}) as any,
    // sentryVitePlugin({
    //   authToken: process.env.SENTRY_AUTH_TOKEN,
    //   org: "mao-wa",
    //   project: "b-react",
    // }),
  ].filter(Boolean) as any,
  define: {
    "process.env.UNSPLASH_CLIENT_ID": JSON.stringify(
      process.env.UNSPLASH_CLIENT_ID,
    ),
    "process.env.CLIENT_ID": JSON.stringify(
      emailBuilderClientId,
    ),
  },
  build: {
    emptyOutDir: true,
    minify: false,
    manifest: false,
    sourcemap: false,
  },

  resolve: {
    alias: {
      "mjml-browser": path.resolve("./node_modules/mjml-browser"),
      "html-minifier-terser": path.resolve(
        "./node_modules/html-minifier-terser/dist/htmlminifier.esm.bundle.js",
      ),
      "@": path.resolve("src"),
    },
  },
  optimizeDeps: {
    needsInterop: ["velocityjs"],
  },
});
