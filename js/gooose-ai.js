(function (global) {
  'use strict';

  const FIXED_REPLIES = {
    'zh-TW': '我什麼都不知道 但我喜歡你的鼠標',
    en: 'I know absolutely nothing, but I like your cursor.'
  };

  let isOpen = false;
  let lang = 'zh-TW';
  let messages = [];
  let idleSleepTimer = null;
  let bubbleTimer = null;

  function formatTime(date) {
    return date.toLocaleTimeString(lang === 'zh-TW' ? 'zh-TW' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function renderDOM() {
    if (document.getElementById('gooose-ai-root')) return;
    const root = document.createElement('aside');
    root.id = 'gooose-ai-root';
    root.className = 'gooose-ai-root';
    root.setAttribute('aria-label', 'goooseAI Assistant');
    root.innerHTML = `
      <button type="button" class="gooose-ai-launcher" id="gooose-ai-launcher" aria-expanded="false" aria-controls="gooose-ai-chat">
        <span class="gooose-ai-badge">AI</span>
        <span class="gooose-ai-mini-bubble" id="gooose-ai-mini-bubble" aria-hidden="true"></span>
        <svg class="gooose-ai-svg" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <ellipse cx="36" cy="54" rx="20" ry="13" fill="#FFFFFF" stroke="#2B201A" stroke-width="3"/>
          <path d="M46 49c2-11 1-20 2-26 1-5 5-8 10-7 4 1 7 4 6 8-1 4-4 5-7 6-1 7-1 15-4 21" fill="#FFFFFF" stroke="#2B201A" stroke-width="3" stroke-linecap="round"/>
          <path d="M63 23l9 3-9 3z" fill="#F27D3B" stroke="#2B201A" stroke-width="2.2" stroke-linejoin="round"/>
          <circle cx="57" cy="21" r="2.2" fill="#2B201A" id="gooose-ai-eye"/>
          <path d="M46 15l7-9 7 9z" fill="#F6C945" stroke="#2B201A" stroke-width="2.2" stroke-linejoin="round"/>
          <circle cx="53" cy="5" r="2.5" fill="#F27D3B"/>
          <path d="M31 67v6M43 67v6" stroke="#F27D3B" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="gooose-ai-chat" id="gooose-ai-chat" role="dialog" aria-label="goooseAI Chat">
        <div class="gooose-ai-chat-head">
          <div style="display:flex;align-items:center;gap:8px;">
            <strong>🪿 goooseAI</strong>
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-feed">🍞</button>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-clear">清除</button>
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-close" aria-label="Close chat">✕</button>
          </div>
        </div>
        <div class="gooose-ai-disclaimer" id="gooose-ai-disclaimer"></div>
        <div class="gooose-ai-messages" id="gooose-ai-messages" aria-live="polite"></div>
        <form class="gooose-ai-form" id="gooose-ai-form">
          <textarea class="gooose-ai-input" id="gooose-ai-input" rows="1" placeholder="輸入訊息…"></textarea>
          <button type="submit" class="btn btn-primary btn-sm" id="gooose-ai-send">送出</button>
        </form>
      </div>
    `;
    document.body.appendChild(root);
  }

  function showMiniBubble(text, ms = 2400) {
    const bubble = document.getElementById('gooose-ai-mini-bubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  function resetSleepTimer() {
    const launcher = document.getElementById('gooose-ai-launcher');
    if (launcher && launcher.dataset.mood === 'sleeping') {
      launcher.dataset.mood = 'idle';
    }
    clearTimeout(idleSleepTimer);
    idleSleepTimer = setTimeout(() => {
      if (!isOpen && launcher) launcher.dataset.mood = 'sleeping';
    }, 15000);
  }

  function renderMessages() {
    const box = document.getElementById('gooose-ai-messages');
    if (!box) return;
    box.innerHTML = messages.map((m) => {
      const safe = String(m.text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="ai-msg ${m.role}">${safe}<span class="ai-msg-time">${m.time}</span></div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  }

  function updateLanguage(nextLang) {
    lang = nextLang === 'en' ? 'en' : 'zh-TW';
    const disclaimer = document.getElementById('gooose-ai-disclaimer');
    const clearBtn = document.getElementById('gooose-ai-clear');
    const sendBtn = document.getElementById('gooose-ai-send');
    const input = document.getElementById('gooose-ai-input');
    const feedBtn = document.getElementById('gooose-ai-feed');
    if (disclaimer) {
      disclaimer.textContent = lang === 'zh-TW'
        ? '純前端互動小鵝（不會連接任何真實 AI 模型）'
        : 'Playful front-end goose only (zero real AI or server calls)';
    }
    if (clearBtn) clearBtn.textContent = lang === 'zh-TW' ? '清除' : 'Clear';
    if (sendBtn) sendBtn.textContent = lang === 'zh-TW' ? '送出' : 'Send';
    if (feedBtn) feedBtn.title = lang === 'zh-TW' ? '餵食 goooseAI' : 'Feed goooseAI';
    if (input) {
      input.placeholder = lang === 'zh-TW'
        ? '跟 goooseAI 說句話… (Enter 送出)'
        : 'Say something to goooseAI… (Enter to send)';
    }
    if (messages.length === 0) {
      messages.push({ role: 'bot', text: FIXED_REPLIES[lang], time: formatTime(new Date()) });
      renderMessages();
    }
  }

  function setOpen(nextOpen) {
    isOpen = Boolean(nextOpen);
    const chat = document.getElementById('gooose-ai-chat');
    const launcher = document.getElementById('gooose-ai-launcher');
    if (chat) chat.classList.toggle('open', isOpen);
    if (launcher) launcher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    resetSleepTimer();
    if (isOpen) {
      const input = document.getElementById('gooose-ai-input');
      if (input) input.focus();
    }
  }

  function sendUserMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    resetSleepTimer();
    messages.push({ role: 'user', text: trimmed, time: formatTime(new Date()) });
    renderMessages();

    const typingLabel = lang === 'zh-TW' ? 'goooseAI 正在思考…（其實沒有）' : 'goooseAI is thinking… (not really)';
    messages.push({ role: 'bot', text: typingLabel, time: '...' });
    renderMessages();

    setTimeout(() => {
      messages.pop();
      messages.push({ role: 'bot', text: FIXED_REPLIES[lang], time: formatTime(new Date()) });
      renderMessages();
      if (global.GoooseSound) global.GoooseSound.honk();
    }, 450);
  }

  function init(initialLang) {
    renderDOM();
    updateLanguage(initialLang);
    resetSleepTimer();

    const launcher = document.getElementById('gooose-ai-launcher');
    const closeBtn = document.getElementById('gooose-ai-close');
    const clearBtn = document.getElementById('gooose-ai-clear');
    const feedBtn = document.getElementById('gooose-ai-feed');
    const form = document.getElementById('gooose-ai-form');
    const input = document.getElementById('gooose-ai-input');

    launcher.addEventListener('click', () => {
      if (global.GoooseSound) global.GoooseSound.honk();
      showMiniBubble(FIXED_REPLIES[lang]);
      setOpen(!isOpen);
    });

    launcher.addEventListener('pointerenter', () => {
      resetSleepTimer();
      showMiniBubble(FIXED_REPLIES[lang], 1600);
    });

    closeBtn.addEventListener('click', () => setOpen(false));
    clearBtn.addEventListener('click', () => {
      messages = [{ role: 'bot', text: FIXED_REPLIES[lang], time: formatTime(new Date()) }];
      renderMessages();
    });
    feedBtn.addEventListener('click', () => {
      launcher.dataset.mood = 'eating';
      if (global.GoooseSound) global.GoooseSound.eat();
      showMiniBubble(lang === 'zh-TW' ? '嚼嚼！還是喜歡你的鼠標！' : 'Nom! Still love your cursor!');
      setTimeout(() => { launcher.dataset.mood = 'idle'; }, 1500);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendUserMessage(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage(input.value);
        input.value = '';
      }
    });

    document.addEventListener('pointermove', (e) => {
      const eye = document.getElementById('gooose-ai-eye');
      if (!eye) return;
      const rect = launcher.getBoundingClientRect();
      const dx = Math.max(-1.6, Math.min(1.6, (e.clientX - (rect.left + rect.width / 2)) / 240));
      const dy = Math.max(-1.4, Math.min(1.4, (e.clientY - (rect.top + rect.height / 2)) / 240));
      eye.setAttribute('cx', (57 + dx).toFixed(1));
      eye.setAttribute('cy', (21 + dy).toFixed(1));
    }, { passive: true });
  }

  global.GoooseAI = { init, updateLanguage, setOpen };
})(window);
