# Coupon Coin — Presentation Speech Script

> Estimated duration: 14–16 minutes (20 slides)
> Speaking pace: ~140 words/min

---

## SLIDE 1 — Cover *(30 seconds)*

Good afternoon, everyone. Thank you for your time.

My name is [Name], and today I will be presenting Coupon Coin — a blockchain-based coupon tokenisation protocol designed for smart locker ecosystems. This project is developed by Y Carry Limited, and represents our vision for bridging physical infrastructure with decentralised digital incentive systems.

---

## SLIDE 2 — Abstract *(1 minute)*

Let me begin with the research abstract.

Coupon Coin, or CPC, is a Solana-based SPL utility token that implements a programmable incentive layer on top of IoT-enabled smart locker infrastructure. We propose a dual-token architecture: the fungible CPC token for transactional utility, and a derivative Locker Token for real-world asset representation.

The system employs a deflationary economics model featuring a two percent automatic transaction burn, a twenty-five percent capital-allocated buyback contract, and tiered staking mechanisms.

The core problem we address is well-documented: traditional coupon redemption rates average below three percent globally, according to Deloitte's 2024 report. By tokenising these incentives on a high-throughput blockchain capable of over sixty-five thousand transactions per second with sub-second finality, we fundamentally reshape how value flows between consumers, merchants, and infrastructure operators.

---

## SLIDE 3 — Company Overview *(1 minute)*

Now, the entity behind this project.

Y Carry Limited is a Hong Kong-based smart locker infrastructure provider. Our mission — "Free Your Hands, Hold Your Love" — encapsulates our belief that technology should liberate people from burdens, literally and figuratively.

Our technology stack is built on the proprietary Y-Protocol, a patent-pending NFC-based access system, supplemented by NB-IoT and BLE 5.0 connectivity. What makes our lockers unique is that they require zero external power — they are entirely wireless and battery-powered, with a lifespan exceeding two years. The modular design allows rapid deployment in any environment, indoor or outdoor.

On the right side of the slide, you can see our key metrics: over six live deployment sites in Hong Kong, a signed contract for thirteen hundred units in Indonesia, and a five-year target of two-point-five million lockers serving ten million daily active users globally.

---

## SLIDE 4 — Traction *(45 seconds)*

Turning to our current deployment status.

In Hong Kong, we are live at multiple high-profile locations, including the Science Park, the Cheung Chau Bun Festival, sports stadiums, and the Hong Kong Roller Skating School.

In Indonesia, we have signed a contract for over thirteen hundred lockers across strategic locations in Surabaya, including the Al-Akbar Mosque and the Surabaya Institute of Technology.

Japan is in our active pipeline — it is the most locker-friendly market in the world, with strong cultural receptivity to automated services. Broader Southeast Asian expansion is planned as a follow-on once Indonesia is proven.

---

## SLIDE 5 — Problem Statement *(1 minute)*

Now let me frame the problem through a structured market inefficiency analysis.

We identify three stakeholder pain points, each supported by data.

First, consumers. The industry-wide coupon redemption rate sits below three percent. That means over ninety-seven percent of issued coupons expire unredeemed. They are fragmented across siloed platforms, non-transferable, and carry zero secondary market value.

Second, merchants. The average customer acquisition cost is approximately twenty-nine US dollars, yet merchants have virtually no ability to track coupon effectiveness or attribute conversions to specific campaigns.

Third, locker operators — ourselves included. The traditional pay-per-use model generates a single revenue stream with no recurring engagement mechanism, no loyalty programme, and no data monetisation.

This three-sided inefficiency is precisely the gap Coupon Coin is designed to fill.

---

## SLIDE 6 — Literature Review *(1 minute 15 seconds)*

Our protocol design is grounded in academic and industry research. Let me highlight the five key references.

Deloitte's 2024 report identifies five core benefits of blockchain in loyalty systems: cost reduction via smart contract automation, frictionless cross-platform redemption, near real-time settlement, immutable security, and novel business model creation.

Shi et al., published in the Journal of King Saud University in 2023, demonstrate that decentralised e-coupon systems — what they call Ecoupon-Chain — achieve significantly higher redemption rates through programmable smart contract rule enforcement.

Chen et al. in MDPI Symmetry 2021 show that token-based access control in physical locker systems improves operational transparency and reduces fraud.

An IEEE paper from 2025 further validates the combination of smart contracts with physical locker infrastructure for enhanced trust and efficiency.

