(function (global) {
  'use strict';

  const STORAGE_KEY = 'gooose-cursor';
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const reducedMotionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  let enabled = !coarsePointer;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'off') enabled = false;
    else if (saved === 'on' && !coarsePointer) enabled = true;
  } catch (e) {}

  let cursorEl = null;
  let targetX = -100;
  let targetY = -100;
  let curX = -100;
  let curY = -100;
  let rafId = null;
  let isVisible = false;
  let currentState = 'normal';
  let clickTimer = null;

  function createCursorDOM() {
    if (cursorEl) return;
    cursorEl = document.createElement('div');
    cursorEl.className = 'goose-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.dataset.state = 'normal';
    cursorEl.innerHTML = `
      <div class="goose-cursor-inner">
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
          <path d="M5 7l13 4-7 10z" fill="#F27D3B" stroke="#2B201A" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M14 14c6-4 14-2 17 4 2 4 1 10-2 14 4 2 7 6 5 11-2 4-10 4-15 1-5-3-7-10-6-16-2-5-2-10 1-14z" fill="#FFFFFF" stroke="#2B201A" stroke-width="2.5" stroke-linejoin="round"/>
          <circle cx="20" cy="15" r="2.2" fill="#2B201A"/>
          <path d="M22 30c3-2 7-1 8 2" stroke="#2B201A" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    document.body.appendChild(cursorEl);
  }

  function shouldHideForTarget(target) {
    if (!target || !(target instanceof Element)) return false;
    return Boolean(target.closest('input, textarea, [contenteditable="true"]'));
  }

  function detectState(target) {
    if (!target || !(target instanceof Element)) return 'normal';
    const disabledEl = target.closest(':disabled, [aria-disabled="true"]');
    if (disabledEl) return 'disabled';
    const interactive = target.closest('a, button, summary, select, [role="button"], [role="tab"], .media-thumb-btn, .memory-tile');
    if (interactive) return 'hover';
    return 'normal';
  }

  function setState(state) {
    if (!cursorEl || currentState === state) return;
    currentState = state;
    cursorEl.dataset.state = state;
  }

  function renderLoop() {
    if (!enabled || !cursorEl || document.hidden) {
      rafId = null;
      return;
    }
    const reduced = reducedMotionQuery && reducedMotionQuery.matches;
    const ease = reduced ? 1 : 0.38;
    curX += (targetX - curX) * ease;
    curY += (targetY - curY) * ease;
    cursorEl.style.transform = `translate3d(${curX - 4}px, ${curY - 6}px, 0)`;
    rafId = requestAnimationFrame(renderLoop);
  }

  function startLoop() {
    if (!rafId && enabled && !document.hidden) {
      rafId = requestAnimationFrame(renderLoop);
    }
  }

  function updateBodyClass() {
    const active = enabled && !coarsePointer;
    document.body.classList.toggle('goose-cursor-active', active);
    if (cursorEl) {
      cursorEl.classList.toggle('visible', active && isVisible);
    }
    if (active) startLoop();
  }

  function init() {
    createCursorDOM();
    updateBodyClass();

    document.addEventListener('pointermove', (e) => {
      if (!enabled || e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        curX = targetX;
        curY = targetY;
      }
      if (shouldHideForTarget(e.target)) {
        isVisible = false;
        cursorEl.classList.remove('visible');
        return;
      }
      isVisible = true;
      cursorEl.classList.add('visible');
      if (e.buttons === 1) setState('drag');
      else setState(detectState(e.target));
      startLoop();
    }, { passive: true });

    document.addEventListener('pointerdown', (e) => {
      if (!enabled || e.pointerType === 'touch' || shouldHideForTarget(e.target)) return;
      setState('click');
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => setState(detectState(e.target)), 150);
    }, { passive: true });

    document.addEventListener('pointerup', (e) => {
      if (!enabled || e.pointerType === 'touch') return;
      setState(detectState(e.target));
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      isVisible = false;
      if (cursorEl) cursorEl.classList.remove('visible');
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && enabled) startLoop();
    });
  }

  global.GoooseCursor = {
    init,
    isEnabled() { return enabled && !coarsePointer; },
    isTouchOnly() { return coarsePointer; },
    setEnabled(val) {
      enabled = Boolean(val) && !coarsePointer;
      try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch (e) {}
      updateBodyClass();
      return this.isEnabled();
    },
    toggle() {
      return this.setEnabled(!enabled);
    },
    setBusy(busy) {
      if (cursorEl) setState(busy ? 'busy' : 'normal');
    }
  };
})(window);
