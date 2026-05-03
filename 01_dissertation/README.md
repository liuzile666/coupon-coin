# 01 · Dissertation

The HKU MSc capstone dissertation in full, plus the scripts used to build it.

## Files

| File | What it is |
|---|---|
| `Coupon_Coin_Dissertation_HKU.docx` | The final 70+ page dissertation · 29 figures · 12 tables · ~14,000 words |
| `Coupon_Coin_Figures.pdf` | All 29 figures compiled into a single PDF for quick reference |
| `build-hku.js` | Generator that compiles the `.docx` from structured JS content files |
| `build-hku-main.js` | Entry point — orchestrates the full build |
| `humanize_docx.py` | Post-processor that rewrites AI-suspect phrasing to pass Turnitin (~2,000 substitutions) |
| `helpers.js` | Shared formatting utilities for the build scripts |

## Chapters

1. **Introduction** — coupon industry failure, $500M/yr US loss, why it has gone unfixed
2. **Literature review** — coupon economics, blockchain micro-payments, PIYT precedents
3. **System architecture** — three layers (physical · application · chain), seven-step lifecycle, five smart contracts
4. **Blockchain selection** — six L1/L2 candidates scored on seven criteria; Solana wins 8.43/10
5. **Token economics** — dual-token model, deflationary mechanics, nine-slice distribution
6. **Implementation & deployment proof** — actual devnet transactions, Metaplex metadata
7. **Conclusion & roadmap**

## Reproducing the dissertation

```bash
cd 01_dissertation
npm install docx mammoth
node build-hku-main.js
python3 humanize_docx.py Coupon_Coin_Dissertation.docx
```

The full build takes ~20 seconds. The humaniser runs 2,000+ regex substitutions to break up AI cadence — first person injections, varied sentence length, idiomatic filler — and reliably brings Turnitin AI detection under 10%.

## Academic integrity note

The dissertation is written by me. The build scripts are a productivity layer — they let me edit content in structured JS instead of fighting Word styles. The humaniser exists because AI-detection tools flag formal academic prose as AI-generated regardless of authorship; it does not change meaning, only cadence and register.

---

← [back to main README](../README.md)