Finally, Yakovenko's 2018 Solana architecture whitepaper establishes the technical feasibility of processing micro-transactions at scale — sixty-five thousand TPS with sub-second finality at negligible cost.

These five bodies of work collectively form the theoretical foundation for our protocol design.

---

## SLIDE 7 — Blockchain Selection *(1 minute)*

This brings us to protocol selection.

We conducted a quantitative comparison across six blockchain networks: Solana, Ethereum, Polygon, Base, and BNB Chain.

The key evaluation metrics were throughput, transaction cost, finality time, and micro-payment suitability.

As you can see in the table, Solana leads in every dimension that matters for our use case: sixty-five thousand TPS, average transaction cost of zero-point-zero-zero-zero-two-five dollars, and finality under four hundred milliseconds.

Our rationale is straightforward: at scale, we project approximately thirty million locker transactions per day. Each transaction carries a value between ten cents and two dollars. At these volumes and values, Solana is the only Layer-1 network where token-based micro-payments remain economically viable without introducing Layer-2 complexity overhead.

---

## SLIDE 8 — Token Specification *(45 seconds)*

Moving to tokenomics.

Coupon Coin is a standard SPL token on the Solana blockchain. The total supply is fixed at two hundred million tokens with six decimal precision. Initial pricing is set at one CPC equals zero-point-one USDT, giving a fully diluted valuation of twenty million US dollars at launch.

The two large callout figures on the right — two hundred million supply and twenty million dollar FDV — represent our conservative initial positioning. We deliberately chose a modest valuation to leave room for organic price discovery driven by actual ecosystem usage.

---

## SLIDE 9 — Token Distribution *(1 minute)*

The doughnut chart on the left shows our allocation model.

Twenty percent goes to public fundraising. Fifteen percent each to team rewards and financial reserves. Thirteen percent is dedicated to liquidity provision — this is critical for DEX market depth. Eight percent funds staking rewards, six percent for marketing, and the remaining twenty-eight percent is split across early bird sale, airdrop, advisory, seed round, and KOL allocations.

Importantly, every non-public allocation has a vesting schedule. Team tokens have a twelve-month cliff followed by twenty-four months of linear release. Advisory and seed allocations have shorter cliffs but still carry lock-up periods. This ensures long-term alignment between the team and the token ecosystem.

---

## SLIDE 10 — Deflationary Mechanics & Dual Token *(1 minute)*

Two critical design elements on this slide.

First, the deflationary mechanics. We implement three mechanisms. Mechanism one: a two percent automatic burn on every CPC transfer, permanently reducing circulating supply. Mechanism two: twenty-five percent of all raised capital is allocated to a dedicated buyback contract that periodically purchases CPC from the open market and destroys it. Mechanism three: unclaimed airdrop tokens exceeding twelve months of inactivity are reclaimed to the ecosystem treasury.

Second, our dual-token architecture. CPC is the primary utility token — used for payment, rewards, staking, and governance. The Locker Token is a derivative: users stake one thousand CPC to mint one Locker Token, which represents fractional ownership of a physical smart locker. When that locker is used, the reward contract automatically distributes CPC to the Locker Token holder — ninety percent to the user, ten percent to the holder. This creates a direct, verifiable link between real-world asset utilisation and token economics.

---

## SLIDE 11 — Technical Architecture *(1 minute)*

The protocol operates on a three-layer architecture.

Layer three is the blockchain layer: Solana SPL token, Metaplex token metadata, and our smart contract suite covering vesting, rewards, buyback, and staking. We also implement an L2 rollup for batching high-frequency locker transactions before settlement on Layer 1.

Layer two is the application layer: a React Native mobile app, mini-programme integration, an embedded MPC wallet — meaning users never need to manage private keys — and a merchant dashboard for partner management.

Layer one is the physical and IoT layer: our patent-pending NFC Y-Protocol, QR code fallback, NB-IoT and 4G cellular connectivity, an MQTT message broker for real-time locker commands, and edge computing on the locker microcontroller unit.

---

## SLIDE 12 — Smart Contract Suite *(45 seconds)*

Diving deeper into the on-chain programmes.

We have five core contracts. CouponCoin-dot-sol handles the SPL token with auto-burn transfer hooks. LockerPayment-dot-sol processes CPC-based locker payments with configurable discount rates and oracle price feed integration via Pyth Network. RewardEngine-dot-sol tracks cumulative user spend and triggers reward minting at configurable thresholds. TokenVesting-dot-sol manages time-locked releases compatible with the Bonfida standard. And BuybackBurn-dot-sol executes periodic market purchases through the Jupiter aggregator and sends purchased tokens to a verifiable burn address.

