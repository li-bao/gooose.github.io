(function (global) {
  'use strict';

  const REPO_OWNER = 'li-bao';
  const REPO_NAME = 'gooose';
  const CACHE_KEY = 'gooose_gh_cache_v2';
  const CACHE_TTL_MS = 15 * 60 * 1000;
  const REQUEST_TIMEOUT_MS = 8000;

  const GitHubDataService = {
    state: {
      status: 'loading', // loading | live | cached | unavailable
      repo: null,
      latest: null,
      releases: null,
      error: null
    },
    listeners: [],

    onChange(fn) {
      this.listeners.push(fn);
    },

    emit() {
      this.listeners.forEach((fn) => fn(this.state));
    },

    readCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    writeCache(payload) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } catch (e) {}
    },

    async fetchWithETag(url, prevEntry) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const headers = { Accept: 'application/vnd.github+json' };
      if (prevEntry && prevEntry.etag) headers['If-None-Match'] = prevEntry.etag;
      try {
        const res = await fetch(url, { headers, signal: controller.signal });
        if (res.status === 304 && prevEntry && prevEntry.data) {
          return { data: prevEntry.data, etag: prevEntry.etag };
        }
        if (!res.ok) {
          const err = new Error('HTTP_' + res.status);
          err.status = res.status;
          throw err;
        }
        const json = await res.json();
        if (!json || typeof json !== 'object') throw new Error('INVALID_JSON');
        return { data: json, etag: res.headers.get('ETag') || null };
      } finally {
        clearTimeout(timer);
      }
    },

    async load(forceRefresh = false) {
      const cached = this.readCache();
      const now = Date.now();
      if (!forceRefresh && cached && cached.timestamp && (now - cached.timestamp) < CACHE_TTL_MS && cached.repo && cached.latest && Array.isArray(cached.releases)) {
        this.state = { status: 'live', repo: cached.repo.data, latest: cached.latest.data, releases: cached.releases.data, error: null };
        this.emit();
        return;
      }

      this.state.status = 'loading';
      this.emit();

      const base = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
      try {
        const [repoRes, latestRes, releasesRes] = await Promise.all([
          this.fetchWithETag(base, cached && cached.repo),
          this.fetchWithETag(`${base}/releases/latest`, cached && cached.latest),
          this.fetchWithETag(`${base}/releases?per_page=20`, cached && cached.releases)
        ]);
        if (!Array.isArray(releasesRes.data)) throw new Error('INVALID_RELEASES');

        const nextCache = {
          timestamp: now,
          repo: { data: repoRes.data, etag: repoRes.etag },
          latest: { data: latestRes.data, etag: latestRes.etag },
          releases: { data: releasesRes.data, etag: releasesRes.etag }
        };
        this.writeCache(nextCache);
        this.state = {
          status: 'live',
          repo: repoRes.data,
          latest: latestRes.data,
          releases: releasesRes.data,
          error: null
        };
      } catch (err) {
        if (cached && cached.repo && cached.latest && cached.releases) {
          this.state = {
            status: 'cached',
            repo: cached.repo.data,
            latest: cached.latest.data,
            releases: cached.releases.data,
            error: err.message
          };
        } else {
          this.state = {
            status: 'unavailable',
            repo: null,
            latest: null,
            releases: null,
            error: err.message
          };
        }
      }
      this.emit();
    }
  };

  global.GitHubDataService = GitHubDataService;
})(window);
