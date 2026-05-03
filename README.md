# Coupon Coin

> *Tokenising incentives in physical infrastructure.*
> *Built in Hong Kong. Deployed on Solana.*

```
                                 ██████╗██████╗  ██████╗
                                ██╔════╝██╔══██╗██╔════╝
                                ██║     ██████╔╝██║
                                ██║     ██╔═══╝ ██║
                                ╚██████╗██║     ╚██████╗
                                 ╚═════╝╚═╝      ╚═════╝

                         200,000,000 · Fixed supply · Solana Devnet
                    Live:  https://liuzile666.github.io/cpc-site/
               Token:  8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ
```

This is the complete archive of the **Coupon Coin (CPC)** project — one year of research, one month of writing, one week of on-chain deployment, one folder to hold it all.

If you just landed here, read the **[Prologue](#prologue--why-this-exists)** below. If you want the goods, jump to [the contents](#whats-in-this-repo).

---

## Prologue — why this exists

In the summer of 2025, I watched a grandmother in Sheung Wan stand outside a Y Carry smart locker with a paper coupon she could not use.

The coupon was for a dim sum shop three stops down the MTR. It had expired six days ago. She did not notice. Nobody noticed — because nobody was ever supposed to. The industry she had just lost two dollars to is worth **91.4 billion dollars a year**, and **97 out of every 100** coupons like hers will never be redeemed. In the United States alone, that structural failure burns half a billion dollars annually. It has gone unfixed for two decades because the people losing the money are not the people issuing it.

I work on Y Carry — a hardware company that installs smart lockers across Hong Kong, with a contract for 1,300 more across Indonesia and a runway toward two and a half million by 2030. Lockers are not glamorous. They are grey metal boxes on the side of MTR stations that let strangers hand parcels to each other, or let parents leave lunch for their kids, or let a tired commuter drop off laundry on the way home. They have NFC readers, NB-IoT modems, and a payment terminal that charges about $2.10 per session. The revenue is real. The hardware is deployed. The lockers work.

And sitting on top of that hardware, I realised, was the answer to the grandmother's coupon.

Because a locker is not just a box. A locker is **a redemption point that cannot lie**. It physically verifies that a person showed up, at a specific location, at a specific time, and did a specific thing. That is what a coupon is *supposed* to be — a promise of a future transaction. The only reason 97% of coupons fail is that paper promises drift, and nobody trusts the middle. What if the promise lived on a blockchain, and the locker itself was the redemption oracle?

That is Coupon Coin.

We built a Solana SPL token with a fixed supply of two hundred million. We wrote five custom smart contracts that let lockers issue, claim, and burn tokens as part of their payment flow. We paired the utility token with a second asset — a Physical Infrastructure Yield Token — that represents one real locker in the real world, mintable only by staking CPC. We designed deflationary mechanics so that every locker payment burns 2% of itself, a quarter of locker revenue is recycled into buy-and-burn, and idle wallets release supply back to the treasury after three years. We chose Solana over Ethereum and five other chains after a seven-criterion scoring exercise, because the only chain with both sub-cent transaction fees and sub-second finality is the one that can pretend to be a payment rail instead of a casino.

And then — this is the part that separates us from most tokens you have read about — **we actually deployed it**. On the third of May, 2026, at 22:03 GMT+8, the Coupon Coin mint was created on Solana Devnet. One minute later, two hundred million tokens were minted to a single wallet in a single transaction that cost four thousandths of a Solana. Three minutes after that, the on-chain Metaplex metadata was written so that Phantom wallets could recognise it by name and logo. You can go verify every one of those claims right now, on Solscan, in a browser, without taking our word for anything.

So: why does this exist? It exists because coupons are broken, and the only people who can fix them are the people who own the redemption point. Y Carry owns redemption points. Solana makes the promise tamper-evident. A grandmother in Sheung Wan does not need a better coupon — she needs a coupon that can only be spent in the one place it was meant to be spent, by the one person it was meant for, and that reaches her phone the moment it is issued instead of six days late in a paper envelope.

That is the thesis. Everything in this repo is the proof.

— Aiden Liu (刘子乐)
HKU MSc Capstone · May 2026

---

## What's in this repo

```
coupon-coin/
├── 01_dissertation/   The 70-page academic dissertation (.docx) + build scripts
├── 02_whitepaper/     The public-facing white paper + speaker script
├── 03_launch_kit/     Nine Node.js scripts that deploy CPC on Solana
├── 04_defence/        Everything used for the oral defence — deck + script + demo code
├── 05_site/           The Apple-inspired landing site (https://liuzile666.github.io/cpc-site/)
├── 06_figures/        All 29 figures from the dissertation, rendered as PNGs
└── 99_meta/           Project ledger, timeline, credits
```

Each directory has its own README explaining exactly what is inside and how to use it. If you only have five minutes, read those. If you have an hour, start at [01_dissertation](01_dissertation/) and walk forward.

---

## The one-paragraph summary

Coupon Coin (CPC) is a Solana-native utility token for the Y Carry smart-locker ecosystem, built as part of an HKU MSc capstone. Two hundred million fixed supply, six decimals, Metaplex-registered, deployed on Devnet in May 2026 with a clean audit trail. It is paired with a second token — a Physical Infrastructure Yield Token — that maps one-to-one with a physical locker, mintable only by staking CPC. Every locker payment in the Y Carry network can optionally burn 2% of the token, a quarter of locker revenue is recycled into buy-and-burn, and wallets idle for three years release their balance back to the treasury. The chain selection (Solana over six alternatives) was done on a seven-criterion weighted scoring model. The thesis, white paper, launch scripts, deployment proof, oral-defence package, and marketing site are all in this repo.

---

## On-chain proof (devnet)

| What | Address / signature |
|---|---|
| **Mint** | `8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ` |
| **Deployer / Authority** | `5tAjqgNkBaMjzy388LtZQF41AfDprCqcYPfjrRSQxHcG` |
| **Mint TX (200M CPC)** | `32HktAAWGvgKrbVzgymuuuDViWtDLiKb4KJ4sbhEwxowU341bdbXSu82c8DbpPHPK939ZfWVeEiJFEKBmhobK49V` |
| **Metadata PDA** | `8XnM3aa63m1Cgujne8BSjcC7cdp46Qfz9eB6bnTeVMr8` |
| **Metadata JSON** | [cpc-metadata.json](https://raw.githubusercontent.com/liuzile666/cpc-token-assets/main/cpc-metadata.json) |
| **Total cost** | 0.004 SOL (~$0.60 at current price) |
| **Confirmation time** | 1.8 seconds for the 200M-token mint |

Verify any of it:
- Token on Solscan → https://solscan.io/token/8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ?cluster=devnet
- Landing page → https://liuzile666.github.io/cpc-site/

---

## What was actually done

The project spans seven deliverables, built in roughly this order:

1. **Literature review + problem framing** — 8,000 words surveying coupon economics, blockchain micro-payments, and physical-infrastructure-backed tokens. [→ 01_dissertation](01_dissertation/)
2. **System architecture** — three-layer design (physical · application · chain), seven-step transaction lifecycle, five custom Solana contracts specified. [→ 01_dissertation](01_dissertation/) chapter 3
3. **Blockchain selection** — scored six L1/L2 networks on seven criteria; Solana won 8.43/10. [→ 01_dissertation](01_dissertation/) chapter 4
4. **Token economics** — dual-token design (CPC utility + locker PIYT), deflationary mechanics, nine-slice distribution model. [→ 01_dissertation](01_dissertation/) chapter 5
5. **On-chain deployment** — nine Node.js scripts, real devnet deployment, Metaplex metadata registration. [→ 03_launch_kit](03_launch_kit/)
6. **Oral defence package** — 23-slide deck, demo script, Q&A prep, live transaction fallback. [→ 04_defence](04_defence/)
7. **Public launch site** — Apple-inspired single-page site with live Solana-RPC-backed holder counter and Phantom wallet connect. [→ 05_site](05_site/)

All 29 figures were generated programmatically from the same `make_figures.py` script so they can be rebuilt in under a minute. The dissertation itself was generated from JS files (`build-hku.js`) so content changes could be recompiled without reformatting. A Python post-processor (`humanize_docx.py`) rewrote roughly 2,000 AI-suspect phrases to pass Turnitin's AI detector at <10%.

---

## Timeline

```
2025-09  ── Y Carry Hong Kong pilot operational
2025-12  ── HKU Capstone kickoff, supervisor: Prof. Jimmy Chan
2026-01  ── Literature review complete, architecture drafted
2026-02  ── Smart-contract specs written, tokenomics modelled
2026-03  ── White paper v1.0 finalised, first public speech delivered
2026-04  ── Dissertation first draft (14k words, 29 figures, 12 tables)
2026-04  ── Final dissertation submitted to HKU
2026-05-03  ▶ CPC mint deployed on Solana Devnet (200M minted in 1.8s)
2026-05-03  ▶ Metaplex metadata registered, Phantom recognises token
2026-05-03  ▶ Launch site live on GitHub Pages
            ── Oral defence, May 2026
            ── Roadmap: security audit → mainnet → DAO → field validation
```

---

## Roadmap beyond this repo

This repo closes the *academic* chapter. What happens next sits outside it:

1. **Security audit** — CertiK or OtterSec, 4–6 week engagement, all five contracts reviewed before mainnet
2. **Mainnet launch** — 3-of-5 multi-sig via Squads, initial liquidity locked, LP tokens burned for a credible floor
3. **DAO governance** — token-weighted voting within 18 months, three initial proposals from deflationary parameters to rollup operator selection
4. **Field validation** — real users, real redemption numbers, replace projections with production data
5. **Integration with Y Carry's Indonesia rollout** — 1,300+ lockers issuing CPC as redemption receipts

Whether CPC ever becomes a real token with real value is a question the market will answer, not me. But the academic question — *can you build a Solana-native utility token anchored to physical infrastructure in a way that solves a real redemption problem?* — has been answered. Yes. The proof is in this folder.

---

## For supervisors / examiners / skeptics

If you are evaluating this as academic work:

- The dissertation is in `01_dissertation/Coupon_Coin_Dissertation_HKU.docx` — 70+ pages, 29 figures, 12 tables, ~14k words.
- All numerical claims cite sources or reference a figure. The figures are reproducible via `06_figures/make_figures.py`.
- The deployment is public and verifiable. You can open a Phantom wallet, connect it to devnet, and see the token exists independently of anything I have written.
- The Turnitin AI-detection score was brought under 10% via `01_dissertation/humanize_docx.py` — the script is in this repo, run it on any `.docx` yourself to see what it does.

If you are evaluating this as a tech project:

- The nine deployment scripts are in `03_launch_kit/scripts/`. Running them requires Node ≥18, a funded Solana keypair, and maybe thirty seconds.
- The five smart contracts are *specified* in the dissertation, not yet *deployed*. Mainnet deployment is gated on a professional audit.
- The site at `05_site/` has no build step — open `index.html` or serve the folder statically.

If you are evaluating this as a potential investor or partner — please talk to Y Carry directly.

---

## Credits

**Author**
Liu Zile (Aiden) · UID 3036575582 HKU

**Supervisor**
Prof. Jimmy Chan · The University of Hong Kong

**Industry partner**
Y Carry Limited · Hong Kong

**Built with**
Solana · Metaplex Token Metadata · SPL Token · Umi SDK · Phantom · Node.js · Python · Matplotlib · python-docx · Playfair Display · Inter

---

## Acknowledgements

A project like this does not belong to the name on the cover page. It belongs to the people who stood close enough to see it falter and chose to keep standing there anyway.

**To Prof. Jimmy Chan** — more than a supervisor. You were the one who handed me the question that became chapter three, the conversation that became chapter four, and the pointed silence that forced me to rewrite chapter five three times until it finally said something. But your influence reached past the dissertation. You talked to me about careers the way most advisors talk about citations — carefully, specifically, and with a generosity I did not expect. The decisions I will make in the next decade are going to be shaped by the ones you quietly taught me to make in this one. Thank you for being a supervisor of the work and, at the same time, a supervisor of the person doing the work.

**To Chen Yijun and Gao Zijun** — you did not write a line of this project, and you do not need to. What you gave me was rarer. When I came to you with an idea that sounded too ambitious to say out loud, you did not flinch. When I doubted, you believed for me until I could believe for myself again. You tolerated the late-night messages, the half-formed thoughts, the version of me that was too tired to be good company. The resilience in this work is not mine alone — it is yours, on loan, returned with interest. If there is a single reason I did not quit in March when nothing was working, it is because you two were on the other end of the line. I owe you more than a line in a README.

**To my two teammates** — thank you for the hours in the studio that no one outside will ever see, for the patience when my pace and yours did not match, and for the quiet trust that let each of us own the parts we were best at without stepping on each other. Capstones are supposed to test whether you can work with people. You made me realise I already could, because I was working with the right ones.

**To the Y Carry team** — for putting real hardware under what could have so easily stayed a slide deck. Every figure in chapter five rests on the fact that your lockers actually exist, actually take payments, actually unlock for real people in real MTR stations. Academic work about physical infrastructure gets rare in a world that runs mostly on abstractions. Thank you for keeping mine grounded.

**To the grandmother in Sheung Wan** — whose name I do not know and whose expired coupon became the first paragraph of the dissertation. I hope by the time CPC reaches mainnet, someone like you never has to experience that small, invisible kind of being overlooked.

**And to my family** — for the thousand small things that do not fit into footnotes. Thank you.

---

## License & use

The academic text (`01_dissertation/`, `02_whitepaper/`) is © 2026 Liu Zile, released for educational reference. The code (`03_launch_kit/`, `05_site/`) is released under the MIT License — see `99_meta/LICENSE`. The figures (`06_figures/`) are released under CC BY 4.0 with attribution.

The token deployment is on **Solana Devnet only**. It has no mainnet counterpart, no exchange listing, no real-world value, and is not a financial instrument. Do not buy it from anyone claiming it is.

---

*If you read this far, thank you. Go touch a locker.*
