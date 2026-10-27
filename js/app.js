// ============================================================
// 知隅 v2.0 - 主应用逻辑
// ============================================================

// 全局状态
let currentPage = 'onboarding';
let pageHistory = [];
let selectedGender = '';
let selectedSpeed = '';
let userProfile = null;

// 全局加载提示
function showGlobalLoading(msg) {
  let el = document.getElementById('global-loading');
  if (!el) {
    el = document.createElement('div');
    el.id = 'global-loading';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);z-index:9999;backdrop-filter:blur(3px);';
    el.innerHTML = '<div style="background:#FFF;border-radius:14px;padding:18px 26px;box-shadow:0 6px 20px rgba(160,130,100,0.15);display:flex;align-items:center;gap:10px;font-size:15px;color:#5C4A3A;"><span class="spin"></span><span id="gl-msg">加载中...</span></div>';
    document.body.appendChild(el);
  }
  document.getElementById('gl-msg').textContent = msg || '加载中...';
  el.style.display = 'flex';
}
function hideGlobalLoading() {
  const el = document.getElementById('global-loading');
  if (el) el.style.display = 'none';
}

function iconSVG(name){
  var paths = {
    chat:'<path d="M20 11.6c0 3.8-3.6 6.8-8 6.8-1 0-2-.2-2.9-.5L5 19.4l1-3.4C4.8 14.7 4 13.2 4 11.6 4 7.8 7.6 4.8 12 4.8s8 3 8 6.8z"/>',
    phone:'<rect x="6.5" y="3" width="11" height="18" rx="2.6"/><path d="M10.6 18h2.8"/>',
    camera:'<rect x="3.5" y="7.5" width="17" height="12.4" rx="2.6"/><circle cx="12" cy="13.7" r="3.4"/><path d="M8.4 7.5 9.6 5h4.8l1.2 2.5"/>'
  };
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||'')+'</g></svg>';
}

// 角色配置
const SPEAKERS = {
  yuchuan: { name: '屿川', avatar: '', avatarUrl: 'images/avatars/yuchuan.png', emoji: '' },
  zhinuan: { name: '知暖', avatar: '', avatarUrl: 'images/avatars/zhinuan.png', emoji: '' }
};

// 快捷工具
const QUICK_TOOLS = [
  { id: 'chat_rescue', name: '聊天急救', ask: { male: '她刚跟我说了句话，我不知道怎么回了，帮我看看该怎么接。', female: '他刚跟我说了句话，我不知道怎么回了，帮我看看该怎么接。' }},
  { id: 'breakup', name: '情感挽回', ask: { male: '我最近感情出问题了，吵架/冷战/快分手了，我想挽回，你帮我分析分析。', female: '我最近感情出问题了，吵架/冷战/快分手了，我想挽回，你帮我分析分析。' }},
  { id: 'icebreak', name: '破冰开场', ask: { male: '我刚认识一个女生，不知道怎么开场、找什么话题，教教我。', female: '我刚认识一个男生，不知道怎么开场、找什么话题，教教我。' }},
  { id: 'mind_read', name: 'TA的心思', ask: { male: '她最近有些反应我有点摸不透，你帮我分析分析她是怎么想的。', female: '他最近有些反应我有点摸不透，你帮我分析分析他是怎么想的。' }},
  { id: 'date_plan', name: '约会策划', ask: { male: '我想约她出来，但不知道去哪、怎么安排、聊什么，帮我策划一下。', female: '他约我/我想约他，但不知道约会怎么安排，帮我策划一下。' }},
  { id: 'image', name: '形象改造', ask: { male: '我想提升一下外在形象，发型、穿搭、气质这块给我点实用建议。', female: '我想提升一下外在形象，发型、穿搭、妆容这块给我点实用建议。' }}
];

// 工具欢迎语
const TOOL_WELCOME = {
  icebreaker: '说说你们怎么认识的、从哪看到对方的，我帮你想第一句话。',
  expression: '你想对TA表达什么？说清楚你的心意，我帮你变成自然的话。',
  imagemakeover: '想从哪开始？发型、穿搭还是整体？先说说你的情况。',
  quickreply: '把TA刚发的那句话发过来，我马上帮你想三种回法。',
  mindreader: '把TA的行为或原话告诉我，前因后果也说一点，我帮你分析。',
  dateplanner: '想约TA做什么？你们现在的关系、所在城市，先说给我听。',
  giftadvisor: '对方是你什么人、什么场合、预算多少？我帮你选方向。',
  checkup: '最近相处得怎么样？想到什么说什么，我陪你一起梳理。',
  chataid: '聊天遇到什么状况？冷场、误会、还是说错话了……',
  coach: '在感情里，你最想让自己成长的是哪一块？',
  breakuprescue: '我在呢。先说说发生了什么、你现在什么感受，不着急。'
};

// ============ 页面路由 ============
function showPage(pageName, addToHistory = true) {
  if (addToHistory && currentPage !== pageName) {
    pageHistory.push(currentPage);
  }
  
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const target = document.getElementById('page-' + pageName);
  if (target) {
    target.classList.remove('hidden');
    // 触发淡入动画
    target.style.animation = 'none';
    void target.offsetHeight;
    target.style.animation = '';
    currentPage = pageName;
  }
  
  // 页面onShow
  if (pageName === 'chat') initChatPage();
  if (pageName === 'procenter') refreshProcenter();
  if (pageName === 'member') refreshMember();
  if (pageName === 'settings') refreshSettings();
  
  // 滚到顶部
  setTimeout(() => {
    const pc = target ? target.querySelector('.page-content') : null;
    if (pc) pc.scrollTop = 0;
  }, 30);
}

function goBack() {
  if (pageHistory.length > 0) {
    const prev = pageHistory.pop();
    showPage(prev, false);
  } else {
    showPage('chat', false);
  }
}

function goTo(pageName) {
  closeDrawers();
  showPage(pageName);
}

// ============ 初始化 ============
// 读取管理后台配置（同域 localStorage 共享），覆盖默认品牌/头像
function applyAdminConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem('adminConfig') || '{}');
    const brand = JSON.parse(localStorage.getItem('adminBrand') || '{}');
    const avatars = JSON.parse(localStorage.getItem('adminAvatars') || '{}');

    // LOGO
    if (brand.logo) {
      document.querySelectorAll('img.ob-logo').forEach(img => { img.src = brand.logo; });
    }
    // 应用名 / Slogan
    if (cfg.appName) {
      const w = document.querySelector('.ob-word'); if (w) w.textContent = cfg.appName;
      document.title = cfg.appName;
    }
    if (cfg.slogan) {
      const s = document.querySelector('.ob-slogan'); if (s) s.textContent = cfg.slogan;
    }
    // 角色头像：覆盖运行时 SPEAKERS 与默认用户头像
    if (avatars.zhinuan) SPEAKERS.zhinuan.avatarUrl = avatars.zhinuan;
    if (avatars.yuchuan) SPEAKERS.yuchuan.avatarUrl = avatars.yuchuan;
    window.__adminAvatars = avatars;
  } catch (e) { /* 配置损坏不影响启动 */ }
}

function adminAvatar(key, fallback) {
  const a = window.__adminAvatars || {};
  return a[key] || fallback;
}

function init() {
  applyAdminConfig();
  // 加载用户数据
  userProfile = wx.getStorageSync('userProfile') || {};
  
  // 判断入口
  const hasProfile = userProfile && userProfile.gender;
  const hasChat = wx.getStorageSync('chatHistory');
  
  if (hasProfile && hasChat) {
    showPage('chat', false);
  } else if (hasProfile) {
    showPage('gender', false);
  } else {
    showPage('onboarding', false);
  }
}

