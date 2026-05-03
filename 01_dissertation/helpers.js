const {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak,
} = require("docx");

const F = "Times New Roman";
const CW = 9360;
const bd = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const bds = { top: bd, bottom: bd, left: bd, right: bd };
const cm = { top: 80, bottom: 80, left: 100, right: 100 };
let figN = 0, tblN = 0;

const t = (s, o={}) => new TextRun({ text: String(s), font: F, size: o.sz||24, ...o });
const b = (s) => t(s, { bold: true });
const it = (s) => t(s, { italics: true });

function P(runs, o={}) {
  const ch = typeof runs === "string" ? [t(runs)] : runs;
  return new Paragraph({
    spacing: { after: o.a ?? 200, before: o.b ?? 0, line: o.line ?? 360 },
    alignment: o.al || AlignmentType.JUSTIFIED,
    heading: o.h,
    indent: o.indent ? { firstLine: 480 } : undefined,
    children: ch,
  });
}

const H1 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing:{ before:600, after:240 }, children:[t(s,{bold:true,sz:32})] });
const H2 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing:{ before:400, after:200 }, children:[t(s,{bold:true,sz:28})] });
const H3 = (s) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing:{ before:300, after:160 }, children:[t(s,{bold:true,sz:24})] });

const BL = (s) => {
  const ch = !s ? [t(" ")] : (typeof s==="string" ? [t(s)] : (Array.isArray(s) ? s : [s]));
  return new Paragraph({ numbering:{reference:"bul",level:0}, spacing:{after:100,line:340}, children: ch.length ? ch : [t(" ")] });
};
const NL = (s) => {
  const ch = !s ? [t(" ")] : (typeof s==="string" ? [t(s)] : (Array.isArray(s) ? s : [s]));
  return new Paragraph({ numbering:{reference:"num",level:0}, spacing:{after:100,line:340}, children: ch.length ? ch : [t(" ")] });
};

const PB = new Paragraph({ children:[new PageBreak()] });
const SP = (n=200) => new Paragraph({ spacing:{ after: n } });

function figCap(desc) {
  figN++;
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing:{ after:240, before:80 },
    children:[t(`Figure ${figN}: ${desc}`, { sz:20, italics:true })] });
}
function tblCap(desc) {
  tblN++;
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing:{ after:80, before:240 },
    children:[t(`Table ${tblN}: ${desc}`, { sz:20, italics:true, bold:true })] });
}
function mkFig(caption) {
  const box = new Paragraph({ alignment: AlignmentType.CENTER, spacing:{ before:120, after:60 },
    border:{ top:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}, bottom:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}, left:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"}, right:{style:BorderStyle.SINGLE,size:2,color:"CCCCCC"} },
    children:[t(`[ Figure: ${caption} ]`, { sz:20, color:"999999", italics:true })] });
  return [box, figCap(caption)];
}
function mkTable(headers, rows, cw, caption) {
  const total = cw.reduce((a,b)=>a+b,0);
  const items = [];
  if (caption) items.push(tblCap(caption));
  items.push(new Table({ width:{size:total,type:WidthType.DXA}, columnWidths:cw,
    rows:[
      new TableRow({ children: headers.map((h,i) => new TableCell({ borders:bds, width:{size:cw[i],type:WidthType.DXA}, shading:{fill:"1B2A4A",type:ShadingType.CLEAR}, margins:cm, children:[new Paragraph({children:[t(h,{bold:true,sz:20,color:"FFFFFF"})]})] })) }),
      ...rows.map((row,ri) => new TableRow({ children: row.map((cell,ci) => new TableCell({ borders:bds, width:{size:cw[ci],type:WidthType.DXA}, shading:ri%2===1?{fill:"F0F4F8",type:ShadingType.CLEAR}:undefined, margins:cm, children:[new Paragraph({children:[t(cell,{sz:20})]})] })) })),
    ],
  }));
  return items;
}

module.exports = { t, b, it, P, H1, H2, H3, BL, NL, PB, SP, figCap, tblCap, mkFig, mkTable, F, CW };
