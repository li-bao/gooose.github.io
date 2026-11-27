(function (global) {
  'use strict';

  function initHeroGoose() {
    const canvas = document.getElementById('hero-goose-canvas');
    const bumpBadge = document.getElementById('hero-bump-badge');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reducedQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 460;
    let height = 310;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const goose = {
      x: -60,
      y: 230,
      vx: 78,
      vy: 0,
      dir: 1,
      state: 'enter', // enter | walk | observe | hop | nap | bump
      timer: 0,
      stepPhase: 0,
      speech: ''
    };

    let pointer = { x: -999, y: -999, inside: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(260, rect.width || 460);
      height = Math.max(220, rect.height || 310);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (goose.y > height - 44) goose.y = height - 44;
    }

    function setSpeech(zh, en) {
      const lang = document.documentElement.lang === 'en' ? 'en' : 'zh-TW';
      goose.speech = lang === 'en' ? en : zh;
    }

    function drawGoose(g) {
      ctx.save();
      ctx.translate(g.x, g.y);

      // Ground shadow
      ctx.fillStyle = 'rgba(43, 32, 26, 0.14)';
      ctx.beginPath();
      ctx.ellipse(0, 26, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(g.dir, 1);

      const bob = g.state === 'walk' || g.state === 'enter' ? Math.sin(g.stepPhase) * 3 : (g.state === 'nap' ? 5 : 0);
      ctx.translate(0, bob);

      // Feet
      ctx.strokeStyle = '#F27D3B';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const footSwing = g.state === 'walk' || g.state === 'enter' ? Math.sin(g.stepPhase) * 6 : 0;
      ctx.beginPath();
      ctx.moveTo(-7, 14);
      ctx.lineTo(-7 + footSwing, 25);
      ctx.moveTo(7, 14);
      ctx.lineTo(7 - footSwing, 25);
      ctx.stroke();

      // Body
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#2B201A';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.ellipse(-4, 0, 27, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Wing
      ctx.fillStyle = '#FDF6E8';
      ctx.beginPath();
      ctx.ellipse(-8, 1, 14, 8, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Neck & Head
      const headDrop = g.state === 'nap' ? 14 : 0;
      const tilt = g.state === 'observe' ? 0.18 : 0;
      ctx.save();
      ctx.translate(15, -10 + headDrop);
      ctx.rotate(tilt);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-6, 12);
      ctx.quadraticCurveTo(-4, -18, 2, -26);
      ctx.arc(7, -26, 10, Math.PI, Math.PI * 2.1);
      ctx.quadraticCurveTo(13, -12, 8, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Beak
      ctx.fillStyle = '#F27D3B';
      ctx.beginPath();
      ctx.moveTo(15, -27);
      ctx.lineTo(29, -23);
      ctx.lineTo(15, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#2B201A';
      if (g.state === 'nap') {
        ctx.beginPath();
        ctx.moveTo(5, -28);
        ctx.lineTo(11, -28);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(8, -28, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.restore();

      // Speech or Zzz
      if (g.state === 'nap') {
        ctx.font = '800 14px sans-serif';
        ctx.fillStyle = '#F27D3B';
        ctx.fillText('Zzz', g.x + 22, g.y - 36);
      } else if (g.speech) {
        ctx.font = '700 13px sans-serif';
        const tw = ctx.measureText(g.speech).width;
        const bw = tw + 22;
        const bx = Math.max(10, Math.min(width - bw - 10, g.x - bw / 2));
        const by = Math.max(12, g.y - 76);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#2B201A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, 30, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#2B201A';
        ctx.fillText(g.speech, bx + 11, by + 19);
      }
    }

    let rafId = null;
    let last = performance.now();
    function tick(now) {
      if (!document.body.contains(canvas)) {
        rafId = null;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const reduced = (reducedQuery && reducedQuery.matches) || document.documentElement.dataset.reducedMotion === 'true';

      if (!document.hidden) {
        const floorY = height - 48;
        if (reduced) {
          goose.x = width * 0.48;
          goose.y = floorY;
          goose.state = 'observe';
        } else {
          goose.timer += dt;
          if (goose.state === 'enter') {
            goose.x += 95 * dt;
            goose.y = floorY;
            goose.stepPhase += dt * 10;
            if (goose.x >= width * 0.35) {
              goose.state = 'observe';
              goose.timer = 0;
              setSpeech('偷看你⋯⋯', 'Peeking at you…');
            }
          } else if (goose.state === 'walk') {
            goose.x += goose.vx * dt;
            goose.y = floorY;
            goose.stepPhase += dt * 11;
            if (goose.x > width - 48) {
              goose.x = width - 48;
              goose.vx = -Math.abs(goose.vx);
              goose.dir = -1;
              if (bumpBadge) {
                bumpBadge.style.transform = 'rotate(8deg) scale(1.08)';
                setTimeout(() => { bumpBadge.style.transform = ''; }, 240);
              }
              setSpeech('撞到標籤了！', 'Bonked the badge!');
            } else if (goose.x < 48) {
              goose.x = 48;
              goose.vx = Math.abs(goose.vx);
              goose.dir = 1;
            }
            if (goose.timer > 3.2) {
              goose.state = Math.random() < 0.35 ? 'nap' : 'observe';
              goose.timer = 0;
              if (goose.state === 'observe') setSpeech('這個網站歸我管。', 'This site is mine.');
              else goose.speech = '';
            }
          } else if (goose.state === 'observe') {
            if (pointer.inside) {
              goose.dir = pointer.x >= goose.x ? 1 : -1;
            }
            if (goose.timer > 2.4) {
              goose.state = 'walk';
              goose.timer = 0;
              goose.vx = goose.dir * 82;
              goose.speech = '';
            }
          } else if (goose.state === 'nap') {
            if (goose.timer > 3.0) {
              goose.state = 'walk';
              goose.timer = 0;
              goose.vx = goose.dir * 75;
            }
          } else if (goose.state === 'hop') {
            goose.vy += 880 * dt;
            goose.y += goose.vy * dt;
            if (goose.y >= floorY) {
              goose.y = floorY;
              goose.vy = 0;
              goose.state = 'walk';
              goose.timer = 0;
            }
          }
        }

        ctx.clearRect(0, 0, width, height);
        // Floor line
        ctx.strokeStyle = 'rgba(43, 32, 26, 0.14)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, height - 22);
        ctx.lineTo(width - 16, height - 22);
        ctx.stroke();

        drawGoose(goose);
      }
      rafId = requestAnimationFrame(tick);
    }

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside = true;
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => { pointer.inside = false; });
    canvas.addEventListener('click', () => {
      goose.state = 'hop';
      goose.vy = -310;
      goose.timer = 0;
      setSpeech('嘎！被你點到了！', 'HONK! You poked me!');
      if (global.GoooseSound) global.GoooseSound.honk();
    });

    window.addEventListener('resize', resize);
    resize();
    rafId = requestAnimationFrame(tick);

    return function destroyHero() {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }

  global.initHeroGoose = initHeroGoose;
})(window);