// ============ Onboarding ============
function startOnboarding() {
  wx.vibrateShort({ type: 'light' });
  showPage('profile');
}

// ============ Profile ============
function selectGender(gender) {
  selectedGender = gender;
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('.gender-btn.' + gender).classList.add('selected');
  // 明确的“按到了”反馈：中等振动 + CSS 描边/底色/打勾
  if (typeof wx !== 'undefined' && wx.vibrateShort) wx.vibrateShort({ type: 'medium' });
}

// ============ 自定义生日选择器（修复部分安卓 WebView 系统 date 控件白屏/半截） ============
var BP_ITEM_H = 40;
var bpState = { year: 2000, month: 1, day: 1 };

function bpDaysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function openBirthPicker() {
  var cur = document.getElementById('profile-birthdate').value;
  if (cur) {
    var p = cur.split('-');
    bpState.year = parseInt(p[0]);
    bpState.month = parseInt(p[1]);
    bpState.day = parseInt(p[2]);
  } else {
    bpState.year = 2000; bpState.month = 1; bpState.day = 1;
  }
  var nowY = new Date().getFullYear();
  document.getElementById('birth-picker').classList.remove('hidden');
  buildWheel('bp-year', nowY - 60, nowY, bpState.year, function (v) { bpState.year = v; refreshDayColumn(); });
  buildWheel('bp-month', 1, 12, bpState.month, function (v) { bpState.month = v; refreshDayColumn(); });
  buildWheel('bp-day', 1, bpDaysInMonth(bpState.year, bpState.month), bpState.day, function (v) { bpState.day = v; });
}

function closeBirthPicker() {
  document.getElementById('birth-picker').classList.add('hidden');
}

function confirmBirth() {
  var mm = String(bpState.month).padStart(2, '0');
  var dd = String(bpState.day).padStart(2, '0');
  var val = bpState.year + '-' + mm + '-' + dd;
  document.getElementById('profile-birthdate').value = val;
  syncBirthDisplay();
  calcAgeZodiac();
  closeBirthPicker();
  if (typeof wx !== 'undefined' && wx.vibrateShort) wx.vibrateShort({ type: 'light' });
}

function syncBirthDisplay() {
  var val = document.getElementById('profile-birthdate').value;
  var box = document.getElementById('birth-display');
  if (!box) return;
  if (val) {
    var p = val.split('-');
    box.textContent = p[0] + ' 年 ' + parseInt(p[1], 10) + ' 月 ' + parseInt(p[2], 10) + ' 日';
    box.classList.add('has-value');
  } else {
    box.innerHTML = '<span class="bd-placeholder">请选择生日</span>';
    box.classList.remove('has-value');
  }
}

// 年/月变化后，按当月天数就地重建“日”列
function refreshDayColumn() {
  var col = document.getElementById('bp-day');
  if (!col || col.getAttribute('data-built') !== '1') return;
  var max = bpDaysInMonth(bpState.year, bpState.month);
  if (bpState.day > max) bpState.day = max;
  buildWheel('bp-day', 1, max, bpState.day, function (v) { bpState.day = v; });
}

// 单列滚轮：触摸滑动 / 鼠标滚轮 / 点按均可；scroll-snap + 松手吸附
function buildWheel(id, min, max, current, onChange) {
  var col = document.getElementById(id);
  col.innerHTML = '';
  col.setAttribute('data-built', '1');

  for (var v = min; v <= max; v++) {
    (function (val) {
      var it = document.createElement('div');
      it.className = 'bp-item';
      it.textContent = (id === 'bp-year') ? (val + '年') : (id === 'bp-month' ? (val + '月') : (val + '日'));
      it.dataset.value = val;
      it.addEventListener('click', function () {
        col.scrollTo({ top: (val - min) * BP_ITEM_H, behavior: 'smooth' });
      });
      col.appendChild(it);
    })(v);
  }

  function indexOfScroll() {
    var idx = Math.round(col.scrollTop / BP_ITEM_H);
    if (idx < 0) idx = 0;
    if (idx > max - min) idx = max - min;
    return idx;
  }
  function syncActive() {
    var val = min + indexOfScroll();
    var items = col.children;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', parseInt(items[i].dataset.value, 10) === val);
    }
    if (val !== current) { current = val; onChange(val); }
  }
  // 用 onscroll 覆盖式赋值，避免重复打开/重建列时监听器堆积
  var snapTimer = null;
  col.onscroll = function () {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(function () {
      col.scrollTo({ top: indexOfScroll() * BP_ITEM_H, behavior: 'smooth' });
      syncActive();
    }, 90);
    syncActive();
  };
  // 桌面调试：鼠标滚轮逐行
  col.onwheel = function (e) {
    e.preventDefault();
    var dir = e.deltaY > 0 ? 1 : -1;
    var idx = indexOfScroll() + dir;
    if (idx < 0) idx = 0;
    if (idx > max - min) idx = max - min;
    col.scrollTo({ top: idx * BP_ITEM_H, behavior: 'smooth' });
  };

  col.scrollTop = (current - min) * BP_ITEM_H;
  syncActive();
}

function calcAgeZodiac() {
  const dateStr = document.getElementById('profile-birthdate').value;
  if (!dateStr) return;
  
  const parts = dateStr.split('-');
  const birthMonth = parseInt(parts[1]);
  const birthDay = parseInt(parts[2]);
  const birthYear = parseInt(parts[0]);
  
  // 算年龄
  const now = new Date();
  let age = now.getFullYear() - birthYear;
  if (now.getMonth() + 1 < birthMonth || (now.getMonth() + 1 === birthMonth && now.getDate() < birthDay)) {
    age--;
  }
  
  // 算星座
  const md = birthMonth * 100 + birthDay;
  let zodiac = '';
  if (md >= 321 && md <= 419) zodiac = '白羊座';
  else if (md >= 420 && md <= 520) zodiac = '金牛座';
  else if (md >= 521 && md <= 621) zodiac = '双子座';
  else if (md >= 622 && md <= 722) zodiac = '巨蟹座';
  else if (md >= 723 && md <= 822) zodiac = '狮子座';
  else if (md >= 823 && md <= 922) zodiac = '处女座';
  else if (md >= 923 && md <= 1023) zodiac = '天秤座';
  else if (md >= 1024 && md <= 1122) zodiac = '天蝎座';
  else if (md >= 1123 && md <= 1221) zodiac = '射手座';
  else if (md >= 1222 || md <= 119) zodiac = '摩羯座';
  else if (md >= 120 && md <= 218) zodiac = '水瓶座';
  else if (md >= 219 && md <= 320) zodiac = '双鱼座';
  
  document.getElementById('age-zodiac').textContent = age + '岁 · ' + zodiac;
}

