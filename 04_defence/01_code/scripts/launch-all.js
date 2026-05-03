/**
 * 🚀 Coupon Coin — 一键发币脚本
 * 按顺序执行所有步骤
 */
const { execSync } = require("child_process");
const path = require("path");

const scripts = [
  { file: "01-setup-wallet.js", desc: "创建钱包 & 获取 SOL" },
  { file: "02-create-token.js", desc: "创建 Token Mint" },
  { file: "03-mint-tokens.js", desc: "铸造 200,000,000 CPC" },
  { file: "05-verify.js", desc: "验证 & 生成报告" },
];

console.log("╔══════════════════════════════════════════════════════╗");
console.log("║     🚀 Coupon Coin — 一键发币 (Solana Devnet)      ║");
console.log("║     Y Carry Smart Locker Ecosystem                  ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

for (let i = 0; i < scripts.length; i++) {
  const s = scripts[i];
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  [${i + 1}/${scripts.length}] ${s.desc}`);
  console.log(`${"═".repeat(50)}`);

  try {
    execSync(`node ${path.join(__dirname, s.file)}`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
  } catch (e) {
    console.error(`\n❌ 步骤 ${i + 1} 失败: ${s.desc}`);
    console.error("   请检查错误信息并重试。");
    process.exit(1);
  }
}

console.log("\n");
console.log("╔══════════════════════════════════════════════════════╗");
console.log("║                                                      ║");
console.log("║   🎉 Coupon Coin 发行完成！                         ║");
console.log("║                                                      ║");
console.log("║   所有步骤已成功执行：                               ║");
console.log("║   ✅ 钱包已创建                                     ║");
console.log("║   ✅ Token Mint 已部署                               ║");
console.log("║   ✅ 200,000,000 CPC 已铸造                       ║");
console.log("║   ✅ 验证报告已生成                                  ║");
console.log("║                                                      ║");
console.log("║   查看结果: cpc-token-result.json                  ║");
console.log("║                                                      ║");
console.log("╚══════════════════════════════════════════════════════╝\n");
