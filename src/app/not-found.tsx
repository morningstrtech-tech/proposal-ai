import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        {/* Large 404 */}
        <div
          style={{
            fontSize: "8rem",
            fontWeight: 900,
            lineHeight: 1,
            color: "var(--primary)",
            opacity: 0.15,
            fontFamily: "var(--font-main)",
            letterSpacing: "-0.05em",
            marginBottom: "-1rem",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-main)",
            marginBottom: "1rem",
          }}
        >
          Halaman Tidak Ditemukan
        </h1>

        <p
          style={{
            fontFamily: "var(--font-main)",
            color: "var(--text-muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.
          Periksa URL atau kembali ke beranda.
        </p>

        <Link href="/" style={{ textDecoration: "none" }}>
          <button
            className="btn-material"
            style={{
              padding: "1rem 2rem",
              fontSize: "0.9rem",
              margin: "0 auto",
            }}
          >
            KEMBALI KE BERANDA
          </button>
        </Link>
      </div>
    </div>
  );
}
