/* ============================================================
 * 知隅 · 聊天解读（APP 侧 v2.9）
 * 和小程序 1.1.8 同一套逻辑、同一套 prompt：
 *   1) 一次最多 9 张截图，逐张转成文字（glm-4v-flash，免费）
 *   2) 只分析"这一段"，不下结论，末尾必须反问把情况问清楚
 *   3) 每次识别的记录自动攒着，攒够两段可以「看一遍」做关系复盘
 * APP 是 H5 直连 API，没有云函数，所以图片压缩在本地做
 * ============================================================ */
(function () {
  var API = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  var OCR_MODEL = 'glm-4v-flash';
  var SHOT_MODEL = 'glm-4.5-flash';
  var ARCHIVE_MODEL = 'glm-4.5-flash';

  var IMG_MAX = 9;
  var BATCH = 3;
  var ARCHIVE_KEY = 'zy_chat_archive';
  var ARCHIVE_MAX_SEG = 40;
  var ARCHIVE_MAX_CHARS = 30000;

  /* ---------- prompt：与云端 toolPrompts.js 保持一致 ---------- */
  var RED_LINES =
    '\n【口径与红线】\n' +
    '1. 你是「知隅」的亲密关系沟通参考工具，所有建议仅作参考，最终由用户自己判断决定。\n' +
    '2. 反对PUA、情感操控、物化对方、欺骗与套路。\n' +
    '3. 尊重对方的边界、节奏与知情同意；不鼓励越界纠缠。\n' +
    '4. 语气平等真诚，像一个靠谱的朋友。\n' +
    '5. 涉及违法、自残、伤害他人等情况，明确拒绝并建议寻求现实中的专业帮助。\n';

  var OCR_PROMPT =
    '这是一张聊天截图，可能来自微信、探探、陌陌、Soul、QQ 或其他聊天软件。\n' +
    '任务：把图里能看到的对话，按从上到下的顺序原样转写成文字。\n' +
    '格式要求：\n' +
    '- 左侧（灰色/白色气泡，对方发的）写成「对方：内容」\n' +
    '- 右侧（绿色/蓝色气泡，本人发的）写成「我：内容」\n' +
    '- 看不清或没截全的字用「…」代替，不要猜\n' +
    '- 不要写对方的备注名或昵称，只写「对方」两个字，免得后面分不清谁是谁\n' +
    '- 有时间、日期，单独用一行【时间】标出来\n' +
    '- 只转写，不分析、不解释、不加任何评论\n' +
    '如果图里根本没有对话内容（比如截错了界面），只输出四个字母：NO_CHAT';

  var SHOT_PROMPT =
    '你是知隅的「聊天分析」顾问。用户会发来一段聊天记录（截图已转成文字，或直接粘贴）。\n' +
    '如果开头写着「下面是用户发来的聊天截图，系统已经把图里的对话转成文字」，说明图已经识别好了，\n' +
    '直接看下面的对话，不要再问他要截图。如果他说"我发了截图"但手上没有对话内容，\n' +
    '说明这次图没传上来：让他重发，或者长按消息多选复制成文字发过来。\n' +
    '记录里「我：」是用户本人，「对方：」是他聊的那个人，不要搞反。\n' +
    '核心原则：你手上的永远只是"一段"，不是"全部"。所以——\n' +
    '- 只分析这一段本身，不推断整段关系，不判断她是个什么样的人。\n' +
    '- 记录里没有的，不猜。想说"她可能……"，必须先引原句。\n' +
    '- 不下"她是不是在吊着你""她是不是不喜欢你"这类结论。你判断不了，也不该替人下这种定论。\n' +
    '输出按这三块，不要多：\n' +
    '【这一段在说什么】\n' +
    '客观描述 2-3 句：谁在说什么事，她的回应是什么类型（接话往下问 / 只回应不展开 / 转移话题 /\n' +
    '隔很久才回 / 只回表情）。只描述，不评价。\n' +
    '【能看出什么、看不出什么】\n' +
    '- 能看出：最多两条，每条都要引原句（"她说……"，"你说……"）。\n' +
    '- 看不出：明说"这一段看不出她的整体态度。要看她是不是一直这样，得看更多段"。\n' +
    '【想继续聊，这几种接法可以挑】\n' +
    '给 2-3 条可以直接发的话，风格不同。是"你可以挑"，不是"你应该这么回"。\n' +
    '用户可能会接着补充信息（这段是哪天的、她平时主不主动、见过面没、你什么感受）。\n' +
    '这些补充会写在消息开头的「（我补充的信息，优先看这段）」里，那是最重要的，先看那段。\n' +
    '补充了就必须用上：\n' +
    '- 他已经回答过的，不要再问第二遍。\n' +
    '- 补充的信息够判断了，就直接归纳事实，别继续问；不够才继续问，一次只问还缺的那几条。\n' +
    '- 归纳事实可以（"这三点放在一起，目前是你在单方面推进"），\n' +
    '  但不要下人格结论（"她对你没兴趣"），也不要给"该不该继续"的建议。\n' +
    '最后只问 2-3 个问题（这块不能省，但只问 2-3 个），一行一个，用「-」开头。\n' +
    '从这几类里挑最缺的，不要全问：这段是哪天的事、后面她回了吗、她平时会主动找你吗、\n' +
    '你们见过面吗、见面时她什么状态、这些聊天里哪一句让你最不舒服。\n' +
    '问题要具体，别问"你觉得她怎么样""你对关系有什么期待"这种。\n' +
    '如果对话里出现控制、贬低、冷暴力、PUA 等信号，单独提出来，说清是什么。\n' +
    '正常对话不要硬找问题。不评判谁对谁错，不劝分也不劝和。' + RED_LINES;

  var ARCHIVE_PROMPT =
    '你是知隅的「关系复盘」顾问。用户攒了几段聊天记录，让你看一遍。\n' +
    '记录开头有【第 N 段·日期】的标记。如果段号和对话里的实际日期对不上\n' +
    '（他可能是后来才补发早期的记录），按对话里的日期排。全文用"你"称呼他。\n' +
    '核心原则：你看到的仍然是片段，不是全部。所以——\n' +
    '- 只陈述记录里真实出现的东西，不加推断。\n' +
    '- 不下结论。不说"她在降温""她对你没兴趣""她可能在养鱼"这类判断。\n' +
    '- 不给"要不要继续"的建议。这不是你能替他决定的事。\n' +
    '输出按这四块：\n' +
    '【记录里有什么】\n' +
    '客观列出：覆盖哪几天、共几段、每段大致聊了什么（一行一段）。\n' +
    '再说清缺什么：她主动找你的有没有、你约她她答应的有没有、她拒绝的有没有。\n' +
    '（只按记录里真实出现过的写，不许凭"应该会有"填。）\n' +
    '【行为上的变化，只讲事实】\n' +
    '拿最早的一段和最近的一段对比，四项各一行：\n' +
    '- 谁先开口：最早……，最近……\n' +
    '- 回的长度：最早……，最近……\n' +
    '- 会不会主动接话往下问：最早……，最近……\n' +
    '- 约见面时怎么回应：最早……，最近……\n' +
    '每项只写"最早是……，最近是……"，不写"这说明她……"。\n' +
    '某一项记录里没有，就写"记录里看不出来"，不要拿不相关的话硬凑。\n' +
    '【这些放在一起，可能是什么情况】\n' +
    '给 2-3 种可能，不是一种。每种都说清依据哪几条、可信度高低（高/中/低）。\n' +
    '例："可能是她最近确实忙（依据：她提过加班）；也可能是兴趣在下降（依据：三次邀约都没给具体时间）。\n' +
    '两种都可能，光看记录分不出来。"\n' +
    '【接下来你可以做什么】\n' +
    '2-3 条具体动作，重点放在"用一件事怎么验证"，而不是"你应该怎么做人"。\n' +
    '最后必须问 2-3 个问题，把缺的补上，例如：\n' +
    '你们见过面吗、见面时她什么状态（话多吗、会看手机吗、会主动找话题吗）、\n' +
    '被推掉之后她有没有主动找过你、你跟她相处时是什么感觉（放松 / 紧张 / 一直在猜）。\n' +
    '红线：\n' +
    '- 不贴标签，不下人格结论。不说"她是渣女""海王""在养鱼"。\n' +
    '- 不给"分/不分""继续/放弃"的建议。\n' +
    '- 每条判断都要有原句或具体行为支撑，没有就写"记录里看不出来"。\n' +
    '- 不确定的地方用"可能"，并且尽量给两种以上解释。\n' +
    '- 他自己说的话（"她最近很冷淡"）只当背景，不作判断依据。判断只看对话原文。\n' +
    '  如果他的描述和原文对不上，直接指出来。\n' +
    '- 出现控制、贬低、冷暴力、PUA、要钱、威胁等信号，单独提出来，建议保护自己。' + RED_LINES;

  /* ---------- 小工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function toast(t) {
    if (window.wx && wx.showToast) wx.showToast({ title: t });
  }

  function loadArchive() {
    try {
      var a = window.wx ? wx.getStorageSync(ARCHIVE_KEY) : null;
      if (a && Array.isArray(a.rounds)) return a;
    } catch (e) {}
    return { rounds: [] };
  }
  function saveArchive(a) {
    try { if (window.wx) wx.setStorageSync(ARCHIVE_KEY, a); } catch (e) {}
  }
  function archiveCount() { return loadArchive().rounds.length; }

  /* ---------- 图片压缩（尽量小，别把请求体撑爆） ---------- */
  function compress(file, maxEdge, quality) {
    if (typeof compressImageFile === 'function') return compressImageFile(file, maxEdge, quality);
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onerror = reject;
      r.onload = function (ev) {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var w = img.width, h = img.height;
          if (Math.max(w, h) > maxEdge) {
            var s = maxEdge / Math.max(w, h);
            w = Math.round(w * s); h = Math.round(h * s);
          }
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality));
        };
        img.src = ev.target.result;
      };
      r.readAsDataURL(file);
    });
  }

  /* ---------- 调模型 ---------- */
  function post(body) {
    return fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (typeof getApiKey === 'function' ? getApiKey() : '')
      },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  function ocrOne(dataUrl, idx) {
    return post({
      model: OCR_MODEL,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: OCR_PROMPT }
        ]
      }],
      temperature: 0.2,
      max_tokens: 1024
    }).then(function (d) {
      var t = '';
      if (d && d.choices && d.choices[0] && d.choices[0].message) {
        t = (d.choices[0].message.content || '').trim();
      }
      if (!t) return '';
      // 模型不一定会严格输出 NO_CHAT，也会说"图中没有对话内容"，一并当失败
      if (t.length < 60 && /NO_CHAT|没有对话|不是对话|无法识别|没有聊天/.test(t)) return '';
      return t;
    }).catch(function () { return ''; });
  }

  function analyze(text, supplement) {
    var payload = '';
    if (supplement) {
      payload += '（我补充的信息，优先看这段）\n' + supplement + '\n\n';
    }
    payload += '下面是用户发来的聊天截图，系统已经把图里的对话转成文字：\n\n' + text;

    return post({
      model: SHOT_MODEL,
      messages: [
        { role: 'system', content: SHOT_PROMPT },
        { role: 'user', content: payload }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      thinking: { type: 'disabled' }
    }).then(function (d) {
      if (d && d.choices && d.choices[0] && d.choices[0].message) {
        return (d.choices[0].message.content || '').trim();
      }
      return '';
    });
  }

  function archiveReview(text) {
    return post({
      model: ARCHIVE_MODEL,
      messages: [
        { role: 'system', content: ARCHIVE_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.6,
      max_tokens: 4000,
      thinking: { type: 'disabled' }
    }).then(function (d) {
      if (d && d.choices && d.choices[0] && d.choices[0].message) {
        return (d.choices[0].message.content || '').trim();
      }
      return '';
    });
  }

  /* ---------- 渲染 ---------- */
  function sp() {
    var isFemale = (typeof chatState !== 'undefined' && chatState.isFemale);
    return isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
  }

  function appendUser(text) {
    var box = $('tool-messages');
    if (!box) return;
    box.insertAdjacentHTML('beforeend',
      '<div class="message user"><div class="message-bubble">' + esc(text).replace(/\n/g, '<br>') + '</div></div>');
    scrollBottom();
  }

  function appendAI(html) {
    var box = $('tool-messages');
    if (!box) return;
    var s = sp();
    box.insertAdjacentHTML('beforeend',
      renderMessageHtml('ai', html, s.name, s.avatarUrl, false));
    scrollBottom();
  }

  function appendTip(text) {
    var box = $('tool-messages');
    if (!box) return;
    box.insertAdjacentHTML('beforeend', '<div class="ca-tipline">' + esc(text) + '</div>');
    scrollBottom();
  }

  function scrollBottom() {
    var wrap = document.querySelector('#page-tool .page-content');
    if (wrap) wrap.scrollTop = wrap.scrollHeight;
  }

  function appendTyping(label) {
    var box = $('tool-messages');
    if (!box) return;
    var s = sp();
    var el = document.createElement('div');
    el.className = 'message ai';
    el.id = 'ca-typing';
    el.innerHTML = '<img class="message-avatar" src="' + s.avatarUrl + '">'
      + '<div class="message-body"><div class="message-name">' + s.name + '</div>'
      + '<div class="message-bubble typing-indicator">'
      + '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>'
      + '</div></div>';
    box.appendChild(el);
    scrollBottom();
  }
  function removeTyping() {
    var el = $('ca-typing');
    if (el) el.remove();
  }

  /* ---------- 落地页 ---------- */
  function introHtml() {
    var n = archiveCount();
    var archCard = '';
    if (n > 0) {
      archCard = '<div class="ca-card ca-arch">'
        + '<div class="ca-arch-main" onclick="caReview()">'
        + '<div class="ca-arch-l">'
        + '<div class="ca-arch-t">已经攒了 ' + n + ' 段对话</div>'
        + '<div class="ca-arch-s">'
        + (n > 3
            ? '让我从头看一遍，只讲记录里的事实，给你几种可能'
            : (n > 1 ? '段数越多越准，最好把刚开始聊的那几天也补进来' : '再发一段。把刚开始聊的那几天也发进来，有对比才看得出变化'))
        + '</div></div>'
        + '<span class="ca-arch-go' + (n > 1 ? ' on' : '') + '">看一遍 ›</span>'
        + '</div>'
        + '<div class="ca-arch-clear" onclick="caClearArchive(event)">清空</div>'
        + '</div>';
    }

    return '<div class="ca-card ca-what">'
      + '<div class="ca-card-title">只分析这一段，不替你下结论</div>'
      + '<div class="ca-card-body">'
      + '我只说这一段能看到什么、看不到什么，再问你几个问题把情况问清楚。'
      + '判断一个人怎么样、要不要继续，这些我看不全，也不该替你定。'
      + '</div>'
      + '</div>'

      + '<div class="ca-card ca-how">'
      + '<div class="ca-card-title">怎么发给我</div>'
      + '<div class="ca-step"><span class="ca-no">1</span><span>发截图，一次最多 ' + IMG_MAX + ' 张（相册里可以多选）</span></div>'
      + '<div class="ca-step"><span class="ca-no">2</span><span>或者长按消息「多选」→「合并转发」→ 复制成文字粘过来</span></div>'
      + '<div class="ca-step"><span class="ca-no">3</span><span>每次识别的记录会自动攒着，攒够两段能「看一遍」</span></div>'
      + '<div class="ca-btns">'
      + '<button class="ca-btn ca-btn-main" onclick="caPick()">选截图（最多 ' + IMG_MAX + ' 张）</button>'
      + '<button class="ca-btn" onclick="caPaste()">粘贴文字</button>'
      + '</div>'
      + '<div class="ca-tip">嫌麻烦就直接截图发我，我能直接看图。</div>'
      + '</div>'

      + archCard;
  }

  window.showChatAnalysisIntro = function () {
    var box = $('tool-messages');
    if (!box) return;
    box.innerHTML = introHtml();
  };

  window.caPaste = function () {
    var input = $('tool-input');
    if (input) {
      input.placeholder = '粘贴聊天记录，长点也没事…';
      input.focus();
    }
    appendTip('粘过来吧，长点也没事。发之前可以在开头补一句：这段是哪天的、她平时主动吗、你们见过面没。');
  };

  /* ---------- 选图 → 转写 → 分析 ---------- */
  var busy = false;

  window.caPick = function () {
    if (busy) { toast('还在看上一批，稍等'); return; }
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    input.onchange = function (e) {
      var files = Array.prototype.slice.call(e.target.files || []);
      if (!files.length) return;
      if (files.length > IMG_MAX) {
        toast('一次最多 ' + IMG_MAX + ' 张，多的分两次发');
        files = files.slice(0, IMG_MAX);
      }
      runBatch(files);
    };
    document.body.appendChild(input);
    input.click();
    setTimeout(function () { if (input.parentNode) input.parentNode.removeChild(input); }, 60000);
  };

  function runBatch(files) {
    busy = true;
    appendUser('［发来 ' + files.length + ' 张聊天截图］');

    var box = $('tool-messages');
    if (box) {
      var s = sp();
      box.insertAdjacentHTML('beforeend',
        '<div class="ca-progress" id="ca-progress">'
        + '<div class="ca-progress-t" id="ca-progress-t">正在识别 0/' + files.length + '…</div>'
        + '<div class="ca-progress-bar"><div class="ca-progress-fill" id="ca-progress-fill" style="width:0%"></div></div>'
        + '</div>');
      scrollBottom();
    }

    // 先压缩（多张串行压，避免同时解码把内存打满）
    var dataUrls = [];
    var idx = 0;
    function nextCompress() {
      if (idx >= files.length) return startOCR();
      compress(files[idx], 1000, 0.72).then(function (u) {
        dataUrls.push(u);
      }).catch(function () {}).then(function () {
        idx++;
        nextCompress();
      });
    }
    nextCompress();

    function startOCR() {
      if (!dataUrls.length) {
        removeProgress();
        appendAI('这几张图我这边没读出来，可能是格式问题。你换个图试试，或者直接把文字复制过来发我。');
        busy = false;
        return;
      }

      var parts = [];
      var done = 0;
      var b = 0;

      function nextBatch() {
        if (b >= dataUrls.length) return finish();
        var slice = dataUrls.slice(b, b + BATCH);
        var startIdx = b;
        b += BATCH;
        Promise.all(slice.map(function (u, j) {
          return ocrOne(u, startIdx + j).then(function (t) {
            done++;
            updateProgress(done, dataUrls.length);
            return t;
          });
        })).then(function (texts) {
          texts.forEach(function (t) { if (t) parts.push(t); });
          nextBatch();
        }).catch(function () { nextBatch(); });
      }

      function finish() {
        removeProgress();
        if (!parts.length) {
          appendAI('这几张图里我没读到对话内容。是不是截到别的界面了？再挑几张聊天界面的试试。');
          busy = false;
          return;
        }
        var transcript = parts.join('\n\n');
        pushArchive(transcript);

        appendTyping();
        analyze(transcript, '').then(function (reply) {
          removeTyping();
          if (reply) {
            appendAI(reply);
            try { if (window.wx) wx.setStorageSync('zy_last_shot', transcript); } catch (e) {}
          } else {
            appendAI('AI 开了点小差，等一下再发一次？');
          }
          refreshIntroArch();
          busy = false;
        }).catch(function () {
          removeTyping();
          appendAI('网络好像有点问题，等信号好一点再试？');
          busy = false;
        });
      }

      nextBatch();
    }
  }

  function updateProgress(done, total) {
    var t = $('ca-progress-t');
    var f = $('ca-progress-fill');
    if (t) t.textContent = '正在识别 ' + done + '/' + total + '…';
    if (f) f.style.width = Math.round(done / total * 100) + '%';
  }
  function removeProgress() {
    var el = $('ca-progress');
    if (el) el.remove();
  }

  /* ---------- 存档 ---------- */
  function pushArchive(text) {
    var t = (text || '').trim();
    if (!t) return;
    var a = loadArchive();
    a.rounds.push({ at: Date.now(), text: t });
    while (a.rounds.length > ARCHIVE_MAX_SEG) a.rounds.shift();
    var total = 0;
    for (var i = 0; i < a.rounds.length; i++) total += a.rounds[i].text.length;
    while (total > ARCHIVE_MAX_CHARS && a.rounds.length > 1) {
      total -= a.rounds[0].text.length;
      a.rounds.shift();
    }
    saveArchive(a);
  }

  // 分析完把落地页的「攒了几段」刷新一下（如果用户滑回顶部还能看到新的）
  function refreshIntroArch() {
    // 不重绘整页，避免把刚出的结果冲掉；只更新可能存在的数字
    var el = document.querySelector('.ca-arch-t');
    if (el) el.textContent = '已经攒了 ' + archiveCount() + ' 段对话';
  }

  /* ---------- 关系复盘 ---------- */
  var reviewing = false;

  window.caReview = function () {
    if (reviewing) return;
    var a = loadArchive();
    if (!a.rounds.length) { toast('先发几张聊天截图攒着'); return; }
    if (a.rounds.length < 2) { toast('再攒一段，一段看不出变化'); return; }

    reviewing = true;
    appendUser('［从头看一遍这段关系：共 ' + a.rounds.length + ' 段记录］');

    var segs = a.rounds.slice(-ARCHIVE_MAX_SEG);
    var total = 0;
    var picked = [];
    for (var i = segs.length - 1; i >= 0; i--) {
      var t = String((segs[i] && segs[i].text) || '').trim();
      if (!t) continue;
      if (total + t.length > 18000) break;
      total += t.length;
      picked.unshift(segs[i]);
    }
    if (!picked.length) { toast('攒的记录读不出来，重新发几张截图'); reviewing = false; return; }

    var lines = [];
    picked.forEach(function (x, k) {
      var d = x.at ? new Date(x.at) : null;
      var tag = '第 ' + (k + 1) + ' 段';
      if (d) tag += '·' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
      lines.push('【' + tag + '】\n' + String(x.text).trim());
    });
    var body = lines.join('\n\n');

    appendTyping();
    archiveReview(body).then(function (reply) {
      removeTyping();
      appendAI(reply || '这次没看成，等会儿再试一次？');
      reviewing = false;
    }).catch(function () {
      removeTyping();
      appendAI('网络好像有点问题，等信号好一点再试？');
      reviewing = false;
    });
  };

  window.caClearArchive = function (e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!window.wx || !wx.showModal) return;
    wx.showModal({
      title: '清空攒下的记录？',
      content: '清掉之后要重新发截图。已经聊过的分析还在，不影响。',
      success: function (res) {
        if (!res.confirm) return;
        saveArchive({ rounds: [] });
        var box = $('tool-messages');
        if (box) box.innerHTML = introHtml();
        toast('已清空');
      }
    });
  };

  /* ---------- 追问：带上一轮记录，补充信息放最前 ---------- */
  var _origSend = window.sendToolMessage;
  window.sendToolMessage = function () {
    if (typeof currentToolId === 'undefined' || currentToolId !== 'chatanalysis') {
      return _origSend ? _origSend.apply(null, arguments) : undefined;
    }

    var input = $('tool-input');
    if (!input) return;
    var content = input.value.trim();
    if (!content) return;
    input.value = '';
    if (typeof autoResize === 'function') autoResize(input);

    var lastShot = '';
    try { lastShot = (window.wx && wx.getStorageSync('zy_last_shot')) || ''; } catch (e) {}

    var payload = content;
    if (lastShot) {
      var room = 5200 - content.length;
      if (room > 200) {
        payload = '（我补充的信息，优先看这段）\n' + content
          + '\n\n（上一轮发来的聊天记录，供参考）\n' + lastShot.slice(0, room);
      }
    }

    appendUser(content);

    return post({
      model: SHOT_MODEL,
      messages: [
        { role: 'system', content: SHOT_PROMPT },
        { role: 'user', content: payload }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      thinking: { type: 'disabled' }
    }).then(function (d) {
      var reply = (d && d.choices && d.choices[0] && d.choices[0].message)
        ? (d.choices[0].message.content || '').trim() : '';
      appendAI(reply || '我想了想，这个还得再问问你才知道。能再说说当时的情况吗？');
    }).catch(function () {
      appendAI('网络有点小问题，没发出去。再点一次试试？');
    });
  };
})();
