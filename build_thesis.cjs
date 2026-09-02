'use strict';
const h = require('./generate_thesis.cjs');
const ch1_7 = require('./thesis_chapters_1_7.cjs');
const ch8_13 = require('./thesis_chapters_8_13.cjs');

const { Document, Packer, Paragraph, TextRun, PageBreak, Header, Footer,
  AlignmentType, NumberFormat, TabStopType, TabStopPosition, PageNumber,
  TITLE, FONT, PAGE_W, PAGE_H, MARGIN_TOP, MARGIN_BOTTOM, MARGIN_RIGHT, MARGIN_LEFT,
  LEFT_FOOTER, bodyPara, boldRun, normalRun, chapterHeading, sectionHeading,
  blankLine, centeredPara, makeTable, makeHeader, makeFooter } = h;

const fs = require('fs');
const path = require('path');

// ─── COVER PAGE ──────────────────────────────────────────────────
function coverPageContent() {
  return [
    blankLine(), blankLine(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 200 },
      children: [new TextRun({ text: 'A PROJECT REPORT', font: FONT, size: 28, bold: true })] }),
    centeredPara('On', { size: 24 }),
    blankLine(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
      children: [new TextRun({ text: TITLE, font: FONT, size: 32, bold: true })] }),
    blankLine(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 120 },
      children: [new TextRun({ text: 'Submitted in the Partial Fulfillment of the Requirement for the Award of', font: FONT, size: 24 })] }),
    centeredPara('BACHELOR OF TECHNOLOGY', { bold: true, size: 28 }),
    centeredPara('In', { size: 24 }),
    centeredPara('Computer Science and Engineering', { bold: true, size: 28 }),
    centeredPara('(2026)', { bold: true, size: 28 }),
    blankLine(),
    centeredPara('By', { size: 24 }),
    blankLine(),
    centeredPara('AYUSH CHAUHAN (2201220100043)', { bold: true, size: 26 }),
    centeredPara('AYUSH SINGH (2201220100044)', { bold: true, size: 26 }),
    blankLine(),
    centeredPara('Under the Guidance Of', { size: 24 }),
    blankLine(),
    centeredPara('DR. PANKAJ KUMAR', { bold: true, size: 26 }),
    blankLine(), blankLine(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 200, after: 120 },
      children: [new TextRun({ text: 'SHRI RAMSWAROOP MEMORIAL COLLEGE OF ENGINEERING & MANAGEMENT, LUCKNOW', font: FONT, size: 26, bold: true })] }),
    centeredPara('Affiliated to', { size: 24 }),
    centeredPara('DR. APJ ABDUL KALAM TECHNICAL UNIVERSITY, UTTAR PRADESH, LUCKNOW', { bold: true, size: 26 }),
  ];
}