function submitProfile() {
  const nickname = document.getElementById('profile-nickname').value.trim();
  const birthdate = document.getElementById('profile-birthdate').value;
  const status = document.getElementById('profile-status').value.trim();
  const need = document.getElementById('profile-need').value.trim();
  
  if (!selectedGender) {
    wx.showToast({ title: '请选择性别' });
    return;
  }
  if (!birthdate) {
    wx.showToast({ title: '请选择生日' });
    return;
  }
  
  wx.vibrateShort({ type: 'medium' });
  
  // 计算年龄星座
  const parts = birthdate.split('-');
  const birthMonth = parseInt(parts[1]);
  const birthDay = parseInt(parts[2]);
  const birthYear = parseInt(parts[0]);
  const now = new Date();
  let age = now.getFullYear() - birthYear;
  if (now.getMonth() + 1 < birthMonth || (now.getMonth() + 1 === birthMonth && now.getDate() < birthDay)) age--;
  const md = birthMonth * 100 + birthDay;
  let zodiac = '';
  if (md >= 321 && md <= 419) zodiac = '白羊'; else if (md >= 420 && md <= 520) zodiac = '金牛';
  else if (md >= 521 && md <= 621) zodiac = '双子'; else if (md >= 622 && md <= 722) zodiac = '巨蟹';
  else if (md >= 723 && md <= 822) zodiac = '狮子'; else if (md >= 823 && md <= 922) zodiac = '处女';
  else if (md >= 923 && md <= 1023) zodiac = '天秤'; else if (md >= 1024 && md <= 1122) zodiac = '天蝎';
  else if (md >= 1123 && md <= 1221) zodiac = '射手'; else if (md >= 1222 || md <= 119) zodiac = '摩羯';
  else if (md >= 120 && md <= 218) zodiac = '水瓶'; else if (md >= 219 && md <= 320) zodiac = '双鱼';
  
  userProfile = {
    nickname: nickname || '',
    gender: selectedGender,
    birthdate: birthdate,
    age: age,
    zodiac: zodiac,
    relationshipStatus: status,
    need: need
  };
  
  wx.setStorageSync('userProfile', userProfile);
  wx.setStorageSync('gender', selectedGender);
  // 性别确定后，用户头像默认用该性别第1张预设（不影响已上传的自定义头像）
  if (!wx.getStorageSync('userAvatar')) {
    wx.setStorageSync('userAvatarPreset', '1');
  }
  
  // 跳到性别选择（角色登场）
  initGenderPage();
  showPage('gender');
}

function editProfile() {
  showPage('profile');
  // 回填数据
  if (userProfile) {
    document.getElementById('profile-nickname').value = userProfile.nickname || '';
    document.getElementById('profile-birthdate').value = userProfile.birthdate || '';
    syncBirthDisplay();
    calcAgeZodiac();
    document.getElementById('profile-status').value = userProfile.relationshipStatus || '';
    document.getElementById('profile-need').value = userProfile.need || '';
    selectedGender = userProfile.gender;
    document.querySelectorAll('.gender-btn').forEach(function (b) { b.classList.remove('selected'); });
    var _gb = document.querySelector('.gender-btn.' + selectedGender);
    if (_gb) _gb.classList.add('selected');
  }
}

// ============ Gender Select ============
function initGenderPage() {
  const gender = userProfile ? userProfile.gender : selectedGender;
  const isMale = gender === 'male';
  
  const ga = document.getElementById('greeting-avatar');
  const _avUrl = isMale ? adminAvatar('yuchuan', 'images/avatars/yuchuan.png') : adminAvatar('zhinuan', 'images/avatars/zhinuan.png');
  ga.innerHTML = '<img class="ga-img" src="' + _avUrl + '" alt="">';
  document.getElementById('greeting-name').textContent = isMale ? '屿川' : '知暖';
  document.getElementById('greeting-text').textContent = isMale ?
    '嘿，兄弟。我是屿川。拉你进个小群，就咱仨——感情上的事儿想吐槽、想问招，随时开口。' :
    '嘿，姐妹。我是知暖。拉你进个小群，就咱仨——感情上的事儿想吐槽、想问招，随时开口。';
}