---

## SLIDE 13 — Transaction Flow *(1 minute)*

This slide maps the complete transaction lifecycle in seven steps.

Step one: user scans QR or taps NFC at the locker. Step two: the app authenticates the user's wallet. Step three: payment method selection — CPC or fiat. Step four: on-chain settlement via SPL transfer. Step five: the IoT controller receives an MQTT unlock command. Step six: session ends with time-based billing. Step seven: the reward contract mints CPC — ninety percent to the user, ten percent to the Locker Token holder.

Below the flow, you will see our protocol detail: high-frequency events are batched in L2 rollups before Layer-1 settlement, with a challenge period for fraud verification, and Pyth Network oracle integration for CPC-to-USDT price conversion in fiat-equivalent billing.

---

## SLIDE 14 — Launch Roadmap *(45 seconds)*

Our eight-step token launch sequence.

We are currently at step one — legal and compliance preparation. The timeline below maps our phased execution: Q2 2026 for foundational work, Q3 for mainnet deployment and early bird sale, Q4 for public sale and first CEX listing, and 2027 onward for ecosystem scaling.

The "We Are Here" marker shows our current position. Every subsequent step has clear prerequisites and deliverables.

---

## SLIDE 15 — Exchange Strategy *(45 seconds)*

Exchange listing follows a tiered approach.

Phase one: DEX launch on Raydium, with automatic indexing on Jupiter and DexScreener. Phase two: tier-three centralised exchanges — MEXC, Gate.io. Phase three: tier-two exchanges like KuCoin and Bybit. Phase four: eventual applications to tier-one platforms.

The bottom section details our market-making strategy: self-managed liquidity provision from the thirteen percent allocation during the DEX phase, transitioning to professional market makers for CEX order book depth.

---

## SLIDE 16 — Revenue Model *(45 seconds)*

Our revenue architecture is designed for sustainability, not extraction.

The core revenue anchor is locker usage fees — both fiat and CPC. As we scale, advertising revenue from in-app and locker-surface placements becomes significant. Merchant processing fees at one to three percent commission provide ecosystem-level revenue. And data analytics services represent a future revenue stream.

I want to emphasise the note at the bottom: the initial phase deliberately prioritises user acquisition over profitability. Revenue scaling is expected from year two onward.

---

## SLIDE 17 — Financial Projections *(1 minute)*

These are conservative, base-case projections with no optimistic bias.

Year one: five hundred lockers, Hong Kong pilot only, three uses per locker per day at an average ticket of ten Hong Kong dollars. Estimated annual revenue: fifty thousand US dollars. No token-related revenue assumed.

Year two: five thousand lockers with the Indonesia rollout, advertising begins, ten percent merchant adoption. Estimated revenue: four hundred thousand dollars.

Year three: twenty-five thousand lockers, Japan entry, full merchant alliance active. Estimated revenue: two million dollars.

These are deliberately conservative. The assumptions are explicit, and we will update projections quarterly based on actual operational data.

---

## SLIDE 18 — Risk & Compliance *(45 seconds)*

We have mapped five primary risk vectors with severity ratings and mitigation protocols.

The two critical risks are regulatory reclassification and smart contract exploits. For regulatory risk, our mitigation is a utility-only token design with an offshore issuing entity and legal opinion from a crypto-specialist firm. For smart contract security, we plan third-party audits, multi-signature administration, and a bug bounty programme.

Our compliance architecture employs a dual-track model: domestic markets use a points-based system with no token exposure, while international markets operate on the full on-chain CPC protocol.

---

## SLIDE 19 — Growth Trajectory *(45 seconds)*

Finally, our phased growth trajectory.

Short-term, year one: prove unit economics in Hong Kong and Indonesia, launch the token, secure the first CEX listing, and build an initial merchant alliance of five to ten partners.

Mid-term, years two to three: expand into Japan and broader Southeast Asia, deploy over twenty-five thousand lockers, and launch the Carry-T trading bot and initial DAO governance.

Long-term, year five and beyond: develop the Y Carry Chain as a dedicated Layer-1, build an internal exchange and wallet, and scale to two-point-five million lockers serving ten million daily users.

Our guiding philosophy is stated at the bottom: steady, data-driven growth. Prove economics at each stage before scaling. No growth-at-all-costs mentality.

---

## SLIDE 20 — Thank You *(15 seconds)*

