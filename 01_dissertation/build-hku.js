// HKU IDAT7100 Capstone Final Report - Coupon Coin
// Format: Times New Roman, 1.5 line spacing, full justified
// Headings: Section bold 16pt, Subsection bold 14pt, body 12pt
// Citations: IEEE numbered [1][2]

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, Header, Footer, PageNumber, LevelFormat,
  TableOfContents, StyleLevel, ImageRun,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ===== Style constants =====
const F = "Times New Roman";
const SZ_BODY   = 24;   // 12pt
const SZ_H1     = 32;   // 16pt
const SZ_H2     = 28;   // 14pt
const SZ_H3     = 26;   // 13pt
const SZ_CAP    = 22;   // 11pt
const LINE_15   = 360;  // 1.5 line spacing
const CW_TOTAL  = 9360;

const bd = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const bdLite = { style: BorderStyle.SINGLE, size: 2, color: "888888" };
const bds = { top: bd, bottom: bd, left: bd, right: bd };
const bdsLite = { top: bdLite, bottom: bdLite, left: bdLite, right: bdLite };
const cm = { top: 100, bottom: 100, left: 120, right: 120 };

let figN = 0, tblN = 0, eqN = 0;

// ===== Atomic builders =====
const t = (s, o={}) => new TextRun({ text: String(s), font: F, size: o.sz || SZ_BODY, ...o });
const b  = (s) => t(s, { bold: true });
const it = (s) => t(s, { italics: true });
const sup = (s) => t(s, { superScript: true, sz: SZ_BODY - 2 });

function P(runs, o={}) {
  const ch = typeof runs === "string" ? [t(runs)] : runs;
  return new Paragraph({
    spacing: { after: o.a ?? 200, before: o.b ?? 0, line: o.line ?? LINE_15 },
    alignment: o.al || AlignmentType.JUSTIFIED,
    indent: o.indent ? { firstLine: 480 } : undefined,
    children: ch,
  });
}

// Section heading 16pt bold (Chapter level)
const H1 = (s) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 480, after: 240, line: LINE_15 },
  alignment: AlignmentType.LEFT,
  children: [t(s, { bold: true, sz: SZ_H1 })],
});

// Subsection 14pt bold (1.1, 1.2 etc.)
const H2 = (s) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 360, after: 200, line: LINE_15 },
  alignment: AlignmentType.LEFT,
  children: [t(s, { bold: true, sz: SZ_H2 })],
});

// Sub-subsection 13pt bold (1.1.1)
const H3 = (s) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 280, after: 160, line: LINE_15 },
  alignment: AlignmentType.LEFT,
  children: [t(s, { bold: true, sz: SZ_H3 })],
});

const BL = (s) => {
  const ch = typeof s === "string" ? [t(s)] : (Array.isArray(s) ? s : [s]);
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { after: 100, line: LINE_15 },
    children: ch.length ? ch : [t(" ")],
  });
};

const NL = (s) => {
  const ch = typeof s === "string" ? [t(s)] : (Array.isArray(s) ? s : [s]);
  return new Paragraph({
    numbering: { reference: "num", level: 0 },
    spacing: { after: 100, line: LINE_15 },
    children: ch.length ? ch : [t(" ")],
  });
};

const PB = () => new Paragraph({ children: [new PageBreak()] });
const SP = (n=200) => new Paragraph({ spacing: { after: n } });

// Center-justified text
const PC = (s, o={}) => new Paragraph({
  spacing: { after: o.a ?? 200, before: o.b ?? 0, line: o.line ?? LINE_15 },
  alignment: AlignmentType.CENTER,
  children: typeof s === "string" ? [t(s, o)] : s,
});

// Figure caption (italic, centered, "Figure N. caption")
function figCap(desc) {
  figN++;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 280, before: 80 },
    children: [
      t(`Figure ${figN}. `, { italics: true, sz: SZ_CAP, bold: true }),
      t(desc, { italics: true, sz: SZ_CAP }),
    ],
  });
}

