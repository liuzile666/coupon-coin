/**
 * Coupon Coin (CPC) Token — 配置
 * Y Carry Smart Locker Ecosystem — MSc IDAT Capstone
 */
const path = require("path");

module.exports = {
  // === 代币参数（与白皮书 / 论文一致）===
  TOKEN_NAME: "Coupon Coin",
  TOKEN_SYMBOL: "CPC",
  TOKEN_DECIMALS: 6,
  TOTAL_SUPPLY: 200_000_000,
  TOKEN_DESCRIPTION:
    "Coupon Coin (CPC) is a Solana-based utility token designed for the Y Carry Smart Locker ecosystem. Tokenising incentives in physical infrastructure.",

  // === 网络 ===
  // "devnet"（默认，测试网免费）或 "mainnet-beta"（主网，真钱）
  NETWORK: "devnet",

  // RPC 端点 — 优先读环境变量 SOLANA_RPC_URL
  // 推荐：免费注册 https://helius.dev 后把 key 粘到下面
  RPC_URL:
    process.env.SOLANA_RPC_URL ||
    "https://devnet.helius-rpc.com/?api-key=afc1b7aa-d7c5-4881-b786-fb54f26a8b12",

  // 备选：
  //   https://api.devnet.solana.com                           (官方公共，可能被企业 DPI 拦)
  //   https://solana-devnet.g.alchemy.com/v2/YOUR_KEY        (Alchemy 免费)
  //   https://api.mainnet-beta.solana.com                    (主网)

  // === 路径 ===
  ROOT_DIR: path.join(__dirname, ".."),
  DEPLOYER_KEYPAIR: path.join(__dirname, "..", "deployer.json"),
  STATE_FILE: path.join(__dirname, "..", "state.json"),
  RESULT_FILE: path.join(__dirname, "..", "cpc-token-result.json"),
  LOGO_PATH: path.join(__dirname, "..", "assets", "cpc-logo.png"),

  // === 代币分配（与白皮书对齐）===
  DISTRIBUTION: {
    publicFundraising:  { label: "Public Fundraising",  pct: 20, amount: 40_000_000 },
    teamRewards:        { label: "Team Rewards",        pct: 15, amount: 30_000_000 },
    financialReserves:  { label: "Financial Reserves",  pct: 15, amount: 30_000_000 },
    liquidityProvision: { label: "Liquidity Provision", pct: 13, amount: 26_000_000 },
    stakingRewards:     { label: "Staking Rewards",     pct:  8, amount: 16_000_000 },
    marketing:          { label: "Marketing",           pct:  6, amount: 12_000_000 },
    earlyBirdSale:      { label: "Early Bird Sale",     pct:  5, amount: 10_000_000 },
    airdrop:            { label: "Airdrop",             pct:  5, amount: 10_000_000 },
    advisoryTeam:       { label: "Advisory Team",       pct:  5, amount: 10_000_000 },
    seedRoundInvestors: { label: "Seed Round",          pct:  5, amount: 10_000_000 },
    influencerRound:    { label: "Influencer Round",    pct:  3, amount:  6_000_000 },
  },
};
