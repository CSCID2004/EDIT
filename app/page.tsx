"use client";

import { useEffect, useMemo, useState } from "react";

type Content = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  whatsappUrl: string;
  imageTitle: string;
  imageDescription: string;
};

const initialContent: Content = {
  eyebrow: "COCONUT SHELL CHARCOAL INDONESIA",
  title: "Natural energy,",
  accent: "global standard.",
  description: "Premium coconut shell charcoal products, prepared with care for dependable international supply.",
  primaryCta: "Explore Products",
  secondaryCta: "Contact Us",
  whatsappUrl: "",
  imageTitle: "From Indonesia, with purpose",
  imageDescription: "Responsible sourcing · Consistent quality · Global supply",
};

const navigation = [
  { group: "WORKSPACE", items: [{ id: "overview", label: "Overview", icon: "◫" }, { id: "editor", label: "Website Editor", icon: "✎" }, { id: "pages", label: "Pages", icon: "▤" }, { id: "media", label: "Media Library", icon: "▧" }] },
  { group: "CONTROL", items: [{ id: "services", label: "Services", icon: "⌘" }, { id: "integrations", label: "Integrations", icon: "⌁" }, { id: "environment", label: "Environment", icon: "⚙" }, { id: "security", label: "Security", icon: "◇" }] },
];