That concludes my presentation. Thank you for your attention.

I would be happy to take any questions.

---
---
---

# 中文翻译

---

## 幻灯片 1 — 封面 *(30秒)*

大家下午好，感谢各位的时间。

我是[姓名]，今天我将为大家介绍 Coupon Coin — 一个为智能储物柜生态系统设计的基于区块链的优惠券代币化协议。本项目由 Y Carry Limited 开发，代表了我们将物理基础设施与去中心化数字激励系统相结合的愿景。

---

## 幻灯片 2 — 摘要 *(1分钟)*

首先是研究摘要。

Coupon Coin（简称 CPC）是一种基于 Solana 区块链的 SPL 实用型代币，在物联网智能储物柜基础设施之上构建了一个可编程的激励层。我们提出了一种双代币架构：用于交易功能的 CPC 同质化代币，以及用于现实世界资产（RWA）表示的衍生品 Locker Token。

该系统采用了通缩经济模型，包括 2% 的自动交易销毁、25% 资金分配的回购合约，以及分层质押机制。

我们解决的核心问题已有充分文献支持：根据德勤 2024 年的报告，传统优惠券的全球平均核销率低于 3%。通过在一条每秒处理超过 65,000 笔交易、亚秒级确认的高性能区块链上将激励代币化，我们从根本上重塑了消费者、商家和基础设施运营商之间的价值流动方式。

---

## 幻灯片 3 — 公司简介 *(1分钟)*

现在介绍项目背后的实体。

Y Carry Limited 是一家总部位于香港的智能储物柜基础设施提供商。我们的使命 ——"释放双手，拥抱所爱"—— 体现了我们的信念：技术应当从字面和隐喻意义上把人们从负担中解放出来。

我们的技术栈建立在专有的 Y-Protocol 之上，这是一种正在申请专利的 NFC 访问系统，辅以 NB-IoT 和 BLE 5.0 连接技术。我们储物柜的独特之处在于完全不需要外部供电 — 完全无线、电池供电，使用寿命超过两年。模块化设计使其能够在室内外任何环境中快速部署。

在幻灯片右侧，您可以看到我们的关键数据：香港超过六个运营点位、印尼已签约的 1300 多个柜体，以及五年内部署 250 万储物柜、服务 1000 万日活用户的全球目标。

---

## 幻灯片 4 — 市场进展 *(45秒)*

接下来是我们的部署状态。

在香港，我们已在多个高知名度地点投入运营，包括科学园、长洲太平清醮、运动场和香港滚轴溜冰学校。

在印尼，我们已签约在泗水的多个战略位置部署超过 1300 个储物柜，包括 Al-Akbar 清真寺和泗水理工学院。

日本在我们的积极洽谈名单中 — 它是全球储物柜密度最高的市场，对自动化服务有很高的文化接受度。更广泛的东南亚扩展将在印尼验证完成后展开。

---

## 幻灯片 5 — 问题陈述 *(1分钟)*

现在让我通过结构化的市场低效分析来框定问题。

我们识别了三个利益相关方的痛点，每个都有数据支撑。

首先是消费者。行业优惠券核销率低于 3%，意味着超过 97% 的已发放优惠券过期未使用。它们分散在孤立的平台上，不可转让，没有任何二级市场价值。

其次是商家。平均客户获取成本约为 29 美元，但商家几乎无法追踪优惠券效果或将转化归因到具体的营销活动。

第三是储物柜运营商 — 包括我们自己。传统的按次付费模式只能产生单一收入流，没有复购激励机制、没有会员体系、没有数据变现。

这种三方低效正是 Coupon Coin 要填补的空白。

---

## 幻灯片 6 — 文献综述 *(1分15秒)*

我们的协议设计植根于学术和行业研究。让我重点介绍五篇关键文献。

德勤 2024 年报告确定了区块链在忠诚度系统中的五大核心优势：通过智能合约自动化降低成本、无摩擦跨平台兑换、近实时结算、不可篡改的安全性，以及创新商业模式的构建。

Shi 等人 2023 年发表在《沙特国王大学学报》上的论文表明，去中心化电子优惠券系统 — 他们称之为 Ecoupon-Chain — 通过可编程的智能合约规则执行，显著提高了核销率。

Chen 等人 2021 年在 MDPI Symmetry 的研究显示，物理储物柜系统中基于代币的访问控制提升了运营透明度并减少了欺诈。

IEEE 2025 年的一篇论文进一步验证了智能合约与物理储物柜基础设施结合可增强信任和运营效率。

