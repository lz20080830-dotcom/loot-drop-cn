/* ============================================================
   创业坟场 · app.js
   数据来自 js/data.js（由 tools/build-data.mjs 生成）
   字段: 0名字 1行业 2创办年 3死亡年 4融资额 5死因idx 6产品类型
         7国家 8价值主张(英) 9死因(英) 10难度 11可扩展性 12市场潜力 13描述(英)
   ============================================================ */
"use strict";

/* ---------- 中文映射 ---------- */
const CAUSE_ZH = [
  { zh: "被巨头碾碎", icon: "🐜" },
  { zh: "算不过账",   icon: "➗" },
  { zh: "弹尽粮绝",   icon: "🔥" },
  { zh: "没人要的产品", icon: "🔮" },
  { zh: "触礁监管",   icon: "⚖️" },
  { zh: "技术难产",   icon: "🍋" },
  { zh: "团队内讧",   icon: "🧨" },
];
const CAUSE_VIBE = {
  0: "好产品，但被 Google / Facebook / Amazon 们吃掉了。大厂抄你只是周一早上的例行动作。",
  1: "获客成本 > 用户终身价值。这门账从第一天起就没算平，规模只是把亏损放大。",
  2: "融资烧完，下一笔没来。现金流断裂不是死因，是死状。",
  3: "造出了一个不存在的需求。幻灭之前，它们都以为自己在改变世界。",
  4: "它们选择了和监管对抗——监管赢了。一纸文件就能清零一个行业。",
  5: "技术始终停留在 PPT 和演示视频里。承诺的产品，从来没有真正工作过。",
  6: "不是被对手杀死的，是创始人先散了。股权、权力、方向，都能掀桌子。",
};
const SECTOR_ZH = {
  "Communication Services": ["通信与传媒", "COMM & MEDIA"],
  "Consumer": ["消费", "CONSUMER"],
  "Information Technology": ["信息技术", "INFO TECH"],
  "Financials": ["金融", "FINANCIALS"],
  "Industrials": ["工业", "INDUSTRIALS"],
  "Health Care": ["医疗健康", "HEALTH CARE"],
  "Real Estate": ["房地产", "REAL ESTATE"],
  "Utilities": ["公用事业", "UTILITIES"],
  "Energy": ["能源", "ENERGY"],
  "Materials": ["原材料", "MATERIALS"],
};
/* 国家 → ISO 代码芯片（Windows 缺少国旗 emoji 字形，统一用代码风格） */
const CC = {
  USA: "US", China: "CN", UK: "GB", India: "IN", Australia: "AU", Indonesia: "ID",
  Poland: "PL", Canada: "CA", Germany: "DE", France: "FR", Israel: "IL", Singapore: "SG",
  Japan: "JP", "South Korea": "KR", Sweden: "SE", Switzerland: "CH", Netherlands: "NL",
  Brazil: "BR", Mexico: "MX", Nigeria: "NG", Kenya: "KE", Spain: "ES", Italy: "IT",
  Russia: "RU", Turkey: "TR", UAE: "AE", Vietnam: "VN", Thailand: "TH", Philippines: "PH",
  Malaysia: "MY", Argentina: "AR", Chile: "CL", Colombia: "CO", Ireland: "IE", Belgium: "BE",
  Austria: "AT", Denmark: "DK", Finland: "FI", Norway: "NO", Portugal: "PT", Greece: "GR",
  Romania: "RO", Ukraine: "UA", "Saudi Arabia": "SA", Pakistan: "PK", Bangladesh: "BD",
  Egypt: "EG", "South Africa": "ZA", "New Zealand": "NZ", "Hong Kong": "HK", Taiwan: "TW",
  Luxembourg: "LU", Estonia: "EE", Lithuania: "LT", Croatia: "HR", Serbia: "RS",
  "Czech Republic": "CZ", Hungary: "HU", "Sri Lanka": "LK", Kazakhstan: "KZ", Morocco: "MA",
  Jordan: "JO", Peru: "PE", Ghana: "GH", Iceland: "IS", Latvia: "LV", Cyprus: "CY",
};
const flag = (c) => `<span class="cc">${c ? (CC[c] || c.slice(0, 2).toUpperCase()) : "??"}</span>`;
const MP_ZH = { 3: "高", 2: "中", 1: "低" };

/* ---------- 口令解锁（20 份中文验尸报告） ----------
   口令在公众号「志投助手」回复「坟场」获取。
   换口令：node tools/passcode-hash.mjs 新口令，替换下面两个值。 */
