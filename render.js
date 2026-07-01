// render.js
// slide データ（slides-data.js）をもとに、audience画面用のHTML文字列を生成する。
// presenter.html はこのモジュールを直接使わず、index.html を iframe で埋め込んで
// プレビューとして利用する（BroadcastChannelはiframe含む同一オリジンの全コンテキストに届くため）。

import { SLIDES, PHASES } from "./slides-data.js";

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderPhaseRail(currentPhase) {
  return PHASES.map((p) => {
    const active = p.key === currentPhase ? "active" : "";
    return `<div class="seg ${active}">
      <span class="seg-label">${esc(p.label)}</span>
    </div>`;
  }).join("");
}

function renderProgressDots(index) {
  return SLIDES.map((_, i) => {
    const active = i === index ? "active" : "";
    return `<span class="dot ${active}"></span>`;
  }).join("");
}

function renderBody(slide) {
  switch (slide.layout) {
    case "cover": {
      const meta = slide.meta || {};
      return `
        <div class="layout-cover">
          <div class="cover-rule"></div>
          <div class="cover-title">${esc(slide.title).replace(/\n/g, "<br/>")}</div>
          <div class="cover-meta">
            <div class="meta-item"><span>対象企業</span>${esc(meta.target || "―")}</div>
            <div class="meta-item"><span>ご提供</span>${esc(meta.company || "―")}</div>
            <div class="meta-item"><span>日付</span>${esc(meta.date || "―")}</div>
          </div>
        </div>`;
    }
    case "statement": {
      const points = (slide.points || []).map((p) => `<li>${esc(p)}</li>`).join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-statement">
            <ul class="points">${points}</ul>
          </div>
          ${slide.footnote ? `<div class="footnote">${esc(slide.footnote)}</div>` : ""}
        </div>`;
    }
    case "cards": {
      const cards = (slide.cards || [])
        .map(
          (c) => `
        <div class="card">
          <div class="card-label">${esc(c.label)}</div>
          <div class="card-body">${esc(c.body)}</div>
        </div>`
        )
        .join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-cards">
            <div class="card-grid">${cards}</div>
          </div>
          ${slide.footnote ? `<div class="footnote">${esc(slide.footnote)}</div>` : ""}
        </div>`;
    }
    case "dual-track": {
      const tracks = (slide.tracks || [])
        .map(
          (t) => `
        <div class="track">
          <div class="track-label">${esc(t.label)}</div>
          <div class="track-state">${esc(t.state)}</div>
        </div>`
        )
        .join(`<div class="track-plus">＋</div>`);
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-dual-track">
            <div class="tracks">${tracks}</div>
            <div class="body-text">${esc(slide.body || "")}</div>
          </div>
        </div>`;
    }
    case "list": {
      const items = (slide.items || [])
        .map(
          (it, i) =>
            `<li><span class="num">${String(i + 1).padStart(2, "0")}</span>${esc(it)}</li>`
        )
        .join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-list">
            <ul class="plain-list">${items}</ul>
          </div>
          ${slide.footnote ? `<div class="footnote">${esc(slide.footnote)}</div>` : ""}
        </div>`;
    }
    case "quadrant": {
      const quad = (slide.quadrant || [])
        .map(
          (q) => `
        <div class="quad-item">
          <div class="quad-label">${esc(q.label)}</div>
          <div class="quad-body">${esc(q.body)}</div>
        </div>`
        )
        .join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-quadrant">
            <div class="quad-grid">${quad}</div>
          </div>
        </div>`;
    }
    case "steps": {
      const steps = (slide.steps || [])
        .map(
          (s, i) => `
        <div class="step">
          <div class="step-num">${i + 1}</div>
          <div class="step-label">${esc(s)}</div>
        </div>`
        )
        .join(`<div class="arrow">→</div>`);
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-steps">
            <div class="step-flow">${steps}</div>
          </div>
        </div>`;
    }
    case "checklist": {
      const items = (slide.items || [])
        .map((it) => `<li><span class="box"></span>${esc(it)}</li>`)
        .join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-checklist">
            <ul class="check-list">${items}</ul>
          </div>
          ${slide.footnote ? `<div class="footnote">${esc(slide.footnote)}</div>` : ""}
        </div>`;
    }
    case "action": {
      const items = (slide.items || [])
        .map(
          (it, i) =>
            `<li><span class="action-num">${i + 1}</span><span>${esc(it)}</span></li>`
        )
        .join("");
      return `
        <div class="slide-inner-content">
          <div class="eyebrow">${esc(slide.eyebrow)}</div>
          <div class="title">${esc(slide.title)}</div>
          <div class="slide-body layout-action">
            <ul class="action-list">${items}</ul>
          </div>
        </div>`;
    }
    default:
      return `<div class="slide-inner-content"><div class="title">${esc(slide.title)}</div></div>`;
  }
}

export function renderSlide(index) {
  const slide = SLIDES[index];
  if (!slide) return "";
  const rail = renderPhaseRail(slide.phase);
  const dots = renderProgressDots(index);

  // renderBody() はレイアウトごとに eyebrow / title / body / footnote まで
  // 含めた完全なブロックを返す（cover も含む）ため、そのまま .slide-inner に差し込む。
  return `
    <div class="slide-canvas fade-enter" data-slide-id="${slide.id}">
      <div class="phase-rail">${rail}</div>
      <div class="slide-inner">
        ${renderBody(slide)}
      </div>
      <div class="slide-footer">
        <div class="progress-dots">${dots}</div>
        <div class="wordmark">JCT — 有限会社ジェイシーティー</div>
      </div>
    </div>
  `;
}

export function totalSlides() {
  return SLIDES.length;
}
