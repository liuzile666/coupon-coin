# 06 · Figures

All 29 figures from the dissertation, rendered as individual PNGs.

## File list

| Figure | Title (short) |
|---|---|
| `figure_01.png` | Global coupon market size (2019–2023) |
| `figure_02.png` | Industry redemption rate distribution |
| `figure_03.png` | US coupon fraud losses by category |
| `figure_04.png` | Y Carry hardware stack |
| `figure_05.png` | Y Carry deployment map (HK + Indonesia) |
| `figure_06.png` | Three-layer system architecture |
| `figure_07.png` | Seven-step transaction lifecycle |
| `figure_08.png` | Token supply distribution doughnut |
| `figure_09.png` | Dual-token model (CPC × locker PIYT) |
| `figure_10.png` | Transaction cost comparison across chains |
| `figure_11.png` | Throughput comparison across chains |
| `figure_12.png` | Finality comparison across chains |
| `figure_13.png` | Gas fee volatility |
| `figure_14.png` | Blockchain selection radar (7 criteria × 6 chains) |
| `figure_15.png` | Smart contract module map |
| `figure_16.png` | Revenue → buyback-and-burn flow |
| `figure_17.png` | Staking rewards curve |
| `figure_18.png` | Idle wallet reclamation model |
| `figure_19.png` | User journey: locker tap to settlement |
| `figure_20.png` | Merchant onboarding flow |
| `figure_21.png` | DAO governance proposal lifecycle |
| `figure_22.png` | Security threat model |
| `figure_23.png` | Compliance framework |
| `figure_24.png` | Cost per locker session breakdown |
| `figure_25.png` | 5-year supply/burn projection |
| `figure_26.png` | Revenue projection (conservative) |
| `figure_27.png` | Revenue projection (optimistic) |
| `figure_28.png` | Carbon footprint comparison |
| `figure_29.png` | Roadmap Gantt chart |

## Reproducing

```bash
pip install matplotlib numpy
python3 make_figures.py
```

All 29 figures rebuild in about 40 seconds. The script has one constant block at the top for colour palette and font — change those and every figure updates consistently.

## Style conventions

- **Gold** `#E0B250` — Coupon Coin, token supply, positive flow
- **Teal** `#2E86AB` — application layer, user journey
- **Navy** `#0A0A0C` — chain layer, backgrounds
- **Red** `#C62828` — deflationary / burn mechanics
- Font: **Inter** for UI labels, **Playfair Display** for titles

---

← [back to main README](../README.md)