const PASSCODE_SHA256 = "0589c622427330a3d3c19f3953f46e7e18faf9262e99c5e54bd36d4c923e59be";
const PASSCODE_DJB2 = "bde0d63e"; // 无 WebCrypto 环境（如 file://）的降级校验
const LOCK_KEY = "ldgzh_pass_v1";
const isUnlocked = () => { try { return localStorage.getItem(LOCK_KEY) === "1"; } catch { return false; } };
async function passcodeOk(input) {
  const code = input.trim();
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
    const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex === PASSCODE_SHA256;
  }
  let h = 5381;
  for (const c of "lootdrop::gzh::v1" + code) h = (((h << 5) + h) + c.charCodeAt(0)) >>> 0;
  return h.toString(16) === PASSCODE_DJB2;
}

/* ---------- 名尸陈列室：手写中文验尸报告（20 例） ---------- */
const FEATURED = [
  { name: "Silicon Valley Bank", zh: "硅谷银行", metricLabel: "资产规模",
    epitaph: "为半个硅谷保管了四十年的钱，用一个周末全部亏光。",
    story: "它曾是科技初创企业的「御用银行」，把大量低息存款投进长期国债。美联储激进加息后债券浮亏爆雷，储户 48 小时内挤兑 420 亿美元，酿成美国史上第二大银行倒闭案。把「稳健」建立在单一利率赌注上的银行，死得比创业公司更快。",
    valueZh: "为科技初创企业提供存款、融资与现金管理的全生命周期银行服务。",
    deathZh: "利率飙升导致国债持仓巨亏，引发教科书级挤兑。" },
  { name: "Wirecard", zh: "Wirecard 支付",
    epitaph: "账上躺着 19 亿欧元——后来发现，这 19 亿欧元从未存在过。",
    story: "欧洲最大支付公司之一、德国 DAX 指数蓝筹股。2020 年审计师发现 19 亿欧元现金凭空消失，CEO 被捕，公司四天内破产。德国战后最大会计丑闻，安然的德国翻版。",
    valueZh: "为电商与商户提供全球支付处理、发卡与风控服务。",
    deathZh: "长期系统性财务造假被审计揭穿，信任一夜归零。" },
  { name: "WeWork", zh: "WeWork",
    epitaph: "把二房东生意讲成了改变世界的故事，估值 470 亿——直到大家发现它只是个二房东。",
    story: "用「办公空间 + 社区 + 生活方式」的故事融到 220 亿美元，估值一度 470 亿。招股书暴露惊人亏损与治理混乱后 IPO 熔断，估值蒸发 96%，软银接管。资本可以放大一门生意，但改变不了生意的本质。",
    valueZh: "弹性联合办公空间 + 会员社区，让办公像订阅服务一样按需购买。",
    deathZh: "长租转短租的重资产模式，收入覆盖不了成本，规模越大亏得越多。" },
  { name: "FTX", zh: "FTX 交易所",
    epitaph: "加密货币的救世主交易所，挪用客户的钱去救别人，最后把自己救死了。",
    story: "全球第三大加密交易所，创始人 SBF 被视为行业良心。2022 年底流动性危机曝光其挪用客户资产给关联对冲基金 Alameda，8 天内从 320 亿美元估值到申请破产，SBF 获刑 25 年。",
    valueZh: "提供加密货币现货与衍生品交易的一站式交易所。",
    deathZh: "客户资产被挪用，挤兑之下挪用链条全面崩塌。" },
  { name: "Theranos", zh: "Theranos 滴血验身",
    epitaph: "一滴血改变世界——可惜那滴血从来没测准过。",
    story: "Elizabeth Holmes 承诺用指尖几滴血完成数百项检测，估值 90 亿美元。《华尔街日报》调查显示核心技术根本不达标，公司用第三方设备冒充自家技术。Holmes 获刑 11 年——硅谷「fake it till you make it」的终极反面教材。",
    valueZh: "用专利微流控技术，几滴指尖血完成上百项医学检测。",
    deathZh: "核心技术从未达到宣称精度，以造假维持叙事。" },
  { name: "Quibi", zh: "Quibi 短剧",
    epitaph: "烧掉 17.5 亿美元，证明了一件事：没人需要在等咖啡的 8 分钟里看好莱坞。",
    story: "好莱坞大佬卡森伯格 + 前迪士尼 CEO 梅耶尔，专做手机竖屏精品短剧。上线 6 个月即宣布关停。疫情把「排队、通勤」这些它赖以生存的碎片场景一扫而空，产品连投屏和截图都不允许。",
    valueZh: "专为手机竖屏制作的 10 分钟内精品短剧，填补碎片时间。",
    deathZh: "需求场景不成立，付费意愿不足，疫情期场景彻底消失。" },
  { name: "Juicero", zh: "Juicero 榨汁机",
    epitaph: "一台 400 美元的 WiFi 榨汁机——后来被证明用手挤包装袋效果一样。",
    story: "融资 1.2 亿美元打造云端连接的「智能冷压榨汁机」与专供果汁包。彭博记者徒手挤压果汁包，比机器更快。它沦为硅谷过度工程的永久笑柄：解决一个用手就能解决的问题。",
    valueZh: "智能高压冷压榨汁机 + 订阅制新鲜果汁包，一键喝上鲜榨果蔬汁。",
    deathZh: "产品解决的「问题」用手就能解决，过度工程没有价值。" },
  { name: "Northvolt", zh: "Northvolt 电池",
    epitaph: "欧洲对抗亚洲电池工业的全部希望，倒在了量产爬坡的路上。",
    story: "欧洲本土最大电池制造商，融资 150 亿美元，客户包括宝马、沃尔沃。但瑞典工厂良率迟迟爬不上去，宝马撤销订单，2024 年申请破产保护——欧洲电池自主化的最大押注熄火。",
    valueZh: "用清洁能源为欧洲车企生产本土化、可持续的锂电池。",
    deathZh: "产能爬坡失败 + 客户流失，巨额资本开支在现金流枯竭后无以为继。" },
  { name: "Byju's", zh: "Byju's 教育",
    epitaph: "印度教育科技的骄傲，估值 220 亿——最后连工资都发不出来。",
    story: "全球估值最高的教育科技公司。疫情红利消失后增长熄火，激进收购留下巨额债务，审计与治理危机接连爆发，2025 年被印度法庭启动破产程序。增长可以买来，但买不来保质期。",
    valueZh: "通过 App 为 K12 学生提供个性化视频课程与互动学习。",
    deathZh: "疫情红利消失后增长崩塌，激进并购 + 财务违规 + 融资断档。" },
  { name: "Argo AI", zh: "Argo AI 自动驾驶",
    epitaph: "福特和大众投了 36 亿美元，最后承认：L4 没那么快。",
    story: "福特与大众联合押注的自动驾驶明星公司。2022 年两家东家同时收手，公司直接关闭。L4 的落地时间被证明比想象中长一个数量级，福特随即把资源转向 L2+ 辅助驾驶。愿景没有错，错的是钱等不了那么久。",
    valueZh: "为车企提供 L4 级自动驾驶系统与运营平台。",
    deathZh: "商业化路径过长，股东战略收缩，投资周期无法支撑。" },
  { name: "LeEco", zh: "乐视",
    epitaph: "为梦想窒息。",
    story: "「平台 + 内容 + 终端 + 应用」七大生态同时开战：电视、手机、体育、汽车、金融……资金链 2017 年断裂，贾跃亭赴美造车至今未归。中国互联网史上最著名的「生态化反」失败，七大子生态几乎全部阵亡。",
    valueZh: "以视频网站起家，构建覆盖内容、硬件、体育、汽车的完整生态。",
    deathZh: "七大生态同时烧钱，融资节奏跟不上扩张野心，资金链断裂。" },
  { name: "Ezubao", zh: "e租宝",
    epitaph: "一年半吸金 500 亿，95% 的项目是编的。",
    story: "以 A2P 网贷之名行庞氏之实，向 90 万投资者非法集资超 500 亿元人民币，2016 年被一锅端。中国 P2P 时代最标志性的崩盘，主犯被判无期徒刑。宣传语「1 元起投，稳赚不赔」成了 90 万人的噩梦。",
    valueZh: "线上融资租赁债权转让理财，宣称年化 9%-14.6% 保本保息。",
    deathZh: "庞氏骗局被定性为非法集资，监管收网。" },
  { name: "WM Motor", zh: "威马汽车",
    epitaph: "新势力四强之一，倒在了价格战开打的前夜。",
    story: "曾与蔚小理并称新势力四强，累计融资近 410 亿元人民币。但产品始终没有爆款，销量持续掉队，EX5 自燃召回雪上加霜。2023 年申请预重整，工厂停摆、门店关闭——新能源淘汰赛的第一个大块头倒下。",
    valueZh: "面向大众市场的智能电动汽车整车制造。",
    deathZh: "单车毛利率长期为负 + 销量规模掉队，融资输血中断。" },
  { name: "Xingsheng Youxuan", zh: "兴盛优选",
    epitaph: "社区团购大战中，最后一支撤退的部队。",
    story: "湖南起家的社区团购独角兽，腾讯、京东都投了。美团优选、多多买菜用补贴 + 流量碾压全场，2024 年起大规模撤城收缩，2025 年业务全面停摆。烧掉 300 多亿人民币后，社区团购没有赢家，只有还没退场的输家。",
    valueZh: "以社区小店为自提点的次日达团购，预售制卖生鲜百货。",
    deathZh: "巨头以亏损补贴打消耗战，区域玩家的规模劣势无法逆转。" },
  { name: "Yuanfudao", zh: "猿辅导",
    epitaph: "双减一纸文件，中国在线教育大厦一夜清零。",
    story: "K12 在线辅导独角兽，估值一度 155 亿美元，腾讯、高瓴加持。2021 年「双减」政策落地，K12 学科类培训一夜之间失去商业化资格。它转型素质教育与学习硬件活了下来，但那个千亿赛道连同它的估值一起，留在了 2021。",
    valueZh: "在线直播大班课 + AI 互动课，覆盖 K12 全学科辅导。",
    deathZh: "行业性监管巨变，主营业务在政策之下无法继续经营。" },
  { name: "Nuverse", zh: "朝夕光年",
    epitaph: "字节跳动证明了：再多的钱，也买不来做游戏的耐心。",
    story: "字节跳动旗下游戏品牌，豪掷 40 亿美元收购沐瞳、有爱互娱，全球招兵买马。但五年拿不出一个自研爆款，买量打法在游戏业失灵。2023 年底大规模裁员，游戏业务整体关停——中国大厂游戏梦的最贵一次失败。",
    valueZh: "面向全球市场的手游研发与发行平台。",
    deathZh: "缺乏自研爆款，流量打法失灵，字节战略收缩回主业。" },
  { name: "Zuoyebang", zh: "作业帮",
    epitaph: "拍照搜题起家，终结它的不是对手，是一份文件。",
    story: "从「拍照搜题」工具长成的 K12 巨头，估值 96 亿美元。双减之后 K12 业务归零，转型学习机、打印机等智能硬件。它的「死亡年份」定格在 2021——中国 K12 在线教育整体消亡的那一年。",
    valueZh: "拍照搜题工具 + 在线直播课，用流量红利快速变现。",
    deathZh: "政策终结了 K12 学科培训的商业模式。" },
  { name: "Gionee", zh: "金立手机",
    epitaph: "金品质，立天下——最后赌输在澳门的牌桌上。",
    story: "一代国产手机巨头，刘德华代言、年销数千万台。创始人刘立荣被曝在澳门豪赌输掉十几亿资金，叠加供应链欠款与持续失血，2018 年破产清算。「金品质立天下」成了国产手机黄金年代的一句墓志铭。",
    valueZh: "面向下沉市场的长续航功能机与智能机。",
    deathZh: "创始人挪用资金赌博 + 行业竞争加剧，资金链断裂。" },
  { name: "Ofo", zh: "ofo 小黄车",
    epitaph: "共享经济元年最亮的星，押金退到今天还没排完队。",
    story: "无桩共享单车的开创者。戴威先后拒绝滴滴与阿里的收购，坚持独立对抗摩拜。烧钱大战后一地鸡毛：1600 万用户排队退押金，公司被列为失信被执行人，成千上万辆小黄车成了城市钢铁垃圾。",
    valueZh: "扫码即走的无桩共享单车，解决最后 1 公里出行。",
    deathZh: "单车运维成本高于骑行收入，押金模式被监管禁止，融资断档。" },
  { name: "Panda TV", zh: "熊猫直播",
    epitaph: "王思聪的直播间。最后一夜，百万用户守着屏幕不肯下线。",
    story: "王思聪创办的游戏直播平台，重金挖角头部主播。但在虎牙、斗鱼的上市军备竞赛中掉队，拖欠主播薪资，资金链断裂，2019 年关停。最后一夜满屏「晚安」，中国直播史上最体面的一次告别。",
    valueZh: "游戏与泛娱乐直播平台，用明星主播与赛事版权拉新。",
    deathZh: "头部主播天价签约费烧穿现金流，融资断档后掉出第一梯队。" },
];

