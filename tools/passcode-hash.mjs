// 换口令工具：node tools/passcode-hash.mjs 新口令
// 把输出的两个值替换到 js/app.js 顶部的 PASSCODE_SHA256 / PASSCODE_DJB2
import { createHash } from "node:crypto";

const pass = process.argv[2];
if (!pass) {
  console.error("用法: node tools/passcode-hash.mjs 新口令");
  process.exit(1);
}

const sha256 = createHash("sha256").update(pass, "utf8").digest("hex");

let h = 5381;
for (const c of "lootdrop::gzh::v1" + pass) h = (((h << 5) + h) + c.charCodeAt(0)) >>> 0;

console.log(`口令: ${pass}`);
console.log(`PASSCODE_SHA256 = "${sha256}"`);
console.log(`PASSCODE_DJB2   = "${h.toString(16)}"`);