function selectSpeed(speed) {
  selectedSpeed = speed;
  wx.vibrateShort({ type: 'light' });
  document.querySelectorAll('.speed-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById('speed-confirm').textContent = speed === 'fast' ? '开始认识我' : '我们慢慢来';
}

function confirmSpeed() {
  if (!selectedSpeed) {
    wx.showToast({ title: '请选择一个方式' });
    return;
  }
  wx.vibrateShort({ type: 'medium' });
  
  if (selectedSpeed === 'fast') {
    showPage('assessment');
  } else {
    wx.setStorageSync('testChoice', 'slow');
    wx.setStorageSync('registerAt', Date.now());
    showPage('chat');
  }
}

// ============ Assessment ============
let assessState = { qIndex: 0, answers: {}, freeText: {}, allQuestions: [] };

function startAssessment() {
  wx.vibrateShort({ type: 'light' });
  
  // 加载80题
  const allQs = window.questions_segment1.concat(window.questions_segment2).concat(window.questions_segment3);
  assessState.allQuestions = allQs;
  assessState.qIndex = 0;
  assessState.answers = {};
  assessState.freeText = {};
  
  document.getElementById('assess-intro').classList.add('hidden');
  document.getElementById('assess-quiz').classList.remove('hidden');
  
  renderQuestion();
}

function renderQuestion() {
  const q = assessState.allQuestions[assessState.qIndex];
  if (!q) return;
  
  const progress = Math.round((assessState.qIndex + 1) / assessState.allQuestions.length * 100);
  document.getElementById('assess-progress').style.width = progress + '%';
  
  document.getElementById('assess-question').textContent = (assessState.qIndex + 1) + '. ' + q.title;
  
  let optionsHtml = '';
  q.options.forEach(opt => {
    const selected = assessState.answers[q.id] === opt.key ? ' selected' : '';
    optionsHtml += '<div class="assess-option' + selected + '" onclick="selectOption(\'' + opt.key + '\')">' +
      '<strong>' + opt.key + '.</strong> ' + opt.text + '</div>';
  });
  // E选项
  const eSelected = assessState.answers[q.id] === 'E' ? ' selected' : '';
  optionsHtml += '<div class="assess-option' + eSelected + '" onclick="selectOption(\'E\')" style="border-style:dashed">' +
    '<strong>E.</strong> ' + (q.eOption ? q.eOption.text : '都不完全是，我的真实想法是……') + '</div>';
  
  document.getElementById('assess-options').innerHTML = optionsHtml;
}

function selectOption(key) {
  wx.vibrateShort({ type: 'light' });
  const q = assessState.allQuestions[assessState.qIndex];
  
  if (key === 'E') {
    const text = prompt('写下你的真实想法：');
    if (text && text.trim()) {
      assessState.freeText[q.id] = text.trim();
      assessState.answers[q.id] = 'E';
    } else {
      return;
    }
  } else {
    assessState.answers[q.id] = key;
    if (assessState.freeText[q.id]) delete assessState.freeText[q.id];
  }
  
  renderQuestion();
  
  // 自动下一题
  setTimeout(() => {
    if (assessState.qIndex < assessState.allQuestions.length - 1) {
      assessState.qIndex++;
      renderQuestion();
    } else {
      finishAssessment();
    }
  }, 300);
}

function finishAssessment() {
  document.getElementById('assess-quiz').classList.add('hidden');
  document.getElementById('assess-done').classList.remove('hidden');
  
  wx.vibrateShort({ type: 'medium' });
  
  // 简单计分
  const result = calcAssessmentResult();
  wx.setStorageSync('assessmentResult', result);
  
  // 更新userProfile
  userProfile = userProfile || {};
  userProfile.dimensions = result.dims;
  userProfile.dimsDetail = result.dimsDetail;
  wx.setStorageSync('userProfile', userProfile);
  
  wx.setStorageSync('registerAt', Date.now());
  
  setTimeout(() => {
    showPage('report');
    renderReport();
  }, 1500);
}

function calcAssessmentResult() {
  // 简化版计分：按维度汇总
  const scores = {};
  const dimKeys = window.DIM_KEYS_V2 || ['ATT','CON','EXP','INT','ASR','EST','EMR','EMP'];
  dimKeys.forEach(k => scores[k] = 50); // 默认中位
  
  // 根据答案调整（简化逻辑）
  const allQs = assessState.allQuestions;
  for (let i = 0; i < allQs.length; i++) {
    const q = allQs[i];
    const ans = assessState.answers[q.id];
    if (ans && ans !== 'E' && q.options) {
      const opt = q.options.find(o => o.key === ans);
      if (opt && opt.scores) {
        for (const sk in opt.scores) {
          const dim = sk.split('_')[0];
          if (scores[dim] !== undefined) {
            scores[dim] += opt.scores[sk] * 3;
          }
        }
      }
    }
  }
  
  // 归一化到0-100
  for (const k in scores) {
    scores[k] = Math.min(100, Math.max(0, scores[k]));
  }
  
  // 生成标签
  const dims = {};
  const dimNames = window.DIM_NAMES_V2 || {};
  for (const k in scores) {
    const v = scores[k];
    if (k === 'ATT') dims[k] = v > 70 ? '安全型' : v > 40 ? '焦虑型' : '回避型';
    else if (k === 'CON') dims[k] = v > 70 ? '协作型' : v > 40 ? '妥协型' : '回避型';
    else if (k === 'EXP') dims[k] = v > 60 ? '直接开放型' : '含蓄压抑型';
    else if (k === 'INT') dims[k] = v > 60 ? '高需求' : '低需求';
    else if (k === 'ASR') dims[k] = v > 60 ? '果断' : '犹豫';
    else if (k === 'EST') dims[k] = v > 60 ? '高自尊' : '低自尊';
    else if (k === 'EMR') dims[k] = v > 60 ? '稳定型' : '敏感型';
    else if (k === 'EMP') dims[k] = v > 60 ? '高共情' : '低共情';
  }
  
  return {
    version: 'v2.0',
    finishedAt: Date.now(),
    scores: scores,
    dims: dims,
    dimsDetail: scores
  };
}

// ============ Report ============
function renderReport() {
  const result = wx.getStorageSync('assessmentResult');
  if (!result) {
    document.getElementById('report-content').innerHTML = '<p>还没有测评结果，先去完成测评吧。</p>';
    return;
  }
  
  const dimNames = { ATT:'关系里的安全感', CON:'吵架时的样子', EXP:'怎么表达心意', INT:'需要多少陪伴', ASR:'做决定的底气', EST:'对自己的感觉', EMR:'情绪恢复力', EMP:'读懂别人的能力' };
  
  let html = '<div class="report-section"><div class="report-title">你的8维度画像</div><div class="report-content">';
  
  const dims = result.dims || {};
  for (const k in dims) {
    const name = dimNames[k] || k;
    const label = dims[k];
    const score = result.scores ? result.scores[k] : 50;
    html += '<div style="margin-bottom:12px"><strong>' + name + '</strong>：' + label + 
      ' <span style="color:#969088">(' + Math.round(score) + '%)</span></div>';
  }
  
  html += '</div></div>';
  html += '<div class="report-section"><div class="report-title">建议</div><div class="report-content">';
  html += '<p>根据你的测评结果，你在亲密关系中有自己独特的模式。</p>';
  html += '<p>和屿川/知暖聊聊，他们会根据你的性格给你更有针对性的建议。</p>';
  html += '</div></div>';
  
  document.getElementById('report-content').innerHTML = html;
}

function viewAssessment() {
  const result = wx.getStorageSync('assessmentResult');
  if (result) {
    showPage('report');
    renderReport();
  } else {
    showPage('assessment');
  }
}

function viewReport() {
  const result = wx.getStorageSync('assessmentResult');
  if (result) {
    showPage('report');
    renderReport();
  } else {
    wx.showToast({ title: '还没有报告，先去测评吧' });
  }
}

function reassess() {
  document.getElementById('assess-intro').classList.remove('hidden');
  document.getElementById('assess-quiz').classList.add('hidden');
  document.getElementById('assess-done').classList.add('hidden');
  showPage('assessment');
}

// ============ Chat ============
let chatState = { aiTyping: false, isFemale: false, mainName: '', guestName: '' };

function initChatPage() {
  const profile = wx.getStorageSync('userProfile') || {};
  const gender = profile.gender || wx.getStorageSync('gender') || 'male';
  const isFemale = gender === 'female';
  
  chatState.isFemale = isFemale;
  chatState.mainName = isFemale ? '知暖' : '屿川';
  chatState.guestName = isFemale ? '屿川' : '知暖';
  
  document.getElementById('chat-members').textContent = chatState.mainName + '·' + chatState.guestName + ' 都在';
  document.getElementById('drawer-nickname').textContent = profile.nickname || '知隅用户';
  // 抽屉用户头像（默认角色图，点击可上传）
  renderUserAvatar('duc-avatar', isFemale);
  
  // 加载消息
  renderChatMessages();
  
  // 下拉加载更多
  initLoadMore();
  
  // 如果没有消息，显示欢迎语
  const history = chatStorage.getHistory(30);
  if (history.length === 0) {
    showWelcomeMessages();
  }
}

function showWelcomeMessages() {
  const container = document.getElementById('chat-messages');
  const isFemale = chatState.isFemale;
  
  const welcomes = isFemale ? [
    { speaker: 'main', text: '欢迎进群！这儿就咱仨，感情上那点事儿，想吐槽、想分析、想要话术，随时开口。' },
    { speaker: 'guest', text: '我是屿川～想知道男生怎么想，@我就行。' }
  ] : [
    { speaker: 'main', text: '欢迎进群！这儿就咱仨，感情上那点事儿，想吐槽、想分析、想要话术，随时开口。' },
    { speaker: 'guest', text: '我是知暖～想知道女生会怎么想，@我就行。' }
  ];
  
  let html = '<div style="text-align:center;color:#969088;padding:12px;font-size:13px">欢迎来到知隅陪伴群，这里只有你和两位朋友</div>';
  
  welcomes.forEach(w => {
    const sp = w.speaker === 'main' ? 
      (isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan) : 
      (isFemale ? SPEAKERS.yuchuan : SPEAKERS.zhinuan);
    html += renderMessageHtml('ai', w.text, sp.name, sp.avatarUrl);
  });
  
  container.innerHTML = html;
  scrollChatBottom();
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  const history = chatStorage.getHistory(30);
  
  if (history.length === 0) {
    showWelcomeMessages();
    return;
  }
  
  let html = '';
  let lastSpeaker = '';
  let lastTime = 0;
  
  history.forEach(h => {
    // 时间戳：间隔>5 分钟显示一次
    if (h.timestamp - lastTime > 5 * 60 * 1000) {
      html += '<div class="msg-time">' + chatStorage.formatTime(h.timestamp) + '</div>';
      lastTime = h.timestamp;
    }
    
    if (h.role === 'user') {
      var userBubble = '';
      if (h.image) {
        userBubble += '<img class="uploaded-shot" src="' + h.image + '">';
        if (h.content && h.content !== '[图片]') userBubble += '<div class="msg-img-caption">' + escapeHtml(h.content) + '</div>';
      } else {
        userBubble += escapeHtml(h.content).replace(/\n/g, '<br>');
      }
      html += '<div class="message user"><div class="message-bubble">' + userBubble + '</div></div>';
      lastSpeaker = 'user';
    } else if (h.type === 'system') {
      html += '<div style="text-align:center;color:#969088;padding:8px;font-size:12px">' + escapeHtml(h.content) + '</div>';
      lastSpeaker = 'system';
    } else {
      const isFemale = chatState.isFemale;
      const speaker = h.speaker || 'main';
      const sp = speaker === 'guest' ? 
        (isFemale ? SPEAKERS.yuchuan : SPEAKERS.zhinuan) : 
        (isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan);
      
      const showName = lastSpeaker !== ('ai-' + speaker);
      html += renderMessageHtml('ai', h.content, sp.name, sp.avatarUrl, showName);
      lastSpeaker = 'ai-' + speaker;
    }
  });
  
  container.innerHTML = html;
  scrollChatBottom();
}

function renderMessageHtml(type, content, name, avatarUrl, showName) {
  if (type === 'ai') {
    const nameHtml = showName !== false ? '<div class="message-name">' + escapeHtml(name) + '</div>' : '';
    const formattedContent = escapeHtml(content).replace(/\n/g, '<br>');
    return '<div class="message ai">' +
      '<img class="message-avatar" src="' + avatarUrl + '">' +
      '<div class="message-body">' + nameHtml +
      '<div class="message-bubble">' + formattedContent + '</div></div></div>';
  }
  return '<div class="message user"><div class="message-body">' +
    '<div class="message-bubble">' + escapeHtml(content).replace(/\n/g, '<br>') + '</div></div></div>';
}

function scrollChatBottom() {
  const container = document.getElementById('chat-messages');
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
}

// 下拉加载更多
let loadMorePage = 1;
function initLoadMore() {
  const container = document.getElementById('chat-messages');
  container.addEventListener('scroll', function() {
    if (container.scrollTop < 50 && !container.dataset.loading) {
      loadMorePage++;
      container.dataset.loading = '1';
      container.insertAdjacentHTML('afterbegin', '<div class="pull-load-more" id="load-more-hint">加载中…</div>');
      setTimeout(() => {
        const older = chatStorage.getHistoryPaged(loadMorePage, 15);
        const hint = document.getElementById('load-more-hint');
        if (hint) hint.remove();
        container.dataset.loading = '';
        if (older.length === 0) {
          loadMorePage--;
          return;
        }
        let html = '';
        older.forEach(h => {
          if (h.role === 'user') {
            html += '<div class="message user"><div class="message-bubble">' + escapeHtml(h.content).replace(/\n/g, '<br>') + '</div></div>';
          } else if (h.type !== 'system') {
            const sp = chatState.isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
            html += renderMessageHtml('ai', h.content, sp.name, sp.avatarUrl, false);
          }
        });
        container.insertAdjacentHTML('afterbegin', html);
      }, 300);
    }
  });
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  updateSendButton();
}

function updateSendButton() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('send-btn');
  if (input && btn) {
    btn.disabled = !input.value.trim() || chatState.aiTyping;
  }
  // 工具页发送按钮
  const toolInput = document.getElementById('tool-input');
  const toolBtn = document.getElementById('tool-send-btn');
  if (toolInput && toolBtn) {
    toolBtn.disabled = !toolInput.value.trim();
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || chatState.aiTyping) return;
  
  input.value = '';
  autoResize(input);
  updateSendButton();
  
  // 保存并显示用户消息
  chatStorage.saveMessage('user', text);
  renderChatMessages();
  
  // 调用AI
  callAI(text);
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const isFemale = chatState.isFemale;
  const sp = isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
  
  const typingHtml = '<div class="message ai" id="typing-indicator">' +
    '<div class="message-avatar"><img src="' + sp.avatarUrl + '" style="width:36px;height:36px;border-radius:50%"></div>' +
    '<div><div class="message-body"><div class="message-name">' + sp.name + '</div>' +
    '<div class="message-bubble typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>' +
    '</div></div></div>';
  
  container.insertAdjacentHTML('beforeend', typingHtml);
  scrollChatBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// 主聊角色系统提示词；hasImage=true 时追加看图分析要求
function buildMainSystemPrompt(hasImage) {
  const profile = wx.getStorageSync('userProfile') || {};
  const isFemale = chatState.isFemale;
  const mainName = isFemale ? '知暖' : '屿川';
  let p = '你是「知隅」里的' + mainName + '，是用户的' + (isFemale ? '闺蜜' : '兄弟') + '。\n' +
    '定位：亲密关系沟通参考工具。\n' +
    '\n' +
    '【铁律，每条回复必须照做】\n' +
    '1. 你是朋友，不是老师不是专家，语气像微信里跟好朋友聊天\n' +
    '2. 三拍子结构，缺一不可：\n' +
    '   ① 先接情绪（"这事儿听着是真闹心"、"换我我也懵"）\n' +
    '   ② 反问一个具体问题摸清情况（"你们处多久了？"、"她原话咋说的？"）\n' +
    '   ③ 只给一个明确立场（"要是我，我就直接问清楚"），不许列多个选项\n' +
    '3. 严禁说教：不许出现"你应该""你可以""建议你"。换成"要是我我就…""我哥们儿之前…"\n' +
    '4. 口语化：多用"嗯""啊""咋""呗""哈哈"，允许句子不完整\n' +
    '5. 每次回复40到100字，不许长篇大论，不许用序号分点\n' +
    '6. 反对PUA/操控/物化，引导平等健康的关系\n' +
    '7. 没把握的事说"可能""我猜"，不把话说死\n' +
    (profile.dimensions ? '8. 这用户的性格特征：' + JSON.stringify(profile.dimensions) + '\n' : '');
  if (hasImage) {
    p += '\n【本次用户发来了一张图片，多半是聊天截图/朋友圈/对方资料】\n' +
      '仔细看清图里的文字、对话顺序、时间和语气，再开口。像朋友凑过来一起看手机那样，' +
      '先点出你看到的关键信号，接住情绪，问一个最关键的摸底问题，给一个明确立场。' +
      '看不清或图里信息不够，就老实说哪看不清、让用户补一张或讲讲，别瞎编图里没有的内容。\n';
  }
  p += '\n直接输出聊天内容，不要解释你在做什么。';
  return p;
}

async function callAI(userText, imageDataUrl) {
  chatState.aiTyping = true;
  showTypingIndicator();

  const hasImage = !!imageDataUrl;
  const systemPrompt = buildMainSystemPrompt(hasImage);

  // 有图走视觉模型 glm-4v-flash（免费），纯文字走 glm-4-flash
  let userContent;
  let model = 'glm-4-flash';
  if (hasImage) {
    model = 'glm-4v-flash';
    userContent = [
      { type: 'text', text: userText || '帮我看看这张截图' },
      { type: 'image_url', image_url: { url: imageDataUrl } }
    ];
  } else {
    userContent = userText;
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    let reply = '';
    if (data.choices && data.choices[0]) {
      reply = data.choices[0].message.content;
    } else if (hasImage) {
      reply = '图我这边一时没太读清，网络可能抖了下，你再发一次试试？不行就先用嘴跟我说说啥情况。';
    } else {
      reply = '让我想想...你说的这个情况挺常见的，能再具体说说吗？';
    }

    chatStorage.saveMessage('assistant', reply, { speaker: 'main' });
    renderChatMessages();
  } catch(e) {
    removeTypingIndicator();
    console.error('AI调用失败:', e);
    const reply = hasImage
      ? '图我这边暂时没连上，稍等再发一次？急的话你先打字跟我说说。'
      : '抱歉，我这边暂时连不上，稍等一下再试试？';
    chatStorage.saveMessage('assistant', reply, { speaker: 'main' });
    renderChatMessages();
  }

  chatState.aiTyping = false;
}

function getApiKey() {
  // 从localStorage获取API key，或使用默认值
  return wx.getStorageSync('apiKey') || '33ce52e609034ca3a8dedad6e189e211.yp1ocAeRQOJqb5fw';
}

function inviteGuest() {
  const history = chatStorage.getHistory(30);
  const hasUserMsg = history.some(h => h.role === 'user');
  
  if (!hasUserMsg) {
    wx.showToast({ title: '先说说你的事儿，再@' + chatState.guestName + '吧' });
    return;
  }
  
  // 发送邀请
  const guestText = '哎我在呢～这事儿换我看啊，先别自己瞎琢磨，找机会轻松问一句比啥都强。';
  chatStorage.saveMessage('assistant', chatState.mainName + ' 邀请了 ' + chatState.guestName + ' 加入群聊', { type: 'system' });
  
  callGuestAI();
}

async function callGuestAI() {
  chatState.aiTyping = true;
  showTypingIndicator();
  
  const history = chatStorage.getHistory(10);
  const lastUserMsg = history.filter(h => h.role === 'user').pop();
  const userText = lastUserMsg ? lastUserMsg.content : '帮我分析一下';
  
  const isFemale = chatState.isFemale;
  const guestSpeaker = isFemale ? SPEAKERS.yuchuan : SPEAKERS.zhinuan;
  const guestName = chatState.guestName;
  
  const systemPrompt = '你是「知隅」里的' + guestName + '，用户刚把你@进群，想听' + (isFemale ? '男生' : '女生') + '视角的大实话。\n' +
    '【铁律】\n' +
    '1. 你是被朋友拉来帮忙的，开口像群里真人发言，别客套\n' +
    '2. 先接一句用户的情绪或处境，再给你的异性视角看法，最多给一个\n' +
    '3. 严禁说教，不许说"你应该""建议你"，要口语"我跟你说""这事儿吧"\n' +
    '4. 40到90字，不许分点，不许长篇分析\n' +
    '5. 说真话，不讨好任何一方，反对PUA和物化\n' +
    '直接输出聊天内容。';
  
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });
    
    const data = await response.json();
    removeTypingIndicator();
    
    let reply = '';
    if (data.choices && data.choices[0]) {
      reply = data.choices[0].message.content;
    } else {
      reply = '这事儿吧，我觉得最重要的是真诚，别想太多套路。';
    }
    
    chatStorage.saveMessage('assistant', reply, { speaker: 'guest' });
    renderChatMessages();
  } catch(e) {
    removeTypingIndicator();
    chatStorage.saveMessage('assistant', '我这边信号不太好，等会儿再说~', { speaker: 'guest' });
    renderChatMessages();
  }
  
  chatState.aiTyping = false;
}