/* ---------- 解析数据 ---------- */
// data.js 以顶层 const S 声明（全局词法作用域，不在 window 上），这里直接引用
const RAW = typeof S !== "undefined" ? S : [];
const DATA = RAW.map((r, i) => ({
  id: i, name: r[0], sector: r[1], sy: r[2], ey: r[3], fund: r[4],
  cause: r[5], type: r[6], country: r[7],
  valueEn: r[8], deathEn: r[9],
  diff: r[10], scal: r[11], mp: r[12], desc: r[13],
}));

const $ = (sel) => document.querySelector(sel);
const causeZh = (i) => (CAUSE_ZH[i] ? CAUSE_ZH[i].zh : "未知");
const money = (f) => {
  if (!f) return "";
  if (f >= 1e8) return "$" + (f / 1e8).toFixed(f / 1e8 >= 10 ? 0 : 1) + "亿";
  if (f >= 1e4) return "$" + Math.round(f / 1e4) + "万";
  return "$" + f;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 打字机 ---------- */
const TYPE_LINES = [
  "> 正在扫描墓园……找到 1749 座墓碑",
  "> 死因分析：51.5% 死于竞争，15.4% 算不过账",
  "> 平均尸龄：5.4 年 · 最大单笔损失：$2090 亿",
  "> 提示：每一座墓碑下面，都埋着一份没人捡走的战利品",
];
(function typewriter() {
  const el = $("#typewriter");
  let li = 0, ci = 0, deleting = false;
  function tick() {
    const line = TYPE_LINES[li];
    el.textContent = line.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > line.length) { deleting = true; setTimeout(tick, 2600); return; }
    } else {
      ci -= 3;
      if (ci <= 0) { ci = 0; deleting = false; li = (li + 1) % TYPE_LINES.length; }
    }
    setTimeout(tick, deleting ? 18 : 55);
  }
  tick();
})();