// Table caption (above table, "Table N. caption")
function tblCap(desc) {
  tblN++;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100, before: 240 },
    children: [
      t(`Table ${tblN}. `, { italics: true, sz: SZ_CAP, bold: true }),
      t(desc, { italics: true, sz: SZ_CAP }),
    ],
  });
}

// Equation: centered with right-aligned number "(1)"
function equation(latexLike, num) {
  if (num === undefined) { eqN++; num = eqN; } else { eqN = num; }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, before: 200 },
    tabStops: [{ type: "right", position: 9000 }],
    children: [
      t("    "),
      t(latexLike, { italics: true }),
      t("\t"),
      t(`(${num})`),
    ],
  });
}

// Figure with embedded PNG (loaded from figures/figure_NN.png)
// Falls back to grey placeholder box when the file is missing.
const FIG_DIR = path.join(__dirname, "figures");

// Per-figure aspect ratio map (w x h) — keep visual proportions sane.
// Values are typical width:height ratios used during PNG generation.
const FIG_ASPECT = {
  1:9/5, 2:9/5, 3:9.5/5.8, 4:9/6, 5:9.5/5.5, 6:9.5/5.5, 7:10/6, 8:10/5.5,
  9:10/6, 10:9/6.2, 11:8.5/6, 12:10/5.5, 13:10/5.4, 14:10/5.5, 15:10/6,
  16:11/4.5, 17:10/5.5, 18:10/6, 19:10/6, 20:10/6, 21:11/5.2, 22:10/5.5,
  23:10/6, 24:10/5.4, 25:11/5.6, 26:8.5/6.5, 27:10/6, 28:11/5.5, 29:11/5.5,
};
// Render width in EMU-equivalent pixels (docx uses pixels for ImageRun)
const FIG_W_DEFAULT = 540;       // ~ 5.6 inches @ 96dpi → fits within 6"" usable
const FIG_W_WIDE    = 600;       // for very wide figures (16, 25, 28, 29, 21)
const WIDE_FIGS = new Set([16, 21, 25, 28, 29]);

function mkFig(caption) {
  figN++;
  const idx = figN;
  const filePath = path.join(FIG_DIR, `figure_${String(idx).padStart(2, "0")}.png`);
  let imgPara;
  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    const aspect = FIG_ASPECT[idx] || 1.6;
    const w = WIDE_FIGS.has(idx) ? FIG_W_WIDE : FIG_W_DEFAULT;
    const h = Math.round(w / aspect);
    imgPara = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      children: [
        new ImageRun({
          data: buf,
          type: "png",
          transformation: { width: w, height: h },
        }),
      ],
    });
  } else {
    imgPara = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      border: {
        top:    { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        left:   { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        right:  { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      children: [t(`[ Figure ${idx}: ${caption} ]`, { sz: SZ_CAP, color: "808080", italics: true })],
    });
  }
  // figCap normally increments figN, but we already did. Build the caption manually.
  const cap = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 280, before: 80 },
    children: [
      t(`Figure ${idx}. `, { italics: true, sz: SZ_CAP, bold: true }),
      t(caption, { italics: true, sz: SZ_CAP }),
    ],
  });
  return [imgPara, cap];
}

// Standard table with header
function mkTable(headers, rows, cw, caption) {
  const total = cw.reduce((a, b) => a + b, 0);
  const items = [];
  if (caption) items.push(tblCap(caption));
  items.push(new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: cw,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
          borders: bds,
          width: { size: cw[i], type: WidthType.DXA },
          shading: { fill: "DCE6F1", type: ShadingType.CLEAR },
          margins: cm,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [t(h, { bold: true, sz: SZ_CAP })],
          })],
        })),
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders: bds,
          width: { size: cw[ci], type: WidthType.DXA },
          margins: cm,
          children: [new Paragraph({ children: [t(cell, { sz: SZ_CAP })] })],
        })),
      })),
    ],
  }));
  return items;
}

