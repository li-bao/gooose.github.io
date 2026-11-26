(function (global) {
  'use strict';

  const STORAGE_KEY = 'gooose-sound';
  let ctx = null;
  let enabled = false;

  try {
    enabled = localStorage.getItem(STORAGE_KEY) === 'on';
  } catch (e) {}

  function ensureCtx() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(freq, duration, type = 'triangle', gainVal = 0.08, slideTo = null) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  const GoooseSound = {
    isEnabled() {
      return enabled;
    },
    setEnabled(val) {
      enabled = Boolean(val);
      try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch (e) {}
      if (enabled) this.click();
      return enabled;
    },
    toggle() {
      return this.setEnabled(!enabled);
    },
    honk() {
      tone(370, 0.12, 'sawtooth', 0.06, 260);
      setTimeout(() => tone(330, 0.14, 'sawtooth', 0.05, 220), 80);
    },
    step() {
      tone(150, 0.04, 'sine', 0.03, 95);
    },
    eat() {
      tone(440, 0.07, 'triangle', 0.05, 580);
      setTimeout(() => tone(520, 0.07, 'triangle', 0.05, 660), 75);
    },
    jump() {
      tone(280, 0.14, 'sine', 0.06, 560);
    },
    sleep() {
      tone(240, 0.22, 'sine', 0.03, 180);
    },
    click() {
      tone(520, 0.05, 'triangle', 0.04, 620);
    },
    score() {
      tone(587, 0.09, 'triangle', 0.06, 880);
    },
    hazard() {
      tone(190, 0.18, 'sawtooth', 0.06, 95);
    },
    win() {
      [523, 659, 784, 1046].forEach((f, i) => {
        setTimeout(() => tone(f, 0.14, 'triangle', 0.06), i * 85);
      });
    }
  };

  global.GoooseSound = GoooseSound;
})(window);
