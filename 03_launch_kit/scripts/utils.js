const fs = require("fs");
const { Keypair, Connection, clusterApiUrl } = require("@solana/web3.js");
const config = require("./config");

function log(emoji, msg) {
  console.log(`\n${emoji}  ${msg}`);
}

function logDetail(key, value) {
  console.log(`   ${key}: ${value}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getConnection() {
  const url = config.RPC_URL || clusterApiUrl(config.NETWORK);
  
  if (url.includes("YOUR_API_KEY") || url.includes("YOUR_KEY")) {
    console.log("\n⚠️  请先配置 RPC 端点！");
    console.log("   方法 1：去 https://helius.dev 免费注册，获取 API key");
    console.log("   方法 2：设置环境变量 SOLANA_RPC_URL");
    console.log("   方法 3：编辑 scripts/config.js 中的 RPC_URL\n");
    console.log("   示例：");
    console.log("   export SOLANA_RPC_URL='https://devnet.helius-rpc.com/?api-key=xxx'\n");
    process.exit(1);
  }
  
  return new Connection(url, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });
}

function loadDeployer() {
  if (!fs.existsSync(config.DEPLOYER_KEYPAIR)) {
    throw new Error(
      `部署者密钥不存在: ${config.DEPLOYER_KEYPAIR}\n请先运行: npm run setup`
    );
  }
  const data = JSON.parse(fs.readFileSync(config.DEPLOYER_KEYPAIR, "utf-8"));
  return Keypair.fromSecretKey(new Uint8Array(data));
}

function loadState() {
  if (fs.existsSync(config.STATE_FILE)) {
    return JSON.parse(fs.readFileSync(config.STATE_FILE, "utf-8"));
  }
  return {};
}

function saveState(state) {
  const existing = loadState();
  const merged = { ...existing, ...state };
  fs.writeFileSync(config.STATE_FILE, JSON.stringify(merged, null, 2));
}

function explorerUrl(type, address) {
  const cluster = config.NETWORK === "mainnet-beta" ? "" : `?cluster=${config.NETWORK}`;
  return `https://solscan.io/${type}/${address}${cluster}`;
}

module.exports = { log, logDetail, sleep, getConnection, loadDeployer, loadState, saveState, explorerUrl };