// IEEE-style citation reference (e.g. [1])
const cite = (n) => t(` [${n}]`, { sz: SZ_BODY });

// ============================================================
// COVER PAGE
// ============================================================
const coverPage = [
  SP(400),
  PC([t("THE UNIVERSITY OF HONG KONG", { bold: true, sz: 32 })], { a: 200 }),
  PC([t("DEPARTMENT OF MECHANICAL ENGINEERING", { bold: true, sz: 28 })], { a: 600 }),
  PC([t("IDAT7100 Capstone Experience", { bold: true, sz: 28 })], { a: 200 }),
  PC([t("Final Report", { bold: true, sz: 28 })], { a: 200 }),
  PC([t("2025 – 2026", { bold: true, sz: 26 })], { a: 800 }),

  // Information table
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [2800, 6200],
    rows: [
      ["Project Title:", "Tokenising Incentives in Physical Infrastructure: Design, Implementation, and Analysis of Coupon Coin (CPC) for Smart Locker Ecosystems"],
      ["Student Name and UID:", "Liu Zile (Aiden)  —  3036575582"],
      ["Degree Programme:", "Master of Science in Innovative Design and Technology (MSc IDAT)"],
      ["Supervisor:", "Prof. Jimmy Chan"],
      ["Moderator:", "Prof. Marian"],
      ["Date:", "April 2026"],
    ].map(([k, v]) => new TableRow({
      children: [
        new TableCell({
          borders: bdsLite, margins: cm,
          width: { size: 2800, type: WidthType.DXA },
          children: [new Paragraph({ children: [t(k, { bold: true, sz: SZ_BODY })] })],
        }),
        new TableCell({
          borders: bdsLite, margins: cm,
          width: { size: 6200, type: WidthType.DXA },
          children: [new Paragraph({ children: [t(v, { sz: SZ_BODY })] })],
        }),
      ],
    })),
  }),

  SP(800),
  PC([t("In partial fulfilment of the requirements for the degree of", { italics: true, sz: SZ_BODY })], { a: 100 }),
  PC([t("Master of Science in Innovative Design and Technology", { italics: true, sz: SZ_BODY })]),
  PB(),
];

// ============================================================
// ABSTRACT
// ============================================================
const abstractSection = [
  PC([t("Abstract", { bold: true, sz: SZ_H1 })], { a: 320 }),

  P("Coupons are everywhere, and almost nobody uses them. The latest Deloitte numbers put the global redemption rate below three per cent, which means that more than 97 of every 100 coupons issued never make it to the cash register [1], [2]. Multiply that by an industry north of USD 91 billion and the waste runs into the hundreds of millions every year. This Capstone takes that mismatch as its starting point and asks a simple question: if the coupon as we know it is broken, can a programmable on-chain version, anchored to a piece of physical infrastructure people actually touch, do better?"),

  P("My answer is Coupon Coin (CPC), a Solana-based utility token I designed and built around the Y Carry smart-locker network — currently live across several venues in Hong Kong and contracted for more than 1,300 units in Indonesia. Rather than throw another token at the wall, I tied CPC to a real device people pay to use. The system has four moving parts. There is the SPL token itself, with built-in auto-burn and a buyback fund. There is a second token, the Locker Token, which I argue is better understood as a new sub-class of real-world asset I have called the Physical Infrastructure Yield Token (PIYT). There is a five-contract suite handling vesting, payments, rewards, buyback-and-burn, and staking. And there is a three-layer IoT-to-blockchain stack, with an optimistic Layer-2 rollup for batching and Pyth Network for pricing."),

  P("The work was done in four passes. First, a literature review across blockchain loyalty schemes [3], [4], smart-locker integration [5], [6], and RWA tokenisation [7], [8]. Second, a quantitative selection exercise weighing six candidate networks against seven criteria. Third, an end-to-end deployment on Solana Devnet, complete with twelve functional test cases. Fourth, a deliberately conservative three-year financial model built on the deployment data Y Carry shared with me."),

  P("The token deployed cleanly. The full 200,000,000 CPC supply minted in a single transaction confirmed in under two seconds. Every one of the twelve test cases passed. The numbers also work: at Solana's demonstrated 65,000+ TPS and roughly USD 0.00025 per transaction, even the most aggressive growth path I modelled barely scratches the available headroom. The Locker Token, framed as a PIYT, is — to the best of my knowledge — the first attempt in the literature to apply that pattern to consumer-facing locker hardware specifically."),

  P([
    b("Keywords: "),
    t("blockchain; tokenisation; smart locker; coupon economics; loyalty rewards; Solana; SPL token; Internet of Things; NFC; decentralised finance; real-world asset (RWA); deflationary tokenomics; dual-token architecture; Physical Infrastructure Yield Token (PIYT)."),
  ]),
  PB(),
];

