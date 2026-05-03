// HKU IDAT7100 Final Report — Main Build Script
// Output: ~/Desktop/Coupon_Coin_Final_Report_HKU.docx

const {
  Document, Packer, Header, Footer, PageNumber, AlignmentType,
  LevelFormat,
} = require("docx");
const fs = require("fs");

// Front matter / Chapter 1
const front = require("./build-hku.js");
// Chapter 2
const { ch2 } = require("./build-hku-ch2.js");
// Chapter 3
const { ch3 } = require("./build-hku-ch3.js");
// Chapters 4, 5, 6, References, Appendices
const { ch4, ch5, ch6, references, appendices } = require("./build-hku-ch4to6.js");

const { t } = front;

// ===== Page header / footer =====
const headerText = new Header({
  children: [
    new (require("docx").Paragraph)({
      alignment: AlignmentType.RIGHT,
      children: [t("IDAT7100 Capstone Final Report — Coupon Coin (CPC)", {
        size: 18, italics: true, color: "666666",
      })],
    }),
  ],
});

const footerText = new Footer({
  children: [
    new (require("docx").Paragraph)({
      alignment: AlignmentType.CENTER,
      children: [
        t("— ", { size: 18, color: "666666" }),
        new (require("docx").TextRun)({
          children: [PageNumber.CURRENT],
          font: "Times New Roman",
          size: 18,
          color: "666666",
        }),
        t(" —", { size: 18, color: "666666" }),
      ],
    }),
  ],
});

// ===== Numbering =====
const numbering = {
  config: [
    {
      reference: "bul",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    },
    {
      reference: "num",
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    },
  ],
};

// ===== Compose the document =====
const doc = new Document({
  creator: "Liu Zile (Aiden)",
  title: "Tokenising Incentives in Physical Infrastructure: Coupon Coin (CPC) — IDAT7100 Capstone Final Report",
  description: "HKU MSc IDAT Capstone Final Report — Coupon Coin Smart Locker Tokenisation Protocol",
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24 },
        paragraph: { spacing: { line: 360 } },
      },
    },
  },
  numbering,
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    headers: { default: headerText },
    footers: { default: footerText },
    children: [
      // Front matter
      ...front.coverPage,
      ...front.abstractSection,
      ...front.acknowledgement,
      ...front.statementContributions,
      ...front.toc,
      ...front.listOfFigures,
      ...front.listOfTables,
      ...front.listOfAbbrev,
      // Chapters
      ...front.ch1,
      ...ch2,
      ...ch3,
      ...ch4,
      ...ch5,
      ...ch6,
      // References & Appendices
      ...references,
      ...appendices,
    ],
  }],
});

(async () => {
  console.log("Building HKU IDAT7100 Final Report...");
  const buf = await Packer.toBuffer(doc);
  const outputPath = "/Users/aiden/Desktop/Coupon_Coin_Final_Report_HKU.docx";
  fs.writeFileSync(outputPath, buf);
  console.log(`✅ Saved to: ${outputPath}`);
  console.log(`   File size: ${(buf.length / 1024).toFixed(0)} KB`);
})();