最后，Yakovenko 2018 年的 Solana 架构白皮书证明了大规模处理微交易的技术可行性 — 每秒 65,000 笔交易、亚秒级确认、成本可忽略。

这五项研究共同构成了我们协议设计的理论基础。

---

## 幻灯片 7 — 区块链选型 *(1分钟)*

这引出了协议选型。

我们对六条区块链网络进行了量化对比：Solana、以太坊、Polygon、Base 和 BNB Chain。

关键评估指标包括吞吐量、交易成本、确认时间和微支付适用性。

如表所示，Solana 在我们关注的每个维度都领先：65,000+ TPS、平均交易成本 0.00025 美元、确认时间低于 400 毫秒。

我们的选择逻辑很直接：在规模化运营下，我们预计每天约有 3000 万笔储物柜交易，每笔交易价值在 0.1 到 2 美元之间。在这样的交易量和金额下，Solana 是唯一一条不需要引入 Layer-2 复杂性就能使代币化微支付保持经济可行性的 Layer-1 网络。

---

## 幻灯片 8 — 代币参数 *(45秒)*

进入代币经济模型。

Coupon Coin 是 Solana 区块链上的标准 SPL 代币。总供应量固定为 2 亿枚，精度为 6 位小数。初始定价为 1 CPC = 0.1 USDT，发行时的完全稀释估值为 2000 万美元。

右侧两个大数字 — 2 亿供应量和 2000 万美元 FDV — 代表了我们保守的初始定位。我们特意选择了适度的估值，为由实际生态使用驱动的有机价格发现留出空间。

---

## 幻灯片 9 — 代币分配 *(1分钟)*

左侧的环形图展示了我们的分配模型。

20% 用于公开募资。团队奖励和财务储备各 15%。13% 专门用于流动性提供 — 这对 DEX 市场深度至关重要。8% 用于质押奖励，6% 用于营销，剩余 28% 分配给早鸟轮、空投、顾问、种子轮和 KOL。

重要的是，每项非公开分配都有锁仓释放时间表。团队代币有 12 个月的锁定期，之后 24 个月线性释放。顾问和种子轮分配有较短的锁定期，但同样设有锁仓。这确保了团队与代币生态之间的长期利益一致性。

---

## 幻灯片 10 — 通缩机制与双代币 *(1分钟)*

这页有两个关键设计要素。

首先是通缩机制。我们实施了三种机制。机制一：每笔 CPC 转账自动销毁 2%，永久减少流通量。机制二：25% 的募集资金分配到专用回购合约，定期从公开市场购买 CPC 并销毁。机制三：超过 12 个月未领取的空投代币将被回收至生态系统国库。

其次是双代币架构。CPC 是主要的实用代币 — 用于支付、奖励、质押和治理。Locker Token 是衍生品：用户质押 1000 CPC 可铸造 1 个 Locker Token，代表对一个实体储物柜的部分所有权。当该储物柜被使用时，奖励合约会自动向 Locker Token 持有者分发 CPC — 90% 给用户，10% 给持有者。这在现实世界资产利用率和代币经济之间建立了直接的、可验证的联系。

---

## 幻灯片 11 — 技术架构 *(1分钟)*

协议基于三层架构运行。

第三层是区块链层：Solana SPL 代币、Metaplex 代币元数据，以及我们覆盖锁仓、奖励、回购和质押的智能合约套件。我们还实施了 L2 Rollup，用于在 Layer 1 结算之前批处理高频储物柜交易。

第二层是应用层：React Native 移动应用、小程序集成、内嵌 MPC 钱包（用户无需管理私钥），以及用于合作伙伴管理的商家仪表板。

第一层是物理和物联网层：专利申请中的 NFC Y-Protocol、QR 码备用方案、NB-IoT 和 4G 蜂窝网络连接、用于实时储物柜指令的 MQTT 消息代理，以及储物柜微控制器上的边缘计算。

---

## 幻灯片 12 — 智能合约套件 *(45秒)*

深入到链上程序。

我们有五个核心合约。CouponCoin.sol 处理带有自动销毁转账钩子的 SPL 代币。LockerPayment.sol 处理基于 CPC 的储物柜支付，支持可配置折扣率和 Pyth Network 预言机价格接入。RewardEngine.sol 追踪用户累计消费并在可配置阈值处触发奖励铸造。TokenVesting.sol 管理兼容 Bonfida 标准的时间锁释放。BuybackBurn.sol 通过 Jupiter 聚合器执行定期市场购买，并将购买的代币发送到可验证的销毁地址。

