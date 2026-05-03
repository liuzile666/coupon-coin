# 03 · Launch Kit

The actual code that deployed Coupon Coin on Solana Devnet. Nine Node.js scripts, zero magic.

## Files

```
scripts/
├── 01-setup-wallet.js           Create + fund a fresh deployer keypair
├── 02-create-token.js           Create the SPL mint (6 decimals)
├── 03-mint-tokens.js            Mint 200,000,000 CPC to the deployer ATA
├── 04-continue-after-airdrop.js Fallback for when devnet faucet is rate-limited
├── 05-verify.js                 Read-back — confirms supply, holders, metadata
├── 06-add-metadata.js           Register Metaplex metadata so Phantom shows name + logo
├── config.js                    Shared constants (RPC URL, mint decimals, supply)
├── utils.js                     Shared helpers (keypair I/O, airdrop retry)
└── launch-all.js                Runs 01 → 03 → 05 in sequence

assets/
├── cpc-logo.png                 512×512 gold-coin logo (38 KB)
└── cpc-metadata.json            OpenSea-format metadata JSON

cpc-token-result.json            Deployment output — mint/signatures/timestamps
state.json                       Resumable state across the launch steps
make_logo.py                     The matplotlib script that generated the logo
```

## Note — deployer.json is not included

The `deployer.json` file (your Solana private key) is **intentionally excluded** from this repo. If you want to redeploy, run `node scripts/01-setup-wallet.js` — it will generate a fresh keypair locally.

## Running it

```bash
cd 03_launch_kit
npm install @solana/web3.js @solana/spl-token @metaplex-foundation/umi @metaplex-foundation/mpl-token-metadata bs58

# End-to-end
node scripts/01-setup-wallet.js     # creates deployer.json + airdrops 2 SOL
node scripts/02-create-token.js     # creates the mint
node scripts/03-mint-tokens.js      # mints 200M CPC to you
node scripts/06-add-metadata.js     # registers name/symbol/uri on-chain
node scripts/05-verify.js           # prints the full audit
```

## What the deployment actually did

- Created mint `8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ` on Solana Devnet
- Assigned mint + freeze authority to deployer `5tAjqgNkBaMjzy388LtZQF41AfDprCqcYPfjrRSQxHcG`
- Minted **200,000,000 CPC** (the full supply, with 6 decimals — that is 200 000 000 × 10⁶ base units)
- Wrote Metaplex metadata PDA `8XnM3aa63m1Cgujne8BSjcC7cdp46Qfz9eB6bnTeVMr8` pointing at the logo + JSON
- Total cost: **0.004 SOL** (≈$0.60 at current prices)
- Total time: **1.8 seconds** for the mint transaction, ~3 minutes for the full pipeline including faucet waits

## The scripts in narrative order

1. **Get a wallet** → `01-setup-wallet.js` generates a fresh Solana keypair, saves it to `deployer.json`, and airdrops 2 SOL from the devnet faucet. We retry up to 5 times because the public faucet is flaky.
2. **Create the mint** → `02-create-token.js` calls `createMint` from `@solana/spl-token`, paying for the rent-exempt mint account, setting 6 decimals, and storing both the mint and freeze authority on the deployer.
3. **Mint the supply** → `03-mint-tokens.js` creates an Associated Token Account for the deployer and mints the full 200M in one transaction. No cliff. No vesting schedule. The distribution happens off-chain through the Y Carry operator.
4. **Register metadata** → `06-add-metadata.js` uses the Metaplex Umi SDK to derive the metadata PDA (`["metadata", ProgramId, MintAddress]`) and write `{name, symbol, uri}`. Without this step, Phantom shows "Unknown Token".
5. **Verify** → `05-verify.js` reads the mint supply, the deployer's ATA balance, and the metadata account, and prints a one-page audit.

---

← [back to main README](../README.md)