/* ---------- 数字滚动 ---------- */
function animateCounters(root) {
  root.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimal || "0");
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1800;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * ease).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
}
animateCounters($(".hero"));

/* ---------- 烧钱排行榜 ---------- */
(function burnList() {
  const top = [...DATA].filter((r) => r.fund > 0).sort((a, b) => b.fund - a.fund).slice(0, 10);
  const max = top[0].fund;
  const wrap = $("#burn-list");
  wrap.innerHTML = top.map((r, i) => `
    <div class="burn-row" data-name="${esc(r.name)}">
      <div class="burn-rank">${String(i + 1).padStart(2, "0")}</div>
      <div class="burn-name">${esc(r.name)}${r.name === "Silicon Valley Bank" ? "" : ""}
        <small>${flag(r.country)} ${esc(SECTOR_ZH[r.sector] ? SECTOR_ZH[r.sector][0] : r.sector)} · ${r.sy || "?"}–${r.ey || "?"} · ${causeZh(r.cause)}</small>
      </div>
      <div class="burn-bar-wrap"><div class="burn-bar" data-w="${Math.max(3, Math.round(r.fund / max * 100))}"></div></div>
      <div class="burn-amount">${money(r.fund) || "—"}</div>
    </div>`).join("");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    wrap.querySelectorAll(".burn-bar").forEach((b) => (b.style.width = b.dataset.w + "%"));
  }));
  wrap.querySelectorAll(".burn-row").forEach((row) =>
    row.addEventListener("click", () => openModalByName(row.dataset.name)));
})();