// ============================================================
// ACKNOWLEDGEMENT
// ============================================================
const acknowledgement = [
  PC([t("Acknowledgement", { bold: true, sz: SZ_H1 })], { a: 320 }),

  P("This project would not have happened without Professor Jimmy Chan. He took on a topic that sits awkwardly between the mechanical engineering syllabus and a frontier blockchain stack, and never once asked me to make it tidier than it really is. Many of the better instincts in this report come from the conversations I had with him over the past nine months."),

  P("I am grateful to Professor Marian for the moderator role and for pressing on the parts of the methodology I had glossed over. The chapter on selection criteria is sharper because of his questions."),

  P("Y Carry Limited gave me operating data that students do not normally see. Mr. Jimmy Chan from the Y Carry side handed over the white paper, the deployment numbers, and a remarkably honest account of what works and what does not in the locker business. The case study in Chapter 3 is built almost entirely on what he was willing to share."),

  P("Finally, my family and the small group of friends who put up with the late nights — you know who you are. Writing a dissertation is, on most days, lonely work. It mattered that you were nearby."),

  PB(),
];

// ============================================================
// STATEMENT OF CONTRIBUTIONS
// ============================================================
const statementContributions = [
  PC([t("Statement of Contributions", { bold: true, sz: SZ_H1 })], { a: 320 }),

  P([b("Main contributions of this Capstone project:")]),
  BL("An original protocol — Coupon Coin (CPC) — that ties a Solana-based utility token to a working consumer smart-locker network rather than a hypothetical one;"),
  BL("A weighted, six-by-seven blockchain selection exercise covering Layer-1 and Layer-2 candidates, with the spreadsheet, the criteria, and the rationale all on the table;"),
  BL("A new sub-class within the RWA literature that I call the Physical Infrastructure Yield Token (PIYT), and a concrete instantiation of it through the Locker Token mechanism;"),
  BL("A specification (with reference pseudocode) for a five-contract suite covering vesting, locker payments, rewards, buyback-and-burn, and staking;"),
  BL("A working Solana Devnet deployment — supply minted, metadata attached, twelve functional test cases passed end-to-end;"),
  BL("A three-year financial model based on real Y Carry deployment data, deliberately tuned to be conservative rather than salesy;"),
  BL("A dual-track regulatory architecture that keeps Hong Kong operations and offshore on-chain activity in separate corporate boxes, structured to fit current SFC guidance."),

  SP(200),
  P([b("Individual contribution:")]),
  P("This is a single-author Capstone. The design, the code, the writing, and the analysis are all mine, supervised by Professor Jimmy Chan and moderated by Professor Marian. The empirical operational data come from Y Carry Limited, with citations attached at every relevant point."),
  PB(),
];

