"use client";

export default function ExperienceError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#090909",
        color: "#FCF6F5",
        fontFamily: "Inter, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>
        Something went wrong
      </h2>
      <p style={{ color: "rgba(252,246,245,0.65)", marginBottom: "24px" }}>
        We hit a snag loading your onboarding. Give it another shot.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: "12px 32px",
          background: "linear-gradient(to bottom, #4d8eff, #1a5fff)",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
