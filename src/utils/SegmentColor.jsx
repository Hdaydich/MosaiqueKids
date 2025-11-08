import React from "react";

export function SegmentColor(paragraph) {
  const points = [".", "؟", "!", "؛", ":"];
  const chaklTab = [
    "َ", // Fatha
    "ِ", // Kasra
    "ُ", // Damma
    "ً", // Tanwin Fatha
    "ٍ", // Tanwin Kasra
    "ٌ", // Tanwin Damma
    "ْ", // Sukoon
    "ّ", // Shadda
  ];

  const consonne = [
    "ا",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
    "ى",
    "أ",
    "إ",
    "آ",
    "ة",
    "ئ",
    "ء",
  ];
  const colors = {
    consonne: "#242424",
    alif: "#ff005d",
    ya: "#003de6",
    waw: "#00c51a",
    special: "#7d00ae",
    alif_tanwin: "#c2c2c2",
  };

  // Enlever tous les shadda
  paragraph = paragraph.replace(/ّ/g, "");

  // Split par mots et retours à la ligne
  const words = paragraph.split(/(\s+|\n)/);
  const tempResult = [];

  // Création des syllabes
  words.forEach((word) => {
    if (word === "\n") {
      tempResult.push({ text: "\n", color: null, special: false });
      return;
    }

    if (word.trim() === "") {
      tempResult.push({ text: " ", color: colors.consonne, special: false });
      return;
    }

    const chars = word.split("");
    for (let i = 0; i < chars.length; i++) {
      const currentChar = chars[i];
      const testChaklCurrentChar = chars[i + 1] || "";
      const nextChar = chars[i + 2] || "";
      const testChaklNextChar = chars[i + 3] || "";
      const after = chars[i + 4] || "";

      let color = colors.consonne;
      let syllable = currentChar;
      let isSpecial = false;

      // Tanwin Fatha + Alif
      if (
        consonne.includes(currentChar) &&
        testChaklCurrentChar === "ً" &&
        nextChar === "ا"
      ) {
        tempResult.push({
          text: currentChar,
          color: colors.consonne,
          special: false,
        });
        tempResult.push({
          text: testChaklCurrentChar,
          color: colors.consonne,
          special: false,
        });
        tempResult.push({
          text: nextChar,
          color: colors.alif_tanwin,
          special: false,
        });
        i += 2;
        continue;
      }

      // Point : coloré + retour à la ligne
      if (currentChar === ".") {
        tempResult.push({
          text: currentChar,
          color: colors.consonne,
          special: false,
        });
        tempResult.push({ text: "\n", color: null, special: false });
        continue;
      }

      // Autres ponctuations
      if (points.includes(currentChar)) {
        tempResult.push({
          text: currentChar,
          color: colors.consonne,
          special: false,
        });
        continue;
      }

      // Sukūn
      if (testChaklNextChar === "ْ") {
        syllable =
          currentChar + testChaklCurrentChar + nextChar + testChaklNextChar;
        color = colors.special;
        isSpecial = true;
        i += 3;
      }
      // Fatha + Alif ou Fatha + ى
      else if (
        testChaklCurrentChar === "َ" &&
        (nextChar === "ا" || nextChar === "ى") &&
        (consonne.includes(testChaklNextChar) ||
          testChaklNextChar === "" ||
          points.includes(testChaklNextChar)) &&
        (!consonne.includes(after) || after === "") &&
        (after === "" || chaklTab.includes(after))
      ) {
        syllable = currentChar + testChaklCurrentChar + nextChar;
        color = colors.alif;
        isSpecial = true;
        i += 2;
      }
      // Dhamma + Waw
      else if (
        testChaklCurrentChar === "ُ" &&
        nextChar === "و" &&
        (consonne.includes(testChaklNextChar) ||
          testChaklNextChar === "" ||
          points.includes(testChaklNextChar))
      ) {
        syllable = currentChar + testChaklCurrentChar + nextChar;
        color = colors.waw;
        isSpecial = true;
        i += 2;
      }
      // Kasra + Ya
      else if (
        testChaklCurrentChar === "ِ" &&
        nextChar === "ي" &&
        (consonne.includes(testChaklNextChar) ||
          testChaklNextChar === "" ||
          points.includes(testChaklNextChar))
      ) {
        syllable = currentChar + testChaklCurrentChar + nextChar;
        color = colors.ya;
        isSpecial = true;
        i += 2;
      }
      // Alif + Lam + Sukūn
      else if (
        currentChar === "ا" &&
        testChaklCurrentChar === "ل" &&
        nextChar === "ْ"
      ) {
        syllable = currentChar + testChaklCurrentChar + nextChar;
        color = colors.special;
        isSpecial = true;
        i += 2;
      }
      // Alif + Lam + consonne
      else if (
        currentChar === "ا" &&
        testChaklCurrentChar === "ل" &&
        consonne.includes(nextChar)
      ) {
        syllable = currentChar + testChaklCurrentChar;
        color = colors.special;
        isSpecial = true;
        i += 1;
      }
      // Nouvelle règle : consonne + chakl + consonne + consonne + chakl => segment = currentChar + testChaklCurrentChar, marquer comme Sukūn
      else if (
        consonne.includes(currentChar) &&
        chaklTab.includes(testChaklCurrentChar) &&
        consonne.includes(nextChar) &&
        consonne.includes(testChaklNextChar) &&
        chaklTab.includes(after) &&
        after != "ْ" // Sukoon
      ) {
        syllable = currentChar + testChaklCurrentChar + nextChar;
        color = colors.special; // même couleur que Sukūn
        isSpecial = true;
        i += 2; // avancer de 2 car on a pris current + chakl + next
      }

      tempResult.push({ text: syllable, color, special: isSpecial });
    }
  });

  // Transformation en JSX avec remplacement de "ـ" par "-"
  const result = tempResult.flatMap((item, index) => {
    if (item.text === "\n") return <span key={index} />;

    const textClean = item.text.replace(/"/g, "").replace(/ـ/g, "-");

    // Gestion des points avec <hr>
    if (points.includes(textClean)) {
      return (
        <React.Fragment key={index}>
          <span style={{ color: item.color }}>{textClean}</span>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid lightgray",
              margin: "10px 0",
            }}
          />
        </React.Fragment>
      );
    }

    // Ajout de borderLeft si deux segments successifs ont la même couleur
    const prevItem = tempResult[index - 1];
    const style = { color: item.color };

    if (
      prevItem &&
      prevItem.color === item.color &&
      item.color !== colors.consonne
    ) {
      style.borderRight = "1px solid #444444ac";
    }

    return (
      <span key={index} style={style}>
        {textClean}
      </span>
    );
  });

  // Nettoyage des doublons <br> et suppression des <br> après <hr>
  const cleanedResult = [];
  let prevWasHr = false;

  result.forEach((item) => {
    if (item.type === "hr") {
      cleanedResult.push(item);
      prevWasHr = true;
    } else if (item.type === "br") {
      if (!prevWasHr) {
        cleanedResult.push(item);
      }
    } else {
      cleanedResult.push(item);
      prevWasHr = false;
    }
  });

  return cleanedResult;
}