// ─── PRELIMINARY PAGES ───────────────────────────────────────────
function preliminaryContent() {
  const content = [];
  // CERTIFICATE
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 200 },
    children: [new TextRun({ text: 'CSE DEPARTMENT', font: FONT, size: 28, bold: true })] }));
  content.push(centeredPara('SHRI RAMSWAROOP MEMORIAL COLLEGE OF ENGINEERING & MANAGEMENT', { bold: true, size: 28 }));
  content.push(blankLine());
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 120, after: 200 },
    children: [new TextRun({ text: 'CERTIFICATE', font: FONT, size: 36, bold: true, underline: {} })] }));
  content.push(bodyPara('Certified that the project entitled "EV Charge: A Smart Electric Vehicle Charging Station Discovery, Booking and Trip Planning Platform" submitted by AYUSH CHAUHAN [Unv. Roll No. 2201220100043] and AYUSH SINGH [Unv. Roll No. 2201220100044] in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology (CSE) of Dr. APJ Abdul Kalam Technical University (Uttar Pradesh, Lucknow), is a record of students\u2019 own work carried under our supervision and guidance.'));
  content.push(blankLine()); content.push(blankLine()); content.push(blankLine());
  content.push(makeTable(['',''],[['Signature','Signature'],['Dr. Pankaj Kumar','Dr. Pankaj Kumar'],['HOD, CSE','HOD, CSE'],['(Project Guide)','(Head of Department)']],[4100,4100]));
  // DECLARATION
  content.push(new Paragraph({ children: [new PageBreak()] }));
  content.push(centeredPara('CSE DEPARTMENT', { bold: true, size: 28 }));
  content.push(centeredPara('SHRI RAMSWAROOP MEMORIAL COLLEGE OF ENGINEERING & MANAGEMENT', { bold: true, size: 28 }));
  content.push(blankLine());
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 120, after: 200 },
    children: [new TextRun({ text: 'DECLARATION', font: FONT, size: 36, bold: true, underline: {} })] }));
  content.push(bodyPara('We hereby declare that the project entitled "EV Charge: A Smart Electric Vehicle Charging Station Discovery, Booking and Trip Planning Platform" submitted by us in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology (CSE) of Dr. APJ Abdul Kalam Technical University (Uttar Pradesh, Lucknow), is a record of our own work carried under the supervision and guidance of Dr. Pankaj Kumar, HOD, CSE.'));
  content.push(bodyPara('To the best of our knowledge, this project has not been submitted to Dr. APJ Abdul Kalam Technical University or any other University for the award of any degree.'));
  content.push(blankLine()); content.push(blankLine()); content.push(blankLine());
  content.push(makeTable(['',''],[['Signature','Signature'],['AYUSH CHAUHAN','AYUSH SINGH'],['Univ. Roll No.: 2201220100043','Univ. Roll No.: 2201220100044']],[4100,4100]));
  // ACKNOWLEDGEMENT
  content.push(new Paragraph({ children: [new PageBreak()] }));
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'ACKNOWLEDGEMENT', font: FONT, size: 36, bold: true, underline: {} })] }));
  content.push(bodyPara('We would like to express our heartfelt gratitude to everyone who helped us through this project. First and foremost, we are deeply thankful to our project guide, Dr. Pankaj Kumar, HOD, CSE Department, for his patient guidance, timely feedback, and continuous encouragement.'));
  content.push(bodyPara('We also thank the entire faculty of the CSE Department at Shri Ramswaroop Memorial College of Engineering and Management, Lucknow, for creating an environment where learning goes beyond the classroom.'));
  content.push(bodyPara('Our fellow students deserve credit for the many discussions and debugging sessions that helped us refine our work. Finally, we are grateful to our families for their unwavering support.'));
  content.push(blankLine()); content.push(blankLine());
  content.push(bodyPara('AYUSH CHAUHAN')); content.push(bodyPara('AYUSH SINGH'));
  // PREFACE
  content.push(new Paragraph({ children: [new PageBreak()] }));
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'PREFACE', font: FONT, size: 36, bold: true, underline: {} })] }));
  content.push(bodyPara('Electric vehicles are growing fast in India, and with that growth comes a very real problem: charging infrastructure is scattered, hard to find, and there is no single platform where you can discover, compare, and book a charging slot. This project, "EV Charge", is our attempt to build exactly that.'));
  content.push(bodyPara('The platform is built entirely on open-source technologies and free APIs. This report documents the complete development from introduction through implementation, testing, and conclusions.'));
  // ABSTRACT
  content.push(new Paragraph({ children: [new PageBreak()] }));
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'ABSTRACT', font: FONT, size: 36, bold: true, underline: {} })] }));
  content.push(bodyPara('The rapid growth of electric vehicle adoption across India has exposed a major gap in the charging ecosystem. This project presents "EV Charge," a smart web-based platform for EV charging station discovery, battery-aware station recommendation, multi-stop trip planning with automatic charging stop detection, and time-slot booking. The system integrates real-time station data from the OpenChargeMap API and provides an interactive map interface built using React.js, TypeScript, and Leaflet.js.'));
  content.push(bodyPara('A custom multi-factor scoring algorithm ranks stations based on distance, congestion, and battery risk. The trip planning feature uses OSRM for route computation and a greedy algorithm for mandatory stop detection. The booking module provides date picker, time-period selection, and receipt generation. Performance testing shows average API response time under two seconds with accurate routing and stop identification across various test routes.'));
  return content;
}

