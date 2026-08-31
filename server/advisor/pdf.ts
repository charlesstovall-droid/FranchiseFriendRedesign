// @ts-ignore - pdfkit types not available
import PDFDocument from "pdfkit";
import type { OwnershipThesis } from "@shared/advisor";
import { CHAPTER_LABELS } from "@shared/advisor";

const NAVY = "#12304C";
const CREAM = "#F4ECE1";
const GOLD = "#F2C740";
const GREEN = "#9BD7B3";

const SECTION_ORDER: Array<keyof OwnershipThesis> = [
  "whyOwnershipIsBeingConsidered",
  "whatCandidateWantsOwnershipToCreate",
  "recommendedOwnerRole",
  "financialFramework",
  "businessCharacteristicsThatMayFit",
  "businessCharacteristicsToApproachCarefully",
  "strengthsTheCandidateBrings",
  "potentialConflictsOrBlindSpots",
  "questionsStillRequiringHumanJudgment",
  "recommendedNextStep",
];

export function renderOwnershipThesisPdf(input: {
  thesis: OwnershipThesis;
  candidateName?: string;
  reportUrl?: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 54, info: { Title: "Ownership Thesis | Franchise Friend" } });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill(CREAM);
    doc.fillColor(NAVY);
    doc.rect(0, 0, doc.page.width, 8).fill(NAVY);
    doc.fillColor(GOLD).rect(0, 8, doc.page.width, 3).fill(GOLD);

    doc.fillColor(NAVY).font("Times-Bold").fontSize(11).text("FRANCHISE FRIEND", 54, 28, { characterSpacing: 2 });
    doc.font("Times-Roman").fontSize(9).fillColor(NAVY).text("OWNERSHIP ADVISOR", { characterSpacing: 1.4 });
    doc.moveDown(0.8);
    doc.font("Times-Bold").fontSize(26).text("Ownership Thesis");
    if (input.candidateName) {
      doc.moveDown(0.2);
      doc.font("Times-Italic").fontSize(12).text(input.candidateName);
    }
    doc.moveDown(0.4);
    doc.strokeColor(GREEN).lineWidth(1).moveTo(54, doc.y).lineTo(doc.page.width - 54, doc.y).stroke();
    doc.moveDown(0.8);

    for (const key of SECTION_ORDER) {
      const section = input.thesis[key];
      if (!section || typeof section !== "object" || !("body" in section)) continue;
      if (doc.y > 680) doc.addPage();
      doc.fillColor(NAVY).font("Times-Bold").fontSize(13).text(section.title);
      if (section.indicator) {
        doc.moveDown(0.15);
        doc.font("Times-Italic").fontSize(9).fillColor(NAVY).text(section.indicator);
      }
      doc.moveDown(0.25);
      doc.font("Times-Roman").fontSize(10.5).fillColor(NAVY).text(section.body, { align: "left", lineGap: 3 });
      doc.moveDown(0.7);
    }

    if (input.thesis.namedBrands?.length) {
      doc.font("Times-Bold").fontSize(13).text("Brands that may be worth investigating");
      doc.moveDown(0.2);
      for (const brand of input.thesis.namedBrands) {
        doc.font("Times-Bold").fontSize(11).text(brand.name);
        doc.font("Times-Roman").fontSize(10).text(brand.reason);
        doc.font("Times-Italic").fontSize(9).text(brand.disclaimer);
        doc.moveDown(0.4);
      }
    }

    doc.moveDown(0.4);
    doc.font("Times-Italic").fontSize(10).text(input.thesis.conclusion);
    doc.moveDown(1);
    doc.font("Times-Roman").fontSize(8).fillColor(NAVY).text(
      "Private document. Not a franchise recommendation, legal, tax, investment, or earnings claim.",
    );
    if (input.reportUrl) {
      doc.text(input.reportUrl);
    }

    doc.end();
  });
}

export const thesisSectionTitles = CHAPTER_LABELS;