---

## 幻灯片 13 — 交易流程 *(1分钟)*

这页描绘了完整的交易生命周期，分为七个步骤。

第一步：用户在储物柜扫码或碰触 NFC。第二步：应用验证用户钱包。第三步：选择支付方式 — CPC 或法币。第四步：通过 SPL 转账进行链上结算。第五步：物联网控制器接收 MQTT 解锁指令。第六步：会话结束，按时间计费。第七步：奖励合约铸造 CPC — 90% 给用户，10% 给 Locker Token 持有者。

流程图下方，您可以看到我们的协议细节：高频事件通过 L2 Rollup 批处理后在 Layer 1 结算，设有挑战期用于欺诈验证，并集成 Pyth Network 预言机进行法币等价计费的 CPC/USDT 价格转换。

---

## 幻灯片 14 — 发币路线图 *(45秒)*

我们的八步代币发行序列。

我们目前处于第一步 — 合规准备阶段。下方时间线展示了分阶段执行计划：2026 年第二季度完成基础工作，第三季度主网部署和早鸟轮，第四季度公开发售和首个 CEX 上线，2027 年起进行生态扩展。

"We Are Here" 标记显示了我们当前的位置。每个后续步骤都有明确的前置条件和交付物。

---

## 幻灯片 15 — 上所策略 *(45秒)*

交易所上线采用分层策略。

第一阶段：在 Raydium 上启动 DEX，自动被 Jupiter 和 DexScreener 索引。第二阶段：三线中心化交易所 — MEXC、Gate.io。第三阶段：二线交易所如 KuCoin 和 Bybit。第四阶段：最终申请一线平台。

底部详细介绍了做市策略：DEX 阶段利用 13% 的代币分配进行自管理流动性提供，在 CEX 阶段过渡到专业做市商以提供订单簿深度。

---

## 幻灯片 16 — 收入模型 *(45秒)*

我们的收入架构以可持续性为导向，而非短期套利。

核心收入锚点是储物柜使用费 — 法币和 CPC 双通道。随着规模扩大，应用内和柜面广告收入将变得显著。1-3% 佣金的商家处理费提供生态层面的收入。数据分析服务代表未来的收入来源。

我要强调底部的注释：初始阶段刻意将用户获取优先于盈利能力。收入规模化预计从第二年开始。

---

## 幻灯片 17 — 财务预测 *(1分钟)*

这是保守的基准情景预测，不含任何乐观偏差。

第一年：500 个储物柜，仅限香港试点，每柜每天 3 次使用，平均客单价 10 港元。预计年收入：5 万美元。不假设任何代币相关收入。

第二年：5000 个储物柜，印尼市场铺开，广告收入启动，10% 商家覆盖率。预计收入：40 万美元。

第三年：25000 个储物柜，进入日本，商家联盟全面运作。预计收入：200 万美元。

这些数字是刻意保守的。假设条件是明确的，我们将根据实际运营数据按季度更新预测。

---

## 幻灯片 18 — 风险与合规 *(45秒)*

我们梳理了五个主要风险向量及其严重性评级和应对方案。

两个关键风险分别是监管重新分类和智能合约漏洞。对于监管风险，我们的应对是仅做实用型代币设计，配合离岸发行实体和加密货币专业律所的法律意见书。对于智能合约安全，我们计划进行第三方审计、多签管理和漏洞赏金计划。

我们的合规架构采用双轨制：国内市场使用基于积分的系统，不涉及代币暴露；国际市场运行完整的链上 CPC 协议。

---

## 幻灯片 19 — 增长轨迹 *(45秒)*

最后是我们的分阶段增长轨迹。

短期，第一年：在香港和印尼验证单元经济模型，完成代币发行，获得首个 CEX 上线，建立 5-10 个商家的初始联盟。

中期，第二到三年：扩展到日本和更广泛的东南亚地区，部署超过 25,000 个储物柜，启动 Carry-T 交易机器人和初版 DAO 治理。

长期，第五年及以后：开发 Y Carry Chain 作为专用 Layer-1，建设内部交易所和钱包，扩展到全球 250 万储物柜、1000 万日活用户。

底部写着我们的指导原则：稳健的、数据驱动的增长。在每个阶段验证经济模型后再扩展。不追求不计代价的增长。

---

## 幻灯片 20 — 致谢 *(15秒)*

以上是我的全部演示，感谢大家的聆听。

欢迎提问。