/* ---------- 死因图谱 ---------- */
(function causes() {
  const counts = Array(CAUSE_ZH.length).fill(0);
  DATA.forEach((r) => { if (r.cause >= 0 && r.cause < counts.length) counts[r.cause]++; });
  const total = DATA.length;
  const icons = CAUSE_ZH.map((c) => c.icon);
  $("#cause-grid").innerHTML = counts.map((n, i) => `
    <div class="cause-card">
      <div class="cause-head">
        <span class="cause-icon">${icons[i]}</span>
        <span class="cause-name">${CAUSE_ZH[i].zh}</span>
        <span class="cause-count">${n}<small>家</small></span>
      </div>
      <div class="cause-vibe">${CAUSE_VIBE[i]}</div>
      <div class="cause-bar-wrap"><div class="cause-bar" data-w="${(n / total * 100).toFixed(1)}"></div></div>
      <div class="cause-pct">占全部尸体的 ${(n / total * 100).toFixed(1)}% // CAUSE_${String(i).padStart(2, "0")}</div>
    </div>`).join("");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".cause-bar").forEach((b) => (b.style.width = b.dataset.w + "%"));
      io.unobserve(e.target);
    }
  }), { threshold: 0.2 });
  io.observe($("#cause-grid"));
})();

/* ---------- 行业坟场 ---------- */
(function sectors() {
  const m = {};
  DATA.forEach((r) => { if (r.sector) m[r.sector] = (m[r.sector] || 0) + 1; });
  const arr = Object.entries(m).sort((a, b) => b[1] - a[1]);
  $("#sector-grid").innerHTML = arr.map(([sec, n]) => {
    const zh = SECTOR_ZH[sec] ? SECTOR_ZH[sec][0] : sec;
    const en = SECTOR_ZH[sec] ? SECTOR_ZH[sec][1] : "";
    return `<div class="sector-card" data-sector="${esc(sec)}">
      <div class="go">↗</div>
      <div class="sector-zh">${esc(zh)}</div>
      <div class="sector-en">${esc(en)}</div>
      <div class="sector-count">${n}<small> 座墓碑</small></div>
    </div>`;
  }).join("");
  $("#sector-grid").querySelectorAll(".sector-card").forEach((card) =>
    card.addEventListener("click", () => {
      $("#db-sector").value = card.dataset.sector;
      renderDB(true);
      $("#database").scrollIntoView({ behavior: "smooth" });
    }));
})();

