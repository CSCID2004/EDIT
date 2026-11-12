"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Content = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  primaryButton: string;
  contactButton: string;
  whatsapp: string;
  heroImage: string;
  overlayTitle: string;
  overlaySubtitle: string;
  themeCss: string;
};

const DEFAULT_CONTENT: Content = {
  heroEyebrow: "Penyedia Kualitas Terbaik",
  heroTitle: "Arang Batok Kelapa",
  heroAccent: "Premium",
  heroDescription: "Menyediakan arang berkualitas tinggi dengan standar internasional. Solusi energi terpercaya untuk kebutuhan industri, restoran, dan ekspor.",
  primaryButton: "Lihat Produk",
  contactButton: "Hubungi Kami",
  whatsapp: "https://wa.me/6285168152525",
  heroImage: "/Coconut-Shell-Charcoal.jpg",
  overlayTitle: "Sertifikasi ISO 9001",
  overlaySubtitle: "Standar mutu internasional",
  themeCss: "",
};

const groups: { title: string; fields: { key: keyof Content; label: string; hint?: string; multiline?: boolean }[] }[] = [
  { title: "Konten utama", fields: [
    { key: "heroEyebrow", label: "Label kecil" },
    { key: "heroTitle", label: "Judul utama" },
    { key: "heroAccent", label: "Kata aksen" },
    { key: "heroDescription", label: "Deskripsi", multiline: true },
  ]},
  { title: "Tombol dan kontak", fields: [
    { key: "primaryButton", label: "Tombol utama" },
    { key: "contactButton", label: "Tombol kontak" },
    { key: "whatsapp", label: "URL WhatsApp", hint: "Gunakan tautan HTTPS, misalnya https://wa.me/62..." },
  ]},
  { title: "Gambar utama", fields: [
    { key: "heroImage", label: "Path atau URL gambar", hint: "Path lokal seperti /Coconut-Shell-Charcoal.jpg atau URL HTTPS." },
    { key: "overlayTitle", label: "Judul kartu gambar" },
    { key: "overlaySubtitle", label: "Keterangan gambar" },
  ]},
];