export default function Workspace() {
  const [active, setActive] = useState("overview");
  const [content, setContent] = useState<Content>(initialContent);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(true);
  const [notice, setNotice] = useState("Workspace preview is ready");
  const [mobileNav, setMobileNav] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch("/api/server/content", { cache: "no-store", credentials: "same-origin" });
        if (response.status === 401) {
          if (active) setNotice("Founder login diperlukan. Masuk melalui /server terlebih dahulu.");
          return;
        }
        if (!response.ok) throw new Error("Konten website tidak dapat dimuat dari SERVER.");
        const data = await response.json();
        const live = data?.content || {};
        if (active) {
          setContent({
            eyebrow: live.heroEyebrow ?? initialContent.eyebrow,
            title: live.heroTitle ?? initialContent.title,
            accent: live.heroAccent ?? initialContent.accent,
            description: live.heroDescription ?? initialContent.description,
            primaryCta: live.primaryButton ?? initialContent.primaryCta,
            secondaryCta: live.contactButton ?? initialContent.secondaryCta,
            whatsappUrl: live.whatsapp ?? initialContent.whatsappUrl,
            imageTitle: live.overlayTitle ?? initialContent.imageTitle,
            imageDescription: live.overlaySubtitle ?? initialContent.imageDescription,
          });
          setAuthorized(true);
          setNotice("Terhubung ke database konten CSCID.");
        }
      } catch (error) {
        if (active) setNotice(error instanceof Error ? error.message : "Koneksi SERVER gagal.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const update = (key: keyof Content, value: string) => {
    setContent((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const pageTitle = useMemo(() => {
    const titles: Record<string, string> = {
      overview: "Workspace overview", editor: "Website Editor", pages: "Pages", media: "Media Library",
      services: "Services", integrations: "Integrations", environment: "Environment", security: "Security",
    };
    return titles[active] || "Workspace";
  }, [active]);

  async function saveDraft() {
    try {
      setSaved(false);
      const response = await fetch("/api/server/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            heroEyebrow: content.eyebrow,
            heroTitle: content.title,
            heroAccent: content.accent,
            heroDescription: content.description,
            primaryButton: content.primaryCta,
            contactButton: content.secondaryCta,
            whatsapp: content.whatsappUrl,
            overlayTitle: content.imageTitle,
            overlaySubtitle: content.imageDescription,
          },
        }),
      });
      if (response.status === 401) {
        setAuthorized(false);
        setNotice("Sesi Founder tidak ditemukan. Masuk kembali melalui /server.");
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) throw new Error(data?.error || "Konten gagal diterbitkan.");
      setSaved(true);
      setNotice("Konten berhasil disimpan ke Neon dan diterbitkan ke website CSCID.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Gagal menyimpan konten ke SERVER.");
    }
  }

  if (loading) return <main className="shell"><section className="main-area"><div className="content-wrap"><h1>Connecting to CSCID SERVER…</h1><p>Memeriksa sesi Founder dan database konten.</p></div></section></main>;
  if (!authorized) return <main className="shell"><section className="main-area"><div className="content-wrap"><div className="placeholder-panel"><div className="placeholder-icon">◇</div><h2>Founder access required</h2><p>Workspace EDIT hanya dapat digunakan setelah autentikasi Founder di pusat kendali CSCID.</p><a className="button button-primary" href="/server">Open Founder Login →</a><p className="subheading">{notice}</p></div></div></section></main>;

  return (
    <main className="shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">CS</div><div><strong>CSCID</strong><span>CONTROL WORKSPACE</span></div></div>
        <div className="workspace-pill"><span className="status-dot" /> PRIVATE WORKSPACE <span className="chevron">⌄</span></div>
        {navigation.map((section) => <div className="nav-section" key={section.group}>
          <p className="nav-caption">{section.group}</p>
          {section.items.map((item) => <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => { setActive(item.id); setMobileNav(false); }}>
            <span className="nav-icon">{item.icon}</span>{item.label}{item.id === "editor" && <span className="nav-live">LIVE</span>}
          </button>)}
        </div>)}
        <div className="sidebar-bottom"><div className="admin-avatar">F</div><div className="admin-meta"><strong>Founder</strong><span>Administrator session</span></div><span className="more">•••</span></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">☰</button>
          <div className="breadcrumbs"><span>CSCID</span><b>/</b><strong>{pageTitle}</strong></div>
          <div className="top-actions"><span className="environment-tag"><i /> PREVIEW ENVIRONMENT</span><button className="avatar-small" aria-label="Founder account">F</button></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading"><div><p className="overline">CONTROL PLANE <span>·</span> WEBSITE OPERATIONS</p><h1>{pageTitle}</h1><p className="subheading">Kelola pengalaman website CSCID dari satu ruang kerja.</p></div>
            <div className="heading-actions"><button className="button button-quiet" onClick={() => { setContent(initialContent); setSaved(false); }}>Reset preview</button><button className="button button-primary" onClick={saveDraft}>Save & publish <span>↗</span></button></div>
          </div>

          {active === "overview" && <>
            <div className="welcome-card"><div><span className="welcome-kicker">GOOD TO HAVE YOU BACK</span><h2>Everything in one place.</h2><p>Ruang kendali untuk konten, tampilan, dan operasional website Coconut Shell Charcoal Indonesia.</p><button className="text-link" onClick={() => setActive("editor")}>Open Website Editor <span>→</span></button></div><div className="welcome-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-core">CS<span>.</span></div><div className="art-chip chip-a">CONTENT</div><div className="art-chip chip-b">DESIGN</div></div></div>
            <div className="section-title"><div><h3>Workspace status</h3><p>Ringkasan koneksi dan kesiapan workspace.</p></div><span className="updated">UPDATED JUST NOW</span></div>
            <div className="stats-grid">
              <article className="stat-card"><div className="stat-top"><span>WEBSITE</span><span className="stat-icon">⌂</span></div><strong>Connected later</strong><p className="muted-line"><i className="dot dot-amber" /> Main project integration pending</p></article>
              <article className="stat-card"><div className="stat-top"><span>CONTENT STORAGE</span><span className="stat-icon">▤</span></div><strong>Local draft</strong><p className="muted-line"><i className="dot dot-amber" /> Production database not configured</p></article>
              <article className="stat-card"><div className="stat-top"><span>DESIGN SYSTEM</span><span className="stat-icon">◈</span></div><strong>CSS-ID</strong><p className="muted-line"><i className="dot dot-green" /> Foundation repository available</p></article>
              <article className="stat-card"><div className="stat-top"><span>ACCESS</span><span className="stat-icon">◇</span></div><strong>Preview only</strong><p className="muted-line"><i className="dot dot-amber" /> Founder authentication pending</p></article>
            </div>
            <div className="bottom-grid"><article className="panel-card"><div className="panel-head"><div><h3>Quick actions</h3><p>Continue configuring your workspace.</p></div><span className="panel-dots">•••</span></div><button className="quick-action" onClick={() => setActive("editor")}><span className="quick-icon">✎</span><span><b>Edit homepage content</b><small>Update headline, description and CTAs</small></span><span className="arrow">→</span></button><button className="quick-action" onClick={() => setActive("pages")}><span className="quick-icon">▤</span><span><b>Manage website pages</b><small>Review page structure and status</small></span><span className="arrow">→</span></button><button className="quick-action" onClick={() => setActive("integrations")}><span className="quick-icon">⌁</span><span><b>Connect integrations</b><small>Review connected services</small></span><span className="arrow">→</span></button></article>
              <article className="panel-card activity-card"><div className="panel-head"><div><h3>System activity</h3><p>Latest workspace events.</p></div><span className="activity-live"><i /> LIVE</span></div><div className="activity-row"><span className="activity-mark">✓</span><div><b>Workspace initialized</b><small>Foundation interface is ready</small></div><time>NOW</time></div><div className="activity-row"><span className="activity-mark muted-mark">◈</span><div><b>Design system detected</b><small>CSS-ID repository identified</small></div><time>RECENT</time></div><div className="activity-row"><span className="activity-mark pending-mark">!</span><div><b>Persistence not configured</b><small>Database connection required</small></div><time>PENDING</time></div></article></div>
          </>}

          {active === "editor" && <div className="editor-layout">
            <div className="editor-controls">
              <div className="editor-toolbar"><div><span className="live-indicator" /> HOMEPAGE <span className="toolbar-sep">/</span> HERO SECTION</div><button className="preview-toggle" onClick={() => setPreview(!preview)}>{preview ? "Hide preview" : "Show preview"} ◫</button></div>
              <div className="editor-section"><div className="editor-section-heading"><span>01</span><div><h3>Hero content</h3><p>Konten utama yang pertama dilihat pengunjung.</p></div></div>
                <label>Eyebrow / Label<input value={content.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} /></label>
                <label>Headline<input value={content.title} onChange={(e) => update("title", e.target.value)} /></label>
                <label>Accent word<input value={content.accent} onChange={(e) => update("accent", e.target.value)} /></label>
                <label>Description<textarea rows={3} value={content.description} onChange={(e) => update("description", e.target.value)} /></label>
              </div>
              <div className="editor-section"><div className="editor-section-heading"><span>02</span><div><h3>Call to action</h3><p>Label tombol dan tujuan kontak.</p></div></div>
                <label>Primary button<input value={content.primaryCta} onChange={(e) => update("primaryCta", e.target.value)} /></label>
                <label>Secondary button<input value={content.secondaryCta} onChange={(e) => update("secondaryCta", e.target.value)} /></label>
                <label>WhatsApp URL<input placeholder="https://wa.me/62..." value={content.whatsappUrl} onChange={(e) => update("whatsappUrl", e.target.value)} /></label>
              </div>
              <div className="editor-section"><div className="editor-section-heading"><span>03</span><div><h3>Visual card</h3><p>Teks pendamping untuk area visual hero.</p></div></div>
                <label>Card title<input value={content.imageTitle} onChange={(e) => update("imageTitle", e.target.value)} /></label>
                <label>Card description<input value={content.imageDescription} onChange={(e) => update("imageDescription", e.target.value)} /></label>
              </div>
              <div className="editor-footer"><span>{saved ? "Published to CSCID database" : "Perubahan belum disimpan"}</span><button className="button button-primary" onClick={saveDraft}>Save & publish</button></div>
            </div>
            {preview && <div className="preview-column"><div className="preview-label"><span>LIVE PREVIEW</span><span>DESKTOP · 1440 PX</span></div><div className="site-preview"><div className="preview-nav"><div className="preview-logo">CSCID<span>.</span></div><div className="preview-navlinks">ABOUT　 PRODUCTS　 QUALITY　 CONTACT</div><div className="preview-nav-cta">INQUIRE ↗</div></div><div className="preview-hero"><div className="preview-copy"><span className="preview-eyebrow">{content.eyebrow}</span><h2>{content.title} <em>{content.accent}</em></h2><p>{content.description}</p><div className="preview-buttons"><span>{content.primaryCta} ↗</span><span>{content.secondaryCta} →</span></div></div><div className="preview-visual"><div className="visual-lines" /><div className="visual-label">INDONESIAN ORIGIN<br />GLOBAL REACH</div><div className="visual-card"><b>{content.imageTitle}</b><small>{content.imageDescription}</small></div></div></div><div className="preview-foot"><span>COCONUT SHELL CHARCOAL</span><span>01 — 04</span></div></div><div className="preview-note"><span>ⓘ</span> Preview mengikuti data dari SERVER. Simpan & publish untuk memperbarui website.</div></div>}
          </div>}

          {active !== "overview" && active !== "editor" && <div className="placeholder-panel"><div className="placeholder-icon">◈</div><h2>{pageTitle}</h2><p>Modul ini sudah masuk struktur workspace dan akan diaktifkan setelah koneksi data, autentikasi, dan integrasi backend selesai.</p><span className="coming-soon">MODULE FOUNDATION · IN PROGRESS</span></div>}

          <footer className="footer"><span>CSCID EDIT <b>·</b> PRIVATE WORKSPACE</span><span>FOUNDATION BUILD 0.1.0</span></footer>
        </div>
        <div className="toast" role="status">{notice}</div>
      </section>
    </main>
  );
}