/* ---------- 死亡时间线 ---------- */
(function timeline() {
  const m = {};
  DATA.forEach((r) => { if (r.ey) m[r.ey] = (m[r.ey] || 0) + 1; });
  const years = Object.keys(m).map(Number).sort((a, b) => a - b);
  const max = Math.max(...Object.values(m));
  const color = (y) => (y <= 2003 ? "lg-a-bg" : y <= 2021 ? "lg-b-bg" : "lg-c-bg");
  $("#timeline-chart").innerHTML = years.map((y) => `
    <div class="tl-col">
      <div class="tl-bar ${color(y)}" style="height:${(m[y] / max * 100).toFixed(1)}%">
        <span class="tip">${y} 年 · 死亡 ${m[y]} 家</span>
      </div>
      ${y % 4 === 1 ? `<span class="tl-year">${y}</span>` : ""}
    </div>`).join("");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".tl-bar").forEach((b, i) => {
        b.style.transformOrigin = "bottom";
        b.style.transform = "scaleY(0)";
        setTimeout(() => { b.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)"; b.style.transform = "scaleY(1)"; }, i * 18);
      });
      io.unobserve(e.target);
    }
  }), { threshold: 0.15 });
  io.observe($("#timeline-chart"));
})();

/* ---------- 名尸陈列室 ---------- */
function renderFeatured() {
  const unlocked = isUnlocked();
  const byName = new Map(DATA.map((r) => [r.name, r]));
  $("#featured-grid").innerHTML = FEATURED.map((f) => {
    const r = byName.get(f.name);
    if (!r) return "";
    const fundLabel = (f.metricLabel || "融资") + " " + (money(r.fund) || "—");
    return `<div class="tomb" data-name="${esc(r.name)}">
      <div class="tomb-top">
        <span class="tomb-flag">${flag(r.country)}</span>
        <span class="tomb-rip">R.I.P. ${r.sy || "?"}–${r.ey || "?"}</span>
      </div>
      <div class="tomb-name">${f.zh}<small>${esc(r.name)}</small></div>
      <div class="tomb-years">▸ ${esc(SECTOR_ZH[r.sector] ? SECTOR_ZH[r.sector][0] : r.sector)} / ${esc(r.type || "—")}</div>
      <div class="tomb-epitaph">「${f.epitaph}」</div>
      <div class="tomb-chips">
        <span class="chip chip-cause">${CAUSE_ZH[r.cause >= 0 ? r.cause : 0].icon} ${causeZh(r.cause)}</span>
        <span class="chip chip-money"><b>${fundLabel}</b></span>
        ${unlocked ? "" : `<span class="chip chip-lock">🔒 未解锁</span>`}
        <span class="tomb-open">${unlocked ? "验尸报告 →" : "解锁报告 🔒"}</span>
      </div>
    </div>`;
  }).join("");
  $("#featured-grid").querySelectorAll(".tomb").forEach((el) =>
    el.addEventListener("click", () => openModalByName(el.dataset.name)));
}
renderFeatured();

