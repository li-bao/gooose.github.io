(function (global) {
  'use strict';

  const { I18N, FEATURES, DOCS, FAQ } = global.GOOOSE_CONTENT;
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

  function applyTheme(mode, lang) {
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
    if (labelEl) labelEl.textContent = I18N[lang || 'zh-TW']['theme.' + mode];
  }

  function syncChromeText(lang) {
    const t = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      if (t[k]) el.textContent = t[k];
    });
    const langLabel = document.getElementById('lang-switch-label');
    if (langLabel) langLabel.textContent = lang === 'zh-TW' ? 'EN' : '繁中';

    const mode = document.documentElement.dataset.themeMode || 'system';
    const themeLabel = document.getElementById('theme-label');
    if (themeLabel) themeLabel.textContent = t['theme.' + mode];

    // Update nav hrefs for current language
    document.querySelectorAll('a[data-route]').forEach((a) => {
      if (a.closest('header') || a.closest('footer')) {
        a.setAttribute('href', global.GoooseRouter.routeUrl(a.dataset.route, lang));
      }
    });
  }

  function buildSearchIndex(lang) {
    const items = [];
    FEATURES[lang].forEach((f) => {
      items.push({ cat: lang === 'en' ? 'Feature' : '功能特色', title: f.title, text: f.desc, route: 'features' });
    });
    DOCS[lang].forEach((d) => {
      const plain = d.html.replace(/<[^>]+>/g, ' ');
      items.push({ cat: lang === 'en' ? 'Docs' : '使用文件', title: d.title, text: plain, route: 'docs' });
    });
    FAQ[lang].forEach((q) => {
      items.push({ cat: 'FAQ', title: q.q, text: q.a, route: 'faq' });
    });
    const rels = global.GitHubDataService?.state?.releases;
    if (Array.isArray(rels)) {
      rels.forEach((r) => {
        items.push({ cat: 'Changelog', title: `${r.tag_name} — ${r.name || ''}`, text: r.body || '', route: 'changelog' });
      });
    }
    return items;
  }

  function initGlobalSearch() {
    const modal = document.getElementById('global-search-modal');
    const input = document.getElementById('global-search-input');
    const resultsEl = document.getElementById('global-search-results');
    const openBtn = document.getElementById('global-search-btn');
    const closeBtn = document.getElementById('global-search-close');
    if (!modal || !input || !resultsEl) return;

    function renderResults(q) {
      const lang = global.GoooseRouter.getCurrentLang();
      const idx = buildSearchIndex(lang);
      const term = q.trim().toLowerCase();
      const matched = term
        ? idx.filter((it) => (it.title + ' ' + it.text + ' ' + it.cat).toLowerCase().includes(term)).slice(0, 12)
        : idx.slice(0, 8);

      if (matched.length === 0) {
        resultsEl.innerHTML = `<p style="padding:12px;color:var(--muted);margin:0;">${lang === 'en' ? 'No results found.' : '找不到符合的結果。'}</p>`;
        return;
      }

      resultsEl.innerHTML = matched.map((m) => `
        <button type="button" class="search-result-item" data-target-route="${m.route}">
          <span class="search-result-cat">${escapeHtml(m.cat)}</span>
          <strong>${escapeHtml(m.title)}</strong>
          <span style="font-size:0.82rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(m.text.slice(0, 120))}</span>
        </button>
      `).join('');

      resultsEl.querySelectorAll('.search-result-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          closeModal();
          global.GoooseRouter.navigate(btn.dataset.targetRoute);
        });
      });
    }

    function openModal() {
      modal.classList.add('open');
      input.value = '';
      renderResults('');
      input.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
    }

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    input.addEventListener('input', (e) => renderResults(e.target.value));

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('open')) closeModal();
        else openModal();
      } else if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function updateToggleButtons() {
    const cursorBtn = document.getElementById('cursor-switch');
    const soundBtn = document.getElementById('sound-switch');
    const motionBtn = document.getElementById('motion-switch');
    if (cursorBtn && global.GoooseCursor) cursorBtn.setAttribute('aria-pressed', global.GoooseCursor.isEnabled() ? 'true' : 'false');
    if (soundBtn && global.GoooseSound) {
      const on = global.GoooseSound.isEnabled();
      soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      soundBtn.textContent = on ? '🔊' : '🔇';
    }
    if (motionBtn) motionBtn.setAttribute('aria-pressed', document.documentElement.dataset.reducedMotion === 'true' ? 'true' : 'false');
  }

  function initEasterEggs() {
    let logoClicks = 0;
    document.getElementById('brand-logo')?.addEventListener('click', () => {
      logoClicks += 1;
      if (logoClicks === 7) {
        logoClicks = 0;
        const lang = global.GoooseRouter.getCurrentLang();
        if (global.GoooseSound) global.GoooseSound.win();
        showToast(lang === 'en' ? '🎉 Easter Egg: Golden Goose Blessing!' : '🎉 彩蛋解鎖：你發現了黃金鵝祝福！');
      }
    });

    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kIdx = 0;
    document.addEventListener('keydown', (e) => {
      if (e.key === konami[kIdx] || e.key.toLowerCase() === konami[kIdx]) {
        kIdx += 1;
        if (kIdx === konami.length) {
          kIdx = 0;
          const lang = global.GoooseRouter.getCurrentLang();
          if (global.GoooseSound) global.GoooseSound.win();
          showToast(lang === 'en' ? '🥚 Konami Code! HONK HONK!' : '🥚 Konami Code 啟動！HONK HONK！');
        }
      } else {
        kIdx = 0;
      }
    });

    document.getElementById('secret-footer-goose')?.addEventListener('click', () => {
      const lang = global.GoooseRouter.getCurrentLang();
      if (global.GoooseSound) global.GoooseSound.honk();
      showToast(lang === 'en' ? '🪿 Secret Goose: Napping in the footer!' : '🪿 秘密小鵝：在頁尾偷懶睡覺中！');
    });
  }

  global.GoooseApp = { syncChromeText };

  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = document.documentElement.dataset.defaultLang === 'en' ? 'en' : 'zh-TW';
    const initialRoute = document.documentElement.dataset.initialRoute || null;

    if (global.GoooseCursor) global.GoooseCursor.init();
    if (global.GoooseAI) global.GoooseAI.init(initialLang);

    // Lightbox global helper
    const lightbox = document.getElementById('lightbox');
    const lbWrap = document.getElementById('lightbox-media-wrap');
    let lastFocus = null;
    global.openLightbox = function (src, alt) {
      if (!lightbox || !lbWrap) return;
      lastFocus = document.activeElement;
      lbWrap.innerHTML = `<img src="${src}" alt="${escapeHtml(alt)}" />`;
      lightbox.classList.add('open');
      document.getElementById('lightbox-close')?.focus();
    };
    function closeLB() {
      if (!lightbox || !lbWrap) return;
      lightbox.classList.remove('open');
      lbWrap.innerHTML = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
    document.getElementById('lightbox-close')?.addEventListener('click', closeLB);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLB(); });

    document.getElementById('theme-switch')?.addEventListener('click', () => {
      const cur = document.documentElement.dataset.themeMode || 'system';
      applyTheme(themeOrder[(themeOrder.indexOf(cur) + 1) % themeOrder.length], global.GoooseRouter.getCurrentLang());
    });

    document.getElementById('lang-switch')?.addEventListener('click', () => {
      const curLang = global.GoooseRouter.getCurrentLang();
      const nextLang = curLang === 'zh-TW' ? 'en' : 'zh-TW';
      global.GoooseRouter.navigate(global.GoooseRouter.getCurrentRoute(), { lang: nextLang });
    });

    document.getElementById('cursor-switch')?.addEventListener('click', () => {
      if (global.GoooseCursor) global.GoooseCursor.toggle();
      updateToggleButtons();
    });
    document.getElementById('sound-switch')?.addEventListener('click', () => {
      if (global.GoooseSound) global.GoooseSound.toggle();
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

    global.GitHubDataService.onChange((state) => {
      const loadingPill = document.getElementById('loading-goose-pill');
      if (loadingPill) loadingPill.classList.toggle('hidden', state.status !== 'loading');
      if (global.GoooseCursor) global.GoooseCursor.setBusy(state.status === 'loading');
      if (global.GOOOSE_PAGES) global.GOOOSE_PAGES.updateGitHubBindings(global.GoooseRouter.getCurrentLang());
    });

    applyTheme(document.documentElement.dataset.themeMode || 'system', initialLang);
    updateToggleButtons();
    initGlobalSearch();
    initEasterEggs();

    global.GoooseRouter.init(initialRoute, initialLang);
    global.GitHubDataService.load(false);
  });
})(window);
