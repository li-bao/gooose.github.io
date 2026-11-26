(function (global) {
  'use strict';

  /* =====================================
   * Mini-Game 1: Bread Collector (Canvas)
   * ===================================== */
  function initBreadCollector() {
    const canvas = document.getElementById('bread-game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const BEST_KEY = 'gooose_bread_best';
    let W = 500;
    let H = 300;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let active = false;
    let score = 0;
    let lives = 3;
    let best = 0;
    let level = 1;
    try { best = Number(localStorage.getItem(BEST_KEY) || 0) || 0; } catch (e) {}

    const player = { x: 250, w: 54, h: 36, speed: 340 };
    const items = [];
    const keys = { left: false, right: false };
    let spawnTimer = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(260, rect.width || 500);
      H = Math.max(220, rect.height || 300);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      player.x = Math.max(30, Math.min(W - 30, player.x));
    }

    function updateUI() {
      const s = document.getElementById('bg-score');
      const l = document.getElementById('bg-lives');
      const b = document.getElementById('bg-best');
      if (s) s.textContent = String(score);
      if (l) l.textContent = '❤️'.repeat(Math.max(0, lives)) || '0';
      if (b) b.textContent = String(best);
    }

    function startGame() {
      active = true;
      score = 0;
      lives = 3;
      level = 1;
      items.length = 0;
      player.x = W / 2;
      updateUI();
    }

    function spawnItem() {
      const roll = Math.random();
      const type = roll < 0.22 ? 'hazard' : (roll < 0.35 ? 'gold' : 'bread');
      items.push({
        type,
        emoji: type === 'hazard' ? '💣' : (type === 'gold' ? '🥐' : '🍞'),
        x: 24 + Math.random() * (W - 48),
        y: -20,
        vy: (125 + level * 22) + Math.random() * 65,
        r: 16
      });
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;

      if (active && !document.hidden) {
        if (keys.left) player.x -= player.speed * dt;
        if (keys.right) player.x += player.speed * dt;
        player.x = Math.max(30, Math.min(W - 30, player.x));

        level = 1 + Math.floor(score / 60);
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnItem();
          spawnTimer = Math.max(0.32, 0.95 - level * 0.08);
        }

        const py = H - 34;
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.y += it.vy * dt;
          if (Math.abs(it.x - player.x) < 34 && Math.abs(it.y - py) < 26) {
            items.splice(i, 1);
            if (it.type === 'hazard') {
              lives -= 1;
              if (global.GoooseSound) global.GoooseSound.hazard();
              if (lives <= 0) {
                active = false;
                if (score > best) {
                  best = score;
                  try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
                }
              }
            } else {
              score += it.type === 'gold' ? 25 : 10;
              if (score > best) {
                best = score;
                try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
              }
              if (global.GoooseSound) global.GoooseSound.eat();
            }
            updateUI();
            continue;
          }
          if (it.y > H + 24) items.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, W, H);
      // Draw items
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const it of items) {
        ctx.fillText(it.emoji, it.x, it.y);
      }

      // Draw Goose catcher
      const py = H - 32;
      ctx.save();
      ctx.translate(player.x, py);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#2B201A';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(0, 4, 24, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(14, -10, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F27D3B';
      ctx.beginPath();
      ctx.moveTo(22, -12);
      ctx.lineTo(32, -9);
      ctx.lineTo(22, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2B201A';
      ctx.beginPath();
      ctx.arc(16, -12, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!active) {
        ctx.fillStyle = 'rgba(43, 32, 26, 0.55)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 18px sans-serif';
        const isEn = document.documentElement.lang === 'en';
        const msg = lives <= 0
          ? (isEn ? `Game Over! Score: ${score}` : `遊戲結束！分數：${score}`)
          : (isEn ? 'Press Start to Catch Bread!' : '點擊「開始遊戲」接麵包！');
        ctx.fillText(msg, W / 2, H / 2);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      requestAnimationFrame(loop);
    }

    canvas.addEventListener('pointermove', (e) => {
      if (!active) return;
      const rect = canvas.getBoundingClientRect();
      player.x = Math.max(30, Math.min(W - 30, e.clientX - rect.left));
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    document.getElementById('bg-start')?.addEventListener('click', startGame);
    window.addEventListener('resize', resize);
    resize();
    updateUI();
    requestAnimationFrame(loop);
  }

  /* =====================================
   * Mini-Game 2: Goose Memory
   * ===================================== */
  function initGooseMemory() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    const BEST_KEY = 'gooose_mem_best';
    const SYMBOLS = ['🪿', '🍞', '🌽', '🍓', '👑', '🍪', '🎧', '📝'];
    let difficulty = 'easy'; // easy=6 pairs (12), hard=8 pairs (16)
    let tiles = [];
    let flipped = [];
    let matchedCount = 0;
    let moves = 0;
    let locked = false;
    let timerSec = 0;
    let timerId = null;
    let bestMoves = null;
    try {
      const b = localStorage.getItem(BEST_KEY);
      if (b) bestMoves = Number(b);
    } catch (e) {}

    function updateUI() {
      const mEl = document.getElementById('mem-moves');
      const tEl = document.getElementById('mem-timer');
      const bEl = document.getElementById('mem-best');
      if (mEl) mEl.textContent = String(moves);
      if (tEl) tEl.textContent = `${timerSec}s`;
      if (bEl) bEl.textContent = bestMoves ? String(bestMoves) : '—';
    }

    function startMemory() {
      clearInterval(timerId);
      const pairs = difficulty === 'hard' ? 8 : 6;
      const deck = SYMBOLS.slice(0, pairs).flatMap((s) => [s, s]);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      tiles = deck.map((sym, idx) => ({ id: idx, sym, open: false, matched: false }));
      flipped = [];
      matchedCount = 0;
      moves = 0;
      locked = false;
      timerSec = 0;
      timerId = setInterval(() => {
        timerSec += 1;
        updateUI();
      }, 1000);
      renderGrid();
      updateUI();
    }

    function renderGrid() {
      grid.innerHTML = tiles.map((t) => `
        <button type="button" class="memory-tile ${t.open ? 'flipped' : ''} ${t.matched ? 'matched' : ''}"
          data-idx="${t.id}" aria-label="Memory card ${t.id + 1}" ${t.matched ? 'disabled' : ''}>
          ${t.open || t.matched ? t.sym : '❓'}
        </button>
      `).join('');

      grid.querySelectorAll('.memory-tile').forEach((btn) => {
        btn.addEventListener('click', () => onTileClick(Number(btn.dataset.idx)));
      });
    }

    function onTileClick(idx) {
      if (locked) return;
      const t = tiles[idx];
      if (!t || t.open || t.matched) return;
      t.open = true;
      flipped.push(t);
      if (global.GoooseSound) global.GoooseSound.click();
      renderGrid();

      if (flipped.length === 2) {
        moves += 1;
        updateUI();
        const [a, b] = flipped;
        if (a.sym === b.sym) {
          a.matched = true;
          b.matched = true;
          matchedCount += 2;
          flipped = [];
          if (global.GoooseSound) global.GoooseSound.score();
          renderGrid();
          if (matchedCount === tiles.length) {
            clearInterval(timerId);
            if (!bestMoves || moves < bestMoves) {
              bestMoves = moves;
              try { localStorage.setItem(BEST_KEY, String(bestMoves)); } catch (e) {}
              updateUI();
            }
            if (global.GoooseSound) global.GoooseSound.win();
          }
        } else {
          locked = true;
          setTimeout(() => {
            a.open = false;
            b.open = false;
            flipped = [];
            locked = false;
            renderGrid();
          }, 650);
        }
      }
    }

    document.getElementById('mem-restart')?.addEventListener('click', startMemory);
    document.getElementById('mem-diff')?.addEventListener('change', (e) => {
      difficulty = e.target.value;
      startMemory();
    });

    startMemory();
  }

  global.initMiniGames = function () {
    initBreadCollector();
    initGooseMemory();
  };
})(window);