// ============================================================
// TABLE OF CONTENTS / LISTS
// ============================================================
const toc = [
  PC([t("Table of Contents", { bold: true, sz: SZ_H1 })], { a: 320 }),
  P([t("Abstract ............................................................................................................. 2", { sz: SZ_BODY })]),
  P([t("Acknowledgement .......................................................................................... 3", { sz: SZ_BODY })]),
  P([t("Statement of Contributions ............................................................................. 4", { sz: SZ_BODY })]),
  P([t("List of Figures .................................................................................................. 6", { sz: SZ_BODY })]),
  P([t("List of Tables ................................................................................................... 7", { sz: SZ_BODY })]),
  P([t("List of Abbreviations ........................................................................................ 8", { sz: SZ_BODY })]),
  P([t("1. Introduction ................................................................................................. 9", { sz: SZ_BODY })]),
  P([t("2. Background ............................................................................................... 14", { sz: SZ_BODY })]),
  P([t("3. Methods ..................................................................................................... 28", { sz: SZ_BODY })]),
  P([t("4. Results and Discussion ............................................................................. 50", { sz: SZ_BODY })]),
  P([t("5. Conclusions .............................................................................................. 66", { sz: SZ_BODY })]),
  P([t("6. Future Work ............................................................................................... 70", { sz: SZ_BODY })]),
  P([t("References ..................................................................................................... 73", { sz: SZ_BODY })]),
  P([t("Appendices .................................................................................................... 76", { sz: SZ_BODY })]),
  P([it("Note: Page numbers are auto-generated; please right-click and select 'Update Field' in Word to refresh.")], { a: 200 }),
  PB(),
];

const listOfFigures = [
  PC([t("List of Figures", { bold: true, sz: SZ_H1 })], { a: 320 }),
  ...[
    "Global coupon redemption rates by industry segment (2024)",
    "Comparison of traditional versus blockchain-based coupon systems",
    "Ecoupon-Chain decentralised coupon architecture (adapted from Shi et al., 2023)",
    "Y Carry Smart Locker hardware specification",
    "Smart locker blockchain integration model (adapted from Chen et al., 2021)",
    "Solana Proof-of-History consensus mechanism",
    "Overview of the Y Carry Smart Locker ecosystem",
    "Y Carry global deployment map",
    "CPC protocol three-layer system architecture",
    "Blockchain selection radar chart across six candidate networks",
    "CPC token distribution doughnut chart",
    "Token vesting schedule timeline",
    "Deflationary supply simulation over five years",
    "Dual-token architecture: CPC and Locker Token",
    "Smart contract suite interaction and dependency flow",
    "Seven-step transaction lifecycle from NFC tap to reward distribution",
    "Layer-2 rollup batching and Merkle root settlement mechanism",
    "Smart contract functional test flow",
    "Transaction lifecycle: IoT event to on-chain settlement",
    "Rollup challenge period and finality confirmation",
    "Solana Devnet: token deployment confirmation screenshot",
    "Solscan Devnet: CPC Mint Address verification",
    "Token minting test: balance confirmation",
    "Smart contract test suite: results summary",
    "Revenue model flywheel",
    "Three-year conservative locker deployment projection",
    "Risk severity matrix heatmap",
    "Growth trajectory roadmap: short-, mid-, and long-term milestones",
    "Five-year ecosystem scaling vision",
  ].map((c, i) => P([t(`Figure ${i + 1}. `, { bold: true }), t(c)], { a: 100 })),
  PB(),
];

const listOfTables = [
  PC([t("List of Tables", { bold: true, sz: SZ_H1 })], { a: 320 }),
  ...[
    "Quantitative comparison of six Layer-1 / Layer-2 blockchain networks",
    "CPC token specification summary",
    "Token allocation and vesting schedule",
    "Deflationary mechanism parameters",
    "Five-contract smart contract suite specification",
    "Transaction lifecycle phase decomposition",
    "Eight-step token launch sequence and timeline",
    "Devnet deployment configuration parameters",
    "Twelve-case functional test matrix",
    "Three-year conservative financial projection",
    "Five-vector risk severity matrix",
    "Comparative analysis: CPC versus existing solutions",
  ].map((c, i) => P([t(`Table ${i + 1}. `, { bold: true }), t(c)], { a: 100 })),
  PB(),
];

