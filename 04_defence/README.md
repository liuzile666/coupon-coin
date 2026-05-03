# 04 · Defence Package

Everything used for the oral defence. Optimised for a 15-minute presentation with Q&A.

## Files

| File | What it is |
|---|---|
| `Defence_Deck.pptx` | 23-slide defence deck (1.6 MB) — visual-heavy, minimal text |
| `Presentation_v1.pptx` | Earlier 30-slide version (589 KB) — more detailed, for a longer talk |
| `DEFENCE_SCRIPT.md` | Demo script — opening hook, six prepared Q&As, failure fallback, on-the-fly transfer stunt |
| `01_code/` | Subset of launch scripts — enough to run a live demo |
| `02_assets/` | Logo + metadata JSON referenced on slides |
| `03_onchain_proof/` | Deployment receipts — mint address, signatures, timestamps |

## How to run the defence

1. **Pre-flight**: open the deck in presenter view with the script visible on the second monitor
2. **Opening**: read the first paragraph of `DEFENCE_SCRIPT.md` verbatim — it hooks the room in 30 seconds
3. **Live demo**:
   - Slide 18 ("Live On-Chain"): open three Solscan tabs in advance
     - Token page: https://solscan.io/token/8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ?cluster=devnet
     - Mint transaction
     - Deployer wallet
   - Phantom desktop does not expose Devnet in its UI — **do not try to show a Phantom balance live**
   - Fallback: the landing site at https://liuzile666.github.io/cpc-site/ pulls live holder count from Solana RPC
4. **Q&A**: script covers six common questions:
   - "Why Solana and not Ethereum?"
   - "Isn't this just a coupon with extra steps?"
   - "What stops Y Carry from just issuing points in their own app?"
   - "How do you prevent a pump-and-dump?"
   - "Is this legally a security?"
   - "If a locker is offline, what happens to the transaction?"
5. **Close**: the script ends with an offer — transfer 100 CPC to any wallet address the examiner provides, live, on stage. It takes 3 seconds and lands as undeniable proof.

## Insurance

If live demo fails for any reason:
- Deck includes backup screenshots of all three Solscan tabs (slides 19–21)
- Deck includes a QR code to the landing site on the closing slide
- `03_onchain_proof/cpc-token-result.json` has the raw receipts — copy-paste friendly

---

← [back to main README](../README.md)
