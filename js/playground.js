(function (global) {
  'use strict';

  const MAX_GEESE = 5;
  const GRAVITY = 960;
  const FRICTION = 0.985;
  const BOUNCE = 0.56;
  const BEST_KEY = 'gooose_pg2_best';
  const STATS_KEY = 'gooose_user_counters';

  const FOODS = [
    { key: 'bread', emoji: '🍞', pts: 15, zh: '麵包', en: 'Bread' },
    { key: 'corn', emoji: '🌽', pts: 20, zh: '玉米', en: 'Corn' },
    { key: 'strawberry', emoji: '🍓', pts: 25, zh: '草莓', en: 'Strawberry' },
    { key: 'cookie', emoji: '🍪', pts: 30, zh: '餅乾', en: 'Cookie' },
    { key: 'apple', emoji: '🍎', pts: 18, zh: '蘋果', en: 'Apple' }
  ];

  const PERSONALITIES = ['lazy', 'chaotic', 'hungry', 'sleepy'];
  const HATS = ['none', 'crown', 'cap', 'bow', 'glasses'];
  const COLORS = ['#FFFFFF', '#FFF3C4', '#FFE5D4', '#E8F5E9'];

  function initPlayground2() {
    const canvas = document.getElementById('playground-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 800;
    let H = 440;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let running = true;
    let mode = 'free'; // free | frenzy | catch | race | chaos
    let selectedFood = 'bread';
    let selectedPersonality = 'chaotic';
    let selectedHat = 'none';
    let selectedColor = '#FFFFFF';
    let score = 0;
    let combo = 0;
    let bestScore = 0;
    let modeTimer = 0;
    let playSeconds = 0;
    let chaosTick = 0;

    try { bestScore = Number(localStorage.getItem(BEST_KEY) || 0) || 0; } catch (e) {}

    let counters = { clicks: 0, feeds: 0, spawned: 1, playSeconds: 0 };
    try {
      const savedC = JSON.parse(localStorage.getItem(STATS_KEY) || 'null');
      if (savedC && typeof savedC === 'object') counters = { ...counters, ...savedC };
    } catch (e) {}

    function saveCounters() {
      try { localStorage.setItem(STATS_KEY, JSON.stringify(counters)); } catch (e) {}
      updateCounterUI();
    }

    function saveBest() {
      if (score > bestScore) {
        bestScore = score;
        try { localStorage.setItem(BEST_KEY, String(bestScore)); } catch (e) {}
      }
    }

    const geese = [];
    const foods = [];
    let nextId = 1;
    let dragTarget = null; // { type: 'goose'|'food', obj, offX, offY, lastX, lastY, vx, vy }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(300, rect.width || 800);
      H = Math.max(300, rect.height || 440);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      geese.forEach((g) => {
        g.x = Math.max(g.r, Math.min(W - g.r, g.x));
        g.y = Math.max(g.r, Math.min(H - 22 - g.r, g.y));
      });
    }

    function createGoose(x, y) {
      if (geese.length >= MAX_GEESE) return null;
      const idx = geese.length;
      const g = {
        id: nextId++,
        name: ['gooose', 'Honk Jr.', 'Toast', 'Biscuit', 'Noodle'][idx] || ('Goose ' + nextId),
        x: x ?? (90 + idx * 110),
        y: y ?? (H - 60),
        vx: (Math.random() - 0.5) * 120,
        vy: 0,
        r: 28,
        dir: 1,
        state: 'IDLE', // IDLE, WALK, RUN, JUMP, FALL, LAND, SLEEP, EAT, HAPPY, ANGRY, CONFUSED, DRAGGED, FLYING
        mood: 'Happy', // Happy, Hungry, Sleepy, Angry, Excited
        personality: selectedPersonality,
        hat: HATS[(idx + HATS.indexOf(selectedHat)) % HATS.length],
        color: idx === 0 ? selectedColor : COLORS[idx % COLORS.length],
        timer: 0.8 + Math.random() * 1.4,
        phase: Math.random() * 6,
        speech: '',
        speechTimer: 0,
        grounded: false
      };
      geese.push(g);
      counters.spawned += 1;
      saveCounters();
      updateHud();
      return g;
    }

    function dropFood(foodKey, x, y, vx = 0, vy = -120) {
      const meta = FOODS.find((f) => f.key === foodKey) || FOODS[0];
      foods.push({
        key: meta.key,
        emoji: meta.emoji,
        pts: meta.pts,
        x: x ?? (60 + Math.random() * (W - 120)),
        y: y ?? 40,
        vx,
        vy,
        r: 16,
        scale: 1,
        eating: false
      });
      if (foods.length > 14) foods.shift();
    }

    function setGooseSpeech(g, zh, en, duration = 2.0) {
      const isEn = document.documentElement.lang === 'en';
      g.speech = isEn ? en : zh;
      g.speechTimer = duration;
    }

    function addScore(pts) {
      combo += 1;
      score += pts + Math.min(20, combo * 2);
      saveBest();
      if (global.GoooseSound) global.GoooseSound.score();
      updateHud();
    }

    function updateCounterUI() {
      const el = document.getElementById('pg-counters-text');
      if (!el) return;
      const isEn = document.documentElement.lang === 'en';
      el.textContent = isEn
        ? `Clicks: ${counters.clicks} · Feeds: ${counters.feeds} · Spawned: ${counters.spawned} · Time: ${Math.floor(counters.playSeconds)}s`
        : `點擊：${counters.clicks} · 餵食：${counters.feeds} · 新增鵝：${counters.spawned} · 遊玩：${Math.floor(counters.playSeconds)}s`;
    }

    function updateHud() {
      const sEl = document.getElementById('pg-score');
      const cEl = document.getElementById('pg-combo');
      const bEl = document.getElementById('pg-best');
      const tEl = document.getElementById('pg-timer');
      const gEl = document.getElementById('pg-count');
      const addBtn = document.getElementById('pg-add-goose');
      if (sEl) sEl.textContent = String(score);
      if (cEl) cEl.textContent = 'x' + Math.max(1, combo);
      if (bEl) bEl.textContent = String(bestScore);
      if (tEl) tEl.textContent = mode === 'free' || mode === 'chaos' ? `${Math.floor(playSeconds)}s` : `${Math.max(0, Math.ceil(modeTimer))}s`;
      if (gEl) gEl.textContent = `${geese.length} / ${MAX_GEESE}`;
      if (addBtn) addBtn.disabled = geese.length >= MAX_GEESE;
    }

    function startMode(nextMode) {
      mode = nextMode;
      score = 0;
      combo = 0;
      playSeconds = 0;
      foods.length = 0;
      running = true;
      const pauseBtn = document.getElementById('pg-pause');
      if (pauseBtn) pauseBtn.textContent = document.documentElement.lang === 'en' ? 'Pause' : '暫停';

      if (mode === 'frenzy') {
        modeTimer = 30;
        for (let i = 0; i < 4; i++) dropFood(FOODS[i % FOODS.length].key);
      } else if (mode === 'catch') {
        modeTimer = 25;
      } else if (mode === 'race') {
        modeTimer = 18;
        while (geese.length < 3) createGoose(60, H - 60);
        geese.forEach((g, idx) => {
          g.x = 55;
          g.y = H - 55 - idx * 2;
          g.vx = 95 + Math.random() * 110;
          g.dir = 1;
          g.state = 'RUN';
          setGooseSpeech(g, '衝啊！', 'GO!', 1.4);
        });
      } else if (mode === 'chaos') {
        modeTimer = 0;
        geese.forEach((g) => {
          g.mood = 'Excited';
          g.vy = -340;
          g.vx = (Math.random() - 0.5) * 320;
          g.state = 'FLYING';
        });
      }
      updateHud();
    }

    function stepPhysics(dt) {
      const floorY = H - 22;

      // Update foods
      for (let i = foods.length - 1; i >= 0; i--) {
        const f = foods[i];
        if (dragTarget && dragTarget.type === 'food' && dragTarget.obj === f) continue;
        f.vy += GRAVITY * 0.75 * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        if (f.y + f.r > floorY) {
          f.y = floorY - f.r;
          f.vy *= -0.42;
          f.vx *= 0.82;
          if (Math.abs(f.vy) < 18) f.vy = 0;
        }
        if (f.x - f.r < 8) { f.x = 8 + f.r; f.vx = Math.abs(f.vx) * 0.6; }
        if (f.x + f.r > W - 8) { f.x = W - 8 - f.r; f.vx = -Math.abs(f.vx) * 0.6; }
        if (f.eating) {
          f.scale -= dt * 3;
          if (f.scale <= 0) foods.splice(i, 1);
        }
      }

      // Update geese
      for (const g of geese) {
        if (g.speechTimer > 0) {
          g.speechTimer -= dt;
          if (g.speechTimer <= 0) g.speech = '';
        }

        if (dragTarget && dragTarget.type === 'goose' && dragTarget.obj === g) {
          g.state = 'DRAGGED';
          continue;
        }

        // Apply gravity
        const prevVy = g.vy;
        g.vy += GRAVITY * dt;
        g.x += g.vx * dt;
        g.y += g.vy * dt;

        // Clamp max speed to prevent tunneling
        g.vx = Math.max(-680, Math.min(680, g.vx));
        g.vy = Math.max(-760, Math.min(760, g.vy));

        // Floor collision
        if (g.y + g.r >= floorY) {
          g.y = floorY - g.r;
          if (Math.abs(g.vy) > 130) {
            g.vy = -g.vy * BOUNCE;
            g.state = 'LAND';
            g.grounded = false;
          } else {
            if (!g.grounded && prevVy > 180) {
              g.state = 'LAND';
              g.timer = 0.25;
            }
            g.vy = 0;
            g.grounded = true;
          }
          g.vx *= FRICTION;
        } else {
          g.grounded = false;
          if (g.vy < -40) g.state = g.state === 'FLYING' ? 'FLYING' : 'JUMP';
          else if (g.vy > 60) g.state = 'FALL';
        }

        // Ceiling & Wall collision
        if (g.y - g.r < 8) { g.y = 8 + g.r; g.vy = Math.abs(g.vy) * BOUNCE; }
        if (g.x - g.r < 8) {
          g.x = 8 + g.r;
          g.vx = Math.abs(g.vx) * 0.75;
          g.dir = 1;
          if (Math.abs(g.vx) > 140) { g.state = 'CONFUSED'; g.mood = 'Angry'; }
        }
        if (g.x + g.r > W - 8) {
          g.x = W - 8 - g.r;
          g.vx = -Math.abs(g.vx) * 0.75;
          g.dir = -1;
          if (mode === 'race') {
            addScore(50);
            setGooseSpeech(g, '終點冠軍！', 'WINNER!', 2.2);
            mode = 'free';
          }
        }

        // Food tracking & eating
        if (g.state !== 'SLEEP' && foods.length > 0) {
          let nearest = null;
          let bestD = Infinity;
          for (const f of foods) {
            if (f.eating) continue;
            const d = Math.hypot(f.x - g.x, f.y - g.y);
            if (d < bestD) { bestD = d; nearest = f; }
          }
          if (nearest) {
            if (bestD < g.r + nearest.r + 6) {
              nearest.eating = true;
              g.state = 'EAT';
              g.mood = 'Happy';
              g.timer = 0.7;
              counters.feeds += 1;
              saveCounters();
              addScore(nearest.pts);
              if (global.GoooseSound) global.GoooseSound.eat();
              setGooseSpeech(g, '好好吃！', 'Yum!!', 1.4);
            } else if (g.grounded) {
              const dirToFood = nearest.x >= g.x ? 1 : -1;
              const speed = g.personality === 'hungry' ? 170 : 125;
              g.vx += (dirToFood * speed - g.vx) * Math.min(1, dt * 6);
              g.dir = dirToFood;
              g.state = Math.abs(g.vx) > 110 ? 'RUN' : 'WALK';
              g.mood = 'Hungry';
            }
          }
        }

        // Autonomous AI behavior
        g.timer -= dt;
        if (g.grounded) g.phase += Math.abs(g.vx) * dt * 0.08;
        if (g.grounded && g.timer <= 0 && foods.length === 0) {
          const r = Math.random();
          if (g.personality === 'sleepy' && r < 0.45) {
            g.state = 'SLEEP';
            g.mood = 'Sleepy';
            g.vx = 0;
            g.timer = 2.6 + Math.random() * 2;
          } else if (r < 0.22) {
            g.state = 'SLEEP';
            g.mood = 'Sleepy';
            g.vx = 0;
            g.timer = 2.2 + Math.random() * 2;
          } else if (r < 0.65) {
            const spd = g.personality === 'chaotic' ? 165 : (g.personality === 'lazy' ? 55 : 95);
            g.dir = Math.random() < 0.5 ? 1 : -1;
            g.vx = g.dir * spd;
            g.state = spd > 120 ? 'RUN' : 'WALK';
            g.mood = 'Happy';
            g.timer = 1.4 + Math.random() * 1.8;
          } else if (r < 0.82 && g.personality === 'chaotic') {
            g.vy = -340;
            g.vx = (Math.random() - 0.5) * 180;
            g.state = 'JUMP';
            g.mood = 'Excited';
            g.timer = 1.2;
          } else {
            g.state = 'IDLE';
            g.vx *= 0.4;
            g.timer = 1.2 + Math.random() * 1.4;
          }
        }
      }

      // Goose-to-Goose collision
      for (let i = 0; i < geese.length; i++) {
        for (let j = i + 1; j < geese.length; j++) {
          const a = geese[i];
          const b = geese[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;
          if (dist > 0 && dist < minDist) {
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
            const relVx = b.vx - a.vx;
            const impulse = relVx * nx * 0.6;
            a.vx += impulse * nx;
            b.vx -= impulse * nx;
          }
        }
      }
    }

    function drawGooseActor(g) {
      ctx.save();
      ctx.translate(g.x, g.y);

      // Shadow on ground
      const floorY = H - 22;
      const alt = Math.max(0, floorY - (g.y + g.r));
      const shadowScale = Math.max(0.35, 1 - alt / 260);
      ctx.fillStyle = 'rgba(43, 32, 26, 0.14)';
      ctx.beginPath();
      ctx.ellipse(0, floorY - g.y, 24 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(g.dir, 1);

      const walkBob = (g.state === 'WALK' || g.state === 'RUN') ? Math.sin(g.phase) * 3 : 0;
      const squashY = g.state === 'LAND' ? 0.85 : (g.state === 'SLEEP' ? 0.9 : 1);
      ctx.translate(0, walkBob);
      ctx.scale(1, squashY);

      // Feet
      ctx.strokeStyle = '#F27D3B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const swing = (g.state === 'WALK' || g.state === 'RUN') ? Math.sin(g.phase) * 7 : 0;
      ctx.beginPath();
      ctx.moveTo(-6, 14);
      ctx.lineTo(-6 + swing, 26);
      ctx.moveTo(6, 14);
      ctx.lineTo(6 - swing, 26);
      ctx.stroke();

      // Body
      ctx.fillStyle = g.color;
      ctx.strokeStyle = '#2B201A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(-3, 2, 24, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Wing (flaps when flying/jumping/happy)
      ctx.save();
      ctx.translate(-7, 2);
      if (g.state === 'FLYING' || g.state === 'HAPPY') ctx.rotate(Math.sin(performance.now() * 0.025) * 0.45);
      ctx.fillStyle = '#FDF6E8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 7, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Neck & Head
      const headDrop = g.state === 'SLEEP' ? 12 : (g.state === 'EAT' ? 14 : 0);
      ctx.save();
      ctx.translate(13, -8 + headDrop);

      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.moveTo(-5, 11);
      ctx.quadraticCurveTo(-3, -14, 2, -21);
      ctx.arc(6, -21, 9, Math.PI, Math.PI * 2.1);
      ctx.quadraticCurveTo(11, -10, 7, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Beak
      ctx.fillStyle = '#F27D3B';
      ctx.beginPath();
      ctx.moveTo(14, -22);
      ctx.lineTo(25, -18.5);
      ctx.lineTo(14, -15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#2B201A';
      if (g.state === 'SLEEP') {
        ctx.beginPath();
        ctx.moveTo(4, -22);
        ctx.lineTo(10, -22);
        ctx.stroke();
      } else if (g.state === 'ANGRY') {
        ctx.beginPath();
        ctx.arc(7, -22, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(3, -27);
        ctx.lineTo(11, -24);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(7, -22, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Accessories
      if (g.hat === 'crown') {
        ctx.fillStyle = '#F6C945';
        ctx.beginPath();
        ctx.moveTo(0, -29);
        ctx.lineTo(2, -37);
        ctx.lineTo(6, -32);
        ctx.lineTo(10, -37);
        ctx.lineTo(12, -29);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (g.hat === 'cap') {
        ctx.fillStyle = '#5CB882';
        ctx.beginPath();
        ctx.arc(6, -28, 8, Math.PI, 0);
        ctx.fill();
        ctx.stroke();
      } else if (g.hat === 'bow') {
        ctx.fillStyle = '#F27D3B';
        ctx.beginPath();
        ctx.arc(2, -14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (g.hat === 'glasses') {
        ctx.strokeStyle = '#2B201A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(7, -22, 4.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Name + Mood tag
      ctx.font = '700 11px sans-serif';
      const label = `${g.name} · ${g.mood}`;
      const lw = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.beginPath();
      ctx.roundRect(g.x - lw / 2 - 6, g.y + 30, lw + 12, 18, 9);
      ctx.fill();
      ctx.fillStyle = '#2B201A';
      ctx.fillText(label, g.x - lw / 2, g.y + 42);

      // Speech bubble
      if (g.speech) {
        ctx.font = '700 12px sans-serif';
        const sw = ctx.measureText(g.speech).width;
        const bx = Math.max(8, Math.min(W - sw - 24, g.x - sw / 2 - 9));
        const by = Math.max(8, g.y - 68);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#2B201A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, sw + 18, 26, 11);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#2B201A';
        ctx.fillText(g.speech, bx + 9, by + 17);
      }
    }

    let last = performance.now();
    let secondAcc = 0;
    function loop(now) {
      const dt = Math.min(0.035, (now - last) / 1000);
      last = now;

      if (!document.hidden && running) {
        playSeconds += dt;
        secondAcc += dt;
        if (secondAcc >= 1) {
          counters.playSeconds += 1;
          secondAcc -= 1;
          saveCounters();
          updateHud();
        }

        if (mode === 'frenzy' || mode === 'catch' || mode === 'race') {
          modeTimer -= dt;
          if (mode === 'frenzy' && Math.random() < dt * 1.4 && foods.length < 7) {
            dropFood(FOODS[Math.floor(Math.random() * FOODS.length)].key);
          }
          if (modeTimer <= 0) {
            modeTimer = 0;
            running = false;
            if (global.GoooseSound) global.GoooseSound.win();
            geese.forEach((g) => setGooseSpeech(g, `回合結束！分數 ${score}`, `Time's up! Score ${score}`, 3));
            updateHud();
          }
        } else if (mode === 'chaos') {
          chaosTick += dt;
          if (chaosTick > 3.2) {
            chaosTick = 0;
            const roll = Math.random();
            if (roll < 0.35) {
              for (let i = 0; i < 4; i++) dropFood(FOODS[Math.floor(Math.random() * FOODS.length)].key);
            } else if (roll < 0.7) {
              geese.forEach((g) => { g.vy = -340; g.state = 'JUMP'; });
            } else {
              geese.forEach((g) => {
                g.vx = (Math.random() - 0.5) * 420;
                setGooseSpeech(g, '混亂模式啟動！', 'CHAOS MODE!', 1.5);
              });
            }
          }
        }

        stepPhysics(dt);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(43, 32, 26, 0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, H - 22);
      ctx.lineTo(W - 12, H - 22);
      ctx.stroke();

      // Draw foods
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const f of foods) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(f.scale, f.scale);
        ctx.fillText(f.emoji, 0, 0);
        ctx.restore();
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      geese.forEach(drawGooseActor);
      requestAnimationFrame(loop);
    }

    // Pointer Drag & Throw
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('pointerdown', (e) => {
      const p = getPos(e);
      // Check foods first, then geese
      for (let i = foods.length - 1; i >= 0; i--) {
        const f = foods[i];
        if (Math.hypot(p.x - f.x, p.y - f.y) <= f.r + 10) {
          dragTarget = { type: 'food', obj: f, offX: f.x - p.x, offY: f.y - p.y, lastX: p.x, lastY: p.y, vx: 0, vy: 0, moved: false };
          try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
          return;
        }
      }
      for (let i = geese.length - 1; i >= 0; i--) {
        const g = geese[i];
        if (Math.hypot(p.x - g.x, p.y - g.y) <= g.r + 14) {
          dragTarget = { type: 'goose', obj: g, offX: g.x - p.x, offY: g.y - p.y, lastX: p.x, lastY: p.y, vx: 0, vy: 0, moved: false };
          g.state = 'DRAGGED';
          try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
          return;
        }
      }
      // Clicked empty space -> drop selected food
      dropFood(selectedFood, p.x, p.y, 0, -60);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!dragTarget) return;
      const p = getPos(e);
      const dx = p.x - dragTarget.lastX;
      const dy = p.y - dragTarget.lastY;
      if (Math.hypot(dx, dy) > 3) dragTarget.moved = true;
      dragTarget.vx = dx * 28;
      dragTarget.vy = dy * 28;
      dragTarget.lastX = p.x;
      dragTarget.lastY = p.y;
      dragTarget.obj.x = Math.max(24, Math.min(W - 24, p.x + dragTarget.offX));
      dragTarget.obj.y = Math.max(24, Math.min(H - 40, p.y + dragTarget.offY));
    });

    function endDrag(e) {
      if (!dragTarget) return;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      const { type, obj, vx, vy, moved } = dragTarget;
      if (moved) {
        obj.vx = Math.max(-620, Math.min(620, vx));
        obj.vy = Math.max(-620, Math.min(620, vy));
        if (type === 'goose') obj.state = 'FLYING';
      } else if (type === 'goose') {
        obj.vy = -300;
        obj.state = 'JUMP';
        obj.mood = 'Excited';
        counters.clicks += 1;
        saveCounters();
        addScore(mode === 'catch' ? 25 : 10);
        if (global.GoooseSound) global.GoooseSound.honk();
        setGooseSpeech(obj, '嘎！再丟高一點！', 'HONK! Throw me!', 1.8);
      }
      dragTarget = null;
    }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    // Wire UI buttons
    document.getElementById('pg-add-goose')?.addEventListener('click', () => createGoose());
    document.getElementById('pg-drop-food')?.addEventListener('click', () => dropFood(selectedFood));
    document.getElementById('pg-pause')?.addEventListener('click', (e) => {
      running = !running;
      const isEn = document.documentElement.lang === 'en';
      e.target.textContent = running ? (isEn ? 'Pause' : '暫停') : (isEn ? 'Resume' : '繼續');
    });
    document.getElementById('pg-reset')?.addEventListener('click', () => {
      geese.length = 0;
      foods.length = 0;
      score = 0;
      combo = 0;
      playSeconds = 0;
      running = true;
      createGoose(W * 0.45, H - 60);
      updateHud();
    });
    document.getElementById('pg-mode')?.addEventListener('change', (e) => startMode(e.target.value));
    document.getElementById('pg-food-select')?.addEventListener('change', (e) => { selectedFood = e.target.value; });
    document.getElementById('pg-personality')?.addEventListener('change', (e) => {
      selectedPersonality = e.target.value;
      geese.forEach((g) => { g.personality = selectedPersonality; });
    });
    document.getElementById('pg-hat')?.addEventListener('change', (e) => {
      selectedHat = e.target.value;
      if (geese[0]) geese[0].hat = selectedHat;
    });
    document.getElementById('pg-color')?.addEventListener('change', (e) => {
      selectedColor = e.target.value;
      if (geese[0]) geese[0].color = selectedColor;
    });
    document.getElementById('pg-reset-counters')?.addEventListener('click', () => {
      counters = { clicks: 0, feeds: 0, spawned: geese.length, playSeconds: 0 };
      saveCounters();
    });

    window.addEventListener('resize', resize);
    resize();
    createGoose(W * 0.45, H - 60);
    updateCounterUI();
    updateHud();
    requestAnimationFrame(loop);
  }

  global.initPlayground2 = initPlayground2;
})(window);
