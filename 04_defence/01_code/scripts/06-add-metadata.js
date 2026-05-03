/**
 * Step 6: 给 CPC Mint 附加 Metaplex Token Metadata (Umi API)
 *
 * 在现代 Metaplex SDK (v3+) 里，所有指令都通过 Umi 框架发送。
 * 这里我们用：
 *   createMetadataAccountV3 —— 首次创建 PDA
 *   updateMetadataAccountV2 —— 之后更新
 *
 * 执行后 Phantom / Solscan 会自动读取 name / symbol / uri。
 */
const fs = require("fs");
const path = require("path");
const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  createMetadataAccountV3,
  updateMetadataAccountV2,
  fetchMetadataFromSeeds,
  findMetadataPda,
  mplTokenMetadata,
} = require("@metaplex-foundation/mpl-token-metadata");
const {
  keypairIdentity,
  publicKey,
  some,
  none,
} = require("@metaplex-foundation/umi");
const { fromWeb3JsKeypair } = require("@metaplex-foundation/umi-web3js-adapters");
const { Keypair } = require("@solana/web3.js");

const config = require("./config");
const { log, logDetail, loadState, saveState, explorerUrl } = require("./utils");

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Step 6: 附加 Metaplex Token Metadata");
  console.log("═══════════════════════════════════════════");

  const state = loadState();
  if (!state.mintAddress) {
    throw new Error("Mint 尚未创建，请先运行 npm run create-token");
  }

  // 1. 初始化 Umi + 注入钱包
  const umi = createUmi(config.RPC_URL);
  umi.use(mplTokenMetadata());

  const deployerKey = JSON.parse(fs.readFileSync(config.DEPLOYER_KEYPAIR, "utf-8"));
  const web3Kp = Keypair.fromSecretKey(new Uint8Array(deployerKey));
  const umiKp = fromWeb3JsKeypair(web3Kp);
  umi.use(keypairIdentity(umiKp));

  const mint = publicKey(state.mintAddress);
  const [metadataPda] = findMetadataPda(umi, { mint });

  logDetail("Mint", state.mintAddress);
  logDetail("Metadata PDA", metadataPda);
  logDetail("Deployer", web3Kp.publicKey.toBase58());

  // 2. 准备 metadata 数据
  const METADATA_URI =
    process.env.CPC_METADATA_URI ||
    "https://raw.githubusercontent.com/liuzile666/cpc-token-assets/main/cpc-metadata.json";

  const data = {
    name: config.TOKEN_NAME,         // "Coupon Coin"
    symbol: config.TOKEN_SYMBOL,     // "CPC"
    uri: METADATA_URI,
    sellerFeeBasisPoints: 0,
    creators: some([
      { address: umi.identity.publicKey, verified: true, share: 100 },
    ]),
    collection: none(),
    uses: none(),
  };

  // 3. 看 PDA 是否已存在 —— 决定走 create 还是 update
  let exists = false;
  try {
    await fetchMetadataFromSeeds(umi, { mint });
    exists = true;
  } catch (_) {
    exists = false;
  }

  if (exists) {
    log("🔄", "Metadata 账户已存在，执行 UPDATE...");
    const builder = updateMetadataAccountV2(umi, {
      metadata: metadataPda,
      updateAuthority: umi.identity,
      data: some(data),
      newUpdateAuthority: none(),
      primarySaleHappened: none(),
      isMutable: some(true),
    });
    const result = await builder.sendAndConfirm(umi);
    const sig = Buffer.from(result.signature).toString("hex");
    log("✅", "Metadata 更新成功！");
    logDetail("签名 (hex)", sig);
  } else {
    log("📝", "创建 Metadata 账户...");
    const builder = createMetadataAccountV3(umi, {
      metadata: metadataPda,
      mint,
      mintAuthority: umi.identity,
      payer: umi.identity,
      updateAuthority: umi.identity.publicKey,
      data,
      isMutable: true,
      collectionDetails: none(),
    });
    const result = await builder.sendAndConfirm(umi);
    // Umi signature 是 Uint8Array - 需要转成 base58 才能在 solscan 用
    const bs58 = require("bs58");
    const sigStr = bs58.default ? bs58.default.encode(result.signature)
                               : bs58.encode(result.signature);
    log("✅", "Metadata 创建成功！");
    logDetail("交易签名", sigStr);
    logDetail("交易链接", explorerUrl("tx", sigStr));
    saveState({
      metadataAccount: metadataPda.toString(),
      metadataTxSignature: sigStr,
      metadataUri: METADATA_URI,
      metadataCompleted: true,
      metadataTime: new Date().toISOString(),
    });
  }

  logDetail("代币页", explorerUrl("token", state.mintAddress));

  console.log("\n   ┌─────────────────────────────────────────────┐");
  console.log(`   │  Name:   ${data.name}`);
  console.log(`   │  Symbol: ${data.symbol}`);
  console.log(`   │  URI:    ${data.uri}`);
  console.log("   └─────────────────────────────────────────────┘\n");

  console.log("  💡 Phantom 缓存刷新可能需要 1-2 分钟");
  console.log("  💡 如 URI 404，Logo 不会显示 —— 请把 assets/cpc-metadata.json 和 cpc-logo.png 上传到 GitHub 公开仓库后重跑本步骤。\n");
}

main().catch((e) => {
  console.error("\n❌ 错误:", e.message);
  if (e.logs) console.error("Logs:", e.logs);
  process.exit(1);
});
