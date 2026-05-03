/**
 * Step 5: 验证代币信息 & 生成发行报告
 */
const fs = require("fs");
const { PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { getMint, getAccount } = require("@solana/spl-token");
const config = require("./config");
const {
  log,
  logDetail,
  getConnection,
  loadDeployer,
  loadState,
  explorerUrl,
} = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Step 5: 验证 & 生成发行报告");
  console.log("═══════════════════════════════════════════");

  const connection = getConnection();
  const deployer = loadDeployer();
  const state = loadState();

  if (!state.mintAddress) {
    throw new Error("未找到代币信息。请先完成前面的步骤。");
  }

  const mint = new PublicKey(state.mintAddress);

  log("🔍", "从链上获取代币信息...");

  const mintInfo = await getMint(connection, mint);
  const balance = await connection.getBalance(deployer.publicKey);

  let tokenBalance = "N/A";
  if (state.tokenAccount) {
    try {
      const accountInfo = await getAccount(
        connection,
        new PublicKey(state.tokenAccount)
      );
      tokenBalance = `${Number(accountInfo.amount / BigInt(10 ** config.TOKEN_DECIMALS)).toLocaleString()} ${config.TOKEN_SYMBOL}`;
    } catch (e) {
      tokenBalance = "(无法读取)";
    }
  }

  const actualSupply = Number(
    mintInfo.supply / BigInt(10 ** config.TOKEN_DECIMALS)
  );

  // 输出完整报告
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║                                                              ║");
  console.log("║           🪙  CPC TOKEN — 发行报告                        ║");
  console.log("║           Y Carry Smart Locker Ecosystem                     ║");
  console.log("║                                                              ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║                                                              ║");
  console.log(`║  代币名称:      ${config.TOKEN_NAME} (${config.TOKEN_SYMBOL})`);
  console.log(`║  区块链:        Solana ${config.NETWORK}`);
  console.log(`║  Mint 地址:     ${mint.toBase58()}`);
  console.log(`║  小数位:        ${mintInfo.decimals}`);
  console.log(`║  总供应量:      ${actualSupply.toLocaleString()} ${config.TOKEN_SYMBOL}`);
  console.log(`║  初始定价:      1 CPC = 0.1 USDT`);
  console.log(`║  总市值:        ${(actualSupply * 0.1).toLocaleString()} USDT`);
  console.log("║                                                              ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  权限信息                                                    ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Mint Authority:   ${mintInfo.mintAuthority?.toBase58() || "已撤销 ⚠️"}`);
  console.log(`║  Freeze Authority: ${mintInfo.freezeAuthority?.toBase58() || "已撤销 ⚠️"}`);
  console.log("║                                                              ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  部署者信息                                                  ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  部署者:        ${deployer.publicKey.toBase58()}`);
  console.log(`║  SOL 余额:      ${balance / LAMPORTS_PER_SOL} SOL`);
  console.log(`║  代币余额:      ${tokenBalance}`);
  console.log("║                                                              ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  🔗 链接                                                     ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Token:  ${explorerUrl("token", mint.toBase58())}`);
  console.log(`║  Wallet: ${explorerUrl("account", deployer.publicKey.toBase58())}`);
  if (state.mintTxSignature) {
    console.log(`║  Mint Tx: ${explorerUrl("tx", state.mintTxSignature)}`);
  }
  console.log("║                                                              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  // 保存 JSON 结果
  const result = {
    token: {
      name: config.TOKEN_NAME,
      symbol: config.TOKEN_SYMBOL,
      decimals: config.TOKEN_DECIMALS,
      mintAddress: mint.toBase58(),
      totalSupply: actualSupply,
      pricing: "1 CPC = 0.1 USDT",
      totalMarketCap: `${(actualSupply * 0.1).toLocaleString()} USDT`,
    },
    authorities: {
      mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
      freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
    },
    deployer: {
      publicKey: deployer.publicKey.toBase58(),
      solBalance: balance / LAMPORTS_PER_SOL,
      tokenBalance: tokenBalance,
    },
    blockchain: {
      network: config.NETWORK,
      rpcUrl: config.RPC_URL,
    },
    links: {
      token: explorerUrl("token", mint.toBase58()),
      wallet: explorerUrl("account", deployer.publicKey.toBase58()),
      mintTx: state.mintTxSignature
        ? explorerUrl("tx", state.mintTxSignature)
        : null,
    },
    distribution: config.DISTRIBUTION,
    timestamps: {
      setup: state.setupTime,
      tokenCreated: state.tokenCreatedTime,
      minted: state.mintTime,
      verified: new Date().toISOString(),
    },
  };

  fs.writeFileSync(config.RESULT_FILE, JSON.stringify(result, null, 2));
  log("💾", `报告已保存到: ${config.RESULT_FILE}`);

  console.log("\n🎉 Coupon Coin 验证完毕！一切正常。\n");

  if (config.NETWORK === "devnet") {
    console.log("═══════════════════════════════════════════");
    console.log("  📝 正式发币前的检查清单:");
    console.log("═══════════════════════════════════════════");
    console.log("  □ 法律意见书（Utility Token）已获取");
    console.log("  □ 海外实体已注册（新加坡/BVI）");
    console.log("  □ 白皮书最终版已完成");
    console.log("  □ 官网已上线");
    console.log("  □ 社交媒体已建立（Twitter, Telegram, Discord）");
    console.log("  □ 代币 Logo 已设计");
    console.log("  □ 智能合约已审计");
    console.log("  □ 将 config.js 中 NETWORK 改为 'mainnet-beta'");
    console.log("  □ 将 config.js 中 RPC_URL 改为主网 RPC");
    console.log("  □ 准备好至少 2 SOL 用于主网部署");
    console.log("  □ 准备好流动性资金用于创建 DEX 交易池");
    console.log("═══════════════════════════════════════════\n");
  }
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  process.exit(1);
});
