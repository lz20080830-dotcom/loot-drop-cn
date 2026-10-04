// 从 _fetch/startups.json（loot-drop.io 公开 API 抓取的原始数据）
// 生成 site/js/data.js —— 前端用的压缩数据表
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(readFileSync(join(root, '_fetch/startups.json'), 'utf8'));

// 死因枚举（index 存进数组，省体积）
export const CAUSES = [
  'Competition', 'Unit Economics', 'Ran Out of Cash', 'No Market Need',
  'Legal/Regulatory', 'Product/Tech Failure', 'Team/Founder Conflict',
];
const MP = { high: 3, medium: 2, low: 1 };

// 字段顺序: 0名字 1行业 2创办年 3死亡年 4融资额 5死因idx 6产品类型 7国家
// 8一句话价值主张 9一句话死因 10重建难度 11可扩展性 12市场潜力 13完整描述
const recs = raw.map((r) => [
  r.name || '',
  r.sector || '',
  r.start_year || 0,
  r.end_year || 0,
  r.total_funding || 0,
  CAUSES.indexOf(r.primary_cause_of_death),
  r.product_type || '',
  r.country || '',
  r.condensed_value_prop || '',
  r.condensed_cause_of_death || '',
  r.difficulty || 0,
  r.scalability || 0,
  MP[r.market_potential] || 0,
  r.description || '',
]);

const js = '/* 由 tools/build-data.mjs 生成，勿手改 */\nconst S=' + JSON.stringify(recs) +
  ';\nconst CAUSES=' + JSON.stringify(CAUSES) + ';\n';
writeFileSync(join(root, 'js/data.js'), js);

const mb = statSync(join(root, 'js/data.js')).size / 1048576;
console.log(`js/data.js 生成完毕: ${recs.length} 条记录, ${mb.toFixed(2)} MB`);
