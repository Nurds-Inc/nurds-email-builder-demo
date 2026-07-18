import type { Plugin } from "vite";

const VENDOR_TOKEN_ORIGINS = [
  "https://api.beacas.com",
  "https://api.easyemail.pro",
  "https://api-easyemail-pro.vercel.app",
];

/**
 * Redirect Easy Email's hard-coded entitlement lookup to the Nurds compatibility
 * endpoint. Remove this plugin when the vendor SDK supports an API-base option.
 */
export function easyEmailTokenApiPlugin(apiOrigin: string): Plugin {
  const normalizedOrigin = apiOrigin.replace(/\/$/, "");

  return {
    name: "nurds-easy-email-token-api",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("easy-email-pro-core") || !code.includes("/api/public/token")) {
        return null;
      }

      let transformed = code;
      for (const vendorOrigin of VENDOR_TOKEN_ORIGINS) {
        transformed = transformed.replaceAll(vendorOrigin, normalizedOrigin);
      }
      transformed = transformed.replaceAll(
        "/api/public/token",
        "/api/v1/public/email-builder/token",
      );

      return { code: transformed, map: null };
    },
  };
}
