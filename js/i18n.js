(function (global) {
  'use strict';

  const I18N = {
    'zh-TW': {
      skip: '跳至主要內容',
      'nav.home': '首頁',
      'nav.features': '特色',
      'nav.playground': '遊樂場 2.0',
      'nav.games': '小遊戲',
      'nav.gallery': '畫面',
      'nav.download': '下載',
      'nav.docs': '文件',
      'nav.faq': 'FAQ',
      'nav.changelog': '更新日誌',
      'nav.security': '安全與隱私',
      'nav.gooseAi': 'goooseAI',
      'nav.search': '搜尋',
      'nav.menu': '選單',
      'theme.system': '系統',
      'theme.light': '淺色',
      'theme.dark': '深色',
      'hero.eyebrow': 'macOS Apple Silicon · 開源桌面寵物',
      'hero.title': '給你的桌面添一點可愛混亂。',
      'hero.subtitle': '你的桌面，牠們的遊樂場。',
      'hero.lead': 'gooose 是由 Li-bao 開發的原生 macOS 桌面寵物。牠會在螢幕上散步、搶走你的滑鼠游標、從螢幕邊緣拖出迷因與便利貼，並支援最多 5 隻鵝的 Goose Family。',
      'hero.starsLabel': 'Stars：',
      'hero.forksLabel': 'Forks：',
      'hero.releasesLabel': 'Releases：',
      'hero.versionLabel': '最新版本：',
      'hero.ctaDownload': '下載 gooose',
      'hero.ctaFeatures': '探索特色',
      'hero.ctaGithub': 'GitHub 專案',
      'hero.stageHint': '點擊舞台中的 gooose，牠會跳起來並對游標做出反應！',
      'features.eyebrow': '互動功能特色',
      'features.title': '一隻真的住在你電腦裡的鵝',
      'features.desc': '以 Swift、SwiftUI、AppKit 與 SpriteKit 原生打造。點擊或滑過下方卡片預覽 gooose 行為。',
      'pg.eyebrow': '物理互動沙盒',
      'pg.title': 'Goose Playground 2.0',
      'pg.desc': '具備重力、拋擲動量、碰撞偵測、5 種食物、4 種性格與 5 種遊戲模式的實體 Canvas 遊樂場！',
      'pg.pause': '暫停',
      'pg.reset': '重置',
      'loading.pill': 'gooose 正在搬運 GitHub 資料…',
      'pg.sandboxNote': '🔒 瀏覽器安全沙盒：不要求螢幕錄影或輔助使用權限，不會操作你真正的滑鼠。',
      'games.eyebrow': '品牌小遊戲',
      'games.title': 'gooose Arcade 小遊戲',
      'games.desc': '兩款完整可玩的小遊戲，支援鍵盤、滑鼠與手機觸控，最高紀錄自動保存在本機。',
      'gallery.eyebrow': '真實畫面展示',
      'gallery.title': '桌面上的真實模樣',
      'gallery.desc': '可依類型篩選素材，點擊圖片開啟燈箱（ESC 關閉）。未上傳的動態素材誠實標註於右側。',
      'gallery.shotTitle': 'macOS 桌面實機截圖',
      'gallery.shotDesc': '取自 li-bao/gooose 的真實運行畫面（點擊可放大檢視，按 ESC 關閉）。',
      'gallery.missingTitle': '待補齊的影音素材清單',
      'gallery.missingDesc': '目前桌面程式 Repository 尚無以下影音檔案，待製作完成後即可加入本區：',
      'dl.eyebrow': '下載中心',
      'dl.title': '迎接你的桌面新室友',
      'dl.desc': '所有版本號、下載連結、下載次數與 SHA-256 皆即時來自 GitHub Releases API。',
      'api.loading': '正在從 GitHub 取得最新發布資料…',
      'api.refresh': '重新整理',
      'api.live': '已同步 GitHub 即時資料（快取 15 分鐘）',
      'api.cached': '目前顯示最後一次成功快取的真實資料（GitHub API 暫時無法連線或受限）',
      'api.unavailable': '目前無法取得 GitHub 資料，請稍後再試或直接前往 GitHub Releases。',
      'dl.loadingTitle': '正在載入最新版本…',
      'dl.version': '版本：',
      'dl.date': '發布日期：',
      'dl.size': '大小：',
      'dl.downloads': '下載次數：',
      'dl.btnArm': '下載 Apple Silicon (.dmg)',
      'dl.btnIntel': '下載 Intel Mac',
      'dl.btnAll': 'GitHub Releases',
      'dl.armOnlyNote': '目前僅提供 Apple Silicon（arm64）原生版本，暫無 Intel Mac（x86_64）建置檔案。',
      'dl.shaLabel': 'SHA-256：',
      'dl.copySha': '複製',
      'dl.copied': '已複製！',
      'dl.shaMissing': 'GitHub Release 尚未提供',
      'dl.signTitle': '⚠️ 簽章與公證說明（誠實揭露）',
      'dl.signBody': 'gooose 目前採 Ad-hoc 本機簽章（尚未經 Apple Developer ID 公證）。首次開啟若遇到 macOS Gatekeeper 提示，請在「系統設定 → 隱私權與安全性」點擊「強制打開」，或對 App 按右鍵選「打開」，亦可執行：',
      'dl.guideTitle': '安裝說明與系統需求',
      'dl.notesTitle': '最新版本說明（Release Notes）',
      'docs.eyebrow': '使用手冊',
      'docs.title': '完整文件',
      'docs.desc': '依據 li-bao/gooose 實際程式碼與官方文件撰寫，支援搜尋與一鍵複製指令。',
      'faq.eyebrow': '疑難排解',
      'faq.title': '常見問題 FAQ',
      'faq.desc': '支援關鍵字搜尋與分類篩選，快速找到安裝、權限與資料儲存解答。',
      'cl.eyebrow': '版本紀錄',
      'cl.title': 'Changelog',
      'cl.desc': '自動同步 GitHub Releases API。未人工翻譯的 Release Notes 會明確標示原文語言。',
      'cl.origLang': '原文語言：English（未翻譯）',
      'cl.rawToggle': '展開原始 Release Notes',
      'sec.eyebrow': '安全與隱私',
      'sec.title': 'Security & Privacy',
      'sec.desc': '清楚區分本官方網站與 macOS 桌面應用程式的實際行為，不誇大保證。',
      'sec.cardTitle': '🛡️ 安全性說明（Security）',
      'priv.cardTitle': '🔒 隱私權說明（Privacy）',
      'footer.copy': 'Created by Li-bao · gooose 開源 macOS 桌面寵物 · 託管於 GitHub Pages',
      'lb.close': '關閉 (ESC)'
    },
    en: {
      skip: 'Skip to main content',
      'nav.home': 'Home',
      'nav.features': 'Features',
      'nav.playground': 'Playground 2.0',
      'nav.games': 'Games',
      'nav.gallery': 'Gallery',
      'nav.download': 'Download',
      'nav.docs': 'Docs',
      'nav.faq': 'FAQ',
      'nav.changelog': 'Changelog',
      'nav.security': 'Security',
      'nav.gooseAi': 'goooseAI',
      'nav.search': 'Search',
      'nav.menu': 'Menu',
      'theme.system': 'System',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'hero.eyebrow': 'macOS Apple Silicon · Open-Source Desktop Pet',
      'hero.title': 'A little chaos on your desktop.',
      'hero.subtitle': 'Your Desktop. Their Playground.',
      'hero.lead': 'gooose is a native macOS desktop pet created by Li-bao. It waddles across your screen, steals your mouse cursor, drags memes and sticky notes from screen edges, and supports a Goose Family of up to 5 geese.',
      'hero.starsLabel': 'Stars: ',
      'hero.forksLabel': 'Forks: ',
      'hero.releasesLabel': 'Releases: ',
      'hero.versionLabel': 'Latest: ',
      'hero.ctaDownload': 'Download gooose',
      'hero.ctaFeatures': 'Explore Features',
      'hero.ctaGithub': 'GitHub Repo',
      'hero.stageHint': 'Click the goose on stage to make it hop and react to your cursor!',
      'features.eyebrow': 'Features',
      'features.title': 'A goose that actually lives on your computer',
      'features.desc': 'Built natively with Swift, SwiftUI, AppKit, and SpriteKit. Hover or click any card to preview.',
      'pg.eyebrow': 'Physics Sandbox',
      'pg.title': 'Goose Playground 2.0',
      'pg.desc': 'Real Canvas physics with gravity, drag & throw momentum, collisions, 5 foods, personalities, and 5 game modes!',
      'pg.pause': 'Pause',
      'pg.reset': 'Reset',
      'loading.pill': 'gooose is fetching GitHub data…',
      'pg.sandboxNote': '🔒 Browser sandbox: requests zero macOS permissions and never touches your real cursor.',
      'games.eyebrow': 'Mini-Games',
      'games.title': 'gooose Arcade',
      'games.desc': 'Two complete playable mini-games with keyboard, mouse, and touch controls plus local high scores.',
      'gallery.eyebrow': 'Gallery',
      'gallery.title': 'gooose in Action',
      'gallery.desc': 'Filter media by category and click to open the Lightbox (ESC to close). Missing clips are listed honestly.',
      'gallery.shotTitle': 'macOS Desktop Screenshot',
      'gallery.shotDesc': 'Real screenshot from li-bao/gooose (click to enlarge, press ESC to close).',
      'gallery.missingTitle': 'Missing Media Checklist',
      'gallery.missingDesc': 'These media assets are not yet in the desktop repository and can be added once recorded:',
      'dl.eyebrow': 'Download Center',
      'dl.title': 'Welcome Your New Desktop Troublemaker',
      'dl.desc': 'Version numbers, download URLs, download counts, and SHA-256 checksums come live from GitHub Releases API.',
      'api.loading': 'Fetching latest release data from GitHub…',
      'api.refresh': 'Refresh',
      'api.live': 'Live GitHub data synced (15-minute cache)',
      'api.cached': 'Showing last cached real data (GitHub API temporarily unreachable or rate-limited)',
      'api.unavailable': 'GitHub data is currently unavailable. Please try again later or visit GitHub Releases.',
      'dl.loadingTitle': 'Loading latest release…',
      'dl.version': 'Version: ',
      'dl.date': 'Released: ',
      'dl.size': 'Size: ',
      'dl.downloads': 'Downloads: ',
      'dl.btnArm': 'Download Apple Silicon (.dmg)',
      'dl.btnIntel': 'Download Intel Mac',
      'dl.btnAll': 'GitHub Releases',
      'dl.armOnlyNote': 'Currently built for Apple Silicon (arm64) only. No Intel Mac (x86_64) build is published.',
      'dl.shaLabel': 'SHA-256:',
      'dl.copySha': 'Copy',
      'dl.copied': 'Copied!',
      'dl.shaMissing': 'Not provided by GitHub Release',
      'dl.signTitle': '⚠️ Code Signing & Notarization Notice',
      'dl.signBody': 'gooose is currently ad-hoc signed (-) and NOT Apple-notarized. On first launch, use System Settings → Privacy & Security → Open Anyway, Right-click → Open, or run:',
      'dl.guideTitle': 'Installation & Requirements',
      'dl.notesTitle': 'Latest Release Notes',
      'docs.eyebrow': 'Documentation',
      'docs.title': 'Complete Guide',
      'docs.desc': 'Written directly from the actual li-bao/gooose source code, with search and one-click code copy.',
      'faq.eyebrow': 'FAQ',
      'faq.title': 'Frequently Asked Questions',
      'faq.desc': 'Search or filter by category to find answers about installation, permissions, and storage.',
      'cl.eyebrow': 'Release History',
      'cl.title': 'Changelog',
      'cl.desc': 'Automatically synced from the GitHub Releases API. Untranslated release notes are clearly labeled.',
      'cl.origLang': 'Original Language: English',
      'cl.rawToggle': 'Toggle Raw Release Notes',
      'sec.eyebrow': 'Trust & Transparency',
      'sec.title': 'Security & Privacy',
      'sec.desc': 'Clear separation between this static website and the macOS desktop app—no exaggerated claims.',
      'sec.cardTitle': '🛡️ Security',
      'priv.cardTitle': '🔒 Privacy',
      'footer.copy': 'Created by Li-bao · gooose open-source macOS desktop pet · Hosted on GitHub Pages',
      'lb.close': 'Close (ESC)'
    }
  };

  const FEATURES = {
    'zh-TW': [
      { icon: '🖱️', tag: '互動', title: '搶走你的滑鼠游標', desc: '小鵝會追逐或叼走游標，透過 GlobalActionCoordinator 限時安全控制並支援 ESC / ⌃⌥⌘E 緊急停止。', preview: '嘎！游標已被叼走 → 按 ESC 立刻歸還' },
      { icon: '🪿', tag: '多鵝', title: 'Goose Family 多鵝互動', desc: '最多支援 5 隻鵝同時在桌面活動，具備追逐、打招呼、吵架、一起睡覺與搶迷因等 8 種社交互動。', preview: '目前上限：5 隻鵝 · 8 種社交互動' },
      { icon: '🖼️', tag: '惡作劇', title: '邊緣拖出迷因與便利貼', desc: '從螢幕可見邊緣平滑拖出個人迷因圖庫（PNG/JPG/WEBP/GIF）與可編輯調整大小的便利貼。', preview: '平滑貝茲曲線拖曳 · 支援個人圖庫' },
      { icon: '🎭', tag: '性格', title: '7 種情緒與 4 種惡作劇預設', desc: '包含開心、生氣、無聊、興奮、想睡、好奇與調皮情緒，以及 Peaceful 到 Chaos 四種強度預設。', preview: 'Energy 0–100 · 跨啟動狀態持久化' },
      { icon: '🎨', tag: '自訂', title: '10 分頁自訂工作室', desc: '支援自訂音效包、嘲諷語錄庫、動畫工作室參數與惡作劇 Preset，打造專屬於你的搗蛋鵝。', preview: '自訂音效 · 語錄 · 動畫參數' },
      { icon: '⚡', tag: '原生', title: 'Swift 原生與本機 Vision OCR', desc: '專為 Apple Silicon 與 macOS 26+ 打造，螢幕辨識全程於本機記憶體內執行，不寫入硬碟。', preview: 'Swift 6.2 · SpriteKit · On-device OCR' }
    ],
    en: [
      { icon: '🖱️', tag: 'Cursor', title: 'Steals Your Mouse Cursor', desc: 'Geese chase or nab your cursor via GlobalActionCoordinator leases with instant ESC / ⌃⌥⌘E Emergency Stop.', preview: 'HONK! Cursor nabbed → ESC restores immediately' },
      { icon: '🪿', tag: 'Family', title: 'Goose Family (Up to 5)', desc: 'Spawn up to 5 independent geese that chase, greet, argue, sleep together, and steal memes from each other.', preview: 'Hard cap: 5 geese · 8 social interactions' },
      { icon: '🖼️', tag: 'Memes', title: 'Edge-Drag Memes & Notes', desc: 'Smoothly pulls personal memes (PNG/JPG/WEBP/GIF) and resizable editable sticky notes from screen edges.', preview: 'Eased Bezier edge-drag · Custom library' },
      { icon: '🎭', tag: 'Moods', title: '7 Emotions & 4 Presets', desc: 'Dynamic energy (0–100), 7 emotions, and Peaceful, Normal, Mischievous, or Chaos presets.', preview: 'Energy 0–100 · Persistent state' },
      { icon: '🎨', tag: 'Studio', title: '10-Tab Customization Suite', desc: 'Customize audio packs, taunt libraries, animation controls, and prank presets in one place.', preview: 'Audio packs · Taunts · Animation Studio' },
      { icon: '⚡', tag: 'Native', title: 'Native Swift & On-Device OCR', desc: 'Built for Apple Silicon on macOS 26+. Optional Vision OCR runs strictly in RAM and never leaves your Mac.', preview: 'Swift 6.2 · SpriteKit · On-device OCR' }
    ]
  };

  const DOCS = {
    'zh-TW': [
      { id: 'getting-started', title: '快速開始 Getting Started', html: '<h3>快速開始</h3><p>gooose 是一款常駐於 macOS 選單列（Menu Bar 🪿）的桌面寵物應用程式。</p><ul><li>啟動後可從選單列開啟 <strong>Control Center</strong>、<strong>Settings Center</strong>（10 個設定分頁）或 <strong>Permission Center</strong>。</li><li>按住 <strong>ESC</strong> 或使用全域快捷鍵 <code>⌃⌥⌘E</code> 可隨時觸發緊急停止，立即歸還滑鼠控制權。</li><li>核心動畫、打盹、迷因與便利貼無需進階系統權限即可使用。</li></ul>' },
      { id: 'installation', title: '安裝方式 Installation', html: '<h3>安裝方式</h3><ul><li>從 GitHub Releases 下載 <code>Gooose-macOS-arm64.dmg</code>。</li><li>將 <code>gooose.app</code> 拖曳至 <code>/Applications</code> 資料夾，移除 Downloads 中的舊副本以避免 App Translocation。</li><li>因目前採 Ad-hoc 本機簽章（尚未經過 Apple 公證），首次啟動可對 App 按右鍵選「打開」，或執行：</li></ul><div class="code-block-wrap"><pre><code>xattr -cr "/Applications/gooose.app"</code></pre><button type="button" class="btn btn-secondary btn-sm copy-code-btn">複製</button></div>' },
      { id: 'compatibility', title: '系統相容性 Compatibility', html: '<h3>系統相容性</h3><ul><li><strong>支援架構：</strong>Apple Silicon（<code>arm64</code>）。</li><li><strong>最低系統版本：</strong>macOS 26.0+（依據 <code>Goose/Package.swift</code> 定義 <code>.macOS(.v26)</code>）。</li><li><strong>Intel Mac：</strong>目前 Releases 未提供 Intel <code>x86_64</code> 建置版本。</li><li><strong>多螢幕支援：</strong>支援多顯示器座標對應，新增夥伴鵝時會自動分散至不同螢幕。</li></ul>' },
      { id: 'permissions', title: '權限說明 Permissions', html: '<h3>macOS 權限說明</h3><p>所有進階權限皆可在「選單列 🪿 → Permission Center」查看與管理：</p><ul><li><strong>Screen Recording（螢幕錄影）：</strong>僅用於 <code>ScreenCaptureKit</code> 與本機 Vision OCR，提供「自動背景觀察」、「系統內容選擇器」或「完全停用」三種模式。</li><li><strong>Accessibility（輔助使用）：</strong>僅用於視窗惡作劇（Window Pranks / Window Peek）。拒絕授權時僅暫停視窗類惡作劇。</li><li><strong>Notifications（通知）：</strong>選用項目，支援 5 種分類開關。</li></ul>' },
      { id: 'mouse', title: '滑鼠互動 Mouse Interaction', html: '<h3>滑鼠互動機制</h3><ul><li>小鵝會執行 <code>MouseChaseTask</code> 或 <code>NabMouseTask</code> 來追逐或暫時帶走游標。</li><li>所有 <code>CGWarpMouseCursorPosition</code> 呼叫皆集中由 <code>GlobalActionCoordinator</code> 的有時限 <code>ResourceLease</code> 控管。</li><li>一旦觸發 <strong>Emergency Stop（ESC / ⌃⌥⌘E / 選單）</strong>，會立即取消租約並恢復正常游標操作。</li></ul>' },
      { id: 'multi-goose', title: '多鵝模式 Multi-Goose', html: '<h3>Goose Family 多鵝模式</h3><ul><li><code>GooseManager.hardMaxGeese</code> 硬性上限為 <strong>5 隻</strong>。</li><li>第一隻鵝會被標記為 <code>isLead</code>，負責 AI 便利貼、耳機與音樂控制等領隊行為。</li><li>支援 8 種社交互動：<code>chasePeer</code>、<code>greetPeer</code>、<code>argue</code>、<code>playTogether</code>、<code>sleepTogether</code>、<code>stealMeme</code>、<code>shareMemo</code>、<code>spectateHolder</code>。</li></ul>' },
      { id: 'troubleshooting', title: '疑難排解 Troubleshooting', html: '<h3>常見疑難排解</h3><ul><li><strong>授予螢幕錄影後需要重啟：</strong>在 Permission Center 點擊「Quit &amp; Reopen」，讓 ScreenCaptureKit 重新取得 TCC Token。</li><li><strong>升級後權限失效：</strong>確認僅保留一份 App 於 <code>/Applications</code> 後，可於終端機重設對應 TCC 權限（實際 Bundle ID 以你安裝的 App 為主）：</li></ul><div class="code-block-wrap"><pre><code>xattr -cr "/Applications/gooose.app"</code></pre><button type="button" class="btn btn-secondary btn-sm copy-code-btn">複製</button></div>' }
    ],
    en: [
      { id: 'getting-started', title: 'Getting Started', html: '<h3>Getting Started</h3><p>gooose lives in your macOS Menu Bar (🪿).</p><ul><li>Open <strong>Control Center</strong>, the 10-tab <strong>Settings Center</strong>, or <strong>Permission Center</strong> from the menu bar icon.</li><li>Hold <strong>ESC</strong> or press <code>⌃⌥⌘E</code> anytime for Emergency Stop to immediately restore cursor control.</li><li>Core animations, naps, memes, and sticky notes work without Screen Recording or Accessibility permissions.</li></ul>' },
      { id: 'installation', title: 'Installation', html: '<h3>Installation</h3><ul><li>Download <code>Gooose-macOS-arm64.dmg</code> from GitHub Releases.</li><li>Drag <code>gooose.app</code> to <code>/Applications</code> and remove older copies from Downloads to prevent App Translocation.</li><li>Because builds are ad-hoc signed (not Apple-notarized), Right-click → Open on first launch, or run:</li></ul><div class="code-block-wrap"><pre><code>xattr -cr "/Applications/gooose.app"</code></pre><button type="button" class="btn btn-secondary btn-sm copy-code-btn">Copy</button></div>' },
      { id: 'compatibility', title: 'Compatibility', html: '<h3>Compatibility</h3><ul><li><strong>Architecture:</strong> Apple Silicon (<code>arm64</code>) only.</li><li><strong>Minimum OS:</strong> macOS 26.0+ (defined in <code>Goose/Package.swift</code> as <code>.macOS(.v26)</code>).</li><li><strong>Intel Macs:</strong> No <code>x86_64</code> build is currently published.</li><li><strong>Multi-Display:</strong> Companion geese automatically distribute across connected screens.</li></ul>' },
      { id: 'permissions', title: 'Permissions', html: '<h3>macOS Permissions</h3><p>Inspect and manage permissions in <strong>Menu Bar (🪿) → Permission Center…</strong>:</p><ul><li><strong>Screen Recording:</strong> Powers <code>ScreenCaptureKit</code> + on-device Vision OCR with 3 user modes: Automatic Background, System Content Picker (<code>SCContentSharingPicker</code>), or Completely Disabled.</li><li><strong>Accessibility:</strong> Used only for Window Pranks &amp; Window Peek. When denied, window pranks pause cleanly.</li><li><strong>Notifications:</strong> Optional, with 5 per-category toggles.</li></ul>' },
      { id: 'mouse', title: 'Mouse Interaction', html: '<h3>Mouse Interaction</h3><ul><li>Geese use <code>MouseChaseTask</code> and <code>NabMouseTask</code> to chase or temporarily drag your cursor.</li><li>All <code>CGWarpMouseCursorPosition</code> calls are gated by <code>GlobalActionCoordinator</code> time-bounded leases.</li><li><strong>Emergency Stop</strong> (<code>ESC</code>, <code>⌃⌥⌘E</code>, or Menu) revokes all leases immediately.</li></ul>' },
      { id: 'multi-goose', title: 'Multi-Goose', html: '<h3>Goose Family (Multi-Goose)</h3><ul><li><code>GooseManager.hardMaxGeese</code> caps active geese at <strong>5</strong>.</li><li>The first goose is marked <code>isLead</code> to coordinate AI notes and music features.</li><li>Geese perform 8 social interactions: <code>chasePeer</code>, <code>greetPeer</code>, <code>argue</code>, <code>playTogether</code>, <code>sleepTogether</code>, <code>stealMeme</code>, <code>shareMemo</code>, and <code>spectateHolder</code>.</li></ul>' },
      { id: 'troubleshooting', title: 'Troubleshooting', html: '<h3>Troubleshooting</h3><ul><li><strong>Granted Screen Recording mid-session:</strong> Click <strong>Quit &amp; Reopen</strong> in Permission Center so ScreenCaptureKit receives the new TCC token.</li><li><strong>Gatekeeper prompt on first launch:</strong> Keep a single copy in <code>/Applications</code> and clear quarantine if needed:</li></ul><div class="code-block-wrap"><pre><code>xattr -cr "/Applications/gooose.app"</code></pre><button type="button" class="btn btn-secondary btn-sm copy-code-btn">Copy</button></div>' }
    ]
  };

  const FAQ = {
    'zh-TW': [
      { cat: 'general', q: '1. gooose 是什麼？', a: 'gooose 是由 Li-bao 開發的開源 macOS 原生桌面寵物（Swift / SwiftUI / SpriteKit）。牠會在你的螢幕上走動、偷走滑鼠游標、拖出迷因圖片與便利貼，為日常工作帶來一點輕鬆混亂。' },
      { cat: 'install', q: '2. 如何安裝 gooose？', a: '從本頁 Download Center 下載最新的 Apple Silicon DMG，開啟後將應用程式拖進「應用程式（/Applications）」資料夾。首次開啟因採 Ad-hoc 簽章，請使用「系統設定 → 隱私權與安全性 → 強制打開」或右鍵點擊「打開」。' },
      { cat: 'install', q: '3. 支援哪些 Mac 機型與系統？', a: '目前僅支援搭載 Apple Silicon（M 系列 arm64 架構）且系統為 macOS 26.0 以上的 Mac。目前沒有 Intel Mac 版本。' },
      { cat: 'privacy', q: '4. 為什麼需要系統權限？不給權限能用嗎？', a: '可以！不給任何權限也能使用小鵝動畫、音效、迷因、便利貼與滑鼠追逐。只有「視窗惡作劇」需要輔助使用權限，而「螢幕內容辨識（Vision OCR）」需要螢幕錄影權限，兩者皆為完全選用。' },
      { cat: 'install', q: '5. 如何解除安裝？', a: '先從選單列結束 gooose，接著將 /Applications 中的應用程式移至垃圾桶即可。沒有隱藏的常駐背景程式或 LaunchAgent。' },
      { cat: 'general', q: '6. 如何回報 Bug？', a: '歡迎直接前往 GitHub Repository（github.com/li-bao/gooose/issues）開立 Issue，並附上你的 macOS 版本與重現步驟。' },
      { cat: 'install', q: '7. 如何更新到最新版本？', a: '可在設定中手動點擊「Check for Updates」檢查 GitHub Releases，或直接到本網站 Download Center 下載新版 DMG 覆蓋 /Applications 內的舊版。' },
      { cat: 'privacy', q: '8. gooose 會連接網路嗎？', a: '預設僅在你手動點擊「Check for Updates」時向 GitHub API 查詢版本，以及在你明確同意開啟「外部 AI」選項時才會連線至 OpenAI API。沒有背景遙測或分析追蹤。' },
      { cat: 'privacy', q: '9. 使用者資料儲存在哪裡？', a: '設定與互動計數器儲存在本機 macOS UserDefaults；鵝的情緒與精力狀態、惡作劇預設與個人迷因圖庫皆儲存在本機檔案（如 goose_states.json、prank_presets.json）。' },
      { cat: 'features', q: '10. 如何使用 Multi-Goose（多鵝模式）？', a: '在 Control Center 或設定中調整最大鵝數量（最多 5 隻）並新增夥伴鵝，牠們會自動進行追逐、打招呼、一起睡覺與搶迷因等 8 種社交互動。' },
      { cat: 'features', q: '11. 可以自訂內容嗎？', a: '可以！支援匯入個人迷因（PNG/JPG/WEBP/GIF）、自訂音效包、編輯便利貼與嘲諷語錄庫，並提供 4 種預設與自訂惡作劇 Preset。' },
      { cat: 'privacy', q: '12. 是否使用外部 AI？網站上的 goooseAI 是真的 AI 嗎？', a: '桌面程式的外部 AI（OpenAIClient）預設為關閉且強制封鎖，需明確選擇加入才會啟用；網站左下角的 goooseAI 則是純前端互動玩具，不連接任何 AI 模型，永遠只回答固定台詞。' }
    ],
    en: [
      { cat: 'general', q: '1. What is gooose?', a: 'gooose is an open-source native macOS desktop pet built by Li-bao using Swift, SwiftUI, and SpriteKit. It wanders your screen, steals your cursor, drags memes and sticky notes, and brings playful chaos to your Mac.' },
      { cat: 'install', q: '2. How do I install gooose?', a: 'Download the latest Apple Silicon DMG from the Download Center, open it, and drag the app into /Applications. Because builds are ad-hoc signed, use Right-click → Open or System Settings → Privacy & Security → Open Anyway on first launch.' },
      { cat: 'install', q: '3. Which Macs are supported?', a: 'Apple Silicon Macs (arm64) running macOS 26.0 or later. There is currently no Intel Mac (x86_64) build.' },
      { cat: 'privacy', q: '4. Why does it ask for permissions, and are they required?', a: 'They are optional. Core animations, sounds, memes, sticky notes, and cursor chasing work without any TCC permissions. Accessibility is only for Window Pranks, and Screen Recording is only for optional on-device Vision OCR.' },
      { cat: 'install', q: '5. How do I uninstall gooose?', a: 'Quit gooose from the menu bar and move the app from /Applications to the Trash. No hidden LaunchAgents or background daemons are installed.' },
      { cat: 'general', q: '6. How do I report a bug?', a: 'Open an issue on GitHub at github.com/li-bao/gooose/issues with your macOS version and steps to reproduce.' },
      { cat: 'install', q: '7. How do I update gooose?', a: 'Click "Check for Updates" in Settings to check GitHub Releases manually, or download the newest DMG here and replace the app in /Applications.' },
      { cat: 'privacy', q: '8. Does gooose connect to the internet?', a: 'By default it only connects when you manually click "Check for Updates" (GitHub Releases API), or if you explicitly opt into External AI (OpenAI API). Zero background telemetry or analytics.' },
      { cat: 'privacy', q: '9. Where is user data stored?', a: 'Preferences and counters are stored locally in macOS UserDefaults; goose states (goose_states.json), prank presets (prank_presets.json), and personal meme/audio libraries stay on your local disk.' },
      { cat: 'features', q: '10. How do I use Multi-Goose?', a: 'Increase the goose count in Control Center or Settings (capped at 5 geese). Companion geese autonomously perform 8 social interactions including chasing, greeting, sleeping together, and stealing memes.' },
      { cat: 'features', q: '11. Can I customize memes, sounds, and notes?', a: 'Yes! You can add personal memes (PNG/JPG/WEBP/GIF), custom audio packs, editable sticky notes, custom taunt lines, and custom prank presets.' },
      { cat: 'privacy', q: '12. Does it use external AI? Is goooseAI on the website real AI?', a: 'In the desktop app, External AI (OpenAIClient) is off and hard-blocked by default until you opt in. On this website, goooseAI in the bottom-left is purely a front-end mascot that never calls any AI API.' }
    ]
  };

  const SECURITY = {
    'zh-TW': [
      '<strong>本網站行為：</strong>純靜態網頁，僅向公開 GitHub REST API（<code>api.github.com</code>）發送唯讀 GET 請求，無後端、無資料庫、無表單收集。',
      '<strong>桌面程式權限：</strong>螢幕錄影與輔助使用皆為選用且由使用者主動授權；<code>ScreenCaptureKit</code> 與 Vision OCR 僅在記憶體中處理，絕不寫入磁碟。',
      '<strong>游標與視窗安全：</strong>滑鼠控制集中於 <code>GlobalActionCoordinator</code> 限時租約，隨時可按 <code>ESC</code> 或 <code>⌃⌥⌘E</code> 緊急停止；內嵌瀏覽器僅允許 <code>https://</code> 且使用非持久化儲存。',
      '<strong>開源透明度：</strong>桌面程式原始碼公開於 <code>github.com/li-bao/gooose</code>，附有 <code>docs/SECURITY.md</code> 稽核紀錄。任何軟體都無法保證絕對零風險。',
      '<strong>漏洞回報：</strong>若發現安全問題，請透過 GitHub Issues 或於 Repository 頁面聯繫開發者 Li-bao。'
    ],
    en: [
      '<strong>This Website:</strong> Static web app only. Makes read-only GET requests to public GitHub REST API (<code>api.github.com</code>) with no backend or database.',
      '<strong>App Permissions:</strong> Screen Recording and Accessibility are optional and user-initiated. <code>ScreenCaptureKit</code> + Vision OCR run strictly in RAM and never write captured frames to disk.',
      '<strong>Cursor &amp; Window Safety:</strong> Cursor warping is gated by <code>GlobalActionCoordinator</code> leases with instant Emergency Stop (<code>ESC</code> / <code>⌃⌥⌘E</code>). Embedded browser enforces <code>https://</code> and non-persistent storage.',
      '<strong>Open Source Transparency:</strong> Full Swift source code and <code>docs/SECURITY.md</code> audit notes are public at <code>github.com/li-bao/gooose</code>. No software can promise 100% security.',
      '<strong>Vulnerability Reporting:</strong> Report security concerns via GitHub Issues or by contacting Li-bao on GitHub.'
    ]
  };

  const PRIVACY = {
    'zh-TW': [
      '<strong>本網站儲存：</strong>僅使用瀏覽器 <code>localStorage</code> 儲存主題、游標/音效設定、遊戲最高分與 GitHub API 快取（15 分鐘），不使用追蹤 Cookie 或第三方分析工具。',
      '<strong>goooseAI 隱私：</strong>網站左下角的 goooseAI 對話只留在當下瀏覽器記憶體中，不會傳送到任何伺服器或 AI API。',
      '<strong>桌面程式網路連線：</strong>我們不宣稱完全離線——當你手動檢查更新時會連線 GitHub API，若手動啟用 Spotify 控制或外部 AI 亦會產生對應連線。',
      '<strong>本機資料儲存：</strong>桌面程式將設定與自訂內容（偏好設定、狀態 JSON、迷因圖庫）儲存於你的 Mac 本機。',
      '<strong>外部 AI 選擇加入：</strong><code>OpenAIClient</code> 預設停用，需明確確認 <code>externalAIOptIn</code> 才會啟用，且不含螢幕截圖或 OCR 內容。'
    ],
    en: [
      '<strong>This Website:</strong> Uses browser <code>localStorage</code> only for theme, cursor/sound preferences, local game high scores, and 15-minute GitHub API cache. Zero tracking cookies or third-party analytics.',
      '<strong>goooseAI Privacy:</strong> Chat messages in goooseAI stay strictly in ephemeral browser memory and are never sent to any server or AI API.',
      '<strong>Desktop App Network Activity:</strong> We do not claim the app is 100% offline—manual update checks query GitHub API, and optional Spotify or External AI features make their respective requests when enabled.',
      '<strong>Local Storage:</strong> App settings, goose states, prank presets, and personal meme/audio libraries are stored locally on your Mac.',
      '<strong>External AI Opt-In:</strong> <code>OpenAIClient</code> is disabled by default until you explicitly opt in (<code>externalAIOptIn</code>), and never transmits screenshots or OCR text.'
    ]
  };

  const MISSING_MEDIA = {
    'zh-TW': [
      'gooose 桌面互動動態 GIF（目前 README 內的 assets/gooose-demo.gif 尚未上傳）',
      '實際使用示範影片（MP4 / WebM，含游標追逐與邊緣拖曳迷因）',
      'Goose Family 多隻鵝同框互動截圖或影片'
    ],
    en: [
      'Desktop interaction animated GIF (assets/gooose-demo.gif referenced in README is not yet in repo)',
      'Gameplay demo video (MP4 / WebM showing cursor stealing and edge-dragged memes)',
      'Goose Family multi-goose social interaction screenshot or clip'
    ]
  };

  const INSTALL_STEPS = {
    'zh-TW': [
      '確認你的 Mac 為 Apple Silicon（M 系列晶片）且系統為 macOS 26.0 或以上版本。',
      '點擊左側按鈕下載最新的 <code>Gooose-macOS-arm64.dmg</code>。',
      '開啟 DMG 後，將 App 拖曳至 <code>/Applications</code>（應用程式）資料夾，確保 TCC 權限路徑穩定。',
      '首次開啟請依上方簽章說明透過「強制打開」或 <code>xattr -cr</code> 解除隔離屬性。'
    ],
    en: [
      'Ensure you have an Apple Silicon Mac (M-series) running macOS 26.0 or later.',
      'Download the latest <code>Gooose-macOS-arm64.dmg</code> using the button on the left.',
      'Open the DMG and drag the app into <code>/Applications</code> so macOS TCC permissions stay bound to a stable path.',
      'On first launch, follow the Gatekeeper notice (Open Anyway or <code>xattr -cr</code>) since builds are ad-hoc signed.'
    ]
  };

  global.GOOOSE_CONTENT = { I18N, FEATURES, DOCS, FAQ, SECURITY, PRIVACY, MISSING_MEDIA, INSTALL_STEPS };
})(window);
