/* ============================================================
 * 知隅 v2.6 功能模块：在乎的人 / 形象穿搭 / 工具落地页 / 地图
 * 纯本地存储(wx storage)，不依赖后端
 * ============================================================ */

/* ---------- 通用 ---------- */
function zyLoad(key, def) {
  try { const v = wx.getStorageSync(key); return v || def; } catch (e) { return def; }
}
function zySave(key, val) { wx.setStorageSync(key, val); }
function zyUid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function zyToast(t) { if (typeof wx !== 'undefined' && wx.showToast) wx.showToast({ title: t }); }
function zyEscape(s) {
  const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML;
}

/* ============================================================
 * 一、在乎的人
 * 数据结构：[{id,name,relation,birthday(MM-DD),anniversary(YYYY-MM-DD),
 *            notes:[{id,cat,text,ts}],createdAt}]
 * ============================================================ */
const LOVED_CATS = [
  { k: 'day',    icon: '🎂', name: '重要日子', ph: '生日、纪念日、初见那天…' },
  { k: 'like',   icon: '❤️', name: 'TA喜欢的', ph: '爱吃爱喝、喜欢的花/颜色、种草的东西、想去的地方…' },
  { k: 'avoid',  icon: '🚫', name: '忌口雷区', ph: '过敏、不吃的、讨厌被怎样对待…' },
  { k: 'life',   icon: '🌙', name: '生活习惯', ph: '作息、小习惯、生理期怕冷…' },
  { k: 'gift',   icon: '🎁', name: '礼物约会', ph: '哪天、去哪、送了啥、TA开不开心…' },
  { k: 'family', icon: '👨‍👩‍👧', name: 'TA的家人', ph: '父母情况、家里状态、TA挂心的人…' },
  { k: 'free',   icon: '📝', name: '随便记',   ph: '想到什么记什么…' }
];
const LOVED_GUIDE = [
  'TA的生日是？', '爱喝奶茶半糖去冰', '对芒果过敏', '说过想去看海',
  '怕黑，睡觉要留小灯', '妈妈最近身体不太好', '上次约会去了哪', '种草很久的那支口红'
];

function openLoved() {
  closeDrawers();
  showPage('loved');
  renderLovedList();
}
function getLoved() { return zyLoad('lovedPeople', []); }
function setLoved(list) { zySave('lovedPeople', list); }