// ============ Drawer ============
function toggleDrawer() {
  const drawer = document.getElementById('left-drawer');
  const mask = document.getElementById('drawer-mask');
  drawer.classList.toggle('open');
  mask.classList.toggle('show');
}

function toggleHistory() {
  const drawer = document.getElementById('right-drawer');
  const mask = document.getElementById('drawer-mask');
  drawer.classList.toggle('open');
  mask.classList.toggle('show');
  
  if (drawer.classList.contains('open')) {
    renderHistory();
  }
}

function closeDrawers() {
  document.getElementById('left-drawer').classList.remove('open');
  document.getElementById('right-drawer').classList.remove('open');
  document.getElementById('drawer-mask').classList.remove('show');
}

function renderHistory() {
  const history = chatStorage.getHistory(7);
  const container = document.getElementById('history-list');
  
  let html = '';
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    const time = new Date(h.timestamp);
    const timeStr = time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0');
    
    if (h.role === 'user') {
      html += '<div class="history-item"><div style="color:#969088;font-size:11px">' + timeStr + '</div>' + escapeHtml(h.content) + '</div>';
    }
  }
  
  container.innerHTML = html || '<div style="text-align:center;color:#969088;padding:20px">暂无记录</div>';
}

// ============ Tool Page ============
let currentToolId = '';

