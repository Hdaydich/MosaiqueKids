// utils/exportToWord.js
import React from "react";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  BorderStyle,
} from "docx";
import logoImg from "../assets/logo.png";
import img1 from "../assets/soukounWord.png";
import img2 from "../assets/dhammaWord.png";
import img3 from "../assets/kasraWord.png";
import img4 from "../assets/fathaWord.png";

export const exportToWord = async (segments) => {
  const DIACRITICS = new Set([
    "\u064B",
    "\u064C",
    "\u064D",
    "\u064E",
    "\u064F",
    "\u0650",
    "\u0651",
    "\u0652",
    "\u0670",
  ]);

  const REMOVE_CHARS = new Set([
    ".",
    ":",
    "؛",
    '"',
    "'",
    "?",
    "!",
    "؟",
    "-",
    "_",
  ]);

  const flatten = (node, inheritedColor = "000000") => {
    if (!node) return [];
    if (Array.isArray(node))
      return node.flatMap((n) => flatten(n, inheritedColor));
    if (typeof node === "string" || typeof node === "number")
      return [{ type: "text", text: String(node), color: inheritedColor }];
    if (React.isValidElement(node)) {
      if (node.type === "hr") return [{ type: "hr" }];
      if (node.type === "br") return [{ type: "br" }];
      let color = inheritedColor;
      if (node.props?.style?.color)
        color = String(node.props.style.color).replace("#", "");
      const children = node.props?.children;
      if (typeof children === "string" || typeof children === "number")
        return [{ type: "text", text: String(children), color }];
      return flatten(children, color);
    }
    return [{ type: "text", text: String(node), color: inheritedColor }];
  };

  const tokens = flatten(Array.isArray(segments) ? segments : [segments]);

  const lines = [];
  let currentRuns = [];
  let bufferText = "";
  let bufferColor = null;
  let pendingDash = false;

  const flushBuffer = () => {
    if (!bufferText) return;
    currentRuns.push(
      new TextRun({
        text: bufferText,
        color: bufferColor || "000000",
        font: "Arial",
        size: 40,
      })
    );
    bufferText = "";
    bufferColor = null;
  };

  const pushParagraph = () => {
    const children =
      currentRuns.length > 0
        ? [
            ...currentRuns,
            new TextRun({
              text: " -",
              color: "000000",
              font: "Arial",
              size: 40,
            }),
          ]
        : [
            new TextRun({
              text: "\u200B",
              font: "Arial",
              size: 40,
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  size: 6,
                  style: BorderStyle.SINGLE,
                },
              },
            }),
          ];

    lines.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { line: 400 },
        children: children,
      })
    );

    currentRuns = [];
  };

  tokens.forEach((token) => {
    if (!token) return;

    if (token.type === "hr") {
      flushBuffer();
      if (currentRuns.length > 0) pushParagraph();
      return;
    }

    if (token.type === "text") {
      const text = token.text;
      if (typeof text !== "string") return;
      const color = (token.color || "000000").replace("#", "");

      for (let i = 0; i < text.length; i++) {
        let cluster = text[i];
        let j = i + 1;
        while (j < text.length && DIACRITICS.has(text[j])) {
          cluster += text[j];
          j++;
        }
        i = j - 1;

        if (REMOVE_CHARS.has(cluster)) continue;
        if (cluster === "ـ") {
          pendingDash = true;
          continue;
        }

        if (cluster === " " || cluster === "\u00A0") {
          if (pendingDash) {
            flushBuffer();
            currentRuns.push(
              new TextRun({
                text: "-",
                color: "000000",
                font: "Arial",
                size: 40,
              })
            );
            pendingDash = false;
          }
          flushBuffer();
          currentRuns.push(
            new TextRun({ text: " ", color: "000000", font: "Arial", size: 40 })
          );
          continue;
        }

        if (cluster === "\n") {
          if (pendingDash) {
            flushBuffer();
            currentRuns.push(
              new TextRun({
                text: "-",
                color: "000000",
                font: "Arial",
                size: 40,
              })
            );
            pendingDash = false;
          }
          flushBuffer();
          pushParagraph();
          continue;
        }

        if (bufferText === "") {
          bufferText = cluster;
          bufferColor = color;
        } else if (bufferColor === color) {
          bufferText += cluster;
        } else {
          flushBuffer();
          bufferText = cluster;
          bufferColor = color;
        }
      }
    }

    if (token.type === "br") {
      flushBuffer();
      pushParagraph();
    }
  });

  if (pendingDash) {
    flushBuffer();
    currentRuns.push(
      new TextRun({ text: "-", color: "000000", font: "Arial", size: 40 })
    );
    pendingDash = false;
  }

  flushBuffer();
  pushParagraph();

  // --- Logo + 4 images ---

  const responseLogo = await fetch(logoImg);
  const logoBuffer = await responseLogo.arrayBuffer();
  const logo = new ImageRun({
    data: logoBuffer,
    transformation: { width: 60, height: 60 },
  });

  const loadImage = async (src, width = 80, height = 100) => {
    const res = await fetch(src);
    const buffer = await res.arrayBuffer();
    return new ImageRun({ data: buffer, transformation: { width, height } });
  };

  const images = await Promise.all([
    loadImage(img4),
    loadImage(img3),
    loadImage(img2),
    loadImage(img1),
  ]);

  // Créer un tableau avec un espace fixe entre chaque image (via TextRun invisible)
  const imagesWithSpacing = [];
  const spaceBetween = 10; //
  images.forEach((img, index) => {
    imagesWithSpacing.push(img);
    if (index < images.length - 1) {
      // Ajouter un TextRun invisible pour créer un espace uniforme
      imagesWithSpacing.push(
        new TextRun({
          text: "\u200A".repeat(spaceBetween), // hair space répétée
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 800, bottom: 1000, left: 1000, right: 1000 } },
        },

        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 },
            children: [logo],
          }),
          // 4 images côte à côte centrées avec espace uniforme
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { befor: 0, after: 800 }, // réduit encore l'espace avant texte
            children: imagesWithSpacing,
            border: {
              bottom: {
                color: "C0C0C0",
                space: 1,
                size: 6,
                style: BorderStyle.SINGLE,
                space: 400, // espace entre le texte et la bordure en twips
              },
            },
          }),

          // Texte exporté
          ...lines,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Resultat.docx");
};
