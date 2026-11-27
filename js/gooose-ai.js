(function (global) {
  'use strict';

  const STORAGE_KEY = 'gooose_ai_history_v2';
  const RECENT_LIMIT = 10;

  // 48 unique Traditional Chinese responses (includes all 45 starter lines + 3 extras)
  const ZH_RESPONSES = [
    { id: 'z1', cat: 'greeting', text: '嘿！你找我？先說好，我不負責把麵包還給你。' },
    { id: 'z2', cat: 'teasing', text: '我剛剛正在巡邏你的桌面，現在換你巡邏你的待辦事項。' },
    { id: 'z3', cat: 'general', text: '這個問題有點棘手……讓我先假裝思考三秒。' },
    { id: 'z4', cat: 'bread', text: '不要一直盯著我看，我只是在確認你的螢幕有沒有藏麵包。' },
    { id: 'z5', cat: 'bread', text: '我支持你的計畫，尤其是計畫裡有麵包的部分。' },
    { id: 'z6', cat: 'general', text: '嘎！這聽起來值得認真研究。' },
    { id: 'z7', cat: 'encouragement', text: '你先別急，我的小腦袋正在全速旋轉。' },
    { id: 'z8', cat: 'general', text: '我不一定有答案，但我有很多信心和羽毛。' },
    { id: 'z9', cat: 'encouragement', text: '這件事可以更簡單：先呼吸，再拆成小步驟。' },
    { id: 'z10', cat: 'general', text: '好問題！我把翅膀收好，認真回答。' },
    { id: 'z11', cat: 'teasing', text: '你是不是又開了 38 個分頁？我聞到混亂的味道了。' },
    { id: 'z12', cat: 'debug', text: '我建議先存檔，因為我不想看你重做。' },
    { id: 'z13', cat: 'debug', text: '出錯不是世界末日，只是電腦在提醒你它也需要關心。' },
    { id: 'z14', cat: 'debug', text: '這個 Bug 看起來很有自信，該讓它冷靜一下。' },
    { id: 'z15', cat: 'debug', text: '我可以幫忙排查，但先不要把鍵盤丟出去。' },
    { id: 'z16', cat: 'teasing', text: '我不是你的雙胞胎，剛剛那條訊息也不應該重複出現。' },
    { id: 'z17', cat: 'encouragement', text: '你的想法很棒，再加一點耐心就能起飛。' },
    { id: 'z18', cat: 'bread', text: '讓我把這個大問題切成幾塊可吃的小麵包。' },
    { id: 'z19', cat: 'general', text: '目前線索不足，我不會亂編答案，再給我一點上下文吧。' },
    { id: 'z20', cat: 'general', text: '這部分我有把握；不確定的地方我會直接說。' },
    { id: 'z21', cat: 'debug', text: '我聞到一點點需要重構的味道。' },
    { id: 'z22', cat: 'debug', text: '先別改十個地方，一次改一個才知道誰在搗蛋。' },
    { id: 'z23', cat: 'general', text: '我剛查了一下我的羽毛筆記，方向是對的。' },
    { id: 'z24', cat: 'general', text: '這個介面值得更順手，不該讓你跟按鈕打架。' },
    { id: 'z25', cat: 'encouragement', text: '我們可以先做一個最小可用版本，再慢慢加裝翅膀。' },
    { id: 'z26', cat: 'general', text: '想法收到！我把它放進我的秘密巢穴。' },
    { id: 'z27', cat: 'general', text: '我看見潛力了，也看見幾個可以修得更漂亮的小地方。' },
    { id: 'z28', cat: 'debug', text: '先測試，再慶祝；我不想讓 Bug 混進派對。' },
    { id: 'z29', cat: 'general', text: '好的，我會盡量不把事情搞得像鵝群大暴走。' },
    { id: 'z30', cat: 'general', text: '給我一個明確目標，我就能更精準地幫你。' },
    { id: 'z31', cat: 'bread', text: '不錯喔，這次的思路比我偷麵包還俐落。' },
    { id: 'z32', cat: 'teasing', text: '我不是在拖延，我是在進行高級羽毛整理。' },
    { id: 'z33', cat: 'debug', text: '你負責想點子，我負責提醒你別忘了備份。' },
    { id: 'z34', cat: 'general', text: '這個功能值得一個漂亮的入口，不該藏在角落裡。' },
    { id: 'z35', cat: 'encouragement', text: '如果第一種方法不行，我們就換一條路，不跟牆壁吵架。' },
    { id: 'z36', cat: 'general', text: '我可以先給你快速版，再補上詳細步驟。' },
    { id: 'z37', cat: 'encouragement', text: '好耶！這次看起來比上次少了幾根需要拔的羽毛。' },
    { id: 'z38', cat: 'bread', text: '我現在很專心，連麵包屑都暫時不看了。' },
    { id: 'z39', cat: 'debug', text: '這不是失敗，是一個很有教育意義的錯誤。' },
    { id: 'z40', cat: 'general', text: '我同意，但我們要確認它不會破壞原本能用的功能。' },
    { id: 'z41', cat: 'general', text: '你想要可愛一點，還是更有效率一點？我兩邊都能努力。' },
    { id: 'z42', cat: 'greeting', text: '有新任務？我的翅膀已經準備好了。' },
    { id: 'z43', cat: 'general', text: '我正在把複雜的內容翻譯成鵝也聽得懂的版本。' },
    { id: 'z44', cat: 'general', text: '這個問題值得好好回答，不該只回你一個「嘎」。' },
    { id: 'z45', cat: 'general', text: '任務完成前我不會宣稱成功，這是鵝的職業道德。' },
    { id: 'z46', cat: 'goodbye', text: '要去休息了嗎？記得存檔再關電腦，明天再一起嘎！' },
    { id: 'z47', cat: 'greeting', text: '早安午安晚安！不管現在幾點，桌面鵝永遠在線。' },
    { id: 'z48', cat: 'teasing', text: '你的游標看起來很好吃，但我今天先忍住不偷。' }
  ];

  // 42 unique English responses
  const EN_RESPONSES = [
    { id: 'e1', cat: 'greeting', text: 'Hey! Looking for me? Just to be clear, I am not giving the bread back.' },
    { id: 'e2', cat: 'teasing', text: 'I just finished patrolling your desktop. Now it is your turn to patrol your to-do list.' },
    { id: 'e3', cat: 'general', text: 'Tricky question… let me pretend to think for three seconds.' },
    { id: 'e4', cat: 'bread', text: 'Stop staring at me—I am only checking whether your screen is hiding any bread.' },
    { id: 'e5', cat: 'bread', text: 'I support your plan, especially the part where bread is involved.' },
    { id: 'e6', cat: 'general', text: 'HONK! That actually sounds worth investigating properly.' },
    { id: 'e7', cat: 'encouragement', text: 'No rush—my tiny goose brain is spinning at full RPM.' },
    { id: 'e8', cat: 'general', text: 'I may not have every answer, but I have plenty of confidence and feathers.' },
    { id: 'e9', cat: 'encouragement', text: 'We can make this simpler: take a breath, then break it into small steps.' },
    { id: 'e10', cat: 'general', text: 'Great question! Folding my wings neatly to answer seriously.' },
    { id: 'e11', cat: 'teasing', text: 'Did you open 38 browser tabs again? I smell chaos.' },
    { id: 'e12', cat: 'debug', text: 'I recommend saving your work first—I do not want to watch you redo it.' },
    { id: 'e13', cat: 'debug', text: 'An error is not the end of the world; your computer just wants attention.' },
    { id: 'e14', cat: 'debug', text: 'That bug looks way too confident. Time to humble it.' },
    { id: 'e15', cat: 'debug', text: 'I can help debug, just please do not throw the keyboard.' },
    { id: 'e16', cat: 'teasing', text: 'I am not an echo—that message should never appear twice.' },
    { id: 'e17', cat: 'encouragement', text: 'Solid idea! Add a dash of patience and it is ready for takeoff.' },
    { id: 'e18', cat: 'bread', text: 'Let me slice this giant problem into bite-sized pieces of toast.' },
    { id: 'e19', cat: 'general', text: 'Not enough clues yet, and I will not make things up. Give me a bit more context!' },
    { id: 'e20', cat: 'general', text: 'I am confident on this part; if something is uncertain, I will tell you straight.' },
    { id: 'e21', cat: 'debug', text: 'I sniff a tiny bit of refactoring in our future.' },
    { id: 'e22', cat: 'debug', text: 'Do not change ten things at once—change one so we know who caused the mischief.' },
    { id: 'e23', cat: 'general', text: 'Checked my feather notes: you are heading in the right direction.' },
    { id: 'e24', cat: 'general', text: 'An interface should feel effortless—you should never have to fight a button.' },
    { id: 'e25', cat: 'encouragement', text: 'Ship a clean minimum version first, then bolt on the wings.' },
    { id: 'e26', cat: 'general', text: 'Idea received! Tucking it safely into my secret nest.' },
    { id: 'e27', cat: 'general', text: 'I see real potential here—and a few spots we can polish nicely.' },
    { id: 'e28', cat: 'debug', text: 'Test first, celebrate second. No uninvited bugs at the party.' },
    { id: 'e29', cat: 'general', text: 'Got it—I will try not to turn this into a full goose stampede.' },
    { id: 'e30', cat: 'general', text: 'Give me a clear goal and I can give you a much sharper answer.' },
    { id: 'e31', cat: 'bread', text: 'Nice! That logic was smoother than my bread heist.' },
    { id: 'e32', cat: 'teasing', text: 'I am not procrastinating; I am performing executive feather maintenance.' },
    { id: 'e33', cat: 'debug', text: 'You bring the ideas, I will remind you to make backups.' },
    { id: 'e34', cat: 'general', text: 'A good feature deserves a proper front door instead of hiding in a corner.' },
    { id: 'e35', cat: 'encouragement', text: 'If approach A hits a wall, we pick approach B instead of arguing with the wall.' },
    { id: 'e36', cat: 'general', text: 'I can give you the quick version first and follow up with detailed steps.' },
    { id: 'e37', cat: 'encouragement', text: 'Hooray! Looks like fewer ruffled feathers this time.' },
    { id: 'e38', cat: 'bread', text: 'Fully focused right now—not even glancing at breadcrumbs.' },
    { id: 'e39', cat: 'debug', text: 'Not a failure—just a very educational error.' },
    { id: 'e40', cat: 'general', text: 'Agreed, as long as we make sure it does not break what already works.' },
    { id: 'e41', cat: 'greeting', text: 'New mission? My wings are warmed up and ready.' },
    { id: 'e42', cat: 'goodbye', text: 'Heading off? Save your files before closing, and see you next honk!' }
  ];

  // Serious / technical question matcher (avoids random jokes on genuine questions)
  const SERIOUS_TOPICS = [
    {
      test: /install|dmg|gatekeeper|quarantine|xattr|打不開|無法開啟|安裝|簽章|公證|notariz/i,
      zh: '安裝 gooose 的步驟：\n1. 前往 /download 下載最新的 `Gooose-macOS-arm64.dmg`。\n2. 開啟 DMG 並將 `gooose.app` 拖曳至 `/Applications`。\n3. 因目前採 Ad-hoc 簽章（尚未經 Apple 公證），首次開啟請對 App 按右鍵選擇「打開」，或在「系統設定 → 隱私權與安全性」點擊「強制打開」，亦可執行：\n`xattr -cr "/Applications/gooose.app"`',
      en: 'To install gooose:\n1. Download `Gooose-macOS-arm64.dmg` from /download.\n2. Drag `gooose.app` into `/Applications`.\n3. Because builds are ad-hoc signed (not Apple-notarized), Right-click → Open on first launch, click Open Anyway in System Settings → Privacy & Security, or run:\n`xattr -cr "/Applications/gooose.app"`'
    },
    {
      test: /intel|m1|m2|m3|m4|apple silicon|arm64|macos|相容|支援|版本|system requirement/i,
      zh: '系統需求：gooose 目前原生建置於 Apple Silicon（arm64）與 macOS 26.0+（`Goose/Package.swift`）。目前尚未發布 Intel（x86_64）版本。',
      en: 'Compatibility: gooose currently targets Apple Silicon (arm64) and macOS 26.0+ (`Goose/Package.swift`). No Intel (x86_64) build is currently published.'
    },
    {
      test: /permission|screen recording|accessibility|tcc|權限|螢幕錄影|輔助使用/i,
      zh: '關於權限：核心動畫、音效、迷因、便利貼與滑鼠追逐都不需要系統權限。\n• 輔助使用（Accessibility）：僅用於視窗惡作劇。\n• 螢幕錄影（Screen Recording）：僅用於選用的本機 Vision OCR（資料留在 RAM 中，不會存檔或上傳）。',
      en: 'About permissions: animations, sounds, memes, sticky notes, and cursor chasing work with zero TCC permissions.\n• Accessibility is only for Window Pranks.\n• Screen Recording is only for optional on-device Vision OCR (frames stay in RAM and are never saved or uploaded).'
    },
    {
      test: /esc|stop|quit|shortcut|hotkey|緊急|停止|關掉|滑鼠|cursor/i,
      zh: '想立刻停止桌面鵝的滑鼠惡作劇，請按住 **ESC** 或使用全域快捷鍵 **⌃⌥⌘E**，亦可從選單列 🪿 → Quit 結束程式。網頁上的鵝游標則可在頂部導覽列的 🪿 按鈕關閉。',
      en: 'To immediately stop desktop cursor pranks, hold **ESC**, press **⌃⌥⌘E**, or quit from the Menu Bar 🪿 icon. You can also toggle the website Goose Cursor from the 🪿 button in the header.'
    },
    {
      test: /privacy|security|ai|openai|data|隱私|安全|收集|連網|網路/i,
      zh: '隱私與連線說明：\n• 本網站上的 goooseAI 是純前端互動模組，不會連接任何外部 AI 或後端伺服器。\n• 桌面版 gooose 僅在你手動點擊「Check for Updates」時查詢 GitHub API；外部 AI（OpenAIClient）預設關閉且強制封鎖，除非你明確選擇加入。',
      en: 'Privacy & network behavior:\n• goooseAI on this website is purely front-end and never calls any external AI API.\n• The macOS app only checks GitHub Releases when you manually click Check for Updates; External AI (`OpenAIClient`) is off and blocked by default unless you explicitly opt in.'
    },
    {
      test: /multi|family|5|幾隻|多鵝/i,
      zh: 'gooose 桌面版與網頁版 Playground 2.0 皆支援最多 5 隻鵝（`GooseManager.hardMaxGeese = 5`），每隻鵝都有獨立狀態與社交互動（追逐、打招呼、一起睡覺、搶迷因等）。',
      en: 'Both the macOS app and Playground 2.0 support up to 5 geese (`GooseManager.hardMaxGeese = 5`), each with independent states and social interactions (chasing, greeting, sleeping together, stealing memes).'
    },
    {
      test: /bug|issue|error|crash|故障|錯誤|回報|debug/i,
      zh: '遇到問題時，建議先確認只有一份 `gooose.app` 位於 `/Applications`，並檢查 `/docs` 的 Troubleshooting 指南。若為程式 Bug，歡迎附上 macOS 版本與重現步驟回報至 `github.com/li-bao/gooose/issues`。',
      en: 'If something goes wrong, make sure only one copy of `gooose.app` is in `/Applications` and check Troubleshooting in `/docs`. You can report bugs with your macOS version and steps to reproduce at `github.com/li-bao/gooose/issues`.'
    }
  ];

  const SUGGESTED_PROMPTS = {
    'zh-TW': [
      '怎麼安裝 gooose？',
      '為什麼需要權限？',
      '講個麵包笑話！',
      '寫程式卡關了怎麼辦？'
    ],
    en: [
      'How do I install gooose?',
      'Why does it ask for permissions?',
      'Tell me a bread joke!',
      'Help, I am stuck debugging!'
    ]
  };

  let lang = 'zh-TW';
  let isOpen = false;
  let isSending = false;
  let activeReqId = 0;
  let pendingTimer = null;
  let messages = [];
  let recentIds = [];
  let queues = { 'zh-TW': [], en: [] };
  let idleSleepTimer = null;
  let bubbleTimer = null;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          messages = parsed;
          return;
        }
      }
    } catch (e) {}
    messages = [{
      id: 'msg-welcome',
      role: 'bot',
      text: lang === 'zh-TW'
        ? '嘎！我是 goooseAI。我可以回答 gooose 的安裝、權限與使用問題，也能陪你聊天或講冷笑話。'
        : 'HONK! I am goooseAI. Ask me about installing gooose, permissions, or just chat for playful goose humor!',
      time: formatTime(new Date()),
      userPrompt: ''
    }];
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch (e) {}
  }

  function formatTime(date) {
    return date.toLocaleTimeString(lang === 'zh-TW' ? 'zh-TW' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function detectCategory(text) {
    if (/^(hi|hello|hey|哈囉|嗨|你好|早安|午安|晚安)/i.test(text)) return 'greeting';
    if (/bye|再見|晚安|下線|休息|掰/i.test(text)) return 'goodbye';
    if (/bread|toast|麵包|吐司|餓|吃/i.test(text)) return 'bread';
    if (/bug|debug|code|程式|卡關|重構|error|報錯|寫不出/i.test(text)) return 'debug';
    if (/加油|累|難|煩|鼓勵|stressed|tired/i.test(text)) return 'encouragement';
    return null;
  }

  function detectReplyLang(text) {
    const hasCjk = /[\u4e00-\u9fff]/.test(text);
    const hasLatin = /[a-zA-Z]/.test(text);
    if (hasCjk) return 'zh-TW';
    if (hasLatin && !hasCjk) return 'en';
    return lang;
  }

  function pickResponse(userText) {
    const replyLang = detectReplyLang(userText);

    // 1. Check serious / factual product topics first
    for (const topic of SERIOUS_TOPICS) {
      if (topic.test.test(userText)) {
        return { text: replyLang === 'en' ? topic.en : topic.zh, id: 'serious' };
      }
    }

    // 2. Shuffled queue without repeating last 10 responses
    const pool = replyLang === 'en' ? EN_RESPONSES : ZH_RESPONSES;
    const cat = detectCategory(userText);

    if (!queues[replyLang] || queues[replyLang].length === 0) {
      queues[replyLang] = shuffle(pool);
    }

    // Try matching category from queue while avoiding recentIds
    if (cat) {
      const catIdx = queues[replyLang].findIndex((item) => item.cat === cat && !recentIds.includes(item.id));
      if (catIdx !== -1) {
        const [picked] = queues[replyLang].splice(catIdx, 1);
        recordRecent(picked.id);
        return picked;
      }
    }

    let idx = queues[replyLang].findIndex((item) => !recentIds.includes(item.id));
    if (idx === -1) {
      queues[replyLang] = shuffle(pool);
      idx = queues[replyLang].findIndex((item) => !recentIds.includes(item.id));
      if (idx === -1) idx = 0;
    }
    const [picked] = queues[replyLang].splice(idx, 1);
    recordRecent(picked.id);
    return picked;
  }

  function recordRecent(id) {
    if (!id || id === 'serious') return;
    recentIds.push(id);
    if (recentIds.length > RECENT_LIMIT) recentIds.shift();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function gooseAvatarSvg() {
    return `
      <span class="ai-msg-avatar" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
          <ellipse cx="18" cy="27" rx="10" ry="6.5" fill="#FFFFFF" stroke="#2B201A" stroke-width="2"/>
          <path d="M23 24c1-6 .5-10 1-13 .5-2.5 2.5-4 5-3.5 2 .5 3.5 2 3 4-.5 2-2 2.5-3.5 3-.5 3.5-.5 7.5-2 10.5" fill="#FFFFFF" stroke="#2B201A" stroke-width="2" stroke-linecap="round"/>
          <path d="M31.5 11.5l4.5 1.5-4.5 1.5z" fill="#F27D3B" stroke="#2B201A" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="28.5" cy="10.5" r="1.2" fill="#2B201A"/>
        </svg>
      </span>
    `;
  }

  function renderMessagesInto(box, forceScroll = false) {
    if (!box) return;
    const nearBottom = (box.scrollHeight - box.scrollTop - box.clientHeight) < 60;

    box.innerHTML = messages.map((m) => {
      if (m.typing) {
        return `
          <div class="ai-msg-row bot">
            ${gooseAvatarSvg()}
            <div class="ai-msg-bubble">
              <div class="ai-typing-dots" aria-label="Typing"><span></span><span></span><span></span></div>
            </div>
          </div>
        `;
      }
      const copyLabel = lang === 'zh-TW' ? '複製' : 'Copy';
      const retryLabel = lang === 'zh-TW' ? '重試' : 'Retry';
      const actions = m.role === 'bot'
        ? `<button type="button" class="ai-msg-action" data-action="copy" data-id="${m.id}">${copyLabel}</button>`
          + (m.userPrompt ? `<button type="button" class="ai-msg-action" data-action="retry" data-id="${m.id}">${retryLabel}</button>` : '')
        : '';

      return `
        <div class="ai-msg-row ${m.role}" data-msg-id="${m.id}">
          ${m.role === 'bot' ? gooseAvatarSvg() : ''}
          <div class="ai-msg-bubble">${escapeHtml(m.text)}<div class="ai-msg-meta"><span>${escapeHtml(m.time)}</span>${actions}</div></div>
        </div>
      `;
    }).join('');

    box.querySelectorAll('.ai-msg-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        const msg = messages.find((x) => x.id === btn.dataset.id);
        if (!msg) return;
        if (btn.dataset.action === 'copy') {
          navigator.clipboard?.writeText(msg.text).then(() => {
            btn.textContent = lang === 'zh-TW' ? '已複製' : 'Copied';
            setTimeout(() => { btn.textContent = lang === 'zh-TW' ? '複製' : 'Copy'; }, 1200);
          }).catch(() => {});
        } else if (btn.dataset.action === 'retry' && msg.userPrompt && !isSending) {
          regenerateFor(msg.userPrompt);
        }
      });
    });

    if (forceScroll || nearBottom) {
      box.scrollTop = box.scrollHeight;
    }
  }

  function renderAllViews(forceScroll = false) {
    renderMessagesInto(document.getElementById('gooose-ai-messages'), forceScroll);
    renderMessagesInto(document.getElementById('goose-ai-page-messages'), forceScroll);
    syncControlsState();
  }

  function syncControlsState() {
    ['gooose-ai-send', 'goose-ai-page-send'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = isSending;
    });
    ['gooose-ai-stop', 'goose-ai-page-stop'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.style.display = isSending ? 'inline-flex' : 'none';
    });
  }

  function regenerateFor(promptText) {
    if (isSending) return;
    isSending = true;
    const reqId = ++activeReqId;
    const typingId = 'typing-' + reqId;
    messages.push({ id: typingId, role: 'bot', typing: true, text: '', time: '' });
    renderAllViews(true);

    pendingTimer = setTimeout(() => {
      if (reqId !== activeReqId) return;
      messages = messages.filter((m) => m.id !== typingId);
      const picked = pickResponse(promptText);
      messages.push({
        id: 'bot-' + Date.now() + '-' + reqId,
        role: 'bot',
        text: picked.text,
        time: formatTime(new Date()),
        userPrompt: promptText
      });
      isSending = false;
      saveHistory();
      renderAllViews(true);
      if (global.GoooseSound) global.GoooseSound.honk();
    }, 380);
  }

  // Unified single-entry submission with isSending lock & unique IDs
  function submitMessage(rawText, inputEl) {
    const trimmed = String(rawText || '').trim();
    if (!trimmed || isSending) return false;

    isSending = true;
    const reqId = ++activeReqId;
    resetSleepTimer();

    if (inputEl) inputEl.value = '';

    const userMsgId = 'usr-' + Date.now() + '-' + reqId;
    const typingId = 'typing-' + reqId;

    messages.push({
      id: userMsgId,
      role: 'user',
      text: trimmed,
      time: formatTime(new Date())
    });
    messages.push({
      id: typingId,
      role: 'bot',
      typing: true,
      text: '',
      time: ''
    });
    saveHistory();
    renderAllViews(true);

    const delay = 360 + Math.floor(Math.random() * 220);
    pendingTimer = setTimeout(() => {
      if (reqId !== activeReqId) return;
      messages = messages.filter((m) => m.id !== typingId);
      const picked = pickResponse(trimmed);
      messages.push({
        id: 'bot-' + Date.now() + '-' + reqId,
        role: 'bot',
        text: picked.text,
        time: formatTime(new Date()),
        userPrompt: trimmed
      });
      isSending = false;
      saveHistory();
      renderAllViews(true);
      if (global.GoooseSound) global.GoooseSound.honk();
    }, delay);

    return true;
  }

  function stopGeneration() {
    if (!isSending) return;
    clearTimeout(pendingTimer);
    activeReqId += 1;
    messages = messages.filter((m) => !m.typing);
    isSending = false;
    saveHistory();
    renderAllViews(false);
  }

  function clearConversation() {
    stopGeneration();
    messages = [{
      id: 'msg-reset-' + Date.now(),
      role: 'bot',
      text: lang === 'zh-TW' ? '對話已清除！有什麼想問這隻鵝的嗎？' : 'Chat cleared! What would you like to ask this goose?',
      time: formatTime(new Date()),
      userPrompt: ''
    }];
    saveHistory();
    renderAllViews(true);
  }

  function bindChatForm(formEl, inputEl) {
    if (!formEl || !inputEl || formEl.dataset.aiBound === '1') return;
    formEl.dataset.aiBound = '1';

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      submitMessage(inputEl.value, inputEl);
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.isComposing) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (typeof formEl.requestSubmit === 'function') {
          formEl.requestSubmit();
        } else {
          submitMessage(inputEl.value, inputEl);
        }
      }
    });
  }

  function renderFloatingDOM() {
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
          <div style="display:flex;align-items:center;gap:6px;">
            <strong>🪿 goooseAI</strong>
            <a href="#/goose-ai" id="gooose-ai-expand" class="btn btn-secondary btn-sm" title="Full Page">⤢</a>
          </div>
          <div style="display:flex;gap:5px;">
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-stop" style="display:none;">■</button>
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-clear">清除</button>
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-close" aria-label="Close chat">✕</button>
          </div>
        </div>
        <div class="ai-clear-confirm" id="gooose-ai-clear-confirm">
          <span id="gooose-ai-confirm-text">確定要清除對話嗎？</span>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn btn-primary btn-sm" id="gooose-ai-confirm-yes">確定</button>
            <button type="button" class="btn btn-secondary btn-sm" id="gooose-ai-confirm-no">取消</button>
          </div>
        </div>
        <div class="gooose-ai-disclaimer" id="gooose-ai-disclaimer"></div>
        <div class="gooose-ai-messages" id="gooose-ai-messages" aria-live="polite"></div>
        <form class="gooose-ai-form" id="gooose-ai-form">
          <textarea class="gooose-ai-input" id="gooose-ai-input" rows="1"></textarea>
          <button type="submit" class="btn btn-primary btn-sm" id="gooose-ai-send">送出</button>
        </form>
      </div>
    `;
    document.body.appendChild(root);

    const launcher = document.getElementById('gooose-ai-launcher');
    const closeBtn = document.getElementById('gooose-ai-close');
    const clearBtn = document.getElementById('gooose-ai-clear');
    const confirmBox = document.getElementById('gooose-ai-clear-confirm');
    const confirmYes = document.getElementById('gooose-ai-confirm-yes');
    const confirmNo = document.getElementById('gooose-ai-confirm-no');
    const stopBtn = document.getElementById('gooose-ai-stop');
    const expandLink = document.getElementById('gooose-ai-expand');

    launcher.addEventListener('click', () => {
      if (global.GoooseSound) global.GoooseSound.honk();
      setOpen(!isOpen);
    });
    launcher.addEventListener('pointerenter', () => {
      resetSleepTimer();
      showMiniBubble(lang === 'zh-TW' ? '點我聊聊！' : 'Click to chat!', 1500);
    });
    closeBtn.addEventListener('click', () => setOpen(false));
    stopBtn.addEventListener('click', stopGeneration);
    clearBtn.addEventListener('click', () => confirmBox.classList.add('open'));
    confirmNo.addEventListener('click', () => confirmBox.classList.remove('open'));
    confirmYes.addEventListener('click', () => {
      confirmBox.classList.remove('open');
      clearConversation();
    });
    expandLink.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(false);
      if (global.GoooseRouter) global.GoooseRouter.navigate('goose-ai');
    });

    bindChatForm(document.getElementById('gooose-ai-form'), document.getElementById('gooose-ai-input'));

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

  function mountPage(container) {
    if (!container) return;
    const isEn = lang === 'en';
    const prompts = SUGGESTED_PROMPTS[lang];
    container.innerHTML = `
      <div class="goose-ai-page-grid">
        <aside class="glass-panel goose-ai-sidebar">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="brand-badge" aria-hidden="true">🪿</span>
            <div>
              <h2 style="font-size:1.2rem;">goooseAI</h2>
              <span style="font-size:0.8rem;color:var(--muted);">${isEn ? 'Mischievous Desktop Companion' : '調皮又可靠的桌面小鵝'}</span>
            </div>
          </div>
          <p style="margin:0;font-size:0.9rem;color:var(--muted);">
            ${isEn
              ? 'Built-in front-end assistant with 40+ playful responses and real gooose troubleshooting knowledge. No cloud LLM or tracking.'
              : '內建超過 45 句不重複的搞笑鵝語錄，並能認真解答 gooose 安裝、權限與除錯問題（純本機前端運行，不上傳任何對話）。'}
          </p>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:0.84rem;color:var(--muted);">
            <span>✓ ${isEn ? 'Single-submit lock (no duplicates)' : '防重複送出鎖定機制'}</span>
            <span>✓ ${isEn ? 'Enter sends · Shift+Enter newline' : 'Enter 送出 · Shift+Enter 換行'}</span>
            <span>✓ ${isEn ? 'Shuffled queue (no recent repeats)' : '洗牌佇列（最近 10 句不重複）'}</span>
            <span>✓ ${isEn ? 'Local history saved' : '自動保存本機對話紀錄'}</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="goose-ai-page-feed">🍞 ${isEn ? 'Feed goooseAI' : '餵食 goooseAI'}</button>
        </aside>

        <div class="goose-ai-workspace">
          <div class="gooose-ai-chat-head">
            <strong>💬 ${isEn ? 'Chat with goooseAI' : '與 goooseAI 對話'}</strong>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn btn-secondary btn-sm" id="goose-ai-page-stop" style="display:none;">${isEn ? 'Stop' : '停止'}</button>
              <button type="button" class="btn btn-secondary btn-sm" id="goose-ai-page-clear">${isEn ? 'Clear' : '清除對話'}</button>
            </div>
          </div>
          <div class="ai-clear-confirm" id="goose-ai-page-clear-confirm">
            <span>${isEn ? 'Clear all conversation history?' : '確定要清除所有對話紀錄嗎？'}</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn btn-primary btn-sm" id="goose-ai-page-confirm-yes">${isEn ? 'Confirm' : '確定'}</button>
              <button type="button" class="btn btn-secondary btn-sm" id="goose-ai-page-confirm-no">${isEn ? 'Cancel' : '取消'}</button>
            </div>
          </div>
          <div class="gooose-ai-messages" id="goose-ai-page-messages" aria-live="polite"></div>
          <div class="ai-prompts-bar">
            ${prompts.map((p) => `<button type="button" class="ai-prompt-chip" data-prompt="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}
          </div>
          <form class="gooose-ai-form" id="goose-ai-page-form">
            <textarea class="gooose-ai-input" id="goose-ai-page-input" rows="2" placeholder="${isEn ? 'Ask goooseAI anything… (Enter to send, Shift+Enter for newline)' : '輸入任何問題或跟小鵝聊天…（Enter 送出，Shift+Enter 換行）'}"></textarea>
            <button type="submit" class="btn btn-primary" id="goose-ai-page-send">${isEn ? 'Send' : '送出'}</button>
          </form>
        </div>
      </div>
    `;

    const formEl = document.getElementById('goose-ai-page-form');
    const inputEl = document.getElementById('goose-ai-page-input');
    bindChatForm(formEl, inputEl);

    container.querySelectorAll('.ai-prompt-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        submitMessage(chip.dataset.prompt, null);
      });
    });

    const clearBtn = document.getElementById('goose-ai-page-clear');
    const confirmBox = document.getElementById('goose-ai-page-clear-confirm');
    document.getElementById('goose-ai-page-confirm-no')?.addEventListener('click', () => confirmBox.classList.remove('open'));
    document.getElementById('goose-ai-page-confirm-yes')?.addEventListener('click', () => {
      confirmBox.classList.remove('open');
      clearConversation();
    });
    clearBtn?.addEventListener('click', () => confirmBox.classList.add('open'));
    document.getElementById('goose-ai-page-stop')?.addEventListener('click', stopGeneration);
    document.getElementById('goose-ai-page-feed')?.addEventListener('click', () => {
      if (global.GoooseSound) global.GoooseSound.eat();
      submitMessage(isEn ? 'Here is some bread!' : '給你吃麵包！', null);
    });

    renderAllViews(true);
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
    if (launcher && launcher.dataset.mood === 'sleeping') launcher.dataset.mood = 'idle';
    clearTimeout(idleSleepTimer);
    idleSleepTimer = setTimeout(() => {
      if (!isOpen && launcher) launcher.dataset.mood = 'sleeping';
    }, 15000);
  }

  function setOpen(nextOpen) {
    isOpen = Boolean(nextOpen);
    const chat = document.getElementById('gooose-ai-chat');
    const launcher = document.getElementById('gooose-ai-launcher');
    if (chat) chat.classList.toggle('open', isOpen);
    if (launcher) launcher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    resetSleepTimer();
    if (isOpen) document.getElementById('gooose-ai-input')?.focus();
  }

  function setFloatingVisible(visible) {
    const root = document.getElementById('gooose-ai-root');
    if (root) root.style.display = visible ? 'flex' : 'none';
  }

  function updateLanguage(nextLang) {
    lang = nextLang === 'en' ? 'en' : 'zh-TW';
    const disclaimer = document.getElementById('gooose-ai-disclaimer');
    const clearBtn = document.getElementById('gooose-ai-clear');
    const sendBtn = document.getElementById('gooose-ai-send');
    const input = document.getElementById('gooose-ai-input');
    const confirmText = document.getElementById('gooose-ai-confirm-text');
    const confirmYes = document.getElementById('gooose-ai-confirm-yes');
    const confirmNo = document.getElementById('gooose-ai-confirm-no');

    if (disclaimer) {
      disclaimer.textContent = lang === 'zh-TW'
        ? '本機互動小鵝 · 48 句語錄 + 產品問答（無外部 AI）'
        : 'Local interactive goose · 42+ lines + product Q&A (no cloud AI)';
    }
    if (clearBtn) clearBtn.textContent = lang === 'zh-TW' ? '清除' : 'Clear';
    if (sendBtn) sendBtn.textContent = lang === 'zh-TW' ? '送出' : 'Send';
    if (confirmText) confirmText.textContent = lang === 'zh-TW' ? '確定清除對話？' : 'Clear chat?';
    if (confirmYes) confirmYes.textContent = lang === 'zh-TW' ? '確定' : 'Yes';
    if (confirmNo) confirmNo.textContent = lang === 'zh-TW' ? '取消' : 'No';
    if (input) {
      input.placeholder = lang === 'zh-TW' ? '跟 goooseAI 說句話…' : 'Message goooseAI…';
    }
    renderAllViews(false);
  }

  function init(initialLang) {
    lang = initialLang === 'en' ? 'en' : 'zh-TW';
    loadHistory();
    renderFloatingDOM();
    updateLanguage(lang);
    resetSleepTimer();
  }

  global.GoooseAI = {
    init,
    mountPage,
    updateLanguage,
    setOpen,
    setFloatingVisible,
    submitMessage,
    clearConversation,
    getResponseCounts: () => ({ zh: ZH_RESPONSES.length, en: EN_RESPONSES.length }),
    getState: () => ({ isSending, messages: messages.slice(), recentIds: recentIds.slice() })
  };
})(window);