export default function Workspace() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadContent = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/server/content", { method: "GET", cache: "no-store", credentials: "same-origin" });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setAuthRequired(true);
        setMessage("Sesi Founder belum aktif. Masuk melalui Server terlebih dahulu.");
        return;
      }
      if (!response.ok) throw new Error(data.error || "Konten tidak dapat dimuat.");
      setAuthRequired(false);
      setContent({ ...DEFAULT_CONTENT, ...(data.content || {}) });
      setUpdatedAt(data.content?.updatedAt ? new Date(data.content.updatedAt).toLocaleString("id-ID") : "");
      setDirty(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Koneksi ke Server gagal.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadContent(); }, [loadContent]);

  function update(key: keyof Content, value: string) {
    setContent((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setMessage("");
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/server/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setAuthRequired(true);
        throw new Error("Sesi Founder berakhir. Masuk kembali melalui /server.");
      }
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan konten.");
      setContent({ ...DEFAULT_CONTENT, ...(data.content || {}) });
      setUpdatedAt(data.content?.updatedAt ? new Date(data.content.updatedAt).toLocaleString("id-ID") : new Date().toLocaleString("id-ID"));
      setDirty(false);
      setMessage("Berhasil disimpan ke database bersama. Perubahan akan dibaca website CSCID saat dimuat ulang.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">CS</div><div><strong>CSCID</strong><span>CONTENT WORKSPACE</span></div></div>
        <div className="workspace-pill"><span className="status-dot" /> FOUNDER WORKSPACE</div>
        <p className="nav-caption">WORKSPACE</p>
        <div className="nav-item active"><span className="nav-icon">✎</span> Website Editor <span className="nav-live">LIVE</span></div>
        <div className="nav-item"><span className="nav-icon">▧</span> Media & gambar</div>
        <div className="sidebar-bottom"><div className="admin-avatar">F</div><div className="admin-meta"><strong>Founder</strong><span>Session checked by SERVER</span></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>CSCID</span><b>/</b><strong>Website Editor</strong></div>
          <div className="top-actions"><span className="environment-tag"><i /> DATABASE CONNECTED</span><a className="button button-quiet" href="/server">Server</a></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div><p className="overline">CONTENT OPERATIONS <span>·</span> CSCID WEBSITE</p><h1>Website Editor</h1><p className="subheading">Ubah teks dan gambar website utama dari satu ruang kerja.</p></div>
            <div className="heading-actions">
              <button className="button button-quiet" type="button" onClick={() => void loadContent()} disabled={loading || saving}>Muat ulang</button>
              <button className="button button-primary" type="submit" form="content-form" disabled={loading || saving || authRequired || !dirty}>{saving ? "Menyimpan…" : "Simpan perubahan"} <span>↗</span></button>
            </div>
          </div>

          {message && <div role="status" className="notice" style={{ padding: 14, marginBottom: 16, background: "#fff", border: "1px solid #e8e2dc", fontSize: 12, color: "#5d5148" }}>{message}{authRequired && <div style={{ marginTop: 12 }}><a className="button button-primary" href="/server">Masuk melalui SERVER</a></div>}</div>}
          {loading && <div className="panel-card" style={{ marginBottom: 16 }}>Memuat konten dari database SERVER…</div>}

          {!loading && !authRequired && <div className="editor-layout">
            <form id="content-form" className="editor-controls" onSubmit={saveContent}>
              <div className="editor-toolbar"><div><span className="live-indicator" /> PRODUCTION CONTENT <span className="toolbar-sep">/</span> HOMEPAGE</div><span>{dirty ? "UNSAVED CHANGES" : "SYNCHRONIZED"}</span></div>
              {groups.map((group, index) => <section className="editor-section" key={group.title}>
                <div className="editor-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{group.title}</h3><p>Data disimpan melalui API SERVER ke database bersama.</p></div></div>
                {group.fields.map((field) => <label key={field.key}>{field.label}
                  {field.multiline
                    ? <textarea rows={4} maxLength={1200} value={content[field.key]} onChange={(event) => update(field.key, event.target.value)} />
                    : <input maxLength={1200} value={content[field.key]} onChange={(event) => update(field.key, event.target.value)} />}
                  {field.hint && <small style={{ display: "block", marginTop: 5, color: "#92877e", lineHeight: 1.5 }}>{field.hint}</small>}
                </label>)}
                {group.title === "Gambar utama" && <div style={{ marginTop: 12, padding: 12, background: "#f7f4f0", border: "1px solid #e8e1d9" }}>
                  <div style={{ fontSize: 9, letterSpacing: 1, color: "#8c7e72", marginBottom: 9 }}>PRATINJAU GAMBAR</div>
                  <img src={content.heroImage || "/Coconut-Shell-Charcoal.jpg"} alt="Pratinjau gambar utama CSCID" style={{ width: "100%", maxHeight: 230, objectFit: "contain", background: "#eee8e0" }} onError={(event) => { event.currentTarget.style.opacity = "0.25"; }} />
                </div>}
              </section>)}
              <section className="editor-section">
                <div className="editor-section-heading"><span>04</span><div><h3>Custom CSS</h3><p>Opsional. Aturan CSS diperiksa oleh SERVER sebelum disimpan.</p></div></div>
                <label>CSS tambahan<textarea rows={8} maxLength={30000} value={content.themeCss} onChange={(event) => update("themeCss", event.target.value)} placeholder="/* CSS tambahan */" /></label>
              </section>
              <div className="editor-footer"><span>{updatedAt ? "Pembaruan terakhir: " + updatedAt : "Terhubung ke database CSCID"}</span><button className="button button-primary" type="submit" disabled={saving || !dirty}>{saving ? "Menyimpan…" : "Simpan ke database"}</button></div>
            </form>

            <aside className="preview-column">
              <div className="preview-label"><span>LIVE CONTENT PREVIEW</span><span>CSCID / HOMEPAGE</span></div>
              <div className="site-preview">
                <div className="preview-nav"><div className="preview-logo">CSCID<span>.</span></div><div className="preview-navlinks">ABOUT　 PRODUCTS　 QUALITY　 CONTACT</div><div className="preview-nav-cta">INQUIRE ↗</div></div>
                <div className="preview-hero">
                  <div className="preview-copy"><span className="preview-eyebrow">{content.heroEyebrow}</span><h2>{content.heroTitle} <em>{content.heroAccent}</em></h2><p>{content.heroDescription}</p><div className="preview-buttons"><span>{content.primaryButton} ↗</span><span>{content.contactButton} →</span></div></div>
                  <div className="preview-visual"><img src={content.heroImage || "/Coconut-Shell-Charcoal.jpg"} alt="Gambar hero" style={{ width: "100%", maxHeight: 230, objectFit: "cover" }} /><div className="visual-card"><b>{content.overlayTitle}</b><small>{content.overlaySubtitle}</small></div></div>
                </div>
              </div>
              <div className="preview-note">Perubahan tersimpan di database SERVER dan digunakan oleh website utama melalui /api/site-content. Deployment ulang tidak diperlukan untuk konten.</div>
            </aside>
          </div>}

          <footer className="footer"><span>CSCID EDIT <b>·</b> SHARED CONTENT DATABASE</span><span>BACKEND: REPO SERVER</span></footer>
        </div>
      </section>
    </main>
  );
}