function renderLovedList() {
  const list = getLoved();
  const wrap = document.getElementById('loved-list-wrap');
  let html = '<div class="zy-intro">'
    + '<div class="zy-intro-t">把爱，记在细节里</div>'
    + '<div class="zy-intro-d">记得TA的生日、忌口、随口提过的心愿。这里不是分析TA，是帮你更好地关心TA。</div>'
    + '</div>';
  if (!list.length) {
    html += '<div class="zy-empty"><div class="zy-empty-ico">💖</div><div>还没有记下谁</div><div class="zy-empty-sub">建一张TA的小卡片吧</div></div>';
  } else {
    html += '<div class="loved-cards">';
    list.forEach(function (p) {
      const cd = lovedCountdown(p);
      html += '<div class="loved-card" onclick="openLovedDetail(\'' + p.id + '\')">'
        + '<div class="lc-top"><span class="lc-ava">' + (p.relation && p.relation.indexOf('女') >= 0 ? '👧' : (p.relation && p.relation.indexOf('男') >= 0 ? '👦' : '💗')) + '</span>'
        + '<div class="lc-info"><div class="lc-name">' + zyEscape(p.name || '未命名') + '</div>'
        + '<div class="lc-rel">' + zyEscape(p.relation || '在乎的人') + '</div></div>'
        + '<div class="lc-count">' + (p.notes ? p.notes.length : 0) + ' 条</div></div>';
      if (cd) html += '<div class="lc-cd">' + cd + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }
  html += '<button class="btn-primary zy-add-btn" onclick="addLovedPerson()">＋ 添加一个人</button>';
  wrap.innerHTML = html;
}

function lovedCountdown(p) {
  const out = [];
  const now = new Date();
  if (p.birthday) {
    const d = nextOccurrence(p.birthday, now);
    if (d === 0) out.push('🎂 今天是TA生日！');
    else if (d > 0) out.push('🎂 还有 ' + d + ' 天生日');
  }
  if (p.anniversary) {
    const mmdd = p.anniversary.length >= 5 ? p.anniversary.slice(5) : p.anniversary;
    const d = nextOccurrence(mmdd, now);
    if (d === 0) out.push('💞 今天是纪念日');
    else if (d > 0) out.push('💞 还有 ' + d + ' 天纪念日');
  }
  return out.join('　');
}
function nextOccurrence(mmdd, now) {
  const parts = String(mmdd).split(/[-/.]/);
  if (parts.length < 2) return -1;
  const m = parseInt(parts[0]), d = parseInt(parts[1]);
  if (!m || !d) return -1;
  let y = now.getFullYear();
  let t = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (t < today) t = new Date(y + 1, m - 1, d);
  return Math.round((t - today) / 86400000);
}

function addLovedPerson() {
  const list = getLoved();
  const p = { id: zyUid(), name: '', relation: '', birthday: '', anniversary: '', notes: [], createdAt: Date.now() };
  list.push(p); setLoved(list);
  openLovedDetail(p.id, true);
}
function openLovedDetail(id, edit) {
  showPage('loved-detail');
  renderLovedDetail(id, edit);
}
function curLoved(id) { return getLoved().filter(function (p) { return p.id === id; })[0]; }
function updateLoved(id, fn) {
  const list = getLoved();
  for (let i = 0; i < list.length; i++) if (list[i].id === id) fn(list[i]);
  setLoved(list);
}

function renderLovedDetail(id, edit) {
  const p = curLoved(id);
  const wrap = document.getElementById('loved-detail-wrap');
  document.getElementById('loved-detail-title').textContent = p.name ? p.name : '新的小本本';
  let catOpts = LOVED_CATS.map(function (c) { return '<option value="' + c.k + '">' + c.icon + ' ' + c.name + '</option>'; }).join('');

  let html = '<div class="ld-head">';
  html += '<div class="ld-field"><label>怎么称呼TA</label><input id="ld-name" value="' + zyEscape(p.name) + '" placeholder="如：小鹿" oninput="liveLoved(\'' + id + '\',\'name\',this.value)"></div>';
  html += '<div class="ld-field"><label>TA是你的</label><input id="ld-rel" value="' + zyEscape(p.relation) + '" placeholder="女朋友 / 在追的人 / 妈妈…" oninput="liveLoved(\'' + id + '\',\'relation\',this.value)"></div>';
  html += '<div class="ld-row">'
    + '<div class="ld-field"><label>生日(月-日)</label><input id="ld-bd" value="' + zyEscape(p.birthday) + '" placeholder="08-16" inputmode="numeric" onchange="liveLoved(\'' + id + '\',\'birthday\',this.value)"></div>'
    + '<div class="ld-field"><label>在一起纪念日</label><input id="ld-an" value="' + zyEscape(p.anniversary) + '" placeholder="2025-05-20" onchange="liveLoved(\'' + id + '\',\'anniversary\',this.value)"></div>'
    + '</div>';
  html += '<button class="zy-del-link" onclick="deleteLoved(\'' + id + '\')">删除这个人</button></div>';

  // 记一条
  html += '<div class="ld-composer">'
    + '<div class="ld-catrow"><select id="ld-cat">' + catOpts + '</select></div>'
    + '<textarea id="ld-text" rows="2" placeholder="记点什么…"></textarea>'
    + '<div class="ld-guides">' + LOVED_GUIDE.map(function (g) { return '<span class="zy-chip" onclick="fillLovedNote(this)">' + g + '</span>'; }).join('') + '</div>'
    + '<button class="btn-primary" onclick="addLovedNote(\'' + id + '\')">记下来</button>'
    + '</div>';

  // 按分类展示
  const notes = p.notes || [];
  if (!notes.length) {
    html += '<div class="zy-empty small"><div class="zy-empty-ico">📝</div><div>还没有记录</div><div class="zy-empty-sub">上面随手记一条，或点灰色提示试试</div></div>';
  } else {
    LOVED_CATS.forEach(function (c) {
      const arr = notes.filter(function (n) { return n.cat === c.k; });
      if (!arr.length) return;
      html += '<div class="ld-group"><div class="ld-group-t">' + c.icon + ' ' + c.name + '</div>';
      arr.slice().reverse().forEach(function (n) {
        html += '<div class="ld-note"><span>' + zyEscape(n.text) + '</span>'
          + '<span class="ld-note-del" onclick="delLovedNote(\'' + id + '\',\'' + n.id + '\')">×</span></div>';
      });
      html += '</div>';
    });
  }
  wrap.innerHTML = html;
}
function liveLoved(id, field, val) {
  updateLoved(id, function (p) { p[field] = val; });
  if (field === 'name') document.getElementById('loved-detail-title').textContent = val || '新的小本本';
}
function fillLovedNote(el) {
  const t = document.getElementById('ld-text'); t.value = el.textContent; t.focus();
}
function addLovedNote(id) {
  const cat = document.getElementById('ld-cat').value;
  const txt = document.getElementById('ld-text').value.trim();
  if (!txt) { zyToast('先写点内容'); return; }
  updateLoved(id, function (p) {
    p.notes = p.notes || [];
    p.notes.push({ id: zyUid(), cat: cat, text: txt, ts: Date.now() });
  });
  zyToast('记下了');
  renderLovedDetail(id);
}
function delLovedNote(id, nid) {
  updateLoved(id, function (p) { p.notes = (p.notes || []).filter(function (n) { return n.id !== nid; }); });
  renderLovedDetail(id);
}
function deleteLoved(id) {
  const p = curLoved(id);
  if (!confirm('确定删除「' + (p.name || '这个人') + '」的全部记录？')) return;
  setLoved(getLoved().filter(function (x) { return x.id !== id; }));
  goBack();
  setTimeout(renderLovedList, 60);
}

/* ============================================================
 * 二、形象穿搭
 * profiles:[{id,name,relation,gender,height,weight,bust,waist,hip,
 *   shoulder,arm,leg,bodyType,skinTone,usualSize,stylePref,
 *   photos:{face,full},createdAt}]
 * ============================================================ */
const STYLE_FIELDS = [
  ['height', '身高(cm)', 'number'], ['weight', '体重(kg)', 'number'],
  ['bust', '胸围(cm)', 'number'], ['waist', '腰围(cm)', 'number'], ['hip', '臀围(cm)', 'number'],
  ['shoulder', '肩宽(cm)', 'number'], ['arm', '臂长(cm)', 'number'], ['leg', '腿长(cm)', 'number'],
  ['usualSize', '常穿尺码', 'text']
];
const BODY_TYPES = ['偏瘦', '匀称', '微胖', '壮实', '梨形', '苹果形', '沙漏形', '倒三角'];
const SKIN_TONES = ['冷白皮', '自然偏白', '健康小麦', '偏深'];
const STYLES = ['休闲通勤', '干净少年感', '轻熟气质', '甜系温柔', '酷飒街头', '约会心动感', '你帮我定'];

function openStyle() {
  closeDrawers();
  showPage('style');
  renderStyleList();
}
function getStyle() { return zyLoad('styleProfiles', []); }
function setStyle(list) { zySave('styleProfiles', list); }
function curStyle(id) { return getStyle().filter(function (p) { return p.id === id; })[0]; }
function updateStyle(id, fn) {
  const list = getStyle();
  for (let i = 0; i < list.length; i++) if (list[i].id === id) fn(list[i]);
  zySave('styleProfiles', list);
}

function renderStyleList() {
  const list = getStyle();
  const wrap = document.getElementById('style-list-wrap');
  let html = '<div class="zy-intro"><div class="zy-intro-t">你的专属穿搭顾问</div>'
    + '<div class="zy-intro-d">身体数据只填一遍就会记住。可以给自己建档，也可以给在乎的人建档。</div></div>';
  if (!list.length) {
    html += '<div class="zy-empty"><div class="zy-empty-ico">👗</div><div>还没有穿搭档案</div></div>';
  } else {
    html += '<div class="loved-cards">';
    list.forEach(function (p) {
      const done = styleComplete(p);
      html += '<div class="loved-card" onclick="openStyleDetail(\'' + p.id + '\')">'
        + '<div class="lc-top"><span class="lc-ava">' + (p.photos && p.photos.face ? '<img src="' + p.photos.face + '">' : (p.gender === 'female' ? '👩' : '🧑')) + '</span>'
        + '<div class="lc-info"><div class="lc-name">' + zyEscape(p.name || '未命名') + '</div>'
        + '<div class="lc-rel">' + (p.height ? p.height + 'cm · ' : '') + (p.weight ? p.weight + 'kg' : '资料待完善') + '</div></div>'
        + '<div class="lc-count">' + (done ? '已完善' : '待完善') + '</div></div></div>';
    });
    html += '</div>';
  }
  html += '<button class="btn-primary zy-add-btn" onclick="addStylePerson()">＋ 添加一个人</button>';
  wrap.innerHTML = html;
}
function styleComplete(p) { return !!(p.height && p.weight && (p.bodyType || p.waist)); }

function addStylePerson() {
  const list = getStyle();
  const p = { id: zyUid(), name: '', relation: '', gender: 'male', photos: {}, createdAt: Date.now() };
  list.push(p); setStyle(list);
  openStyleDetail(p.id);
}
function openStyleDetail(id) { showPage('style-detail'); renderStyleDetail(id); }

function styleFieldVal(p, key) { return p[key] ? 'value="' + zyEscape(p[key]) + '"' : ''; }

function renderStyleDetail(id) {
  const p = curStyle(id);
  const wrap = document.getElementById('style-detail-wrap');
  document.getElementById('style-detail-title').textContent = p.name || '穿搭档案';

  let html = '<div class="ld-head">';
  html += '<div class="ld-row">'
    + '<div class="ld-field"><label>称呼</label><input value="' + zyEscape(p.name) + '" placeholder="自己 / 小鹿" oninput="liveStyle(\'' + id + '\',\'name\',this.value)"></div>'
    + '<div class="ld-field"><label>身份</label><input value="' + zyEscape(p.relation) + '" placeholder="我自己 / 女朋友" oninput="liveStyle(\'' + id + '\',\'relation\',this.value)"></div></div>';
  html += '<div class="ld-field"><label>性别</label><div class="zy-seg">'
    + ['male:男生', 'female:女生'].map(function (s) {
      const v = s.split(':')[0], t = s.split(':')[1];
      return '<span class="zy-seg-i ' + (p.gender === v ? 'on' : '') + '" onclick="setStyleGender(\'' + id + '\',\'' + v + '\')">' + t + '</span>';
    }).join('') + '</div></div>';

  // 照片
  html += '<div class="style-photos">'
    + stylePhotoBox(id, 'face', '正脸照', p)
    + stylePhotoBox(id, 'full', '全身照', p) + '</div>';

  // 身体数据
  html += '<div class="ld-group-t">📏 身体数据<span class="ld-group-sub">填一遍会记住，可随时改</span></div><div class="style-grid">';
  STYLE_FIELDS.forEach(function (f) {
    html += '<div class="sf-cell"><label>' + f[1] + '</label><input type="' + f[2] + '" inputmode="decimal" '
      + 'value="' + zyEscape(p[f[0]] || '') + '" onchange="liveStyle(\'' + id + '\',\'' + f[0] + '\',this.value)"></div>';
  });
  html += '</div>';

  html += '<div class="ld-field"><label>体型</label><div class="zy-chips">'
    + BODY_TYPES.map(function (t) { return '<span class="zy-chip ' + (p.bodyType === t ? 'on' : '') + '" onclick="pickStyleTag(\'' + id + '\',\'bodyType\',this)">' + t + '</span>'; }).join('')
    + '</div></div>';
  html += '<div class="ld-field"><label>肤色</label><div class="zy-chips">'
    + SKIN_TONES.map(function (t) { return '<span class="zy-chip ' + (p.skinTone === t ? 'on' : '') + '" onclick="pickStyleTag(\'' + id + '\',\'skinTone\',this)">' + t + '</span>'; }).join('')
    + '</div></div>';
  html += '</div>'; // /ld-head

  // AI 建议
  html += '<div class="style-ai"><div class="ld-group-t">✨ 让顾问给建议</div>'
    + '<div id="style-result"></div>'
    + '<div class="ld-field"><label>你想走什么风格？</label><div class="zy-chips" id="style-chips">'
    + STYLES.map(function (t) { return '<span class="zy-chip" onclick="askStyle(\'' + id + '\',\'' + t + '\')">' + t + '</span>'; }).join('')
    + '</div></div>'
    + '<div class="zy-prod-slot">🛍️ 合适单品的购买推荐即将上线（可一键跳转）</div>'
    + '</div>';

  wrap.innerHTML = html;
  renderStyleResult(p);
}
function stylePhotoBox(id, key, label, p) {
  const url = p.photos && p.photos[key];
  return '<div class="sp-box" onclick="pickStylePhoto(\'' + id + '\',\'' + key + '\')">'
    + (url ? '<img src="' + url + '"><span class="sp-mask">点我重传</span>' : '<span class="sp-plus">＋</span><span>' + label + '</span>')
    + '</div>';
}
function liveStyle(id, field, val) {
  updateStyle(id, function (p) { p[field] = val; });
  if (field === 'name') document.getElementById('style-detail-title').textContent = val || '穿搭档案';
}
function setStyleGender(id, g) { updateStyle(id, function (p) { p.gender = g; }); renderStyleDetail(id); }
function pickStyleTag(id, field, el) {
  updateStyle(id, function (p) { p[field] = el.textContent; });
  const par = el.parentNode;
  par.querySelectorAll('.zy-chip').forEach(function (c) { c.classList.remove('on'); });
  el.classList.add('on');
}
function pickStylePhoto(id, key) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = function (e) {
    const file = e.target.files[0]; if (!file) return;
    compressImageFile(file, 420, 0.62).then(function (dataUrl) {
      updateStyle(id, function (p) { p.photos = p.photos || {}; p.photos[key] = dataUrl; });
      zyToast('照片已存'); renderStyleDetail(id);
    }).catch(function () { zyToast('图片读取失败'); });
  };
  input.click();
}

function styleDataText(p) {
  const fmap = { height: '身高', weight: '体重', bust: '胸围', waist: '腰围', hip: '臀围', shoulder: '肩宽', arm: '臂长', leg: '腿长', usualSize: '常穿尺码' };
  let t = [];
  Object.keys(fmap).forEach(function (k) { if (p[k]) t.push(fmap[k] + ' ' + p[k]); });
  if (p.bodyType) t.push('体型 ' + p.bodyType);
  if (p.skinTone) t.push('肤色 ' + p.skinTone);
  if (p.gender) t.push('性别 ' + (p.gender === 'female' ? '女' : '男'));
  return t.join('，') || '暂无身体数据';
}

async function askStyle(id, style) {
  const p = curStyle(id);
  const box = document.getElementById('style-result');
  if (!styleComplete(p)) { zyToast('先把身高体重大致填上'); return; }
  box.innerHTML = '<div class="typing-indicator" style="margin:10px 0"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  const hasFace = p.photos && p.photos.face;
  const hasFull = p.photos && p.photos.full;
  const useVision = hasFace || hasFull;
  const sys = '你是知隅的形象穿搭顾问，专业、具体、像私教朋友。依据用户身体数据'
    + (useVision ? '和照片' : '') + '给可落地建议。'
    + '结构输出，分四块，每块给要点，不要长篇大论：1)适合的颜色(具体色名) 2)建议少碰的颜色 3)版型/款式(结合身材扬长避短) 4)可直接照着买的单品清单(3-5件)。'
    + '语气鼓励自然，不评价身材好坏。';
  let userText = '我的情况：' + styleDataText(p) + '。我想要的风格：' + style
    + '。请按四块给建议，单品说清款式和搭配场景。';
  let content;
  if (useVision) {
    content = [{ type: 'text', text: userText }];
    if (hasFace) content.push({ type: 'image_url', image_url: { url: p.photos.face } });
    if (hasFull) content.push({ type: 'image_url', image_url: { url: p.photos.full } });
  } else content = userText;
  try {
    const resp = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getApiKey() },
      body: JSON.stringify({
        model: useVision ? 'glm-4v-flash' : 'glm-4-flash',
        messages: [{ role: 'system', content: sys }, { role: 'user', content: content }],
        temperature: 0.7, max_tokens: 900
      })
    });
    const data = await resp.json();
    const reply = (data.choices && data.choices[0]) ? data.choices[0].message.content : '顾问暂时开了小差，稍后再试一次。';
    updateStyle(id, function (p) { p.lastStyleReply = reply; });
    box.innerHTML = '<div class="style-reply">' + zyFormat(reply) + '</div>';
  } catch (e) {
    box.innerHTML = '<div class="style-reply">网络有点问题，稍后再试～</div>';
  }
}
function renderStyleResult(p) {
  const box = document.getElementById('style-result');
  if (box && p.lastStyleReply) box.innerHTML = '<div class="style-reply">' + zyFormat(p.lastStyleReply) + '</div>';
}
function zyFormat(text) {
  return zyEscape(text).replace(/\n/g, '<br>');
}

