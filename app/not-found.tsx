import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section top" style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            fontSize: "8rem",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--primary)",
            display: "block",
            textShadow: "0 0 40px rgba(var(--primary-rgb, 255,0,110), 0.4)",
          }}
        >
          404
        </span>
      </div>
      <h1
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          color: "var(--text)",
        }}
      >
        Página no encontrada
      </h1>
      <p
        style={{
          color: "var(--text-light)",
          marginBottom: "2rem",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Lo sentimos, la página que buscas no existe o fue movida. Pero no te
        preocupes, tenemos mucho contenido esperándote.
      </p>
      <Link
        href="/"
        className="btn rnd"
        style={{ display: "inline-block" }}
      >
        Volver al Inicio
      </Link>
    </section>
  );
}
