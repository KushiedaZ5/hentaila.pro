export const metadata = {
  title: "HentaiNator | HentaiLA",
  description: "Encuentra tu hentai ideal con HentaiNator.",
};

export default function HentainatorPage() {
  return (
    <>
      <section className="section top">
        <div className="top-header" style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1 className="section-title" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            HentaiNator
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            El Akinator del hentai. Nuestra IA mágica adivinará en qué estás pensando.
          </p>
        </div>
      </section>

      <div className="columns" style={{ display: "flex", justifyContent: "center" }}>
        <main style={{ width: "100%", maxWidth: "800px" }}>
          <section className="section">
            <div
              style={{
                backgroundColor: "var(--gray-dark)",
                borderRadius: ".5rem",
                padding: "3rem",
                textAlign: "center",
                color: "var(--text)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
              }}
            >
              <i className="fa-cogs" style={{ fontSize: "4rem", color: "var(--primary)", marginBottom: "1rem", display: "inline-block" }}></i>
              <h2 style={{ marginBottom: "1rem", color: "var(--title)" }}>En Construcción</h2>
              <p style={{ marginBottom: 0 }}>
                Nuestros desarrolladores están entrenando al HentaiNator. Estará disponible muy pronto.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
