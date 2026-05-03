# 答辩演示话术 + 操作清单

---

## 演示前准备（5 分钟，开场前做好）

1. **浏览器打开三个 tab 备用**：
   - Tab A · Solscan 代币页：
     `https://solscan.io/token/8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ?cluster=devnet`
   - Tab B · Solscan 钱包页：
     `https://solscan.io/account/5tAjqgNkBaMjzy388LtZQF41AfDprCqcYPfjrRSQxHcG?cluster=devnet`
   - Tab C · Solscan 交易页（mint tx）：
     `https://solscan.io/tx/32HktAAWGvgKrbVzgymuuuDViWtDLiKb4KJ4sbhEwxowU341bdbXSu82c8DbpPHPK939ZfWVeEiJFEKBmhobK49V?cluster=devnet`

2. **Phantom 钱包（可选）**：Chrome 扩展版里已导入 deployer，切到 Devnet 后能看到 200M CPC。桌面 App 只支持主网，不用折腾。

3. **代码包就在桌面** `~/Desktop/CPC_Defence_Package/`，评委要看代码随时打开。

---

## Slide 11 / Implementation 部分的演示节奏（总共 60–90 秒）

### 口述 · 起

> "这一部分不是 slide，是真实上链的结果。我把论文里设计的 CPC 代币 **真的部署到了 Solana Devnet 上**。"

### 切 Tab A — 代币页面

（手指一处一处点）

> "这是 Solana 区块浏览器。
> —— 代币名：**Coupon Coin**。
> —— 符号：**CPC**。
> —— 总供应：**2 亿**，和论文白皮书完全一致。
> —— 持有人：1 个，就是我的部署者钱包。
> —— 代币元数据通过 Metaplex 标准写入链上，Logo 和名字是钱包应用直接读的。"

### 切 Tab C — Mint Tx

> "这是铸造的那一笔交易。确认时间 **1.8 秒**，成本 **0.004 SOL**（主网约 0.40 美元）。
> 一次交易把 2 亿 CPC 全部铸造完毕，这验证了论文 §4.4 里的技术可行性 —— Solana 的吞吐和成本完全承得住。"

### 切 Tab B — 钱包持仓

> "这是部署者钱包。当前余额 200,000,000 CPC。
> 这个钱包既是 mint authority、也是 freeze authority。Mainnet 发币时，按论文 §3.5 的设计，mint authority 会在流动性池建好后永久撤销，成为不可增发的代币。"

### 收

> "所有链上数据公开可验证。如果评委想复现，代码和报告都在 `CPC_Defence_Package` 文件夹里，`npm run verify` 可以现场从链上重新拉一份报告。"

---

## 如果评委追问（常见 Q&A）

**Q: 为什么选 Devnet 而不是 Mainnet？**
> Devnet 和 Mainnet 协议语义完全一致，我关心的是设计正确性。Mainnet 还需要合约审计（CertiK / OtterSec）、海外主体注册、SFC 法律意见书。这三项是 Capstone 边界外的工程。

**Q: 其他人能买到这个 CPC 吗？**
> 目前不行。Devnet 没有经济价值，没有交易所，没有流动性。这是概念验证，不是商品发行。Mainnet 上线需要在 Raydium 或 Jupiter 创建流动池，答辩后的工程路线在 Slide 15 的 roadmap 里。

**Q: 你是怎么保证 200M 是最终供应的？**
> 当前 Mint Authority 还在我的部署者钱包。Mainnet 流程里，LP 建好后会调用 `setAuthority(mint, null, MintTokens, current)` 把 mint authority 设为 null，这步是不可逆的。之后任何人都不能增发。Devnet 故意不做这一步，是为了演示完整代币生命周期。

**Q: 元数据和 Logo 存在哪？**
> 链上只存一个 URI。真实内容（JSON 和 PNG）存在 GitHub Pages。生产环境会迁到 Arweave / IPFS 保证永久性。

**Q: 钱包私钥你怎么保管？**
> Devnet 钱包 `deployer.json` 是 JSON 格式的 Ed25519 64-byte 私钥，本地保存。Mainnet 会换成 Squads Protocol 的 3-of-5 多签，论文 §6.1 有明确设计。

**Q: 整个项目跑通花了多少成本？**
> Devnet 免费。总链上开销 ≈ 0.004 SOL（钱包创建 + mint account 租金 + 一笔 mint + 一笔 metadata）。换算主网 ≈ 0.40 美元。

---

## 失败保险方案

如果演示时网络抽风 / Solscan 打不开：

1. 打开 `03_onchain_proof/cpc-token-result.json` —— 这是从链上拉下来的离线快照，包含所有字段。
2. 打开终端：`cd 01_code && npm run verify` —— 直接从链上重新拉取数据、打印报告。

---

## 强行再加分点（如果还剩时间）

**在终端实时转账演示**：

```bash
cd ~/Desktop/CPC_Token_Launch_Kit
# 发 1,000 CPC 到一个空地址（评委提供的或者你手头另一个 devnet 地址）
npx spl-token transfer 8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ 1000 <收款地址> \
  --url https://devnet.helius-rpc.com/?api-key=afc1b7aa-d7c5-4881-b786-fb54f26a8b12 \
  --fund-recipient --allow-unfunded-recipient
```

几秒内 Solscan 能看到这笔转账记录。

---

## 一句话收尾

> "论文里每一行代币设计，都在这个链接上可以实时查到。谢谢大家。"
