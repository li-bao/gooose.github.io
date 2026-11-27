(function (global) {
  'use strict';

  function getAssetRoot() {
    return document.documentElement.dataset.assetRoot || '';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '—';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(2) + ' MB' : Math.round(bytes / 1024) + ' KB';
  }

  function formatDate(iso, lang) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(lang === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function renderHome(root, lang) {
    const { I18N, FEATURES } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    const isEn = lang === 'en';
    const topFeatures = FEATURES[lang].slice(0, 3);
    const routeHref = (r) => global.GoooseRouter.routeUrl(r, lang);

    root.innerHTML = `
      <section class="hero">
        <div class="wrap hero-grid">
          <div>
            <span class="eyebrow">${t['hero.eyebrow']}</span>
            <h1 class="hero-title">${t['hero.title']}</h1>
            <p class="hero-subtitle">${t['hero.subtitle']}</p>
            <p class="hero-lead">${t['hero.lead']}</p>
            <div class="hero-stats">
              <span class="stat-pill">⭐ <span>${t['hero.starsLabel']}</span><strong id="hero-stars">…</strong></span>
              <span class="stat-pill">🍴 <span>${t['hero.forksLabel']}</span><strong id="hero-forks">…</strong></span>
              <span class="stat-pill">📦 <span>${t['hero.releasesLabel']}</span><strong id="hero-releases-count">…</strong></span>
              <span class="stat-pill">🏷️ <span>${t['hero.versionLabel']}</span><strong id="hero-version">…</strong></span>
            </div>
            <div class="hero-cta">
              <a class="btn btn-primary" href="${routeHref('download')}" data-route="download">${t['hero.ctaDownload']}</a>
              <a class="btn btn-accent" href="${routeHref('features')}" data-route="features">${t['hero.ctaFeatures']}</a>
              <a class="btn btn-secondary" href="https://github.com/li-bao/gooose" target="_blank" rel="noopener noreferrer">${t['hero.ctaGithub']}</a>
            </div>
          </div>

          <div class="hero-stage-card">
            <div class="hero-canvas-wrap">
              <canvas id="hero-goose-canvas" aria-label="Animated Hero Goose"></canvas>
              <span class="hero-bump-badge" id="hero-bump-badge">🪿 gooose</span>
            </div>
            <div class="hero-stage-footer">
              <span>${t['hero.stageHint']}</span>
              <span>Apple Silicon · macOS 26+</span>
            </div>
          </div>
        </div>
      </section>

      <section class="home-band">
        <div class="wrap">
          <div class="glass-panel home-release-strip">
            <div>
              <strong style="font-size:1.1rem;" id="home-latest-title">gooose</strong>
              <p style="margin:4px 0 0;color:var(--muted);font-size:0.92rem;" id="home-latest-meta">
                ${isEn ? 'Native macOS Apple Silicon · Open Source' : '原生 macOS Apple Silicon · 開源免費'}
              </p>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <a class="btn btn-primary btn-sm" id="home-quick-dmg" href="${routeHref('download')}" data-route="download">${t['hero.ctaDownload']}</a>
              <a class="btn btn-secondary btn-sm" href="${routeHref('changelog')}" data-route="changelog">${t['nav.changelog']}</a>
            </div>
          </div>

          <div class="section-head" style="margin-bottom:20px;">
            <span class="eyebrow">${t['features.eyebrow']}</span>
            <h2 class="section-title">${t['features.title']}</h2>
          </div>

          <div class="cards-grid" style="margin-bottom:36px;">
            ${topFeatures.map((f) => `
              <article class="feature-card">
                <div class="feature-top">
                  <div class="card-icon" aria-hidden="true">${f.icon}</div>
                  <span class="feature-demo-pill">${f.tag}</span>
                </div>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
              </article>
            `).join('')}
          </div>

          <div class="overview-grid">
            <a class="overview-link-card" href="${routeHref('playground')}" data-route="playground">
              <strong>🎮 ${t['nav.playground']}</strong>
              <span style="color:var(--muted);font-size:0.88rem;">${isEn ? 'Canvas physics, 5 foods & 5 game modes' : '物理拋擲、5 種食物與 5 種遊玩模式'}</span>
              <span class="ov-arrow">${isEn ? 'Open Playground →' : '前往遊樂場 →'}</span>
            </a>
            <a class="overview-link-card" href="${routeHref('games')}" data-route="games">
              <strong>🕹️ ${t['nav.games']}</strong>
              <span style="color:var(--muted);font-size:0.88rem;">${isEn ? 'Bread Collector & Goose Memory' : '接麵包大作戰與鵝鵝記憶翻牌'}</span>
              <span class="ov-arrow">${isEn ? 'Play Arcade →' : '開始玩遊戲 →'}</span>
            </a>
            <a class="overview-link-card" href="${routeHref('goose-ai')}" data-route="goose-ai">
              <strong>💬 ${t['nav.gooseAi']}</strong>
              <span style="color:var(--muted);font-size:0.88rem;">${isEn ? 'Chat with our playful desktop goose' : '與專屬 goooseAI 對話與提問'}</span>
              <span class="ov-arrow">${isEn ? 'Open Goose AI →' : '開啟 Goose AI →'}</span>
            </a>
            <a class="overview-link-card" href="${routeHref('docs')}" data-route="docs">
              <strong>📘 ${t['nav.docs']}</strong>
              <span style="color:var(--muted);font-size:0.88rem;">${isEn ? 'Install guide, permissions & troubleshooting' : '安裝教學、權限說明與疑難排解'}</span>
              <span class="ov-arrow">${isEn ? 'Read Docs →' : '閱讀文件 →'}</span>
            </a>
          </div>
        </div>
      </section>
    `;

    const cleanupHero = global.initHeroGoose ? global.initHeroGoose() : null;
    updateGitHubBindings(lang);
    return cleanupHero;
  }

  function renderFeatures(root, lang) {
    const { I18N, FEATURES } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['features.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['features.title']}</h1>
            <p class="section-desc">${t['features.desc']}</p>
          </div>
          <div class="cards-grid">
            ${FEATURES[lang].map((f) => `
              <article class="feature-card" tabindex="0">
                <div class="feature-top">
                  <div class="card-icon" aria-hidden="true">${f.icon}</div>
                  <span class="feature-demo-pill">${f.tag}</span>
                </div>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
                <div class="feature-preview-box">
                  <span>${f.preview}</span>
                  <span aria-hidden="true">🪿</span>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    return null;
  }

  function renderPlayground(root, lang) {
    const { I18N } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['pg.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['pg.title']}</h1>
            <p class="section-desc">${t['pg.desc']}</p>
          </div>

          <div class="playground-shell">
            <div class="pg-hud">
              <div class="pg-hud-stats">
                <span class="pg-hud-badge">Score: <strong id="pg-score">0</strong></span>
                <span class="pg-hud-badge">Combo: <strong id="pg-combo">x1</strong></span>
                <span class="pg-hud-badge">Best: <strong id="pg-best">0</strong></span>
                <span class="pg-hud-badge">Time: <strong id="pg-timer">0s</strong></span>
                <span class="pg-hud-badge">Geese: <strong id="pg-count">1 / 5</strong></span>
              </div>
              <div class="toolbar-group">
                <select class="pg-select" id="pg-mode" aria-label="Game Mode">
                  <option value="free">Free Play</option>
                  <option value="frenzy">Feeding Frenzy (30s)</option>
                  <option value="catch">Goose Catch (25s)</option>
                  <option value="race">Goose Race</option>
                  <option value="chaos">Chaos Mode</option>
                </select>
                <button type="button" class="btn btn-secondary btn-sm" id="pg-pause">${t['pg.pause']}</button>
                <button type="button" class="btn btn-secondary btn-sm" id="pg-reset">${t['pg.reset']}</button>
              </div>
            </div>

            <div class="pg-controls-row">
              <div class="toolbar-group">
                <button type="button" class="btn btn-primary btn-sm" id="pg-add-goose">+ Goose</button>
                <select class="pg-select" id="pg-food-select" aria-label="Select Food">
                  <option value="bread">🍞 Bread</option>
                  <option value="corn">🌽 Corn</option>
                  <option value="strawberry">🍓 Strawberry</option>
                  <option value="cookie">🍪 Cookie</option>
                  <option value="apple">🍎 Apple</option>
                </select>
                <button type="button" class="btn btn-accent btn-sm" id="pg-drop-food">Drop Food</button>
              </div>
              <div class="toolbar-group">
                <select class="pg-select" id="pg-personality" aria-label="Personality">
                  <option value="chaotic">Chaotic Goose</option>
                  <option value="lazy">Lazy Goose</option>
                  <option value="hungry">Hungry Goose</option>
                  <option value="sleepy">Sleepy Goose</option>
                </select>
                <select class="pg-select" id="pg-hat" aria-label="Hat">
                  <option value="none">No Hat</option>
                  <option value="crown">👑 Crown</option>
                  <option value="cap">🧢 Cap</option>
                  <option value="bow">🎀 Bow</option>
                  <option value="glasses">🕶️ Glasses</option>
                </select>
                <select class="pg-select" id="pg-color" aria-label="Color">
                  <option value="#FFFFFF">White</option>
                  <option value="#FFF3C4">Butter</option>
                  <option value="#FFE5D4">Peach</option>
                  <option value="#E8F5E9">Mint</option>
                </select>
              </div>
            </div>

            <div class="arena-canvas-wrap">
              <canvas id="playground-canvas" aria-label="Goose Playground 2.0 Physics Canvas"></canvas>
            </div>

            <div class="pg-footer">
              <div class="pg-counter-bar">
                <span id="pg-counters-text"></span>
                <button type="button" class="btn btn-secondary btn-sm" id="pg-reset-counters">Reset Stats</button>
              </div>
              <span>${t['pg.sandboxNote']}</span>
            </div>
          </div>
        </div>
      </section>
    `;
    return global.initPlayground2 ? global.initPlayground2() : null;
  }

  function renderGames(root, lang) {
    const { I18N } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['games.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['games.title']}</h1>
            <p class="section-desc">${t['games.desc']}</p>
          </div>
          <div class="games-grid">
            <article class="game-card">
              <div class="game-head">
                <h3>🍞 Bread Collector</h3>
                <div class="game-stats">
                  <span>Score: <strong id="bg-score">0</strong></span>
                  <span>Lives: <strong id="bg-lives">❤️❤️❤️</strong></span>
                  <span>Best: <strong id="bg-best">0</strong></span>
                  <button type="button" class="btn btn-primary btn-sm" id="bg-start">Start</button>
                </div>
              </div>
              <div class="game-canvas-box">
                <canvas id="bread-game-canvas" aria-label="Bread Collector Game"></canvas>
              </div>
              <p style="margin:0;color:var(--muted);font-size:0.86rem;">Move with mouse/touch or ←/→ (A/D). Catch 🍞 &amp; 🥐, dodge 💣!</p>
            </article>

            <article class="game-card">
              <div class="game-head">
                <h3>🃏 Goose Memory</h3>
                <div class="game-stats">
                  <span>Moves: <strong id="mem-moves">0</strong></span>
                  <span>Time: <strong id="mem-timer">0s</strong></span>
                  <span>Best: <strong id="mem-best">—</strong></span>
                  <select class="pg-select" id="mem-diff" aria-label="Memory Difficulty">
                    <option value="easy">Easy (4×3)</option>
                    <option value="hard">Hard (4×4)</option>
                  </select>
                  <button type="button" class="btn btn-primary btn-sm" id="mem-restart">Restart</button>
                </div>
              </div>
              <div class="memory-grid" id="memory-grid"></div>
            </article>
          </div>
        </div>
      </section>
    `;
    return global.initMiniGames ? global.initMiniGames() : null;
  }

  function renderGallery(root, lang) {
    const { I18N, MISSING_MEDIA } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    const shotSrc = getAssetRoot() + 'assets/screenshot-macos.png';
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['gallery.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['gallery.title']}</h1>
            <p class="section-desc">${t['gallery.desc']}</p>
          </div>
          <div class="filter-bar" role="group" aria-label="Gallery filters">
            <button type="button" class="filter-btn active" data-filter="all">All</button>
            <button type="button" class="filter-btn" data-filter="screenshots">Screenshots</button>
            <button type="button" class="filter-btn" data-filter="gif">GIF</button>
            <button type="button" class="filter-btn" data-filter="video">Video</button>
          </div>
          <div class="gallery-grid">
            <figure class="media-card" id="gallery-shot-card" style="margin:0;">
              <button type="button" class="media-thumb-btn" id="open-lightbox-screenshot" aria-label="Enlarge macOS screenshot">
                <img id="gallery-screenshot-img" src="${shotSrc}" loading="lazy" alt="${lang === 'en' ? 'Real gooose screenshot on macOS' : 'gooose 在 macOS 桌面實際運行的截圖'}" />
              </button>
              <figcaption class="media-caption">
                <h3>${t['gallery.shotTitle']}</h3>
                <p>${t['gallery.shotDesc']}</p>
              </figcaption>
            </figure>
            <div class="missing-media-panel" id="gallery-missing-card">
              <h3>${t['gallery.missingTitle']}</h3>
              <p class="section-desc" style="font-size:0.92rem;">${t['gallery.missingDesc']}</p>
              <ul class="missing-list">${MISSING_MEDIA[lang].map((x) => `<li>${x}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </section>
    `;

    root.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter || 'all';
        const shot = document.getElementById('gallery-shot-card');
        const miss = document.getElementById('gallery-missing-card');
        if (shot) shot.style.display = (f === 'all' || f === 'screenshots') ? '' : 'none';
        if (miss) miss.style.display = (f === 'all' || f === 'gif' || f === 'video') ? '' : 'none';
      });
    });

    document.getElementById('open-lightbox-screenshot')?.addEventListener('click', () => {
      const img = document.getElementById('gallery-screenshot-img');
      if (img && global.openLightbox) global.openLightbox(img.src, img.alt);
    });
    return null;
  }

  function renderDownload(root, lang) {
    const { I18N, INSTALL_STEPS } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['dl.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['dl.title']}</h1>
            <p class="section-desc">${t['dl.desc']}</p>
          </div>
          <div class="api-status-bar" role="status" aria-live="polite">
            <span id="api-status-text">${t['api.loading']}</span>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-refresh-api">${t['api.refresh']}</button>
          </div>
          <div class="download-grid">
            <div class="download-box">
              <h3 style="font-size:1.4rem;" id="dl-release-title">${t['dl.loadingTitle']}</h3>
              <div class="dl-meta-row">
                <span class="dl-badge"><span>${t['dl.version']}</span><strong id="dl-version">—</strong></span>
                <span class="dl-badge"><span>${t['dl.date']}</span><strong id="dl-date">—</strong></span>
                <span class="dl-badge"><span>${t['dl.size']}</span><strong id="dl-size">—</strong></span>
                <span class="dl-badge"><span>${t['dl.downloads']}</span><strong id="dl-count">—</strong></span>
              </div>
              <div class="dl-actions">
                <a class="btn btn-primary" id="btn-dl-arm64" href="https://github.com/li-bao/gooose/releases/latest" target="_blank" rel="noopener noreferrer">${t['dl.btnArm']}</a>
                <a class="btn btn-secondary" id="btn-dl-intel" href="#" style="display:none;">${t['dl.btnIntel']}</a>
                <a class="btn btn-secondary" href="https://github.com/li-bao/gooose/releases" target="_blank" rel="noopener noreferrer">${t['dl.btnAll']}</a>
              </div>
              <p style="margin:8px 0 0;color:var(--muted);font-size:0.9rem;">${t['dl.armOnlyNote']}</p>
              <div class="sha-box">
                <div><strong>${t['dl.shaLabel']}</strong><code id="dl-sha256">—</code></div>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-sha" disabled>${t['dl.copySha']}</button>
              </div>
              <div class="notice-box">
                <strong>${t['dl.signTitle']}</strong>
                <p style="margin:6px 0 0;">${t['dl.signBody']}</p>
                <pre><code>xattr -cr "/Applications/gooose.app"</code></pre>
              </div>
            </div>
            <div class="download-box">
              <h3 style="font-size:1.25rem;margin-bottom:12px;">${t['dl.guideTitle']}</h3>
              <ul style="padding-left:18px;margin:0 0 18px;color:var(--muted);display:grid;gap:8px;">
                ${INSTALL_STEPS[lang].map((s) => `<li>${s}</li>`).join('')}
              </ul>
              <h4 style="font-size:1rem;margin-bottom:8px;">${t['dl.notesTitle']}</h4>
              <div class="release-body-raw" id="dl-release-notes">…</div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.getElementById('btn-refresh-api')?.addEventListener('click', () => global.GitHubDataService.load(true));
    document.getElementById('btn-copy-sha')?.addEventListener('click', async function () {
      const sha = this.dataset.sha;
      if (!sha) return;
      try {
        await navigator.clipboard.writeText(sha);
        this.textContent = t['dl.copied'];
        setTimeout(() => { this.textContent = t['dl.copySha']; }, 1500);
      } catch (e) {}
    });
    updateGitHubBindings(lang);
    return null;
  }

  function renderDocs(root, lang) {
    const { I18N, DOCS } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    let activeId = DOCS[lang][0].id;
    let query = '';

    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['docs.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['docs.title']}</h1>
            <p class="section-desc">${t['docs.desc']}</p>
          </div>
          <div class="docs-shell">
            <div class="docs-sidebar">
              <input type="search" class="search-input" id="docs-search" placeholder="${lang === 'en' ? 'Search docs…' : '搜尋文件…'}" aria-label="Search documentation" />
              <div class="docs-tabs" role="tablist" id="docs-tablist"></div>
            </div>
            <div>
              <div class="docs-progress-track" aria-hidden="true"><div class="docs-progress-fill" id="docs-progress-fill"></div></div>
              <div class="docs-panel" role="tabpanel" id="docs-tabpanel" tabindex="0"></div>
            </div>
          </div>
        </div>
      </section>
    `;

    function drawDocs() {
      const tablist = document.getElementById('docs-tablist');
      const panel = document.getElementById('docs-tabpanel');
      const fill = document.getElementById('docs-progress-fill');
      const items = query.trim()
        ? DOCS[lang].filter((d) => (d.title + ' ' + d.html).toLowerCase().includes(query.toLowerCase()))
        : DOCS[lang];

      if (items.length === 0) {
        tablist.innerHTML = '';
        panel.innerHTML = `<p style="color:var(--muted);">${lang === 'zh-TW' ? '找不到符合的文件主題。' : 'No matching documentation topics.'}</p>`;
        return;
      }
      if (!items.some((d) => d.id === activeId)) activeId = items[0].id;
      const idx = items.findIndex((d) => d.id === activeId);
      if (fill) fill.style.width = `${Math.round(((idx + 1) / items.length) * 100)}%`;

      tablist.innerHTML = items.map((d) => `
        <button type="button" class="doc-tab-btn" role="tab" aria-selected="${d.id === activeId ? 'true' : 'false'}" data-doc-id="${d.id}">${d.title}</button>
      `).join('');
      panel.innerHTML = items[idx].html;

      tablist.querySelectorAll('.doc-tab-btn').forEach((b) => {
        b.addEventListener('click', () => { activeId = b.dataset.docId; drawDocs(); });
      });
      panel.querySelectorAll('.copy-code-btn').forEach((b) => {
        b.addEventListener('click', async () => {
          const code = b.previousElementSibling?.textContent || '';
          try {
            await navigator.clipboard.writeText(code.trim());
            b.textContent = t['dl.copied'];
            setTimeout(() => { b.textContent = t['dl.copySha']; }, 1400);
          } catch (e) {}
        });
      });
    }

    document.getElementById('docs-search')?.addEventListener('input', (e) => { query = e.target.value; drawDocs(); });
    drawDocs();
    return null;
  }

  function renderFAQ(root, lang) {
    const { I18N, FAQ } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    let q = '';
    let cat = 'all';

    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['faq.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['faq.title']}</h1>
            <p class="section-desc">${t['faq.desc']}</p>
          </div>
          <div class="faq-controls">
            <input type="search" class="search-input" id="faq-search" style="max-width:340px;" placeholder="${lang === 'en' ? 'Search FAQ…' : '搜尋常見問題…'}" aria-label="Search FAQ" />
            <select class="pg-select" id="faq-cat" aria-label="FAQ Category">
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="install">Install</option>
              <option value="features">Features</option>
              <option value="privacy">Privacy &amp; Permissions</option>
            </select>
          </div>
          <div class="faq-list" id="faq-list"></div>
        </div>
      </section>
    `;

    function drawFAQ() {
      const list = document.getElementById('faq-list');
      const items = FAQ[lang].filter((it) => (cat === 'all' || it.cat === cat) && (!q.trim() || (it.q + it.a).toLowerCase().includes(q.toLowerCase())));
      if (items.length === 0) {
        list.innerHTML = `<div class="faq-item" style="padding:18px;color:var(--muted);">${lang === 'zh-TW' ? '找不到符合的常見問題。' : 'No matching FAQ items.'}</div>`;
        return;
      }
      list.innerHTML = items.map((item, idx) => `
        <div class="faq-item">
          <button type="button" class="faq-trigger" aria-expanded="false" aria-controls="faq-p-${idx}">
            <span>${item.q}</span><span class="faq-icon" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-p-${idx}" hidden>${item.a}</div>
        </div>
      `).join('');
      list.querySelectorAll('.faq-trigger').forEach((btn) => {
        btn.addEventListener('click', () => {
          const exp = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', exp ? 'false' : 'true');
          const p = document.getElementById(btn.getAttribute('aria-controls'));
          if (p) p.hidden = exp;
        });
      });
    }

    document.getElementById('faq-search')?.addEventListener('input', (e) => { q = e.target.value; drawFAQ(); });
    document.getElementById('faq-cat')?.addEventListener('change', (e) => { cat = e.target.value; drawFAQ(); });
    drawFAQ();
    return null;
  }

  function renderChangelog(root, lang) {
    const { I18N } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['cl.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['cl.title']}</h1>
            <p class="section-desc">${t['cl.desc']}</p>
          </div>
          <div class="changelog-list" id="changelog-list"></div>
        </div>
      </section>
    `;
    updateGitHubBindings(lang);
    return null;
  }

  function renderSecurity(root, lang) {
    const { I18N, SECURITY, PRIVACY } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">${t['sec.eyebrow']}</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${t['sec.title']}</h1>
            <p class="section-desc">${t['sec.desc']}</p>
          </div>
          <div class="two-col">
            <article class="policy-card">
              <h3>${t['sec.cardTitle']}</h3>
              <ul>${SECURITY[lang].map((x) => `<li>${x}</li>`).join('')}</ul>
            </article>
            <article class="policy-card">
              <h3>${t['priv.cardTitle']}</h3>
              <ul>${PRIVACY[lang].map((x) => `<li>${x}</li>`).join('')}</ul>
            </article>
          </div>
        </div>
      </section>
    `;
    return null;
  }

  function renderGooseAI(root, lang) {
    const isEn = lang === 'en';
    root.innerHTML = `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <span class="eyebrow">goooseAI</span>
            <h1 class="section-title" style="font-size:clamp(2rem,3.6vw,2.8rem);">${isEn ? 'Talk to goooseAI' : '與 goooseAI 對話'}</h1>
            <p class="section-desc">${isEn ? 'Ask about gooose setup, permissions, or enjoy 42+ playful goose replies.' : '詢問 gooose 安裝與權限問題，或體驗 48 句不重複的調皮鵝語錄。'}</p>
          </div>
          <div id="goose-ai-page-mount"></div>
        </div>
      </section>
    `;
    if (global.GoooseAI) global.GoooseAI.mountPage(document.getElementById('goose-ai-page-mount'));
    return null;
  }

  function updateGitHubBindings(lang) {
    const { I18N } = global.GOOOSE_CONTENT;
    const t = I18N[lang];
    const { status, repo, latest, releases } = global.GitHubDataService.state;

    const statusTextEl = document.getElementById('api-status-text');
    if (statusTextEl) {
      if (status === 'loading') statusTextEl.textContent = t['api.loading'];
      else if (status === 'live') statusTextEl.textContent = '🟢 ' + t['api.live'];
      else if (status === 'cached') statusTextEl.textContent = '🟡 ' + t['api.cached'];
      else statusTextEl.textContent = '🔴 ' + t['api.unavailable'];
    }

    const starsEl = document.getElementById('hero-stars');
    const forksEl = document.getElementById('hero-forks');
    const relCountEl = document.getElementById('hero-releases-count');
    const heroVerEl = document.getElementById('hero-version');
    const homeTitle = document.getElementById('home-latest-title');
    const homeMeta = document.getElementById('home-latest-meta');
    const homeDmg = document.getElementById('home-quick-dmg');

    const dlTitleEl = document.getElementById('dl-release-title');
    const dlVerEl = document.getElementById('dl-version');
    const dlDateEl = document.getElementById('dl-date');
    const dlSizeEl = document.getElementById('dl-size');
    const dlCountEl = document.getElementById('dl-count');
    const btnArm = document.getElementById('btn-dl-arm64');
    const btnIntel = document.getElementById('btn-dl-intel');
    const shaEl = document.getElementById('dl-sha256');
    const copyBtn = document.getElementById('btn-copy-sha');
    const notesEl = document.getElementById('dl-release-notes');
    const changelogList = document.getElementById('changelog-list');

    if (status === 'unavailable' || (!repo && !latest)) {
      const unavail = lang === 'zh-TW' ? '無法取得' : 'Unavailable';
      [starsEl, forksEl, relCountEl, heroVerEl].forEach((el) => { if (el) el.textContent = status === 'loading' ? '…' : unavail; });
      if (status === 'unavailable') {
        [dlTitleEl, dlVerEl, dlDateEl, dlSizeEl, dlCountEl, shaEl].forEach((el) => { if (el) el.textContent = unavail; });
        if (notesEl) notesEl.textContent = t['api.unavailable'];
        if (changelogList) changelogList.innerHTML = `<div class="release-card"><p style="margin:0;color:var(--muted);">${t['api.unavailable']}</p></div>`;
      }
      return;
    }

    if (repo) {
      if (starsEl) starsEl.textContent = typeof repo.stargazers_count === 'number' ? String(repo.stargazers_count) : '—';
      if (forksEl) forksEl.textContent = typeof repo.forks_count === 'number' ? String(repo.forks_count) : '—';
    }
    if (Array.isArray(releases) && relCountEl) relCountEl.textContent = String(releases.length);

    if (latest) {
      const tag = latest.tag_name || '—';
      if (heroVerEl) heroVerEl.textContent = tag;
      if (homeTitle) homeTitle.textContent = `${latest.name || tag} (${tag})`;
      if (dlTitleEl) dlTitleEl.textContent = latest.name || tag;
      if (dlVerEl) dlVerEl.textContent = tag;
      if (dlDateEl) dlDateEl.textContent = formatDate(latest.published_at, lang);

      const assets = Array.isArray(latest.assets) ? latest.assets : [];
      const armAsset = assets.find((a) => /arm64|apple[-_]?silicon/i.test(a.name || '') && /\.dmg$/i.test(a.name || ''))
        || assets.find((a) => /\.dmg$/i.test(a.name || ''));
      const intelAsset = assets.find((a) => /(intel|x86_64|amd64|universal)/i.test(a.name || '') && /\.(dmg|zip)$/i.test(a.name || ''));

      if (armAsset && armAsset.browser_download_url) {
        if (homeMeta) homeMeta.textContent = `${armAsset.name} · ${formatBytes(armAsset.size)} · ${formatDate(latest.published_at, lang)}`;
        if (homeDmg) {
          homeDmg.href = armAsset.browser_download_url;
          homeDmg.setAttribute('download', armAsset.name || '');
          homeDmg.removeAttribute('data-route');
        }
        if (btnArm) {
          btnArm.href = armAsset.browser_download_url;
          btnArm.setAttribute('download', armAsset.name || '');
          btnArm.textContent = `${t['dl.btnArm']} (${armAsset.name})`;
        }
        if (dlSizeEl) dlSizeEl.textContent = formatBytes(armAsset.size);
        if (dlCountEl) dlCountEl.textContent = typeof armAsset.download_count === 'number' ? String(armAsset.download_count) : '—';
        const digest = armAsset.digest ? String(armAsset.digest).replace(/^sha256:/i, '') : '';
        if (shaEl && copyBtn) {
          if (digest) {
            shaEl.textContent = digest;
            copyBtn.disabled = false;
            copyBtn.dataset.sha = digest;
          } else {
            shaEl.textContent = t['dl.shaMissing'];
            copyBtn.disabled = true;
          }
        }
      }
      if (btnIntel) {
        if (intelAsset && intelAsset.browser_download_url) {
          btnIntel.style.display = 'inline-flex';
          btnIntel.href = intelAsset.browser_download_url;
        } else {
          btnIntel.style.display = 'none';
        }
      }
      if (notesEl) notesEl.textContent = latest.body ? latest.body.trim() : '—';
    }

    if (Array.isArray(releases) && changelogList) {
      changelogList.innerHTML = releases.map((rel) => {
        const body = (rel.body || '').trim();
        const lines = body.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('- ') || l.startsWith('* '));
        const summaryHtml = lines.length > 0
          ? `<ul style="margin:0;padding-left:18px;color:var(--muted);">${lines.slice(0, 5).map((l) => `<li>${escapeHtml(l.slice(2))}</li>`).join('')}</ul>`
          : `<p style="margin:0;color:var(--muted);">${escapeHtml(body || 'No release notes provided.')}</p>`;
        const origBadge = lang === 'zh-TW' ? `<span class="release-lang-note">${t['cl.origLang']}</span>` : '';
        return `
          <article class="release-card">
            <div class="release-head">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span class="release-tag">${escapeHtml(rel.tag_name || '')}</span>
                <strong>${escapeHtml(rel.name || rel.tag_name || '')}</strong>
                ${origBadge}
              </div>
              <span style="color:var(--muted);font-size:0.88rem;">${formatDate(rel.published_at, lang)}</span>
            </div>
            ${summaryHtml}
            ${body ? `<details style="margin-top:12px;"><summary style="cursor:pointer;font-weight:700;font-size:0.88rem;">${t['cl.rawToggle']}</summary><pre class="release-body-raw">${escapeHtml(body)}</pre></details>` : ''}
          </article>
        `;
      }).join('');
    }
  }

  global.GOOOSE_PAGES = {
    home: renderHome,
    features: renderFeatures,
    playground: renderPlayground,
    games: renderGames,
    gallery: renderGallery,
    download: renderDownload,
    docs: renderDocs,
    faq: renderFAQ,
    changelog: renderChangelog,
    security: renderSecurity,
    'goose-ai': renderGooseAI,
    updateGitHubBindings
  };
})(window);
