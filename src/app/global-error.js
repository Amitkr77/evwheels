"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

// Root-level fallback — only renders if the root layout itself throws.
// Must render its own <html>/<body> since it replaces the entire tree.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    analytics.captureException(error, {
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      digest: error?.digest,
      boundary: "global",
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
          fontFamily: "system-ui, sans-serif",
        }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
          <p style={{ color: "#525252", marginBottom: "1.5rem" }}>
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "12px 24px",
              background: "#171717",
              color: "#fff",
              borderRadius: "999px",
              border: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