/* ---------- 墓碑数据库 ---------- */
const DB = { page: 1, per: 48, list: [] };
function dbFiltered() {
  const q = $("#db-search").value.trim().toLowerCase();
  const sec = $("#db-sector").value, cau = $("#db-cause").value, cty = $("#db-country").value;
  const sort = $("#db-sort").value;
  let list = DATA.filter((r) => {
    if (sec && r.sector !== sec) return false;
    if (cau !== "" && String(r.cause) !== cau) return false;
    if (cty && r.country !== cty) return false;
    if (q && !(r.name + " " + r.valueEn + " " + r.type + " " + r.country).toLowerCase().includes(q)) return false;
    return true;
  });
  if (sort === "burn") list.sort((a, b) => b.fund - a.fund);
  else if (sort === "died") list.sort((a, b) => b.ey - a.ey);
  else if (sort === "life") list.sort((a, b) => (b.ey - b.sy) - (a.ey - a.sy));
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function renderDB(reset) {
  if (reset) DB.page = 1;
  DB.list = dbFiltered();
  const shown = DB.list.slice(0, DB.page * DB.per);
  $("#db-meta").innerHTML =
    `// 匹配到 <b>${DB.list.length}</b> 座墓碑 · 当前展示 <b>${shown.length}</b> 座 · 总计 ${DATA.length} 座`;
  if (!DB.list.length) {
    $("#db-grid").innerHTML = `<div class="db-empty">// 查无此尸。换个关键词试试。</div>`;
    $("#db-more").style.display = "none";
    return;
  }
  $("#db-grid").innerHTML = shown.map((r) => `
    <div class="grave" data-name="${esc(r.name)}">
      <div class="grave-head">
        <span class="grave-flag">${flag(r.country)}</span>
        <span class="grave-name">${esc(r.name)}</span>
        <span class="grave-years">${r.sy || "?"}–${r.ey || "?"}</span>
      </div>
      <div class="grave-cause-en">${esc(r.deathEn || r.valueEn || "—")}</div>
      <div class="grave-foot">
        <span class="chip chip-cause">${causeZh(r.cause)}</span>
        ${money(r.fund) ? `<span class="chip chip-money"><b>${money(r.fund)}</b></span>` : ""}
        <span class="chip">${esc(SECTOR_ZH[r.sector] ? SECTOR_ZH[r.sector][0] : r.sector)}</span>
        <span class="chip">${esc(r.country || "未知")}</span>
      </div>
    </div>`).join("") +
    (shown.length < DB.list.length ? `<div class="grave-more" style="grid-column:1/-1">▼ 还有 ${DB.list.length - shown.length} 座墓碑未显示</div>` : "");
  $("#db-grid").querySelectorAll(".grave").forEach((el) =>
    el.addEventListener("click", () => openModalByName(el.dataset.name)));
  $("#db-more").style.display = shown.length < DB.list.length ? "" : "none";
}
function initDBOptions() {
  const secs = [...new Set(DATA.map((r) => r.sector).filter(Boolean))].sort();
  $("#db-sector").innerHTML = `<option value="">全部行业</option>` + secs.map((s) =>
    `<option value="${esc(s)}">${esc(SECTOR_ZH[s] ? SECTOR_ZH[s][0] : s)}（${DATA.filter((r) => r.sector === s).length}）</option>`).join("");
  $("#db-cause").innerHTML = `<option value="">全部死因</option>` + CAUSE_ZH.map((c, i) => {
    const n = DATA.filter((r) => r.cause === i).length;
    return `<option value="${i}">${c.icon} ${c.zh}（${n}）</option>`;
  }).join("");
  const cts = [...new Set(DATA.map((r) => r.country).filter(Boolean))].sort();
  $("#db-country").innerHTML = `<option value="">全部国家</option>` + cts.map((c) =>
    `<option value="${esc(c)}">${flag(c)} ${esc(c)}（${DATA.filter((r) => r.country === c).length}）</option>`).join("");
  ["db-search", "db-sector", "db-cause", "db-country"].forEach((id) =>
    $("#" + id).addEventListener("input", () => renderDB(true)));
  $("#db-sort").addEventListener("change", () => renderDB(true));
  $("#db-more").addEventListener("click", () => { DB.page++; renderDB(false); });
  renderDB(true);
}
initDBOptions();

/* ---------- 弹窗 ---------- */
const mask = $("#modal-mask"), mbody = $("#modal-body");
function scoreBlock(r) {
  if (!r.diff && !r.scal && !r.mp) return "";
  const cell = (v, k) => `<div class="aut-score"><div class="v">${v || "?"}</div><div class="k">${k}</div></div>`;
  return `<div class="aut-h">重生评估 // REBUILD SCORE</div>
    <div class="aut-scores">
      ${cell(r.diff ? r.diff + " / 5" : "?", "重建难度")}
      ${cell(r.scal ? r.scal + " / 5" : "?", "可扩展性")}
      ${cell(r.mp ? MP_ZH[r.mp] : "?", "市场潜力")}
    </div>`;
}
function openModal(r, featuredExtra) {
  const f = featuredExtra || null;
  const locked = f && !isUnlocked();
  const secZh = SECTOR_ZH[r.sector] ? SECTOR_ZH[r.sector][0] : r.sector;
  const fundLabel = f && f.metricLabel ? f.metricLabel : "融资";
  mbody.innerHTML = `
    <div class="aut-head">
      <span class="aut-flag">${flag(r.country)}</span>
      <span class="aut-name">${f ? f.zh : esc(r.name)}<small>${esc(r.name)}</small></span>
    </div>
    <div class="aut-years">▸ 生卒 ${r.sy || "?"} — ${r.ey || "?"}（享年 ${(r.ey && r.sy) ? r.ey - r.sy : "?"} 年）</div>
    ${f ? `<div class="aut-quote">「${f.epitaph}」</div>` : ""}
    <div class="aut-meta">
      <span class="chip chip-cause">${CAUSE_ZH[r.cause >= 0 ? r.cause : 0].icon} ${causeZh(r.cause)}</span>
      ${money(r.fund) ? `<span class="chip chip-money"><b>${fundLabel} ${money(r.fund)}</b></span>` : ""}
      <span class="chip">${esc(secZh || "—")}</span>
      <span class="chip">${esc(r.type || "—")}</span>
      <span class="chip">${esc(r.country || "未知")}</span>
    </div>
    ${f && !locked ? `
      <div class="aut-h">验尸报告 // AUTOPSY</div>
      <p class="aut-p">${f.story}</p>
      <div class="aut-h">它曾以为 // VALUE PROP</div>
      <p class="aut-p">${f.valueZh}</p>
      <div class="aut-h red">它死于 // CAUSE OF DEATH</div>
      <p class="aut-p">${f.deathZh}</p>
    ` : ""}
    ${locked ? `
      <div class="aut-lock">
        <div class="aut-lock-head">🔒 中文验尸报告 · 解锁内容</div>
        <p class="aut-lock-p">这份报告的完整中文解剖（死亡全过程 + 重生评估解读）属于公众号 <b>「志投助手」</b> 专属内容。关注公众号，回复 <b>「坟场」</b> 领取口令，输入后即可永久解锁全部 <b>20 份</b>验尸报告。</p>
        <div class="aut-lock-form">
          <input id="lock-input" placeholder="输入口令…" autocomplete="off" maxlength="30">
          <button id="lock-btn" class="aut-lock-btn">解锁</button>
        </div>
        <div class="aut-lock-err" id="lock-err" hidden>✕ 口令不对。关注公众号「志投助手」，回复「坟场」领取口令。</div>
      </div>
    ` : ""}
    ${scoreBlock(r)}
    ${f
      ? `<div class="aut-h">原档案 // ORIGINAL RECORD</div><div class="aut-en">${esc(r.deathEn || r.valueEn || "—")}</div>`
      : `${r.valueEn ? `<div class="aut-h">它曾以为 // VALUE PROP</div><div class="aut-en">${esc(r.valueEn)}</div>` : ""}
         ${r.deathEn ? `<div class="aut-h red">它死于 // CAUSE OF DEATH</div><div class="aut-en">${esc(r.deathEn)}</div>` : ""}
         ${r.desc ? `<div class="aut-h">完整档案 // FULL RECORD（英文原档，免费阅读）</div><div class="aut-en">${esc(r.desc)}</div>` : ""}`
    }`;
  mask.hidden = false;
  document.body.style.overflow = "hidden";
  if (locked) bindUnlock(r, f);
}
function bindUnlock(r, f) {
  const btn = document.getElementById("lock-btn");
  const input = document.getElementById("lock-input");
  const err = document.getElementById("lock-err");
  if (!btn || !input) return;
  const tryUnlock = async () => {
    if (await passcodeOk(input.value)) {
      try { localStorage.setItem(LOCK_KEY, "1"); } catch {}
      renderFeatured();
      openModal(r, f); // 解锁成功，原地渲染完整报告
    } else if (err) {
      err.hidden = false;
      input.value = "";
      input.focus();
    }
  };
  btn.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
  input.focus();
}
function openModalByName(name) {
  const r = DATA.find((x) => x.name === name);
  if (!r) return;
  const f = FEATURED.find((x) => x.name === name);
  openModal(r, f);
}
$("#modal-close").addEventListener("click", () => { mask.hidden = true; document.body.style.overflow = ""; });
mask.addEventListener("click", (e) => { if (e.target === mask) { mask.hidden = true; document.body.style.overflow = ""; } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mask.hidden) { mask.hidden = true; document.body.style.overflow = ""; } });

/* ---------- 控制台彩蛋 ---------- */
console.log("%c☠ 创业坟场 · LOOT DROP 中文版", "font-size:18px;color:#00e5ff;font-weight:bold");
console.log("%c1749 具尸体，5354 亿美元学费。数据来源: https://www.loot-drop.io", "color:#7c8aa0");
