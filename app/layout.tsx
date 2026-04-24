import type { Metadata } from "next";
import "./globals.css";
import HeaderClient from "./components/HeaderClient";

export const metadata: Metadata = {
  title: "Ver Hentai Online | HentaiLA",
  description:
    "HentaiLA el mejor sitio para ver hentai en Latinoamérica. Streaming HD sin censura.",
};

export function generateViewport() {
  return { themeColor: "#000" };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+HK:400,700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/main.css" media="all" />
      </head>
      <body id="hentai" className="home">
        <div id="aa-wp">
          {/* ==================== HEADER ==================== */}
          <header id="hd" className="hd">
            <div className="top">
              <div className="cont">
                <HeaderClient />
              </div>
            </div>
          </header>

          {/* ==================== BODY ==================== */}
          <div className="bd cont">{children}</div>

          {/* ==================== FOOTER ==================== */}
          <footer className="ft">
            <div className="top">
              <div className="cont">
                <figure className="logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="190.51"
                    height="49"
                    viewBox="0 0 190.51 49"
                  >
                    <g transform="translate(-255 -31.5)">
                      <path
                        d="M26.321-16.429c0-4.367-2.853-7.061-7.62-7.061a19.506,19.506,0,0,0-4.523.653l1.3-7.265v-.122a.664.664,0,0,0-.693-.694H8.554a1,1,0,0,0-.937.816L2.36-.265v.122a.767.767,0,0,0,.734.776H9.247a1.124,1.124,0,0,0,.978-.9l2.893-16.408a11.328,11.328,0,0,1,2.69-.286c1.875,0,2.608.408,2.608,1.673a4.582,4.582,0,0,1-.122.98L15.808-.224v.163A.687.687,0,0,0,16.5.633h6.153a1.082,1.082,0,0,0,.978-.857l2.486-14.163A12.357,12.357,0,0,0,26.321-16.429Z"
                        transform="translate(252.64 71)"
                        fill="var(--gray-light)"
                      />
                      <path
                        d="M1309.636,469.828H1262.7a4,4,0,0,1-3.935-4.7l7.045-40a4,4,0,0,1,3.936-3.3H1316.7a4,4,0,0,1,3.935,4.7l-7.068,40A4,4,0,0,1,1309.636,469.828Z"
                        transform="translate(-875.7 -389.828)"
                        fill="var(--gray-light)"
                        stroke="rgba(0,0,0,0)"
                        strokeMiterlimit={10}
                        strokeWidth={1}
                      />
                      <path
                        d="M1308.414,460.606v.08a.794.794,0,0,1-.779.81l-6.869,0a.757.757,0,0,1-.7-.8l-4.193-23.716c-.071-.4-.134-.511-.254-.52-.145-.011-.229.2-.3.584l-3,17.072h4.465c.41,0,.719.15.7.71s-1.6,4.217-3.315,5.436c-1.8,1.283-13.176,1.174-15.354,1.174-4.665,0-9.24-1.56-9.24-7.24a14.514,14.514,0,0,1,.21-2.18l3.776-21.73a1.107,1.107,0,0,1,1.029-.84h6.793a.637.637,0,0,1,.6.67v.17l-3.786,21.73a7.012,7.012,0,0,0-.08.8c0,.96.49,1.3,1.688,1.3h3.866l3.379-19.674c1.608-4.16,4.865-5,8.78-5s6.985.758,7.935,4.873Z"
                        transform="translate(-875.712 -389.828)"
                        fill="var(--gray)"
                      />
                    </g>
                  </svg>
                </figure>
                <ul className="social-list">
                  <li><a href="#" className="fa-twitter" rel="nofollow" target="_blank"><span hidden>Twitter</span></a></li>
                  <li><a href="#" className="fa-facebook" rel="nofollow" target="_blank"><span hidden>Facebook</span></a></li>
                </ul>
              </div>
            </div>
            <div className="bot">
              <ul className="menu">
                <li><a href="/">Inicio</a></li>
                <li><a href="/catalogo">Directorio Hentai</a></li>
                <li><a href="/catalogo">Estrenos</a></li>
                <li><a href="#">Peticiones</a></li>
              </ul>
            </div>
            <p className="copy cont">
              ©2025 HentaiLA.pro — La próxima plataforma más grande de
              Latinoamérica.
              <span>
                Ningún vídeo se encuentra alojado en nuestros servidores.
              </span>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
