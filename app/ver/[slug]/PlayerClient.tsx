"use client";

import { useState, useEffect } from "react";

// =============================================
// Types
// =============================================
interface VideoLink {
  id_link: number;
  url_video: string;
  idioma: string;
  es_descarga: boolean;
  calidad: string;
  servidor: { nombre: string };
}

interface PlayerClientProps {
  videos: VideoLink[]; // streaming videos (es_descarga = false)
  downloads: VideoLink[]; // download links (es_descarga = true)
}

// =============================================
// PlayerClient — Handles all client-side interactivity
// =============================================
export default function PlayerClient({ videos, downloads }: PlayerClientProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Close modals on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDownloadModal(false);
        setShowShareModal(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle body scroll when modal is open
  useEffect(() => {
    if (showDownloadModal || showShareModal) {
      document.body.classList.add("mdl-on");
    } else {
      document.body.classList.remove("mdl-on");
    }
  }, [showDownloadModal, showShareModal]);

  const currentVideo = videos[currentVideoIndex];

  return (
    <>
      {/* PLAYER SECTION */}
      <section className="section player">
        {/* Server Tabs */}
        <div className="video_options">
          <ul className="video_options-list" id="video-options-list">
            {videos.map((v, i) => (
              <li key={v.id_link}>
                <span
                  className={`video-tab${i === currentVideoIndex ? " on" : ""}`}
                  onClick={() => setCurrentVideoIndex(i)}
                  data-index={i}
                >
                  {v.servidor?.nombre || `Servidor ${i + 1}`}
                </span>
              </li>
            ))}
            {videos.length === 0 && (
              <li>
                <span className="video-tab on">Sin servidores</span>
              </li>
            )}
          </ul>
        </div>

        {/* Video Container */}
        <div id="video-container">
          <div className="video" id="repro">
            {currentVideo ? (
              <iframe
                src={currentVideo.url_video}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
                scrolling="no"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  border: 0,
                  borderRadius: "inherit",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text)",
                }}
              >
                <p>No hay videos disponibles para este episodio.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <ul className="video_buttons-list">
          <li>
            <button
              type="button"
              className={`btn btn-favorites rnd${isFavorite ? " on" : ""}`}
              id="btn-fav"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <span className="fa-heart">
                <i className="fa-plus"></i>
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-download rnd"
              id="btn-download"
              onClick={() => setShowDownloadModal(true)}
            >
              <i className="fa-download"></i> Descargar{" "}
              <span>episodio</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-share rnd"
              id="btn-share"
              onClick={() => setShowShareModal(true)}
            >
              <i className="fa-share"></i> Compartir
            </button>
          </li>
        </ul>
      </section>

      {/* ==================== DOWNLOAD MODAL ==================== */}
      <div id="mdl-download" className={`mdl${showDownloadModal ? " on" : ""}`}>
        <div className="mdl-cn anm-b">
          <div className="mdl-hd">
            <div className="mdl-title">Descargar</div>
            <button
              className="btn lnk mdl-close"
              type="button"
              onClick={() => setShowDownloadModal(false)}
            >
              <i className="fa-times"></i>
            </button>
          </div>
          <div className="mdl-bd">
            <div className="download-links">
              <table>
                <thead>
                  <tr>
                    <th>Servidor</th>
                    <th>Idioma</th>
                    <th>Calidad</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.length > 0 ? (
                    downloads.map((dl, i) => (
                      <tr key={dl.id_link}>
                        <td>
                          <span className="num">#{i + 1}</span>{" "}
                          {dl.servidor?.nombre || "Servidor"}
                        </td>
                        <td>{dl.idioma || "Sub"}</td>
                        <td>
                          <span>{dl.calidad || "HD"}</span>
                        </td>
                        <td>
                          <a
                            rel="nofollow"
                            target="_blank"
                            href={dl.url_video}
                            className="btn sm rnd"
                          >
                            Descargar
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                        No hay enlaces de descarga disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className="mdl-ovr"
          onClick={() => setShowDownloadModal(false)}
        ></div>
      </div>

      {/* ==================== SHARE MODAL ==================== */}
      <div id="mdl-share" className={`mdl${showShareModal ? " on" : ""}`}>
        <div className="mdl-cn anm-b">
          <div className="mdl-hd">
            <div className="mdl-title">Compartir</div>
            <button
              className="btn lnk mdl-close"
              type="button"
              onClick={() => setShowShareModal(false)}
            >
              <i className="fa-times"></i>
            </button>
          </div>
          <div className="mdl-bd">
            <ul className="share-list">
              <li>
                <a
                  href="#"
                  className="fa-twitter"
                  target="_blank"
                  rel="nofollow"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="fa-facebook"
                  target="_blank"
                  rel="nofollow"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mdl-ovr"
          onClick={() => setShowShareModal(false)}
        ></div>
      </div>
    </>
  );
}
