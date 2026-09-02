'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, HeadingLevel,
  NumberFormat, TabStopType, TabStopPosition, PositionalTab,
  PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
} = require('docx');
const fs = require('fs');

const TITLE = 'EV Charge: A Smart Electric Vehicle Charging Station Discovery, Booking And Trip Planning Platform';
const LEFT_FOOTER = 'CSE DEPARTMENT, SRMCEM, Lucknow';
const FONT = 'Times New Roman';
const PAGE_W = 11906; const PAGE_H = 16838;
const MARGIN_TOP = 1440; const MARGIN_BOTTOM = 1440; const MARGIN_RIGHT = 1440; const MARGIN_LEFT = 2160;
const LINE_1_5 = { line: 360, lineRule: 'auto' };
const SPACE_AFTER_PARA = { before: 0, after: 160 };

function bodyPara(text, opts = {}) {
  const runs = typeof text === 'string' ? [new TextRun({ text, font: FONT, size: 24 })] : text;
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { ...LINE_1_5, ...SPACE_AFTER_PARA }, children: runs, ...opts });
}
function boldRun(text) { return new TextRun({ text, font: FONT, size: 24, bold: true }); }
function italicRun(text) { return new TextRun({ text, font: FONT, size: 24, italics: true }); }
function normalRun(text) { return new TextRun({ text, font: FONT, size: 24 }); }
function chapterHeading(text) {
  return new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, spacing: { line: 360, before: 240, after: 400 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, size: 36, bold: true, underline: {} })] });
}
function sectionHeading(text) {
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 360, before: 280, after: 160 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true })] });
}
function subSectionHeading(text) {
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 360, before: 200, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 26, bold: true })] });
}
function blankLine() { return new Paragraph({ spacing: { line: 360, before: 0, after: 0 }, children: [] }); }
function codeBlock(codeString) {
  const lines = codeString.split('\n');
  return lines.map(line => new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 240, before: 0, after: 0 },
    shading: { fill: 'F2F2F2', type: ShadingType.CLEAR },
    indent: { left: 360 },
    children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 18 })],
  }));
}
function centeredPara(text, opts = {}) {
  const runs = typeof text === 'string' ? [new TextRun({ text, font: FONT, size: 24, ...opts })] : text;
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 80, after: 80 }, children: runs });
}

function makeTable(headers, rows, colWidths) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: '000000' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const tableRows = [];
  tableRows.push(new TableRow({ tableHeader: true,
    children: headers.map((h, i) => new TableCell({ borders, width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: 'D9D9D9', type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 300, before: 0, after: 0 },
        children: [new TextRun({ text: String(h), font: FONT, size: 22, bold: true })] })] })) }));
  rows.forEach(row => { tableRows.push(new TableRow({
    children: row.map((cell, i) => new TableCell({ borders, width: { size: colWidths[i], type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 300, before: 0, after: 0 },
        children: [new TextRun({ text: String(cell), font: FONT, size: 22 })] })] })) })); });
  return new Table({ width: { size: totalW, type: WidthType.DXA }, columnWidths: colWidths, rows: tableRows });
}

function makeHeader() {
  return new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 240, before: 0, after: 0 },
    children: [new TextRun({ text: TITLE, font: FONT, size: 18, italics: true })] })] });
}
function makeFooter(pageNum = true) {
  return new Footer({ children: [new Paragraph({ spacing: { line: 240, before: 0, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [ new TextRun({ text: LEFT_FOOTER, font: FONT, size: 18 }),
      pageNum ? new TextRun({ children: ['\t', PageNumber.CURRENT], font: FONT, size: 18 }) : new TextRun('') ] })] });
}

// Export everything needed by part 2
module.exports = {
  TITLE, LEFT_FOOTER, FONT, PAGE_W, PAGE_H, MARGIN_TOP, MARGIN_BOTTOM, MARGIN_RIGHT, MARGIN_LEFT,
  LINE_1_5, SPACE_AFTER_PARA,
  bodyPara, boldRun, italicRun, normalRun, chapterHeading, sectionHeading, subSectionHeading,
  blankLine, codeBlock, centeredPara, makeTable, makeHeader, makeFooter,
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, NumberFormat, TabStopType, TabStopPosition,
};
