(function (global) {
  'use strict';

  const VALID_ROUTES = [
    'home', 'features', 'playground', 'games', 'gallery',
    'download', 'docs', 'faq', 'changelog', 'security', 'goose-ai'
  ];

  const PAGE_TITLES = {
    'zh-TW': {
      home: 'gooose — Your Desktop. Their Playground.',
      features: '功能特色 — gooose',
      playground: 'Goose Playground 2.0 — gooose',
      games: 'gooose Arcade 小遊戲 — gooose',
      gallery: '畫面展示 — gooose',
      download: '下載中心 — gooose',
      docs: '使用手冊 — gooose',
      faq: '常見問題 FAQ — gooose',
      changelog: '更新日誌 — gooose',
      security: '安全與隱私 — gooose',
      'goose-ai': 'goooseAI — gooose'
    },
    en: {
      home: 'gooose — A little chaos on your desktop. | Your Desktop. Their Playground.',
      features: 'Features — gooose',
      playground: 'Goose Playground 2.0 — gooose',
      games: 'gooose Arcade — gooose',
      gallery: 'Gallery — gooose',
      download: 'Download — gooose',
      docs: 'Docs — gooose',
      faq: 'FAQ — gooose',
      changelog: 'Changelog — gooose',
      security: 'Security & Privacy — gooose',
      'goose-ai': 'goooseAI — gooose'
    }
  };

  let currentRoute = 'home';
  let currentLang = 'zh-TW';
  let activeCleanup = null;

  function parseLocation() {
    let path = window.location.pathname || '/';
    path = path.replace(/\/index\.html$/i, '/');
    const isEn = path === '/en' || path.startsWith('/en/');
    const lang = isEn ? 'en' : 'zh-TW';
    const stripped = (isEn ? path.slice(3) : path).replace(/^\/+|\/+$/g, '');
    const route = VALID_ROUTES.includes(stripped) ? stripped : (stripped === '' ? 'home' : 'home');
    return { lang, route };
  }

  function routeUrl(route, lang) {
    const clean = VALID_ROUTES.includes(route) ? route : 'home';
    const prefix = lang === 'en' ? '/en' : '';
    if (clean === 'home') return prefix ? '/en/' : '/';
    return `${prefix}/${clean}/`;
  }

  function updateActiveNav(route) {
    document.querySelectorAll('[data-route]').forEach((el) => {
      if (el.closest('nav') || el.closest('#mobile-drawer')) {
        if (el.dataset.route === route) {
          el.setAttribute('aria-current', 'page');
        } else {
          el.removeAttribute('aria-current');
        }
      }
    });
  }

  function renderRoute(route, lang) {
    if (typeof activeCleanup === 'function') {
      try { activeCleanup(); } catch (e) {}
      activeCleanup = null;
    }

    currentRoute = VALID_ROUTES.includes(route) ? route : 'home';
    currentLang = lang === 'en' ? 'en' : 'zh-TW';

    document.documentElement.lang = currentLang;
    document.documentElement.dataset.route = currentRoute;
    document.title = (PAGE_TITLES[currentLang] && PAGE_TITLES[currentLang][currentRoute]) || 'gooose';

    const root = document.getElementById('page-root');
    if (root && global.GOOOSE_PAGES) {
      const renderer = global.GOOOSE_PAGES[currentRoute] || global.GOOOSE_PAGES.home;
      activeCleanup = renderer(root, currentLang);
      root.classList.remove('page-enter');
      void root.offsetWidth;
      root.classList.add('page-enter');
    }

    if (global.GoooseAI) {
      global.GoooseAI.updateLanguage(currentLang);
      global.GoooseAI.setFloatingVisible(currentRoute !== 'goose-ai');
    }

    updateActiveNav(currentRoute);
    if (global.GoooseApp && global.GoooseApp.syncChromeText) {
      global.GoooseApp.syncChromeText(currentLang);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function navigate(route, opts = {}) {
    const nextRoute = VALID_ROUTES.includes(route) ? route : 'home';
    const nextLang = opts.lang || currentLang;
    const targetUrl = routeUrl(nextRoute, nextLang);
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!opts.replace && window.location.pathname !== targetUrl) {
      window.history.pushState({ route: nextRoute, lang: nextLang }, '', targetUrl);
    } else if (opts.replace) {
      window.history.replaceState({ route: nextRoute, lang: nextLang }, '', targetUrl);
    }

    if (document.startViewTransition && !reduced) {
      document.startViewTransition(() => renderRoute(nextRoute, nextLang));
    } else {
      renderRoute(nextRoute, nextLang);
    }
  }

  function init(initialRoute, initialLang) {
    const parsed = parseLocation();
    const startRoute = initialRoute || parsed.route;
    const startLang = initialLang || parsed.lang;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const targetRoute = link.dataset.route;
      const mobileDrawer = document.getElementById('mobile-drawer');
      const mobileBtn = document.getElementById('mobile-menu-btn');
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      }
      navigate(targetRoute);
    });

    window.addEventListener('popstate', () => {
      const next = parseLocation();
      renderRoute(next.route, next.lang);
    });

    renderRoute(startRoute, startLang);
  }

  global.GoooseRouter = {
    init,
    navigate,
    routeUrl,
    getCurrentRoute: () => currentRoute,
    getCurrentLang: () => currentLang,
    VALID_ROUTES
  };
})(window);