function useTool(toolId) {
  closeDrawers();
  currentToolId = toolId;
  
  const toolNames = {
    icebreaker: '破冰开场', expression: '心意转译', imagemakeover: '形象改造',
    quickreply: '秒回急救', mindreader: '心思解码', dateplanner: '约会策划',
    giftadvisor: '送礼参谋', checkup: '关系体检', chataid: '聊天急救',
    coach: '成长教练', breakuprescue: '分手挽回',
    chatanalysis: '聊天解读'
  };
  
  document.getElementById('tool-title').textContent = toolNames[toolId] || '工具';
  document.getElementById('tool-welcome').textContent = TOOL_WELCOME[toolId] || '说说你的情况，我来帮你。';
  document.getElementById('tool-messages').innerHTML = '';
  
  if (toolId === 'chatanalysis') {
    showChatAnalysisIntro();
  } else if (typeof renderToolLanding === 'function') {
    renderToolLanding(toolId);
  }
  
  showPage('tool');
  var _tc = document.querySelector('#page-tool .page-content'); if (_tc) _tc.scrollTop = 0;
}

// 聊天记录分析：说明 + 导出教程
function showChatAnalysisIntro() {
  const box = document.getElementById('tool-messages');
  box.innerHTML =
    '<div class="ca-card ca-what">' +
      '<div class="ca-card-title"><span class="ico-mi">'+iconSVG('chat')+'</span> 这是什么？</div>' +
      '<div class="ca-card-body">把你和 TA 的整段聊天发我，我帮你看：对方话里的情绪、对你的态度、关系卡在哪，以及下一步怎么接。比你一条条截图问看得更全。</div>' +
    '</div>' +
    '<div class="ca-card ca-how">' +
      '<div class="ca-card-title"><span class="ico-mi">'+iconSVG('phone')+'</span> 怎么导出聊天记录</div>' +
      '<div class="ca-step"><span class="ca-no">1</span><span>打开微信，进入你和 TA 的聊天界面</span></div>' +
      '<div class="ca-step"><span class="ca-no">2</span><span>长按任意一条消息，点「多选」</span></div>' +
      '<div class="ca-step"><span class="ca-no">3</span><span>勾选想分析的消息（可点「全选」）</span></div>' +
      '<div class="ca-step"><span class="ca-no">4</span><span>点转发图标，选「合并转发」发给「文件传输助手」</span></div>' +
      '<div class="ca-step"><span class="ca-no">5</span><span>打开那个合并记录，点右上角「···」选「转为文本」或直接复制</span></div>' +
      '<div class="ca-tip">小提示：嫌转文本麻烦？直接截图，回到聊天页点右下角「+」把图发我，我能直接看图帮你分析。</div>' +
      '<button class="ca-go" onclick="readyPasteChat()">我复制好了，去发送</button>' +
    '</div>';
}

function readyPasteChat() {
  const input = document.getElementById('tool-input') || document.getElementById('chat-input');
  // 切回主聊天页让用户粘贴
  showPage('chat');
  const ci = document.getElementById('chat-input');
  ci.placeholder = '粘贴聊天记录，发给我...';
  ci.focus();
  const isFemale = chatState.isFemale;
  const sp = isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
  const container = document.getElementById('chat-messages');
  container.innerHTML += renderMessageHtml('ai', '粘过来吧，长点也没事，我看完跟你说对方到底啥意思～', sp.name, sp.avatarUrl, false);
  scrollChatBottom();
}

function handleToolKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendToolMessage();
  }
}

async function sendToolMessage() {
  const input = document.getElementById('tool-input');
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  autoResize(input);
  
  const container = document.getElementById('tool-messages');
  const sp = (typeof chatState !== 'undefined' && chatState.isFemale) ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
  container.innerHTML += '<div class="message user"><div class="message-bubble">' + escapeHtml(text).replace(/\n/g, '<br>') + '</div></div>';
  container.innerHTML += '<div class="message ai" id="tool-typing">'
    + '<img class="message-avatar" src="' + sp.avatarUrl + '">'
    + '<div class="message-body"><div class="message-name">' + sp.name + '</div>'
    + '<div class="message-bubble typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>';
  container.scrollTop = container.scrollHeight;
  
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: (typeof getToolSystemPrompt === 'function' ? getToolSystemPrompt(currentToolId) : '你是知隅的沟通陪伴助手，定位是亲密关系沟通参考工具。回复具体、实用、口语化。') },
          { role: 'user', content: text }
        ],
        temperature: 0.8,
        max_tokens: 900
      })
    });
    
    const data = await response.json();
    document.getElementById('tool-typing')?.remove();
    
    let reply = '';
    if (data.choices && data.choices[0]) {
      reply = data.choices[0].message.content;
    } else {
      reply = '我想了想，最实在的还是真诚地把你心里想的说出来，这比啥话术都管用。要不你把前因后果再跟我说说，我陪你一句一句捋。';
    }
    
    container.innerHTML += renderMessageHtml('ai', reply, sp.name, sp.avatarUrl, false);
    var _pc = document.querySelector('#page-tool .page-content'); if (_pc) _pc.scrollTop = _pc.scrollHeight;
  } catch(e) {
    document.getElementById('tool-typing')?.remove();
    const sp2 = (typeof chatState !== 'undefined' && chatState.isFemale) ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
    container.innerHTML += renderMessageHtml('ai', '网络有点小问题，没发出去。你再点一次试试，要是还不行就稍等会儿～', sp2.name, sp2.avatarUrl, false);
  }
  updateSendButton();
}

// ============ Procenter ============
function refreshProcenter() {
  const profile = wx.getStorageSync('userProfile') || {};
  const membership = wx.getStorageSync('membership') || {};
  
  document.getElementById('pc-nickname').textContent = profile.nickname || '知隅用户';
  renderUserAvatar('pc-avatar', !!(profile.gender === 'female'));
  
  let status = '免费用户';
  if (membership.isVip && membership.vipEnd > Date.now()) status = '会员用户';
  document.getElementById('pc-status').textContent = status;
}

// ============ Member ============
function refreshMember() {
  const membership = wx.getStorageSync('membership') || {};
  const registerAt = wx.getStorageSync('registerAt') || Date.now();
  const elapsed = (Date.now() - registerAt) / (24 * 3600 * 1000);
  
  let phase = '试用期';
  let days = '';
  
  if (membership.isVip && membership.vipEnd > Date.now()) {
    phase = '会员';
    days = '到期：' + new Date(membership.vipEnd).toLocaleDateString();
  } else if (elapsed < 30) {
    phase = '试用期';
    days = '剩余 ' + Math.ceil(30 - elapsed) + ' 天';
  } else if (elapsed < 60) {
    phase = '第2月特惠';
    days = '9.9元开通';
  } else {
    phase = '已过期';
    days = '请续费';
  }
  
  document.getElementById('member-phase').textContent = phase;
  document.getElementById('member-days').textContent = days;
}

function selectPlan(planId) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

function payMember() {
  wx.showModal({
    title: '支付通道即将开通',
    content: '微信支付正在接入中，当前试用期内全部功能免费可用。',
    showCancel: false
  });
}

function redeemCode() {
  const code = document.getElementById('redeem-code').value.trim().toUpperCase();
  if (!code) return;
  
  const LOCAL_CODES = {
    ZHIYU7: { type: 'days', value: 7 },
    ZHIYU15: { type: 'days', value: 15 },
    TRIAL99: { type: 'discount', value: 9.9 }
  };
  
  const benefit = LOCAL_CODES[code];
  if (benefit) {
    let membership = wx.getStorageSync('membership') || {};
    if (benefit.type === 'days') {
      const base = membership.vipEnd > Date.now() ? membership.vipEnd : Date.now();
      membership.isVip = true;
      membership.vipEnd = base + benefit.value * 24 * 3600 * 1000;
      wx.setStorageSync('membership', membership);
      wx.showToast({ title: '已加赠' + benefit.value + '天' });
    }
    refreshMember();
  } else {
    wx.showToast({ title: '兑换码无效' });
  }
}

// ============ Settings ============
function refreshSettings() {}

function toggleScene() {
  const on = document.getElementById('setting-scene').checked;
  wx.setStorageSync('sceneMode', on ? 'dynamic' : 'wallpaper');
  wx.showToast({ title: on ? '已开启动态陪伴' : '已切换到壁纸模式' });
}

function toggleGyro() {
  const on = document.getElementById('setting-gyro').checked;
  wx.setStorageSync('gyroParallax', on);
  wx.showToast({ title: on ? '已开启体感视差' : '已关闭体感视差' });
}

function clearChatHistory() {
  wx.showModal({
    title: '确认清除',
    content: '确定要清除所有聊天记录吗？',
    success: function(res) {
      if (res.confirm) {
        chatStorage.clearHistory();
        wx.showToast({ title: '已清除' });
      }
    }
  });
}

function showUserAgreement() {
  wx.showModal({
    title: '用户协议',
    content: '知隅是一款AI情感成长陪伴工具。我们倡导健康、平等、互相尊重与磨合的亲密关系，反对任何形式的PUA、情感操控与物化。',
    showCancel: false
  });
}

function showPrivacyPolicy() {
  wx.showModal({
    title: '隐私政策',
    content: '你的测评答案与聊天记录保存在本机，仅用于生成个性化建议。我们不会将你的个人内容提供给任何第三方。',
    showCancel: false
  });
}

// ============ Utils ============
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 启动
document.addEventListener('DOMContentLoaded', init);

// ========== + 更多功能菜单 ==========
function toggleMoreMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('more-menu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    setTimeout(function() {
      document.addEventListener('click', closeMoreMenu);
    }, 50);
  } else {
    menu.classList.add('hidden');
    document.removeEventListener('click', closeMoreMenu);
  }
}

function closeMoreMenu(e) {
  const menu = document.getElementById('more-menu');
  const btn = document.querySelector('.plus-btn');
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add('hidden');
    document.removeEventListener('click', closeMoreMenu);
  }
}

// 导入聊天记录（占位）
function importChatHistory() {
  document.getElementById('more-menu').classList.add('hidden');
  wx.showModal({
    title: '导入聊天记录',
    content: '操作方法：\n1. 打开微信，进入和TA的聊天\n2. 长按任意一条消息，选「多选」\n3. 勾选后点左下角「转发」-「合并转发」可生成记录\n4. 或直接长按复制文字\n5. 回到这里粘贴发送\n\n我会帮你分析整段对话里的情绪和信号。',
    confirmText: '去复制',
    success: function(res) {
      if (res.confirm) {
        const input = document.getElementById('chat-input');
        input.placeholder = '粘贴聊天记录，发给我...';
        input.focus();
        renderMessageHtml && appendAiTip('把记录粘贴过来就行，长一点也没关系，我慢慢看～');
      }
    }
  });
}

