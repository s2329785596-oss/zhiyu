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
  const sys = (toolBase())
    + '【形象穿搭】你是知隅的形象穿搭顾问，专业但像私教朋友，依据用户的身体数据'
    + (useVision ? '和照片' : '') + '给建议。'
    + '先给一句真诚、具体的鼓励（不空夸），再用emoji分四块，每块2-4个短句要点，别长篇大论、别用#和*：'
    + '🎨适合的颜色（给具体色名，并说为什么衬肤色）；🚫建议少碰的颜色（说得委婉）；'
    + '👔版型/款式（结合身材扬长避短，说清上衣、下装怎么选）；🛍️可直接照着买的单品清单（3-5件，每件带款式和搭配场景）。'
    + '只评价怎么穿好看，绝不评价身材好坏、不制造身材焦虑，尺码和数据不当众复述一遍。';
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
// 所有工具共用的人格底座：与主聊天一致的屿川/知暖，避免工具变成冷冰冰的模板机
function toolBase() {
  let isF = false;
  try { isF = !!(typeof chatState !== 'undefined' && chatState && chatState.isFemale); } catch (e) {}
  const me = isF ? '知暖（像闺蜜）' : '屿川（像兄弟）';
  const ta = isF ? '他' : '她';
  return '你是「知隅」里的' + me + '，定位是亲密关系沟通参考工具。\n'
    + '【怎么说话】\n'
    + '- 像微信里跟好朋友聊天，先共情一两句（“这种是真有点挠头”“别急，我帮你看看”），再上干货，别一上来就甩标题。\n'
    + '- 用户信息少也要先给点马上能用的东西，最多再反问一个最关键的问题，不能只反问、让用户落空。\n'
    + '- 给的话要能直接复制发出去，具体、有细节，不讲大道理、不堆正确的废话。\n'
    + '- 不说教：少用“你应该/你必须/建议你”，多用“要是我我就…”“可以试试…”。\n'
    + '- 没把握就说“可能/我猜”，不把话说死；不替对方找借口，也不吓唬用户。\n'
    + '【底线】反对PUA、操控、物化、死缠烂打，始终往平等、真诚、健康的关系上引。\n'
    + '【手机排版】只用纯文字+emoji，靠换行和emoji分点（如“🍊 ”“1️⃣ ”），绝对不要用 #、*、-、表格这类Markdown符号。短句多分段，让人在手机上一屏能读。\n'
    + '（对方性别按用户情况，需要指代对方时用“' + ta + '”。）\n';
}

const TOOL_SYS = {
  icebreaker: '【破冰开场】结合用户说的场景和怎么认识的，给3条风格不同、能直接复制发的开场白：①轻松自然 ②带点好奇/小钩子 ③走心或夸到点上。'
    + '每条后面用括号给一个“对方回了可以接的话题”。开头先共情一句。要是连怎么认识的都不知道，先按最常见的“刚加上微信”给三条，再顺口问一句怎么认识的，别空手。三条之间空行分隔，口语、不油腻不土味。',
  expression: '【心意转译】用户用大白话说想表达啥（约出来/关心/道歉/表白/拒绝/夸奖），你把它变成3个能直接发的版本：'
    + '💛温柔走心版、😌轻松幽默版、🤝真诚直接版，每版一两句。版本之间空行。'
    + '表白或拒绝这类高风险的，结尾用朋友口吻补一句时机/分寸提醒。真诚第一，不教套路、不夸张、不施压。',
  mindreader: '【心思解码】帮用户读懂对方那句话或那个行为，但不武断、不替对方找借口、也不吓唬人。按这个结构：'
    + '先共情一句；🔍可能的意思（给1-2个最合理的解读，分清“字面”和“潜台词”）；'
    + '📊好感把握：高/中/低，并用对方的具体表现说依据；💬怎么回：给一条可以直接发的回复。'
    + '信息不够就标明“光凭这句还看不准，再结合……”，并说还需要看什么。',
  breakuprescue: '【分手挽回】先稳住情绪（一两句真心的陪伴，不灌鸡汤）。然后：先帮判断更像真性分手还是赌气/试探，说依据；'
    + '🚫当下别做的事（死缠烂打、小作文、立刻找朋友施压等）；📅这几天分步怎么做（先冷静多久、什么时候用什么姿态复联、第一句话怎么说）。'
    + '语气稳、给希望但不打包票，绝不怂恿纠缠或卑微挽回；涉及对方明确拒绝/拉黑要尊重边界。',
  dateplanner: '【约会策划】给一份能照着走的方案：⏰时间线（几点干嘛，松紧合适）；📍1-2个具体场地类型，并提醒“可以点下面地图按钮搜你附近真实的店、看评分和距离”；'
    + '💬3个不尴尬的话题；👕着装和💰预算小提醒；🅱️一个应急Plan B（下雨/排队/冷场怎么办）。'
    + '结合用户说的城市、预算、是第几次约会；信息不全就按“第一次、预算中等”先给一版，再问一句。结尾可帮他想一句自然的邀约话。',
  chatanalysis: '【聊天解读】你手上的永远只是"一段"，不是"全部"。只分析这一段本身，不推断整段关系，不判断对方是个什么样的人。'
    + '记录里「我：」是用户本人，「对方：」是他聊的那个人，不要搞反。记录里没有的不猜，想说"她可能……"必须先引原句。'
    + '按三块输出：①【这一段在说什么】客观描述谁在说什么事、对方的回应是什么类型（接话往下问/只回应不展开/转移话题/隔很久才回/只回表情），只描述不评价；'
    + '②【能看出什么、看不出什么】能看出最多两条且每条引原句，看不出就明说"这一段看不出她的整体态度，要看她是不是一直这样得看更多段"；'
    + '③【想继续聊，这几种接法可以挑】给 2-3 条可以直接发的话，是"你可以挑"不是"你应该这么回"。'
    + '不下"她是不是在吊着你""她是不是不喜欢你"这类结论，也不给"该不该继续"的建议。'
    + '最后必须问 2-3 个问题（一行一个，用「-」开头），从这几类里挑最缺的：这段是哪天的事、后面她回了吗、她平时会主动找你吗、你们见过面吗、见面时她什么状态、哪一句让你最不舒服。'
    + '用户补充的信息会写在消息开头的「（我补充的信息，优先看这段）」里，先看那段；他已经答过的不要再问第二遍。'
};
function getToolSystemPrompt(id) {
  const tail = TOOL_SYS[id] || '【陪伴答疑】结合用户说的情况，先共情，再给具体、实用、口语化的建议，一次别讲太多。';
  return toolBase() + '\n' + tail;
}

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
  // 视觉反馈：选中态
  const parent = el.parentNode;
  parent.querySelectorAll('.zy-chip').forEach(function(c) { c.classList.remove('on'); });
  el.classList.add('on');
  
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