/* ============================================================
 * 三、工具落地页（场景标签）+ 系统提示
 * ============================================================ */
const TOOL_SCENES = {
  icebreaker: ['刚加上微信', '相亲认识后', '共同朋友介绍', '聊过一次冷场了', '想找她没由头', '深夜想发点什么'],
  expression: ['想约她出来', '想表达关心', '想道歉认错', '想表白心意', '想委婉拒绝', '想夸夸她'],
  mindreader: ['她回得很冷淡', '突然不回消息', '这句话撒意思', '忽冷忽热', '发了个表情', '愿意单独出来吗'],
  breakuprescue: ['对方提了分手', '大吵了一架', '被拉黑了', '感觉要分手了', '我想挽回', '放不下'],
  dateplanner: ['第一次约会', '周末日常约会', '纪念日', '预算有限', '不知道聊什么', '想在附近找地方']
};
const TOOL_SYS = {
  icebreaker: '你是帮用户开启对话的朋友，直接给能用的开场白。先按对方给的场景，若信息不足先最多反问1个关键问题(关系/怎么认识的)；信息够就给3条风格不同、可直接复制发送的开场白，每条后附一个可接的话题。口语自然，不油腻不套路。',
  expression: '你是帮用户把心意说得体的朋友。用户会用大白话说他想表达什么，你输出3个版本：温柔走心版、轻松幽默版、真诚直接版，每版一两句能直接发。不教操控、不夸张。',
  mindreader: '你是帮用户读懂对方信号的朋友，不替对方找借口也不吓用户。给：这句话/行为可能的意思(分主客观)、好感把握(高/中/低并说明依据)、建议怎么回。信息不足就点出还需要看什么。',
  breakuprescue: '你是处理感情危机的冷静朋友。先接住情绪，再帮判断更像真性分手还是赌气，给当下别做什么+这几天分步怎么做，语气稳、不灌鸡汤、不怂恿纠缠。',
  dateplanner: '你是约会策划，给具体可执行方案：时间段安排、1-2个场地类型(并提示用户可点下方按钮在地图里搜真实店铺)、聊什么话题、着装与预算提醒、应急Plan B。结合用户城市和预算。',
  chatanalysis: '你是聊天记录分析顾问，从情绪氛围、主动性、边界感、关系阶段给判断和下一步建议，客观具体。'
};
function getToolSystemPrompt(id) { return TOOL_SYS[id] || '你是知隅的沟通陪伴助手，定位是亲密关系沟通参考工具。回复具体、实用、口语化。'; }