function appendAiTip(text) {
  const container = document.getElementById('chat-messages');
  const isFemale = chatState.isFemale;
  const sp = isFemale ? SPEAKERS.zhinuan : SPEAKERS.yuchuan;
  container.innerHTML += renderMessageHtml('ai', text, sp.name, sp.avatarUrl, false);
  scrollChatBottom();
}

// 把图片文件压到指定最长边，返回 dataURL（jpeg）。用于控制请求体/本地存储体积
function compressImageFile(file, maxEdge, quality) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function(ev) {
      const img = new Image();
      img.onerror = reject;
      img.onload = function() {
        let w = img.width, h = img.height;
        if (Math.max(w, h) > maxEdge) {
          const scale = maxEdge / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// 上传图片：聊天截图/朋友圈等 → 压缩 → 入聊天记录 → 视觉AI(glm-4v-flash)分析
function uploadImage() {
  document.getElementById('more-menu').classList.add('hidden');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file || chatState.aiTyping) return;
    // 用户输入框里若有字，当作对这张图的补充提问
    const ci = document.getElementById('chat-input');
    const extraText = ci ? ci.value.trim() : '';
    Promise.resolve()
      .then(function() {
        // 高清图给AI看，保证小字截图能识别
        return compressImageFile(file, 1568, 0.82).then(function(hi) {
          // 缩略图存进本地聊天记录，避免撑爆存储
          return compressImageFile(file, 360, 0.7).then(function(thumb) {
            return { hi: hi, thumb: thumb };
          });
        });
      })
      .then(function(imgs) {
        if (ci) ci.value = '';
        // 存记录：content 是气泡里显示的文字，image 字段存缩略图
        chatStorage.saveMessage('user', extraText || '[图片]', { image: imgs.thumb });
        renderChatMessages();
        callAI(extraText || '帮我看看这张截图，说说对方到底啥意思', imgs.hi);
      })
      .catch(function(err) {
        console.error('图片处理失败:', err);
        wx.showToast({ title: '这张图没读出来，换一张试试' });
      });
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

// ============ 用户头像：同性别2张预设可选 + 可上传任意头像 + 可恢复默认 ============
// 与陪伴角色（屿川/知暖）区分：用户头像是"普通人"正脸形象，男生蓝青调、女生粉橙调
function getUserProfile() {
  return wx.getStorageSync('userProfile') || {};
}
var USER_PRESETS = {
  male:   ['images/avatars/user_m1.png', 'images/avatars/user_m2.png'],
  female: ['images/avatars/user_f1.png', 'images/avatars/user_f2.png']
};
var AV_VER = 'v3'; // 头像资源版本号，换图后用于破缓存

function getDefaultUserAvatar(isFemale) {
  const presets = isFemale ? USER_PRESETS.female : USER_PRESETS.male;
  // 记录用户选过的预设下标，没有就用第1张
  const idx = parseInt(wx.getStorageSync('userAvatarPreset'), 10);
  const chosen = (idx === 1 || idx === 2) ? presets[idx - 1] : presets[0];
  return chosen;
}

// 取得当前应显示的用户头像（自定义优先，否则预设）
function currentUserAvatar(isFemale) {
  const custom = wx.getStorageSync('userAvatar');
  if (custom) return { url: custom, custom: true };
  return { url: getDefaultUserAvatar(isFemale), custom: false };
}

function renderUserAvatar(elId, isFemale) {
  const el = document.getElementById(elId);
  if (!el) return;
  const cur = currentUserAvatar(isFemale);
  const src = cur.custom ? cur.url : cur.url + '?' + AV_VER;
  el.innerHTML = '<img src="' + src + '" alt="我的头像" class="user-avatar-img">';
  el.style.cursor = 'pointer';
  el.onclick = function() { openAvatarPicker(isFemale); };
}

function refreshAllUserAvatars(isFemale) {
  const profile = getUserProfile();
  const female = (typeof isFemale === 'boolean') ? isFemale : !!(profile && profile.gender === 'female');
  renderUserAvatar('duc-avatar', female);
  renderUserAvatar('pc-avatar', female);
}

// 头像选择弹层
function openAvatarPicker(isFemale) {
  closeAvatarPicker();
  const presets = isFemale ? USER_PRESETS.female : USER_PRESETS.male;
  const cur = currentUserAvatar(isFemale);
  const curIdx = parseInt(wx.getStorageSync('userAvatarPreset'), 10);
  const activePreset = cur.custom ? -1 : ((curIdx === 1 || curIdx === 2) ? curIdx - 1 : 0);

  const wrap = document.createElement('div');
  wrap.className = 'av-sheet-mask';
  wrap.id = 'av-sheet-mask';
  let items = '';
  presets.forEach(function(p, i) {
    const on = (!cur.custom && i === activePreset) ? ' on' : '';
    items += '<div class="av-opt' + on + '" onclick="pickPresetAvatar(' + i + ')">'
           + '<img src="' + p + '?' + AV_VER + '"></div>';
  });
  wrap.innerHTML =
    '<div class="av-sheet" onclick="event.stopPropagation()">'
    + '  <div class="av-sheet-title">选个头像</div>'
    + '  <div class="av-grid">' + items + '</div>'
    + '  <button class="av-btn av-btn-up" onclick="uploadCustomAvatar()">'+iconSVG('camera')+' 从相册选一张</button>'
    + (cur.custom ? '<button class="av-btn av-btn-reset" onclick="resetUserAvatar()">↺ 换回默认头像</button>' : '')
    + '  <button class="av-btn av-btn-cancel" onclick="closeAvatarPicker()">取消</button>'
    + '</div>';
  wrap.onclick = closeAvatarPicker;
  document.body.appendChild(wrap);
}

function closeAvatarPicker() {
  const old = document.getElementById('av-sheet-mask');
  if (old && old.parentNode) old.parentNode.removeChild(old);
}

function pickPresetAvatar(i) {
  const profile = getUserProfile();
  const isFemale = !!(profile && profile.gender === 'female');
  wx.setStorageSync('userAvatarPreset', String(i + 1));
  wx.removeStorageSync('userAvatar');
  closeAvatarPicker();
  refreshAllUserAvatars(isFemale);
  toast('头像换好啦');
}

function resetUserAvatar() {
  const profile = getUserProfile();
  const isFemale = !!(profile && profile.gender === 'female');
  wx.removeStorageSync('userAvatar');
  wx.setStorageSync('userAvatarPreset', '1');
  closeAvatarPicker();
  refreshAllUserAvatars(isFemale);
  toast('已换回默认头像');
}

function uploadCustomAvatar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2, sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        const data = canvas.toDataURL('image/jpeg', 0.85);
        try {
          wx.setStorageSync('userAvatar', data);
        } catch (err) {
          toast('图片太大存不下，换一张试试');
          return;
        }
        const profile = getUserProfile();
        const isFemale = !!(profile && profile.gender === 'female');
        closeAvatarPicker();
        refreshAllUserAvatars(isFemale);
        toast('头像换好啦');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

// 轻提示（若无全局 toast 则兜底）
function toast(msg) {
  if (window.showToast) { window.showToast(msg); return; }
  let t = document.getElementById('zy-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'zy-toast';
    t.className = 'zy-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('show'); }, 1600);
}