const listOfAbbrev = [
  PC([t("List of Abbreviations", { bold: true, sz: SZ_H1 })], { a: 320 }),
  ...[
    ["API",   "Application Programming Interface"],
    ["BVI",   "British Virgin Islands"],
    ["CEX",   "Centralised Exchange"],
    ["CPC",   "Coupon Coin"],
    ["DAO",   "Decentralised Autonomous Organisation"],
    ["DEX",   "Decentralised Exchange"],
    ["DPI",   "Deep Packet Inspection"],
    ["FDV",   "Fully Diluted Valuation"],
    ["IoT",   "Internet of Things"],
    ["KYC",   "Know Your Customer"],
    ["L2",    "Layer-2 (Rollup)"],
    ["MQTT",  "Message Queuing Telemetry Transport"],
    ["NB-IoT","Narrow-Band Internet of Things"],
    ["NFC",   "Near-Field Communication"],
    ["PIYT",  "Physical Infrastructure Yield Token"],
    ["PoH",   "Proof-of-History"],
    ["PoS",   "Proof-of-Stake"],
    ["RPC",   "Remote Procedure Call"],
    ["RWA",   "Real-World Asset"],
    ["SFC",   "Securities and Futures Commission (Hong Kong)"],
    ["SPL",   "Solana Program Library"],
    ["TPS",   "Transactions Per Second"],
    ["TVL",   "Total Value Locked"],
  ].map(([abbr, full]) => P([t(abbr, { bold: true }), t("    —    "), t(full)], { a: 80, line: 320 })),
  PB(),
];

