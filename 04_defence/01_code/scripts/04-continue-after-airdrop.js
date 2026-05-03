/**
 * Step 4 (备用): 手动领 SOL 后继续流程
 *
 * 当自动空投失败（devnet faucet 限流 / 网络拦截）时：
 *
 * 1. 运行 `npm run setup` 生成钱包
 * 2. 复制控制台里的 "公钥 (Public Key)"
 * 3. 浏览器打开 https://faucet.solana.com
 * 4. 粘贴钱包地址，领 2 SOL
 * 5. 回来运行这个脚本验证，再跑 create-token / mint
 */
const { LAMPORTS_PER_SOL } = require("@solana/web3.js");
const {
  log,
  logDetail,
  getConnection,
  loadDeployer,
  explorerUrl,
} = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  验证手动空投是否到账");
  console.log("═══════════════════════════════════════════");

  const connection = getConnection();
  const deployer = loadDeployer();

  logDetail("钱包公钥", deployer.publicKey.toBase58());
  logDetail("查看链接", explorerUrl("account", deployer.publicKey.toBase58()));

  const bal = await connection.getBalance(deployer.publicKey);
  const sol = bal / LAMPORTS_PER_SOL;
  logDetail("当前余额", `${sol} SOL`);

  if (sol >= 0.5) {
    log("✅", "余额充足，可以继续！");
    console.log("\n   下一步：");
    console.log("   npm run create-token");
    console.log("   npm run mint");
    console.log("   npm run verify\n");
  } else {
    log("⏳", "还没到账。请：");
    console.log("   1. 打开 https://faucet.solana.com");
    console.log("   2. 粘贴钱包地址：");
    console.log(`      ${deployer.publicKey.toBase58()}`);
    console.log("   3. 选 devnet，点击领取");
    console.log("   4. 等 30 秒再跑一次本脚本验证\n");
  }
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  process.exit(1);
});
