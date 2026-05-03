/**
 * Step 1: 创建部署者钱包 + 获取测试 SOL
 */
const fs = require("fs");
const { Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const config = require("./config");
const { log, logDetail, sleep, getConnection, saveState } = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Step 1: 创建部署者钱包 & 获取测试 SOL");
  console.log("═══════════════════════════════════════════");

  // 1. 创建或加载钱包
  let deployer;
  if (fs.existsSync(config.DEPLOYER_KEYPAIR)) {
    log("📂", "发现已有钱包，加载中...");
    const data = JSON.parse(fs.readFileSync(config.DEPLOYER_KEYPAIR, "utf-8"));
    deployer = Keypair.fromSecretKey(new Uint8Array(data));
  } else {
    log("🔑", "创建新的部署者钱包...");
    deployer = Keypair.generate();
    fs.writeFileSync(
      config.DEPLOYER_KEYPAIR,
      JSON.stringify(Array.from(deployer.secretKey))
    );
  }

  logDetail("公钥 (Public Key)", deployer.publicKey.toBase58());
  logDetail("密钥文件", config.DEPLOYER_KEYPAIR);

  // 2. 连接网络
  log("🌐", `连接到 Solana ${config.NETWORK}...`);
  const connection = getConnection();

  try {
    const version = await connection.getVersion();
    logDetail("节点版本", JSON.stringify(version));
  } catch (e) {
    log("⚠️", `无法连接到 ${config.RPC_URL}`);
    log("💡", "如果在受限网络环境中，请修改 scripts/config.js 中的 RPC_URL");
    log("💡", "可选的免费 RPC 端点:");
    console.log("   - https://api.devnet.solana.com (官方)");
    console.log("   - https://devnet.helius-rpc.com/?api-key=YOUR_KEY");
    console.log("   - https://solana-devnet.g.alchemy.com/v2/YOUR_KEY");
    process.exit(1);
  }

  // 3. 检查余额
  const balance = await connection.getBalance(deployer.publicKey);
  log("💰", `当前余额: ${balance / LAMPORTS_PER_SOL} SOL`);

  // 4. 如果余额不足，请求空投
  if (balance < 2 * LAMPORTS_PER_SOL) {
    log("💧", "余额不足，请求测试 SOL 空投...");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sig = await connection.requestAirdrop(
          deployer.publicKey,
          2 * LAMPORTS_PER_SOL
        );
        log("⏳", `等待空投确认 (尝试 ${attempt}/3)...`);
        await connection.confirmTransaction(sig, "confirmed");
        await sleep(2000);

        const newBalance = await connection.getBalance(deployer.publicKey);
        log("✅", `空投成功！余额: ${newBalance / LAMPORTS_PER_SOL} SOL`);
        break;
      } catch (e) {
        if (attempt === 3) {
          log("❌", `空投失败: ${e.message}`);
          log("💡", "你可以手动在 https://faucet.solana.com 获取测试 SOL");
          logDetail("钱包地址", deployer.publicKey.toBase58());
        } else {
          log("⚠️", `第 ${attempt} 次失败，重试中...`);
          await sleep(3000);
        }
      }
    }
  } else {
    log("✅", "余额充足，无需空投");
  }

  // 5. 保存状态
  saveState({
    deployerPublicKey: deployer.publicKey.toBase58(),
    network: config.NETWORK,
    setupCompleted: true,
    setupTime: new Date().toISOString(),
  });

  log("✅", "Step 1 完成！钱包已就绪。\n");
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  process.exit(1);
});