// ============================================================
// CHAPTER 1 — INTRODUCTION
// ============================================================
const ch1 = [
  H1("1. Introduction"),

  H2("1.1. Project Background and Motivation"),
  P("Blockchain spent its first decade chasing purely digital problems — money, derivatives, profile pictures. The current decade looks different. Capital, attention, and engineering effort have all started moving toward what the market now lazily calls the 'tokenisation of everything', meaning the use of on-chain primitives to govern, monetise, and incentivise interactions with real, tangible things [7], [8]. That broader shift is the wider context for this dissertation, but the specific problem I want to attack is much narrower."),

  P("Coupons are old, well-studied, and astonishingly bad at their job. Deloitte's 2024 industry survey [1] puts the average redemption rate below three per cent. That number is so consistent across categories — grocery, apparel, fast food, beauty — that it is hard to read it as anything other than a structural failure of the medium itself. The Association for Retail Innovation pegs the direct US economic loss above USD 500 million a year, and that figure ignores the soft cost of consumer attention burnt on offers nobody intends to act on [2]."),

  P("On the other side of the same equation, smart-locker hardware is having a moment. Markets and Markets project the global smart-locker industry to clear USD 6.8 billion by 2028, growing at roughly 14.6% a year [9]. The industry partner for this Capstone, Y Carry Limited, sits in a small but interesting corner of that market. Y Carry does not chase parcel logistics. Instead, the company drops consumer-facing rental lockers into venues with a lot of foot traffic — sports stadiums, exhibition halls, science parks, tourism districts — and rents them by the hour for personal effects. People pay roughly USD 2 per session, and they pay it cheerfully, because the alternative is hauling a backpack around all day."),

  P("Stack those two pictures next to each other. One industry has demand for promotional spend but no functioning redemption channel. The other has growing physical infrastructure but a hard ceiling on customer-acquisition cost. The question that drove this dissertation is whether a purpose-built blockchain protocol can bridge them — turning the locker into a redemption surface and the coupon into a token that actually has somewhere to go."),

  H2("1.2. Problem Statement"),
  P("If you read the marketing-science literature carefully [1], [3], [10], the failure of traditional couponing decomposes into four reinforcing problems. None of them is new, but together they explain why the redemption number has not budged in twenty years."),

  NL([b("Low Redemption Rate. "), t("Below three per cent industry-wide. The causes are well documented: too many channels, too much attention saturation, too much friction at the point of sale.")]),
  NL([b("Fragmented Issuance and Settlement. "), t("Coupons issued by Merchant A are useless at Merchant B. The result is what Sancho and López wittily called 'coupon ghettos' — silos that deny the protocol any cross-merchant network effect.")]),
  NL([b("Fraud and Counterfeit Exposure. "), t("Centralised systems leak. The Coupon Information Corporation puts annual US fraud losses at around USD 600 million [10], split between duplicate redemption, counterfeit codes, and outright employee abuse.")]),
  NL([b("No Secondary Liquidity. "), t("A coupon I cannot use, I throw away. There is no market in unredeemed value. That destroys whatever residual price-discovery the system might otherwise provide.")]),

  P("Smart-locker operators face a complementary set of headaches. Customer acquisition is expensive. Off-peak slots sit empty. Cross-promotion with neighbouring merchants is awkward to coordinate at the technical level. Y Carry has done well by the standards of its segment — the Hong Kong rollout works, the Indonesian contract is signed — but the company still hits these constraints in every new market it enters."),

  P("The two problem domains rhyme, and that rhyme is the dissertation's working hypothesis: a single token, redeemable across both the locker network and a partnered merchant graph, can attack both failures at once. Whether that hypothesis survives contact with the data is what the rest of this report tries to figure out."),

  H2("1.3. Research Objectives"),
  P("I set myself four objectives at the start of the project. They map neatly onto the four chapters that follow this one."),

  NL([b("RO1 — Background Synthesis. "), t("Read the relevant literature carefully — blockchain loyalty, smart-locker IoT, RWA tokenisation, Layer-1 versus Layer-2 trade-offs — and pin down where the genuine gap is. No point inventing something somebody else has already shipped.")]),

  NL([b("RO2 — Protocol Design. "), t("Design and document a complete protocol: token economics, smart-contract suite, IoT-blockchain interface, and dual-token mechanics. Every design choice has to be defensible in writing.")]),

  NL([b("RO3 — Implementation and Testing. "), t("Actually build it. Deploy on Solana Devnet, mint the supply, run the contracts through a structured test matrix, and write down what breaks. The deployment notes should be detailed enough that somebody else could reproduce them.")]),

  NL([b("RO4 — Multi-Dimensional Feasibility Analysis. "), t("Stress-test the design along three axes: technical, economic, and regulatory. Use conservative inputs throughout — better to underclaim and over-deliver than the other way round.")]),

  H2("1.4. Significance and Contributions"),
  P("There are three places where I think this work moves the needle, in different ways."),

  H3("1.4.1. Theoretical Contribution"),
  P("The Locker Token mechanism is, in my view, an instance of a broader pattern that the RWA literature has not quite named. I call it the Physical Infrastructure Yield Token, or PIYT. A PIYT has three defining features. It maps one-to-one onto a discrete piece of physical infrastructure — one token, one locker, no fractional ambiguity. Its yield comes from the operational utilisation of that piece of hardware. And its governance rights scale with ownership. As far as I can tell, this is the first time the pattern has been formalised in the consumer-locker context."),

  H3("1.4.2. Methodological Contribution"),
  P("The blockchain selection matrix in Chapter 3 is more boring, but probably more reusable. I scored six candidate networks against seven weighted criteria — throughput, transaction cost, finality, ecosystem maturity, tooling, regulatory clarity, decentralisation. The full spreadsheet sits behind the chapter. Anyone facing a similar Layer-1 decision in physical-asset tokenisation can lift the scoring framework directly, swap in their own weights, and arrive at a defensible answer."),

  H3("1.4.3. Practical Contribution"),
  P("On the practical side, the Capstone hands Y Carry — and anyone in a similar position — a working starter kit. The Devnet deployment is real. The pseudocode for all five contracts is included. The troubleshooting notes for the network-layer issues I hit while testing from a corporate environment will save the next person a few hours of head-scratching. And the three-year financial model is conservative enough to use in actual investment conversations without blushing."),

  H2("1.5. Scope and Limitations"),
  P("This is a Capstone, not a production launch. Four boundary conditions are worth flagging upfront, because every conclusion in the chapters that follow has to be read against them."),

  P([b("First, "), t("everything is on Devnet. Mainnet adds security audits, multi-sig key management, and real money at risk. Those are commercial-deployment problems, not academic ones, and I do not pretend to have solved them here.")]),

  P([b("Second, "), t("the financial projections are deliberately understated. They assume mediocre velocity, no merchant adoption beyond the seed cohort, and no secondary-market liquidity. Treat them as a floor.")]),

  P([b("Third, "), t("the regulatory analysis leans heavily on the Hong Kong SFC framework, with side glances at Singapore and Indonesia. A full multi-jurisdictional analysis would need a securities lawyer, not a graduate student.")]),

  P([b("Fourth, "), t("I did not put a token-paid locker in front of a real user. The IoT-blockchain interface is validated through protocol-level simulation. Field testing is deferred to the post-Capstone roadmap and discussed in Chapter 6.")]),

  H2("1.6. Structure of the Report"),
  P("From here, the report runs in the order the IDAT7100 template expects:"),

  BL([b("Chapter 2 (Background) "), t("walks through the literature: why coupons fail, what the prior work in blockchain loyalty actually accomplished, where smart-locker IoT research currently sits, and how the major Layer-1 and Layer-2 networks compare for this kind of workload.")]),
  BL([b("Chapter 3 (Methods) "), t("documents the research design, the protocol architecture, the blockchain selection process, the smart-contract specification, and the testing protocol.")]),
  BL([b("Chapter 4 (Results and Discussion) "), t("reports the deployment outcomes, the test-suite results, the technical and economic feasibility analysis, the comparative table, and the lessons I picked up along the way.")]),
  BL([b("Chapter 5 (Conclusions) "), t("ties the findings back to the four objectives and is honest about what remains unfinished.")]),
  BL([b("Chapter 6 (Future Work) "), t("lays out the next year of work — Mainnet migration, audit, DAO governance, and eventually cross-chain.")]),
  BL([b("References and Appendices "), t("hold the IEEE-formatted citations, the contract pseudocode, the deployment commands, and the supporting matrices.")]),

  H2("1.7. Notation and Conventions"),
  P("A few small conventions, set once here so I do not have to keep repeating them. Money is in US dollars unless I say otherwise; where it matters, I quote the HKD conversion at 7.80 HKD/USD. Token amounts are written out — 200,000,000 CPC, not 2 × 10⁸ — because nothing about a token supply benefits from scientific notation. On-chain addresses are abbreviated inline as 6T3s2P...iv6K, with the full strings tucked into Appendix B. Every URL was verified between January and April 2026."),

  P("References use IEEE numerical citations: [n] points back to the matching entry in the References section. Equations get a parenthetical number on the right margin. Figures and tables are numbered consecutively across the whole document and listed in their own front-matter sections."),

  PB(),
];

module.exports = {
  // Style helpers
  t, b, it, sup, P, PC, H1, H2, H3, BL, NL, PB, SP,
  figCap, tblCap, mkFig, mkTable, equation, cite,
  F, SZ_BODY, SZ_H1, SZ_H2, SZ_H3, LINE_15,
  // Sections
  coverPage, abstractSection, acknowledgement, statementContributions,
  toc, listOfFigures, listOfTables, listOfAbbrev, ch1,
};
