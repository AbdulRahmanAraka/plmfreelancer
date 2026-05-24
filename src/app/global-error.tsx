"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", padding: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              color: "#b91c1c",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Critical error
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0 8px 0" }}>
            The application crashed
          </h1>
          <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>
            We&apos;ve been notified. Please try again.
          </p>
          {error.digest ? (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 20,
              background: "#4338ca",
              color: "#ffffff",
              border: 0,
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
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
