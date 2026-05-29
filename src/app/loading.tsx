export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main)",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <img
          src="/logopm.webp"
          alt="Loading..."
          className="ai-box-animate"
          style={{ width: 64, height: 64, objectFit: "contain" }}
        />

        <p
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          MEMUAT...
        </p>
      </div>
    </div>
  );
}
