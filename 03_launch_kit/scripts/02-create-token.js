/**
 * Step 2: 创建 Carry SPL Token Mint
 */
const { PublicKey } = require("@solana/web3.js");
const { createMint } = require("@solana/spl-token");
const config = require("./config");
const { log, logDetail, getConnection, loadDeployer, saveState, explorerUrl } = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Step 2: 创建 Coupon Coin Mint");
  console.log("═══════════════════════════════════════════");

  const connection = getConnection();
  const deployer = loadDeployer();

  log("🏗️", `创建 ${config.TOKEN_NAME} (${config.TOKEN_SYMBOL}) Token...`);
  logDetail("小数位", config.TOKEN_DECIMALS);
  logDetail("区块链", `Solana ${config.NETWORK}`);
  logDetail("Mint Authority", deployer.publicKey.toBase58());
  logDetail("Freeze Authority", deployer.publicKey.toBase58());

  const mint = await createMint(
    connection,
    deployer,                // 支付者
    deployer.publicKey,      // Mint Authority (铸造权限)
    deployer.publicKey,      // Freeze Authority (冻结权限)
    config.TOKEN_DECIMALS    // 小数位
  );

  log("✅", "Token Mint 创建成功！");
  logDetail("Mint 地址", mint.toBase58());
  logDetail("查看链接", explorerUrl("token", mint.toBase58()));

  // 保存状态
  saveState({
    mintAddress: mint.toBase58(),
    tokenCreated: true,
    tokenCreatedTime: new Date().toISOString(),
  });

  console.log("\n   ┌─────────────────────────────────────────────┐");
  console.log(`   │  Coupon Coin Mint: ${mint.toBase58()}  `);
  console.log("   └─────────────────────────────────────────────┘\n");

  log("✅", "Step 2 完成！Token Mint 已创建。\n");
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  process.exit(1);
});
