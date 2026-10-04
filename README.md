# ☠ 创业坟场 · LOOT DROP 中文版

> 1749 家失败创业公司的遗产数据库 · 暗色终端风 / 霓虹科技感 / 纯静态无依赖

一个对 [loot-drop.io](https://www.loot-drop.io)（The Startup Graveyard）的**中文重构致敬版**：
把 1749 具「创业尸体」、5354 亿美元烧掉的资本，翻译成中文互联网语境下的失败教科书。

## 在线访问

GitHub Pages: **https://lz20080830-dotcom.github.io/loot-drop-cn/**

## 功能

- **烧钱排行榜** —— 史上最贵的十次失败（硅谷银行、Wirecard、WeWork…）
- **死因图谱** —— 7 大死因：被巨头碾碎 / 算不过账 / 弹尽粮绝 / 没人要的产品 / 触礁监管 / 技术难产 / 团队内讧
- **行业坟场** —— 10 个行业的死亡分布，点击直达筛选结果
- **死亡时间线** —— 2001-2026 按年死亡数量，直观看到加息周期挤泡沫的那堵墙
- **名尸陈列室** —— 20 份手写中文验尸报告（硅谷 10 具 + 中国 10 具：乐视、e租宝、威马、兴盛优选、猿辅导、ofo、熊猫直播…）
- **墓碑数据库** —— 全量 1749 条，搜索 / 行业 / 死因 / 国家筛选 + 四种排序，点击查看档案详情与「重生评估」（重建难度 / 可扩展性 / 市场潜力）

## 技术实现

- 纯静态 HTML / CSS / 原生 JS，**零依赖、零外部请求**（无字体 CDN、无统计、无 Cookie）
- 数据快照自 loot-drop.io 的公开数据库（Supabase REST API，2026-10-04 抓取），
  经 `tools/build-data.mjs` 压缩为 `site/js/data.js`（约 1.7 MB）
- 图表全部手写实现（CSS / IntersectionObserver），无图表库

## 本地运行

```bash
cd site
python -m http.server 8080   # 或任何静态服务器
```

> 直接双击 index.html 也可以运行。

## 免责声明

数据为 AI 辅助整理自公开报道的摘要（与原站一致），仅供学习研究，不构成投资建议；
档案正文为英文原档，可能存在错漏，权威信息请查阅原始来源。

## 目录结构

```
loot-drop-cn/
├── site/               # 静态站点（GitHub Pages 根目录）
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── data.js     # 生成文件：1749 条案例压缩数据
│       └── app.js      # 渲染逻辑 + 20 份手写中文验尸报告
└── tools/
    └── build-data.mjs  # 数据构建脚本（原始 JSON → data.js）
```

> `_fetch/`（原始抓取数据）与 `_shots/`（验收截图）仅存在于本地，不入库；
> 复现 `data.js` 需先从 loot-drop.io 公开 API 重新抓取。
