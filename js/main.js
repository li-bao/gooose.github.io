(function () {
  'use strict';

  const { I18N, FEATURES, DOCS, FAQ, SECURITY, PRIVACY, MISSING_MEDIA, INSTALL_STEPS } = window.GOOOSE_CONTENT;
  const defaultLang = document.documentElement.dataset.defaultLang === 'en' ? 'en' : 'zh-TW';
  let currentLang = defaultLang;
  let activeDocId = 'getting-started';
  let docQuery = '';
  let faqQuery = '';
  let faqCat = 'all';
  let galleryFilter = 'all';

  const themeOrder = ['system', 'light', 'dark'];
  const themeIcons = { system: '🖥️', light: '☀️', dark: '🌙' };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2500);
  }

  function applyTheme(mode) {
    if (!themeOrder.includes(mode)) mode = 'system';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = resolved;
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#191310' : '#FFFBF2');
    try { localStorage.setItem('gooose-theme', mode); } catch (e) {}
    const iconEl = document.getElementById('theme-icon');
    const labelEl = document.getElementById('theme-label');
    if (iconEl) iconEl.textContent = themeIcons[mode];
    if (labelEl) labelEl.textContent = I18N[currentLang]['theme.' + mode];
  }

  function renderFeatures() {
    const grid = document.getElementById('features-grid');
    if (!grid) return;
    grid.innerHTML = FEATURES[currentLang].map((f, idx) => `
      <article class="feature-card" tabindex="0" data-idx="${idx}">
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
    `).join('');

    grid.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('click', () => {
        if (window.GoooseSound) window.GoooseSound.click();
        card.style.borderColor = 'var(--orange)';
        setTimeout(() => { card.style.borderColor = ''; }, 450);
      });
    });
  }

  function renderGallery() {
    const shotCard = document.getElementById('gallery-shot-card');
    const missingCard = document.getElementById('gallery-missing-card');
    const list = document.getElementById('missing-media-list');
    if (list) list.innerHTML = MISSING_MEDIA[currentLang].map((x) => `<li>${x}</li>`).join('');
    if (shotCard) shotCard.style.display = (galleryFilter === 'all' || galleryFilter === 'screenshots') ? '' : 'none';
    if (missingCard) missingCard.style.display = (galleryFilter === 'all' || galleryFilter === 'gif' || galleryFilter === 'video') ? '' : 'none';
  }

  function renderDocs() {
    const tablist = document.getElementById('docs-tablist');
    const panel = document.getElementById('docs-tabpanel');
    const progress = document.getElementById('docs-progress-fill');
    if (!tablist || !panel) return;

    const allDocs = DOCS[currentLang];
    const filtered = docQuery.trim()
      ? allDocs.filter((d) => (d.title + ' ' + d.html).toLowerCase().includes(docQuery.toLowerCase()))
      : allDocs;

    if (filtered.length === 0) {
      tablist.innerHTML = '';
      panel.innerHTML = `<p style="color:var(--muted);">${currentLang === 'zh-TW' ? '找不到符合的文件主題。' : 'No matching documentation topics.'}</p>`;
      return;
    }

    if (!filtered.some((d) => d.id === activeDocId)) activeDocId = filtered[0].id;
    const activeIndex = filtered.findIndex((d) => d.id === activeDocId);
    if (progress) {
      progress.style.width = `${Math.round(((activeIndex + 1) / filtered.length) * 100)}%`;
    }

    tablist.innerHTML = filtered.map((d) => `
      <button type="button" class="doc-tab-btn" role="tab" id="tab-${d.id}"
        aria-controls="docs-tabpanel" aria-selected="${d.id === activeDocId ? 'true' : 'false'}"
        data-doc-id="${d.id}">${d.title}</button>
    `).join('');

    const active = filtered[activeIndex] || filtered[0];
    panel.setAttribute('aria-labelledby', 'tab-' + active.id);
    panel.innerHTML = active.html;

    tablist.querySelectorAll('.doc-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeDocId = btn.dataset.docId;
        renderDocs();
      });
    });

    panel.querySelectorAll('.copy-code-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const code = btn.previousElementSibling?.textContent || '';
        try {
          await navigator.clipboard.writeText(code.trim());
          btn.textContent = I18N[currentLang]['dl.copied'];
          setTimeout(() => { btn.textContent = I18N[currentLang]['dl.copySha']; }, 1400);
        } catch (e) {}
      });
    });
  }

  function renderFAQ() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    const q = faqQuery.trim().toLowerCase();
    const items = FAQ[currentLang].filter((item) => {
      const catOk = faqCat === 'all' || item.cat === faqCat;
      const textOk = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return catOk && textOk;
    });

    if (items.length === 0) {
      list.innerHTML = `<div class="faq-item" style="padding:18px;color:var(--muted);">${currentLang === 'zh-TW' ? '找不到符合的常見問題。' : 'No matching FAQ items.'}</div>`;
      return;
    }

    list.innerHTML = items.map((item, idx) => `
      <div class="faq-item">
        <button type="button" class="faq-trigger" aria-expanded="false" aria-controls="faq-panel-${idx}" id="faq-btn-${idx}">
          <span>${item.q}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-panel" id="faq-panel-${idx}" role="region" aria-labelledby="faq-btn-${idx}" hidden>${item.a}</div>
      </div>
    `).join('');

    list.querySelectorAll('.faq-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function renderPolicies() {
    const sec = document.getElementById('security-list');
    const priv = document.getElementById('privacy-list');
    const steps = document.getElementById('dl-install-steps');
    if (sec) sec.innerHTML = SECURITY[currentLang].map((x) => `<li>${x}</li>`).join('');
    if (priv) priv.innerHTML = PRIVACY[currentLang].map((x) => `<li>${x}</li>`).join('');
    if (steps) steps.innerHTML = INSTALL_STEPS[currentLang].map((x) => `<li>${x}</li>`).join('');
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '—';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(2) + ' MB' : Math.round(bytes / 1024) + ' KB';
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(currentLang === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function renderGitHubUI(state) {
    if (!state) return;
    const { status, repo, latest, releases } = state;
    const loadingPill = document.getElementById('loading-goose-pill');
    if (loadingPill) loadingPill.classList.toggle('hidden', status !== 'loading');
    if (window.GoooseCursor) window.GoooseCursor.setBusy(status === 'loading');

    const statusTextEl = document.getElementById('api-status-text');
    const starsEl = document.getElementById('hero-stars');
    const forksEl = document.getElementById('hero-forks');
    const relCountEl = document.getElementById('hero-releases-count');
    const heroVerEl = document.getElementById('hero-version');
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

    if (statusTextEl) {
      if (status === 'loading') statusTextEl.textContent = I18N[currentLang]['api.loading'];
      else if (status === 'live') statusTextEl.textContent = '🟢 ' + I18N[currentLang]['api.live'];
      else if (status === 'cached') statusTextEl.textContent = '🟡 ' + I18N[currentLang]['api.cached'];
      else statusTextEl.textContent = '🔴 ' + I18N[currentLang]['api.unavailable'];
    }

    if (status === 'unavailable' || (!repo && !latest)) {
      const unavail = currentLang === 'zh-TW' ? '無法取得' : 'Unavailable';
      if (starsEl) starsEl.textContent = status === 'loading' ? '…' : unavail;
      if (forksEl) forksEl.textContent = status === 'loading' ? '…' : unavail;
      if (relCountEl) relCountEl.textContent = status === 'loading' ? '…' : unavail;
      if (heroVerEl) heroVerEl.textContent = status === 'loading' ? '…' : unavail;
      if (status === 'unavailable') {
        if (dlTitleEl) dlTitleEl.textContent = unavail;
        if (dlVerEl) dlVerEl.textContent = unavail;
        if (dlDateEl) dlDateEl.textContent = unavail;
        if (dlSizeEl) dlSizeEl.textContent = unavail;
        if (dlCountEl) dlCountEl.textContent = unavail;
        if (shaEl) shaEl.textContent = unavail;
        if (copyBtn) copyBtn.disabled = true;
        if (notesEl) notesEl.textContent = I18N[currentLang]['api.unavailable'];
        if (changelogList) changelogList.innerHTML = `<div class="release-card"><p style="margin:0;color:var(--muted);">${I18N[currentLang]['api.unavailable']}</p></div>`;
      }
      return;
    }

    if (repo) {
      if (starsEl) starsEl.textContent = typeof repo.stargazers_count === 'number' ? String(repo.stargazers_count) : '—';
      if (forksEl) forksEl.textContent = typeof repo.forks_count === 'number' ? String(repo.forks_count) : '—';
    }
    if (Array.isArray(releases) && relCountEl) {
      relCountEl.textContent = String(releases.length);
    }

    if (latest) {
      const tag = latest.tag_name || '—';
      if (heroVerEl) heroVerEl.textContent = tag;
      if (dlTitleEl) dlTitleEl.textContent = latest.name || tag;
      if (dlVerEl) dlVerEl.textContent = tag;
      if (dlDateEl) dlDateEl.textContent = formatDate(latest.published_at);

      const assets = Array.isArray(latest.assets) ? latest.assets : [];
      const armAsset = assets.find((a) => /arm64|apple[-_]?silicon/i.test(a.name || '') && /\.dmg$/i.test(a.name || ''))
        || assets.find((a) => /\.dmg$/i.test(a.name || ''));
      const intelAsset = assets.find((a) => /(intel|x86_64|amd64|universal)/i.test(a.name || '') && /\.(dmg|zip)$/i.test(a.name || ''));

      if (armAsset && armAsset.browser_download_url) {
        btnArm.href = armAsset.browser_download_url;
        btnArm.setAttribute('download', armAsset.name || '');
        btnArm.textContent = `${I18N[currentLang]['dl.btnArm']} (${armAsset.name})`;
        if (dlSizeEl) dlSizeEl.textContent = formatBytes(armAsset.size);
        if (dlCountEl) dlCountEl.textContent = typeof armAsset.download_count === 'number' ? String(armAsset.download_count) : '—';

        const digest = armAsset.digest ? String(armAsset.digest).replace(/^sha256:/i, '') : '';
        if (digest) {
          shaEl.textContent = digest;
          copyBtn.disabled = false;
          copyBtn.dataset.sha = digest;
        } else {
          shaEl.textContent = I18N[currentLang]['dl.shaMissing'];
          copyBtn.disabled = true;
        }
      }

      if (intelAsset && intelAsset.browser_download_url) {
        btnIntel.style.display = 'inline-flex';
        btnIntel.href = intelAsset.browser_download_url;
        btnIntel.textContent = `${I18N[currentLang]['dl.btnIntel']} (${intelAsset.name})`;
      } else if (btnIntel) {
        btnIntel.style.display = 'none';
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
        const origBadge = currentLang === 'zh-TW' ? `<span class="release-lang-note">${I18N['zh-TW']['cl.origLang']}</span>` : '';
        return `
          <article class="release-card">
            <div class="release-head">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span class="release-tag">${escapeHtml(rel.tag_name || '')}</span>
                <strong>${escapeHtml(rel.name || rel.tag_name || '')}</strong>
                ${origBadge}
              </div>
              <span style="color:var(--muted);font-size:0.88rem;">${formatDate(rel.published_at)}</span>
            </div>
            ${summaryHtml}
            ${body ? `
              <details style="margin-top:12px;">
                <summary style="cursor:pointer;font-weight:700;font-size:0.88rem;">${I18N[currentLang]['cl.rawToggle']}</summary>
                <pre class="release-body-raw">${escapeHtml(body)}</pre>
              </details>
            ` : ''}
          </article>
        `;
      }).join('');
    }
  }

  function applyTranslations(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh-TW';
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (I18N[currentLang][key]) el.textContent = I18N[currentLang][key];
    });
    const langLabel = document.getElementById('lang-switch-label');
    if (langLabel) langLabel.textContent = currentLang === 'zh-TW' ? 'EN' : '繁中';

    const mode = document.documentElement.dataset.themeMode || 'system';
    const themeLabel = document.getElementById('theme-label');
    if (themeLabel) themeLabel.textContent = I18N[currentLang]['theme.' + mode];

    renderFeatures();
    renderGallery();
    renderDocs();
    renderFAQ();
    renderPolicies();
    renderGitHubUI(window.GitHubDataService.state);
    if (window.GoooseAI) window.GoooseAI.updateLanguage(currentLang);
  }

  function updateToggleButtons() {
    const cursorBtn = document.getElementById('cursor-switch');
    const soundBtn = document.getElementById('sound-switch');
    const motionBtn = document.getElementById('motion-switch');
    if (cursorBtn && window.GoooseCursor) {
      const on = window.GoooseCursor.isEnabled();
      cursorBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (soundBtn && window.GoooseSound) {
      const on = window.GoooseSound.isEnabled();
      soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      soundBtn.textContent = on ? '🔊' : '🔇';
    }
    if (motionBtn) {
      const reduced = document.documentElement.dataset.reducedMotion === 'true';
      motionBtn.setAttribute('aria-pressed', reduced ? 'true' : 'false');
    }
  }

  function initEasterEggs() {
    let logoClicks = 0;
    document.getElementById('brand-logo')?.addEventListener('click', () => {
      logoClicks += 1;
      if (logoClicks === 7) {
        logoClicks = 0;
        if (window.GoooseSound) window.GoooseSound.win();
        showToast(currentLang === 'zh-TW' ? '🎉 彩蛋解鎖：你發現了黃金鵝祝福！' : '🎉 Easter Egg: Golden Goose Blessing unlocked!');
      }
    });

    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kIdx = 0;
    document.addEventListener('keydown', (e) => {
      if (e.key === konami[kIdx] || e.key.toLowerCase() === konami[kIdx]) {
        kIdx += 1;
        if (kIdx === konami.length) {
          kIdx = 0;
          if (window.GoooseSound) window.GoooseSound.win();
          showToast(currentLang === 'zh-TW' ? '🥚 Konami Code 啟動！HONK HONK！' : '🥚 Konami Code Activated! HONK HONK!');
          document.getElementById('pg-add-goose')?.click();
        }
      } else {
        kIdx = 0;
      }
    });

    document.getElementById('secret-footer-goose')?.addEventListener('click', () => {
      if (window.GoooseSound) window.GoooseSound.honk();
      showToast(currentLang === 'zh-TW' ? '🪿 秘密小鵝：我其實在頁尾偷懶睡覺！' : '🪿 Secret Goose: Napping in the footer!');
    });
  }

  // Init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    if (window.GoooseCursor) window.GoooseCursor.init();
    if (window.GoooseAI) window.GoooseAI.init(defaultLang);
    if (window.initHeroGoose) window.initHeroGoose();
    if (window.initPlayground2) window.initPlayground2();
    if (window.initMiniGames) window.initMiniGames();

    document.getElementById('theme-switch')?.addEventListener('click', () => {
      const cur = document.documentElement.dataset.themeMode || 'system';
      applyTheme(themeOrder[(themeOrder.indexOf(cur) + 1) % themeOrder.length]);
    });

    document.getElementById('lang-switch')?.addEventListener('click', () => {
      const hash = window.location.hash || '';
      if (window.location.protocol === 'file:') {
        applyTranslations(currentLang === 'zh-TW' ? 'en' : 'zh-TW');
        return;
      }
      window.location.href = currentLang === 'zh-TW' ? ('en/' + hash) : ('../' + hash);
    });

    document.getElementById('cursor-switch')?.addEventListener('click', () => {
      if (window.GoooseCursor) window.GoooseCursor.toggle();
      updateToggleButtons();
    });

    document.getElementById('sound-switch')?.addEventListener('click', () => {
      if (window.GoooseSound) window.GoooseSound.toggle();
      updateToggleButtons();
    });

    document.getElementById('motion-switch')?.addEventListener('click', () => {
      const next = document.documentElement.dataset.reducedMotion !== 'true';
      document.documentElement.dataset.reducedMotion = next ? 'true' : 'false';
      updateToggleButtons();
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    mobileBtn?.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileDrawer?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        galleryFilter = btn.dataset.filter || 'all';
        renderGallery();
      });
    });

    document.getElementById('docs-search')?.addEventListener('input', (e) => {
      docQuery = e.target.value;
      renderDocs();
    });

    document.getElementById('faq-search')?.addEventListener('input', (e) => {
      faqQuery = e.target.value;
      renderFAQ();
    });
    document.getElementById('faq-cat')?.addEventListener('change', (e) => {
      faqCat = e.target.value;
      renderFAQ();
    });

    const lightbox = document.getElementById('lightbox');
    const lbWrap = document.getElementById('lightbox-media-wrap');
    let lastFocus = null;
    document.getElementById('open-lightbox-screenshot')?.addEventListener('click', () => {
      const img = document.getElementById('gallery-screenshot-img');
      if (!img || !lightbox) return;
      lastFocus = document.activeElement;
      lbWrap.innerHTML = `<img src="${img.src}" alt="${escapeHtml(img.alt)}" />`;
      lightbox.classList.add('open');
      document.getElementById('lightbox-close')?.focus();
    });
    function closeLB() {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      lbWrap.innerHTML = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
    document.getElementById('lightbox-close')?.addEventListener('click', closeLB);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLB(); });

    document.getElementById('btn-refresh-api')?.addEventListener('click', () => window.GitHubDataService.load(true));
    document.getElementById('btn-copy-sha')?.addEventListener('click', async function () {
      const sha = this.dataset.sha;
      if (!sha) return;
      try {
        await navigator.clipboard.writeText(sha);
        this.textContent = I18N[currentLang]['dl.copied'];
        setTimeout(() => { this.textContent = I18N[currentLang]['dl.copySha']; }, 1500);
      } catch (e) {}
    });

    window.GitHubDataService.onChange(renderGitHubUI);
    applyTranslations(defaultLang);
    applyTheme(document.documentElement.dataset.themeMode || 'system');
    updateToggleButtons();
    initEasterEggs();
    window.GitHubDataService.load(false);
  });
})();
