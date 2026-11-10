/* ============================================================
 * 知隅 · 话术库（APP 侧）
 * 和小程序 scripts 页同一份数据、同一套搜索逻辑
 * 进去就有东西，搜一下就有答案；每条都能复制，也能交给 AI 改成自己的话
 * ============================================================ */
(function () {
  var LIB = (typeof window !== 'undefined' && window.ZY_SCRIPTS) || { CATS: [], DATA: [] };
  var DATA = LIB.DATA || [];
  var CATS = ['全部'].concat(LIB.CATS || []);

  var PAGE_SIZE = 15;
  var HOT_WORDS = ['不回消息', '约不出来', '她生气了', '表白被拒', '见家长', '想挽回', '没话题', '她说做朋友'];

  // 同义词扩展：搜"不回"也能搜到"已读""不理""消失"
  var SYN = [
    ['不回', '没回', '已读', '不理', '消失', '没消息', '不回消息', '不回复', '断联', '没动静', '石沉大海'],
    // v2.9.13: 补一组「消息/回复」相关。以前搜"她不回我消息"只能命中含"不回"的，
    // 含"回复""回得慢""聊着聊着"的场景全漏掉，看着像搜不到东西。
    ['回消息', '回复', '回得慢', '秒回', '聊着聊着', '不回我', '半天没'],
    ['冷', '冷淡', '敷衍', '没兴趣', '疏远'],
    ['约', '见面', '出来', '去哪', '约她'],
    ['表白', '喜欢', '确认关系', '在一起', '心意'],
    ['分手', '离开', '结束', '分开'],
    ['道歉', '对不起', '抱歉', '认错', '低头'],
    ['生气', '不高兴', '情绪', '哄', '委屈'],
    ['家长', '父母', '爸妈', '见家长', '彩礼', '她妈', '她爸'],
    ['相亲', '介绍', '媒人', '安排'],
    ['前任', '复合', '挽回', '回来'],
    // v2.9.13: 「她说做朋友」这种整句以前只命中 1 个词，补一组朋友相关的
    ['做朋友', '当朋友', '只是朋友', '朋友', '合适的人'],
    ['异地', '距离', '远', '见不到'],
    ['拒绝', '不合适', '婉拒', '说不', '不想'],
    ['礼物', '送什么', '送礼', '送东西'],
    ['聊天', '话题', '聊什么', '冷场', '尬'],
    ['朋友圈', '动态', '发了', '发个'],
    ['忙', '没时间', '慢', '拖延', '抽不出'],
    ['生日', '纪念日', '节日'],
    ['结婚', '彩礼', '未来', '长期']
  ];

  var state = { keyword: '', cat: '全部', filtered: [], loaded: 0 };

  function hayOf(x) {
    var h = x.scene + ' ' + (x.note || '') + ' ' + x.cat;
    for (var i = 0; i < x.lines.length; i++) h += ' ' + x.lines[i].t;
    return h;
  }

  function expand(kw) {
    if (!kw || kw.length < 2) return [kw];
    var out = [kw];
    for (var i = 0; i < SYN.length; i++) {
      var g = SYN[i], hit = false;
      for (var j = 0; j < g.length; j++) {
        if (g[j].indexOf(kw) >= 0 || kw.indexOf(g[j]) >= 0) { hit = true; break; }
      }
      if (hit) {
        for (var k = 0; k < g.length; k++) {
          if (out.indexOf(g[k]) < 0) out.push(g[k]);
        }
      }
    }
    return out;
  }

  // 长句搜不到时的模糊匹配：按两字片段命中数量打分
  function fuzzy(kw, cat) {
    var grams = [];
    for (var i = 0; i < kw.length - 1; i++) grams.push(kw.substr(i, 2));
    if (!grams.length) return [];
    var scored = [];
    for (var n = 0; n < DATA.length; n++) {
      var x = DATA[n];
      if (cat !== '全部' && x.cat !== cat) continue;
      var h = hayOf(x), c = 0;
      for (var g = 0; g < grams.length; g++) {
        if (h.indexOf(grams[g]) >= 0) c++;
      }
      if (c >= 2) scored.push({ x: x, c: c });
    }
    scored.sort(function (a, b) { return b.c - a.c; });
    return scored.map(function (s) { return s.x; });
  }

  function match(kw, cat) {
    var kws = kw ? expand(kw) : [];
    return DATA.filter(function (x) {
      if (cat !== '全部' && x.cat !== cat) return false;
      if (!kw) return true;
      var hay = hayOf(x);
      for (var j = 0; j < kws.length; j++) {
        if (hay.indexOf(kws[j]) >= 0) return true;
      }
      return false;
    });
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  /* ---------- 渲染 ---------- */
  function renderCats() {
    var box = document.getElementById('sc-cats');
    if (!box) return;
    box.innerHTML = CATS.map(function (c) {
      return '<span class="sc-cat' + (c === state.cat ? ' on' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</span>';
    }).join('');
  }

  function renderHot() {
    var box = document.getElementById('sc-hot');
    if (!box) return;
    if (state.keyword) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    box.innerHTML = '<span class="sc-hot-t">常搜</span>' + HOT_WORDS.map(function (w) {
      return '<span class="sc-hot-i" data-w="' + esc(w) + '">' + esc(w) + '</span>';
    }).join('');
  }

  function cardHtml(x) {
    var lines = x.lines.map(function (ln) {
      return '<div class="sc-line" data-t="' + esc(ln.t) + '">'
        + '<span class="sc-style">' + esc(ln.s) + '</span>'
        + '<span class="sc-text">' + esc(ln.t) + '</span>'
        + '<span class="sc-copy">复制</span>'
        + '</div>';
    }).join('');
    return '<div class="sc-card">'
      + '<div class="sc-card-head"><span class="sc-badge">' + esc(x.cat) + '</span><span class="sc-scene">' + esc(x.scene) + '</span></div>'
      + (x.note ? '<div class="sc-note">' + esc(x.note) + '</div>' : '')
      + lines
      + '<div class="sc-ask" data-scene="' + esc(x.scene) + '">让它改成我的话 ›</div>'
      + '</div>';
  }

  function renderList() {
    var box = document.getElementById('sc-list');
    if (!box) return;
    var all = state.filtered;
    var shown = all.slice(0, state.loaded);

    var html = '';
    if (all.length) html += '<div class="sc-count">共 ' + all.length + ' 个场景</div>';
    html += shown.map(cardHtml).join('');

    if (!all.length) {
      html += '<div class="sc-empty">'
        + '<div class="sc-empty-t">没搜到</div>'
        + '<div class="sc-empty-s">换个说法试试，或者直接去问 AI</div>'
        + '<div class="sc-empty-btn" data-scene="">去问 AI</div>'
        + '</div>';
    } else if (all.length > shown.length) {
      html += '<div class="sc-more" id="sc-more">往下滑，还有 ' + (all.length - shown.length) + ' 个</div>';
    } else {
      html += '<div class="sc-end">到底了 · 共 ' + all.length + ' 个场景</div>';
    }
    html += '<div style="height:40px"></div>';

    box.innerHTML = html;
    bindList(box);
  }

  function bindList(box) {
    box.querySelectorAll('.sc-line').forEach(function (el) {
      el.onclick = function () { copyText(el.getAttribute('data-t')); };
    });
    box.querySelectorAll('.sc-ask').forEach(function (el) {
      el.onclick = function () { scAsk(el.getAttribute('data-scene')); };
    });
    box.querySelectorAll('.sc-empty-btn').forEach(function (el) {
      el.onclick = function () { scAsk(''); };
    });
  }

  // v2.9.13: 相关度打分。整串命中最重，第一个扩展词次之，其余按词算。
  function scoreOf(x, kw, kws) {
    var h = hayOf(x), s = 0;
    if (kw && h.indexOf(kw) >= 0) s += 100;
    for (var i = 0; i < kws.length; i++) {
      if (kws[i] && h.indexOf(kws[i]) >= 0) s += (i === 0 ? 30 : 6);
    }
    return s;
  }

  function apply() {
    var kw = (state.keyword || '').trim();
    var cat = state.cat;
    var kws = kw ? expand(kw) : [];
    var out = match(kw, cat);

    // 整串搜不到，按片段模糊找一次
    if (!out.length && kw && kw.length >= 3) out = fuzzy(kw, cat);

    // 当前分类下搜不到，回到全库再搜一次，别让人以为没这内容
    if (!out.length && kw && cat !== '全部') {
      out = match(kw, '全部');
      if (!out.length && kw.length >= 3) out = fuzzy(kw, '全部');
      if (out.length) { state.cat = '全部'; renderCats(); }
    }

    // v2.9.13: 结果太少时补一轮模糊匹配。
    // 以前只有「一条都没搜到」才模糊找，结果搜长句只出 5、6 条，
    // 用户以为库里没东西。现在只要少于 6 条就补，宁多勿少。
    if (kw && out.length < 6) {
      var extra = fuzzy(kw, state.cat);
      for (var e = 0; e < extra.length; e++) {
        if (out.indexOf(extra[e]) < 0) out.push(extra[e]);
      }
    }

    // v2.9.13: 按相关度重排，别让最贴的那条沉在下面
    if (kw && out.length > 1) {
      var scored = out.map(function (x, i) { return { x: x, s: scoreOf(x, kw, kws), i: i }; });
      scored.sort(function (a, b) { return (b.s - a.s) || (a.i - b.i); });
      out = scored.map(function (o) { return o.x; });
    }

    state.filtered = out;
    state.loaded = Math.min(PAGE_SIZE, out.length);
    renderList();
  }

  function copyText(t) {
    if (!t) return;
    function ok() { if (window.wx && wx.showToast) wx.showToast({ title: '复制了' }); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(ok).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = t;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  /* ---------- 对外 ---------- */
  window.openScripts = function () {
    if (typeof closeDrawers === 'function') closeDrawers();
    state.keyword = '';
    state.cat = '全部';
    state.filtered = [];
    state.loaded = 0;
    var input = document.getElementById('sc-input');
    if (input) input.value = '';
    renderCats();
    renderHot();
    apply();
    if (typeof showPage === 'function') showPage('scripts');

    // 滚到底自动加载
    var wrap = document.querySelector('#page-scripts .page-content');
    if (wrap && !wrap._scBound) {
      wrap._scBound = true;
      wrap.addEventListener('scroll', function () {
        if (wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 120) scMore();
      });
    }
  };

  window.scSearch = function (v) {
    state.keyword = v || '';
    renderHot();
    var clearBtn = document.getElementById('sc-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !state.keyword);
    apply();
    // v2.9.13: 每次改关键词都回到列表顶部，不然结果在屏幕外，看着像没搜
    var wrap = document.querySelector('#page-scripts .page-content');
    if (wrap) wrap.scrollTop = 0;
  };

  // v2.9.13: 点搜索框左边那个「搜」字也能搜。
  // 以前它只是个标签，用户按下去一点反应没有，就以为搜索坏了。
  window.scFocus = function () {
    var input = document.getElementById('sc-input');
    if (input) { input.focus(); input.click(); }
    window.scSearch(input ? input.value : '');
  };

  window.scClear = function () {
    state.keyword = '';
    var input = document.getElementById('sc-input');
    if (input) { input.value = ''; input.focus(); }
    var clearBtn = document.getElementById('sc-clear');
    if (clearBtn) clearBtn.classList.add('hidden');
    renderHot();
    apply();
  };

  window.scHot = function (w) {
    state.keyword = w || '';
    state.cat = '全部';
    var input = document.getElementById('sc-input');
    if (input) input.value = state.keyword;
    var clearBtn = document.getElementById('sc-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !state.keyword);
    renderCats();
    renderHot();
    apply();
  };

  window.scCat = function (c) {
    state.cat = c || '全部';
    renderCats();
    apply();
    var wrap = document.querySelector('#page-scripts .page-content');
    if (wrap) wrap.scrollTop = 0;
  };

  window.scMore = function () {
    if (state.loaded >= state.filtered.length) return;
    state.loaded = Math.min(state.loaded + PAGE_SIZE, state.filtered.length);
    renderList();
  };

  // 交给 AI 改成自己的话：跳到「聊天急救」并把场景带上
  window.scAsk = function (scene) {
    if (typeof useTool === 'function') useTool('quickreply');
    var q = scene ? ('这个场景怎么回：' + scene + '。') : '';
    var input = document.getElementById('tool-input');
    if (input && q) {
      input.value = q;
      if (typeof autoResize === 'function') autoResize(input);
      input.focus();
    }
  };

  // 事件委托：分类 / 常搜词
  document.addEventListener('click', function (e) {
    var cat = e.target.closest && e.target.closest('#sc-cats .sc-cat');
    if (cat) { window.scCat(cat.getAttribute('data-c')); return; }
    var hot = e.target.closest && e.target.closest('#sc-hot .sc-hot-i');
    if (hot) { window.scHot(hot.getAttribute('data-w')); return; }
  });
})();
