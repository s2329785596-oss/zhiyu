/**
 * 状态画像（APP 侧 / v1.2.0）
 * ------------------------------------------------------------------
 * 和云函数 cloudfunctions/chat/profile.js 是同一套逻辑，只是：
 *   - 存储：localStorage（APP 是单机，一个设备一个用户）
 *   - 调用：前端直连智谱（APP 本来就没有后端）
 *
 * 这是「了解人」的底层逻辑，用户完全无感：不弹提示、不进消息列表、失败无声。
 *
 * 读三件事：
 *   1) 归因方向：他把原因放在外面（怪对方）还是里面（怪自己）
 *   2) 依恋倾向：他更怕失去（焦虑）还是更怕靠近（回避）
 *   3) 冲突反应：不舒服时是批评、防御、轻蔑，还是回避
 * 攒够 5 段出画像，之后每次对话注入 system prompt，只改「怎么说」。
 * ------------------------------------------------------------------
 */
(function () {
  'use strict';

  var STORE_KEY = 'zy_profile_v1';
  var SIGNAL_MODEL = 'glm-4-flash';
  var SIGNAL_MAX = 30;
  var MIN_SIGNALS = 5;
  var MIN_HIT = 3;
  var MIN_RATIO = 0.45;
  var SCAN_COOLDOWN = 90 * 1000;

  var SIGNAL_PROMPT = [
    '你是沟通状态分析助手。下面是一位用户在情感咨询里刚发的一段原话。',
    '从这段话读他此刻的状态，三项各选一个值。',
    '',
    '1. attribution —— 他把问题的原因放在哪',
    '   ext  外面：怪对方、怪时机。例："她就是不想理我"',
    '   int  里面：怪自己、觉得自己不行。例："是不是我说错话了"',
    '   mix  两边都有',
    '   none 只是陈述事实、纯提问、打招呼',
    '',
    '2. attachment —— 他更怕什么',
    '   anxious  怕失去：反复确认、追问、怕她走。例："她是不是不喜欢我了"',
    '   avoidant 怕靠近：想退、嫌麻烦。例："算了不聊了"',
    '   secure   稳：能接受不确定。例："她忙就先不打扰"',
    '   none     看不出',
    '',
    '3. conflict —— 他觉得不舒服或被质疑时怎么处理',
    '   criticism 批评对方。例："她总是这样"',
    '   defense   解释自己没错、强调本意。例："我不是那个意思"',
    '   contempt  贬低嘲讽。例："女人都这样"',
    '   stonewall 冷处理、"随便吧"',
    '   healthy   就事论事',
    '   none      看不出',
    '',
    '判断要求：',
    '- 这段话里只要有明显的怪对方、怪自己、怕失去、想退、批评、解释、嘲讽、冷处理的痕迹，就按最接近的那一项填。',
    '- 不要因为"也许还有别的解释"就填 none。宁可判一项，也不要三项全填 none。',
    '- 只有纯陈述事实、纯提问、纯打招呼，才填 none。',
    '- "她总是/从来不/每次都/说好的事不算数"这类把对方行为说成绝对的，conflict 填 criticism。',
    '- 只读这段话，不推测他的职业、经历、身份。',
    '',
    '只输出一个 JSON 对象，不要 markdown，不要解释。',
    '下面只是格式示例，值必须按原话重新判断：',
    '{"attribution":"ext","attribution_quote":"她就是不想理我","attachment":"none","attachment_quote":"","conflict":"none","conflict_quote":""}',
    '',
    'quote 必须是原文里原样连续的一段，不超过 20 字；填 none 的那项 quote 留空。',
    '',
    '用户原话：',
    '"""',
    '__MESSAGE__',
    '"""'
  ].join('\n');

  // 策略表：整个系统真正的价值——同一句话对不同状态的人效果相反
  var STRATEGY = {
    attribution: {
      ext: '他习惯把原因放在对方或外部。不要直接指出他的问题，也别跟着他一起怪对方——那样他会更认定自己没错。改问具体动作：「你发的那几条，哪一条是她能接住的？」让他自己找到可控的那一步。',
      int: '他容易把责任全揽到自己身上。开口先明确给一句「这不全是你的问题」，把他从自责里拉出来，然后只谈一个可以改的小点。一次给三条他会更慌。',
      mix: '他一会儿怪对方、一会儿怪自己。别急着评判谁对，先把「发生了什么」按时间顺序摆清楚，让他自己看见哪一步是他能动的。'
    },
    attachment: {
      anxious: '他怕失去，会反复确认对方态度。绝对不要说「别太主动」「冷一冷」——他会更慌。给可控的节奏：具体到什么时候发、发几条、发完去做什么。',
      avoidant: '他倾向往后退，觉得说多了没必要。不要要求他「多表达感受」。给最小动作：一句话、一个问题，做完就算完成，给他留退路。',
      secure: '他状态比较稳，能接受不确定。可以直接给判断和不同视角，不用太多铺垫和安抚。'
    },
    conflict: {
      criticism: '他容易挑对方的不是。不要附和着一起批评，也不要反过来教育他。把「她这个人怎样」转成「这件事是怎么发生的」。',
      defense: '被质疑时他会先解释自己没错。先认同他的出发点（「你想的是……对吧」），再给另一个角度。一上来就否定，他会全程在辩护。',
      contempt: '他会用贬低、嘲讽的方式说对方。不要接这个话茬，也不要正面批评他。把注意力拉回具体的一件事上，只谈这件事怎么处理。',
      stonewall: '他会沉默、回避、不想谈。不要追问「你到底怎么想」。给一个低压力的小步骤：「下次她这样说，你回这一句就行。」',
      healthy: '他能就事论事，可以直接谈问题本身，不用绕。'
    }
  };

  var LABEL = {
    attribution: { ext: '偏外归因', int: '偏内归因', mix: '内外摆动' },
    attachment: { anxious: '偏焦虑', avoidant: '偏回避', secure: '偏安全' },
    conflict: { criticism: '偏批评', defense: '偏防御', contempt: '偏轻蔑', stonewall: '偏回避冲突', healthy: '能就事论事' }
  };

  // ---------- 工具 ----------
  function clip(s, n) {
    var t = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    return t.length > n ? t.slice(0, n) : t;
  }

  function pickJson(text) {
    if (!text) return null;
    var t = String(text).trim();
    var fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) t = fence[1].trim();
    var s = t.indexOf('{');
    var e = t.lastIndexOf('}');
    if (s === -1 || e === -1 || e <= s) return null;
    try {
      return JSON.parse(t.slice(s, e + 1));
    } catch (err) {
      return null;
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { signals: [], portrait: null, lastScanAt: 0 };
      var o = JSON.parse(raw);
      return {
        signals: Array.isArray(o.signals) ? o.signals : [],
        portrait: o.portrait || null,
        lastScanAt: o.lastScanAt || 0
      };
    } catch (e) {
      return { signals: [], portrait: null, lastScanAt: 0 };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function apiKey() {
    try {
      if (typeof window.getApiKey === 'function') return window.getApiKey();
      if (typeof getApiKey === 'function') return getApiKey();
    } catch (e) {}
    return '';
  }

  // ---------- 1. 提取信号 ----------
  function extractSignals(message) {
    var text = clip(message, 800);
    if (text.length < 4) return Promise.resolve(null);
    var key = apiKey();
    if (!key) return Promise.resolve(null);

    var prompt = SIGNAL_PROMPT.replace('__MESSAGE__', text);

    return fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: SIGNAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 220
      })
    }).then(function (r) { return r.json(); }).then(function (data) {
      var raw = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
      var j = pickJson(raw);
      if (!j) return null;

      var okAttr = ['ext', 'int', 'mix', 'none'];
      var okAttach = ['anxious', 'avoidant', 'secure', 'none'];
      var okConf = ['criticism', 'defense', 'contempt', 'stonewall', 'healthy', 'none'];

      var signal = {
        at: Date.now(),
        attr: okAttr.indexOf(j.attribution) !== -1 ? j.attribution : 'none',
        attr_q: clip(j.attribution_quote, 24),
        attach: okAttach.indexOf(j.attachment) !== -1 ? j.attachment : 'none',
        attach_q: clip(j.attachment_quote, 24),
        conf: okConf.indexOf(j.conflict) !== -1 ? j.conflict : 'none',
        conf_q: clip(j.conflict_quote, 24)
      };
      if (signal.attr === 'none' && signal.attach === 'none' && signal.conf === 'none') return null;
      return signal;
    }).catch(function () { return null; });
  }

  // ---------- 2. 统计成画像 ----------
  function tally(signals, key) {
    var map = {};
    var total = 0;
    for (var i = 0; i < signals.length; i++) {
      var v = signals[i][key];
      if (!v || v === 'none') continue;
      map[v] = (map[v] || 0) + 1;
      total++;
    }
    if (!total) return null;
    var best = null;
    var bestN = 0;
    Object.keys(map).forEach(function (k) {
      if (map[k] > bestN) { bestN = map[k]; best = k; }
    });
    if (!best) return null;
    var ratio = bestN / total;
    return {
      key: best,
      n: bestN,
      total: total,
      ratio: ratio,
      solid: bestN >= MIN_HIT && ratio >= MIN_RATIO
    };
  }

  function buildPortrait(signals) {
    if (!Array.isArray(signals) || signals.length < MIN_SIGNALS) {
      return { ready: false, n: signals ? signals.length : 0 };
    }
    var recent = signals.slice(-20);
    var a = tally(recent, 'attr');
    var b = tally(recent, 'attach');
    var c = tally(recent, 'conf');
    var dims = [];
    if (a && a.solid) dims.push({ dim: 'attribution', key: a.key, label: LABEL.attribution[a.key], n: a.n, total: a.total, strategy: STRATEGY.attribution[a.key] });
    if (b && b.solid) dims.push({ dim: 'attachment', key: b.key, label: LABEL.attachment[b.key], n: b.n, total: b.total, strategy: STRATEGY.attachment[b.key] });
    if (c && c.solid) dims.push({ dim: 'conflict', key: c.key, label: LABEL.conflict[c.key], n: c.n, total: c.total, strategy: STRATEGY.conflict[c.key] });
    return { ready: dims.length > 0, n: recent.length, dims: dims, updatedAt: Date.now() };
  }

  // ---------- 3. 拼成注入 system prompt 的一段 ----------
  function formatNote(portrait) {
    if (!portrait || !portrait.ready || !portrait.dims || !portrait.dims.length) return '';
    var lines = ['', '', '【这位用户的当前状态（内部参考，绝对不要说出来）】'];
    lines.push('以下不是他自己说的，是从他最近 ' + portrait.n + ' 段真实对话里读出来的——他实际怎么说话。');
    for (var i = 0; i < portrait.dims.length; i++) {
      var d = portrait.dims[i];
      lines.push('- ' + d.label + '（近 ' + d.total + ' 次里 ' + d.n + ' 次）：' + d.strategy);
    }
    lines.push('');
    lines.push('【和上面测评画像的关系】');
    lines.push('测评（他自己填的题）是他「觉得自己是什么样」，上面这些是他「实际怎么说话」。');
    lines.push('两边不一致时，以实际行为为准。但不要提这件事，也不要当面点破他「你说的和做的不一样」。');
    lines.push('');
    lines.push('【使用原则】');
    lines.push('1. 这些只是给你自己看的。不要说出「你是XX型」「你属于XX」，不要提「归因」「依恋」「防御」这些词。');
    lines.push('2. 只调整你的说法方式和给建议的顺序，不要改变你的角色、语气和长度习惯。');
    lines.push('3. 如果这一轮他说的话明显和上面不符，以他这一轮说的为准，不要硬套。');
    lines.push('4. 不要因为上面的判断就去追问、试探、验证。照常聊。');
    return lines.join('\n');
  }

  // ---------- 4. 对外：扫一次（静默） ----------
  function scan(message) {
    var t = (message || '').trim();
    if (t.length < 15) return Promise.resolve(false);

    var state = load();
    if (state.lastScanAt && Date.now() - state.lastScanAt < SCAN_COOLDOWN) {
      return Promise.resolve(false);
    }
    state.lastScanAt = Date.now();
    save(state);

    return extractSignals(t).then(function (signal) {
      if (!signal) return false;
      var s = load();
      var signals = s.signals.slice();
      signals.push(signal);
      if (signals.length > SIGNAL_MAX) signals = signals.slice(-SIGNAL_MAX);
      var portrait = buildPortrait(signals);
      save({ signals: signals, portrait: portrait, lastScanAt: Date.now() });
      return true;
    }).catch(function () { return false; });
  }

  // ---------- 5. 对外：取注入片段 ----------
  function getNote() {
    try {
      var state = load();
      return formatNote(state.portrait);
    } catch (e) {
      return '';
    }
  }

  // ---------- 6. 对外：清空（设置页/调试用） ----------
  function clear() {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch (e) {}
  }

  window.ZYProfile = {
    scan: scan,
    getNote: getNote,
    clear: clear,
    buildPortrait: buildPortrait,
    formatNote: formatNote
  };
})();