function renderToolLanding(id) {
  const box = document.getElementById('tool-messages');
  if (!box) return;
  // 约会：地图按钮
  if (id === 'dateplanner') {
    box.insertAdjacentHTML('beforeend', '<div class="tl-mapcard"><div class="tl-map-t">📍 不知道去哪？先在地图里找找你附近真实的店</div>'
      + '<div class="tl-map-btns">'
      + ['约会餐厅', '咖啡馆', '电影院', '密室逃脱', '适合散步的公园'].map(function (k) {
        return '<span class="zy-chip" onclick="openMapSearch(\'' + k + '\')">' + k + '</span>';
      }).join('') + '</div></div>');
    return;
  }
  const scenes = TOOL_SCENES[id];
  if (scenes && scenes.length) {
    box.insertAdjacentHTML('beforeend', '<div class="tl-scenecard"><div class="tl-scene-t">选个最像你现在的情况：</div><div class="tl-chips">'
      + scenes.map(function (s) { return '<span class="zy-chip" onclick="toolAsk(this)">' + s + '</span>'; }).join('')
      + '</div>'
      + (id === 'expression' ? '<div class="tl-scene-sub">然后在下面框里，用大白话说你想表达什么就行</div>' : '')
      + '</div>');
  }
}
function toolAsk(el) {
  const input = document.getElementById('tool-input');
  input.value = el.textContent;
  sendToolMessage();
}

/* 地图：优先高德 universal link，手机上有App会拉起，没有就开网页地图 */
function openMapSearch(keyword) {
  const kw = encodeURIComponent(keyword || '约会餐厅');
  const url = 'https://uri.amap.com/search?keyword=' + kw + '&callnative=1';
  window.open(url, '_blank');
}
