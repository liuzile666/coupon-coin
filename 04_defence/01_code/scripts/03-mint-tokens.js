/**
 * Step 3: 铸造 200,000,000 CPC 代币
 */
const { PublicKey } = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getMint,
  getAccount,
} = require("@solana/spl-token");
const config = require("./config");
const {
  log,
  logDetail,
  getConnection,
  loadDeployer,
  loadState,
  saveState,
  explorerUrl,
} = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Step 3: 铸造 Coupon Coin");
  console.log("═══════════════════════════════════════════");

  const connection = getConnection();
  const deployer = loadDeployer();
  const state = loadState();

  if (!state.mintAddress) {
    throw new Error("Token Mint 尚未创建！请先运行: npm run create-token");
  }

  const mint = new PublicKey(state.mintAddress);
  const supplyWithDecimals =
    BigInt(config.TOTAL_SUPPLY) * BigInt(10 ** config.TOKEN_DECIMALS);

  log("📦", "创建 Associated Token Account...");
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    deployer,
    mint,
    deployer.publicKey
  );
  logDetail("Token Account", tokenAccount.address.toBase58());

  log(
    "⛏️",
    `铸造 ${config.TOTAL_SUPPLY.toLocaleString()} ${config.TOKEN_SYMBOL}...`
  );
  const txSig = await mintTo(
    connection,
    deployer,
    mint,
    tokenAccount.address,
    deployer,
    supplyWithDecimals
  );

  log("✅", "铸造完成！");
  logDetail("交易签名", txSig);
  logDetail("交易链接", explorerUrl("tx", txSig));

  // 验证
  const mintInfo = await getMint(connection, mint);
  const accountInfo = await getAccount(connection, tokenAccount.address);
  const actualSupply = Number(mintInfo.supply / BigInt(10 ** config.TOKEN_DECIMALS));

  log("🔍", "验证铸造结果:");
  logDetail("链上总供应量", `${actualSupply.toLocaleString()} ${config.TOKEN_SYMBOL}`);
  logDetail(
    "部署者余额",
    `${Number(accountInfo.amount / BigInt(10 ** config.TOKEN_DECIMALS)).toLocaleString()} ${config.TOKEN_SYMBOL}`
  );

  // 保存状态
  saveState({
    tokenAccount: tokenAccount.address.toBase58(),
    mintTxSignature: txSig,
    totalMinted: config.TOTAL_SUPPLY,
    mintCompleted: true,
    mintTime: new Date().toISOString(),
  });

  // 显示代币分配计划
  console.log("\n   ╔═══════════════════════════════════════════╗");
  console.log("   ║         代币分配计划 (白皮书)              ║");
  console.log("   ╠═══════════════════════════════════════════╣");
  for (const [key, val] of Object.entries(config.DISTRIBUTION)) {
    const line = `   ║  ${val.label.padEnd(22)} ${String(val.pct).padStart(3)}%  ${val.amount.toLocaleString().padStart(14)}  ║`;
    console.log(line);
  }
  console.log("   ╠═══════════════════════════════════════════╣");
  console.log(
    `   ║  ${"TOTAL".padEnd(22)} 100%  ${config.TOTAL_SUPPLY.toLocaleString().padStart(14)}  ║`
  );
  console.log("   ╚═══════════════════════════════════════════╝");

  log("✅", "Step 3 完成！代币已铸造。\n");
  log("📝", "下一步: 按分配计划将代币转入各个钱包地址（Vesting 合约等）\n");
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  process.exit(1);
});
