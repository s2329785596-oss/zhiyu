/**
 * 知隅 APP 端 · 高德真实场所检索
 *
 * 为什么用 JSONP 不用 fetch：
 * Capacitor 的 WebView 里 origin 是 capacitor:// 或 file://，
 * 高德 restapi 没返回 Access-Control-Allow-Origin，直接 fetch 会被 CORS 拦。
 * 高德支持 callback 参数，JSONP 能绕过去。
 *
 * Key 写在前端是没办法的事（纯静态应用没有后端）。
 * 高德个人开发者 Key 没绑卡不能扣费，最坏情况是额度被刷完当天不能用，不会产生费用。
 */
(function () {
  'use strict';

  var KEY = '4d672eb0d6dc391bc8abadb1e9eaf53f';
  var BASE = 'https://restapi.amap.com/v3/place/text';

  var GROUPS = {
    food: { label: '吃', kws: ['咖啡厅', '西餐厅', '日料', '火锅', '甜品店'] },
    play: { label: '玩', kws: ['游乐场', '公园', '密室', '电影院', '剧本杀', '陶艺', 'KTV'] }
  };

  var CITIES = [
    '北京', '上海', '天津', '重庆',
    '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '苏州', '长沙', '郑州', '青岛', '沈阳',
    '大连', '宁波', '厦门', '福州', '济南', '合肥', '昆明', '哈尔滨', '长春', '石家庄', '太原', '南昌',
    '贵阳', '南宁', '兰州', '西宁', '银川', '乌鲁木齐', '呼和浩特', '拉萨', '海口', '三亚',
    '无锡', '常州', '徐州', '南通', '扬州', '镇江', '泰州', '盐城', '连云港', '淮安', '宿迁',
    '温州', '嘉兴', '湖州', '绍兴', '金华', '台州', '丽水', '衢州', '舟山',
    '佛山', '东莞', '珠海', '中山', '惠州', '江门', '汕头', '湛江', '肇庆', '茂名', '揭阳', '潮州',
    '泉州', '漳州', '莆田', '宁德', '龙岩', '三明', '南平',
    '烟台', '潍坊', '淄博', '济宁', '临沂', '泰安', '威海', '日照', '东营', '德州', '聊城', '滨州',
    '洛阳', '开封', '新乡', '安阳', '南阳', '许昌', '平顶山', '焦作', '商丘', '信阳', '周口',
    '唐山', '保定', '廊坊', '秦皇岛', '邯郸', '邢台', '沧州', '承德', '张家口', '衡水',
    '芜湖', '蚌埠', '安庆', '马鞍山', '阜阳', '六安', '黄山',
    '宜昌', '襄阳', '荆州', '十堰', '黄石', '孝感', '荆门', '黄冈', '咸宁',
    '株洲', '湘潭', '衡阳', '岳阳', '常德', '郴州', '益阳', '永州',
    '绵阳', '德阳', '宜宾', '南充', '泸州', '乐山', '自贡', '达州',
    '遵义', '六盘水', '安顺', '曲靖', '玉溪', '大理', '丽江', '西双版纳',
    '桂林', '柳州', '北海', '梧州', '玉林',
    '吉林', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '盘锦', '葫芦岛',
    '大庆', '齐齐哈尔', '牡丹江', '佳木斯',
    '包头', '鄂尔多斯', '赤峰',
    '宝鸡', '咸阳', '渭南', '延安', '榆林', '汉中',
    '天水', '酒泉', '敦煌',
    '义乌', '昆山', '江阴', '常熟', '张家港', '慈溪', '余姚', '诸暨', '晋江', '石狮'
  ];

  var cbSeq = 0;

  function jsonp(url) {
    return new Promise(function (resolve) {
      var name = '__zyamap_' + (++cbSeq) + '_' + Date.now();
      var script = document.createElement('script');
      var done = false;

      function cleanup() {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { delete window[name]; } catch (e) { window[name] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      var timer = setTimeout(function () { cleanup(); resolve(null); }, 6000);
      window[name] = function (data) { cleanup(); resolve(data); };
      script.onerror = function () { cleanup(); resolve(null); };
      script.src = url + '&callback=' + name;
      document.head.appendChild(script);
    });
  }

  // 优先 fetch：APP 里开了 CapacitorHttp，走原生 HTTP，没有跨域问题，比 JSONP 快
  // 浏览器直开 H5 时 fetch 会被 CORS 拦，自动落到 JSONP
  async function request(url) {
    try {
      var r = await fetch(url);
      var d = await r.json();
      if (d && d.status) return d;
    } catch (e) {
      // ignore, fallback to jsonp
    }
    return jsonp(url);
  }

  function extractCity(text) {
    if (!text) return null;
    var s = String(text);
    var best = null;
    for (var i = 0; i < CITIES.length; i++) {
      if (s.indexOf(CITIES[i]) >= 0) {
        if (!best || CITIES[i].length > best.length) best = CITIES[i];
      }
    }
    return best;
  }

  function extractBudget(text) {
    if (!text) return 0;
    var s = String(text);
    var m = s.match(/(?:预算|人均|一个人|每人|大概|差不多|不超过|以内|左右)\D{0,6}(\d{2,5})/);
    if (m) return parseInt(m[1], 10);
    m = s.match(/(\d{2,5})\s*(?:元|块|左右|以内|上下)/);
    if (m) return parseInt(m[1], 10);
    return 0;
  }

  function normalize(poi, groupLabel, kw) {
    if (!poi || !poi.name) return null;
    var biz = poi.biz_ext || {};
    var rating = parseFloat(biz.rating);
    var cost = parseFloat(biz.cost);

    if (/(旧址|公寓|住宅|小区|停车场|收费站|加油站|售楼|中介|公司|办事处|营业厅|银行|药店|诊所|学校|幼儿园|培训)/.test(poi.name)) return null;
    if (/[^\x00-\xff]{4,}[-－—][^\x00-\xff]{2,}/.test(poi.name)) return null;
    if (!isNaN(rating) && rating > 0 && rating < 4.0) return null;

    return {
      name: String(poi.name).slice(0, 40),
      group: groupLabel,
      kw: kw,
      type: (poi.type || '').split(';').slice(-1)[0] || '',
      rating: isNaN(rating) ? null : rating,
      cost: isNaN(cost) ? null : cost,
      district: poi.adname || '',
      address: String(poi.address || '').slice(0, 50),
      tel: poi.tel && poi.tel !== '[]' ? String(poi.tel).split(';')[0] : '',
      openTime: biz.open_time || biz.opentime2 || '',
      tag: String(poi.tag || '').slice(0, 40)
    };
  }

  var CACHE = {};
  var CACHE_TTL = 30 * 60 * 1000;

  function cacheGet(k) {
    var it = CACHE[k];
    if (!it) return null;
    if (Date.now() - it.at > CACHE_TTL) { delete CACHE[k]; return null; }
    return it.value;
  }

  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  /**
   * 查真实场所
   * @param {object} opt {city, groups, budget, perKw}
   */
  async function searchPlaces(opt) {
    opt = opt || {};
    var city = opt.city || '';
    if (!city) return { ok: false, error: 'no_city', places: [] };

    var groups = (opt.groups && opt.groups.length) ? opt.groups : ['food', 'play'];
    var budget = opt.budget || 0;
    var perKw = opt.perKw || 5;

    var cacheKey = city + '|' + groups.join(',') + '|' + budget + '|' + perKw;
    var hit = cacheGet(cacheKey);
    if (hit) return hit;

    var perGroupKw = Math.max(2, Math.ceil(6 / groups.length));
    var picked = [];
    groups.forEach(function (g) {
      var cfg = GROUPS[g];
      if (!cfg) return;
      cfg.kws.slice(0, perGroupKw).forEach(function (kw) {
        picked.push({ group: cfg.label, kw: kw });
      });
    });

    var all = [];
    for (var i = 0; i < picked.length; i++) {
      var t = picked[i];
      var url = BASE +
        '?key=' + encodeURIComponent(KEY) +
        '&keywords=' + encodeURIComponent(t.kw) +
        '&city=' + encodeURIComponent(city) +
        '&citylimit=true' +
        '&offset=' + perKw +
        '&page=1' +
        '&extensions=all';
      var data = await request(url);
      if (data && data.status === '1' && Array.isArray(data.pois)) {
        data.pois.forEach(function (p) {
          var n = normalize(p, t.group, t.kw);
          if (n) all.push(n);
        });
      }
      if (i < picked.length - 1) await sleep(420);
    }

    var seen = {};
    var uniq = [];
    all.forEach(function (p) {
      var k = p.name + '|' + p.address;
      if (seen[k]) return;
      seen[k] = 1;
      uniq.push(p);
    });

    var filtered = uniq;
    if (budget > 0) {
      var cap = Math.round(budget * 1.25);
      filtered = uniq.filter(function (p) {
        if (p.cost === null) return true;
        return p.cost <= cap;
      });
    }

    filtered.sort(function (a, b) {
      if (a.rating === null && b.rating === null) return 0;
      if (a.rating === null) return 1;
      if (b.rating === null) return -1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.cost || 0) - (b.cost || 0);
    });

    var byKw = {};
    var final = [];
    filtered.forEach(function (p) {
      var k = p.kw || p.group;
      byKw[k] = (byKw[k] || 0) + 1;
      if (byKw[k] <= 2) final.push(p);
    });

    var result = { ok: final.length > 0, city: city, places: final };
    CACHE[cacheKey] = { at: Date.now(), value: result };
    return result;
  }

  function buildInjectBlock(result) {
    if (!result || !result.ok) return '';
    var lines = [];
    lines.push('【高德实时检索到的真实场所｜' + result.city + '】');
    lines.push('下面是刚从高德查回来的，都是真实存在的店和景点。');
    lines.push('');

    ['吃', '玩', '逛'].forEach(function (g) {
      var list = result.places.filter(function (p) { return p.group === g; });
      if (!list.length) return;
      lines.push('— ' + g + ' —');
      list.forEach(function (p) {
        var parts = [p.name];
        if (p.type) parts.push(p.type);
        if (p.district) parts.push(p.district);
        if (p.rating !== null) parts.push('评分' + p.rating);
        if (p.cost !== null) parts.push('人均' + p.cost + '元');
        if (p.openTime) parts.push(p.openTime);
        if (p.tag) parts.push('招牌：' + p.tag);
        if (p.tel) parts.push('电话' + p.tel);
        lines.push('· ' + parts.join(' | '));
        if (p.address) lines.push('  地址：' + p.address);
      });
      lines.push('');
    });

    lines.push('【怎么用这批数据｜硬规则，必须遵守】');
    lines.push('1. 推荐地点只能从上面这批里挑，不许自己编店名、编景点。上面没有的，就说"这块我这边暂时查不到合适的，你可以说个大致范围我再找"。');
    lines.push('2. 人均有数字的，报数字；没数字的（景区、公园、博物馆基本都没有），不要估、不要编，就说"门票/消费以现场公示为准，去之前在美团或高德上确认一下"。');
    lines.push('3. 营业时间有写的，看仔细。已经关门的地方不要推荐。');
    lines.push('4. 挑的时候同时看四件事：评分（低于 4.0 的不推）、人均（对得上预算）、位置（尽量在同一个区）、类型（对得上她的偏好）。');
    lines.push('5. 不要把所有店都列出来。挑 3-4 个组成一条线，说明为什么这么排。');
    lines.push('6. 不要说"根据高德数据"这种话，自然地说"这家在崂山区，评分 4.7，人均 57"就行。');
    lines.push('');

    return lines.join('\n');
  }

  window.ZYAmap = {
    extractCity: extractCity,
    extractBudget: extractBudget,
    searchPlaces: searchPlaces,
    buildInjectBlock: buildInjectBlock
  };
})();