// ─── TABLE OF CONTENTS ───────────────────────────────────────────
function tocContent() {
  const content = [];
  content.push(new Paragraph({ children: [new PageBreak()] }));
  content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 360, before: 0, after: 300 },
    children: [new TextRun({ text: 'TABLE OF CONTENTS', font: FONT, size: 36, bold: true, underline: {} })] }));
  const entries = [
    ['Certificate','ii'],['Declaration','iii'],['Acknowledgement','iv'],['Preface','v'],['Abstract','vi'],
    ['CHAPTER 1: INTRODUCTION','1'],['CHAPTER 2: LITERATURE SURVEY','8'],['CHAPTER 3: PROPOSED METHODOLOGY','17'],
    ['CHAPTER 4: SYSTEM DESIGN AND UML DIAGRAMS','31'],['CHAPTER 5: DATABASE DESIGN','40'],
    ['CHAPTER 6: SYSTEM IMPLEMENTATION','47'],['CHAPTER 7: SECURITY AND ETHICS','54'],
    ['CHAPTER 8: PROJECT MANAGEMENT','60'],['CHAPTER 9: COST ANALYSIS','66'],
    ['CHAPTER 10: PERFORMANCE EVALUATION','71'],['CHAPTER 11: RESULT ANALYSIS','77'],
    ['CHAPTER 12: CONCLUSION','83'],['CHAPTER 13: FUTURE SCOPE','88'],
    ['List of Figures','xii'],['List of Tables','xiii'],['List of Abbreviations','xiv'],['References','xvii'],
  ];
  entries.forEach(([title, page]) => {
    content.push(new Paragraph({ spacing: { line: 300, before: 40, after: 40 },
      tabStops: [{ type: TabStopType.RIGHT, position: 7800, leader: 'dot' }],
      children: [ new TextRun({ text: title, font: FONT, size: 24, bold: title.startsWith('CHAPTER') }),
        new TextRun({ text: '\t' + page, font: FONT, size: 24 }) ] }));
  });
  return content;
}

// ─── BUILD DOCUMENT ──────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 24 } } } },
  numbering: { config: [] },
  sections: [
    { // Cover Page
      properties: { page: { size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, right: MARGIN_RIGHT, left: MARGIN_LEFT, header: 720, footer: 720 },
        pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } } },
      headers: { default: new Header({ children: [new Paragraph('')] }) },
      footers: { default: new Footer({ children: [new Paragraph('')] }) },
      children: coverPageContent(),
    },
    { // Preliminary Pages
      properties: { page: { size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, right: MARGIN_RIGHT, left: MARGIN_LEFT, header: 720, footer: 720 },
        pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN } } },
      headers: { default: makeHeader() },
      footers: { default: makeFooter(true) },
      children: [...preliminaryContent(), ...tocContent()],
    },
    { // Main Chapters
      properties: { page: { size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, right: MARGIN_RIGHT, left: MARGIN_LEFT, header: 720, footer: 720 },
        pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: makeHeader() },
      footers: { default: makeFooter(true) },
      children: [
        ...ch1_7.chapter1(), ...ch1_7.chapter2(), ...ch1_7.chapter3(), ...ch1_7.chapter4(),
        ...ch1_7.chapter5(), ...ch1_7.chapter6(), ...ch1_7.chapter7(),
        ...ch8_13.chapter8(), ...ch8_13.chapter9(), ...ch8_13.chapter10(),
        ...ch8_13.chapter11(), ...ch8_13.chapter12(), ...ch8_13.chapter13(),
      ],
    },
    { // Appendices
      properties: { page: { size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, right: MARGIN_RIGHT, left: MARGIN_LEFT, header: 720, footer: 720 },
        pageNumbers: { start: 12, formatType: NumberFormat.LOWER_ROMAN } } },
      headers: { default: makeHeader() },
      footers: { default: makeFooter(true) },
      children: ch8_13.appendices(),
    },
  ],
});

const outputPath = path.join(__dirname, 'EV_Charge_Thesis_Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputPath, buf);
  console.log('Done! File written to ' + outputPath);
}).catch(err => { console.error('Error:', err); process.exit(1); });
