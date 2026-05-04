import type { Question } from "../data/questionTypes";

const UNIT_WORDS = [
  "mm",
  "cm",
  "m",
  "km",
  "g",
  "kg",
  "mg",
  "ml",
  "cl",
  "dl",
  "l",
  "kr",
  "kronor",
  "krona",
  "grader",
  "grad",
  "min",
  "minuter",
  "tim",
  "timmar",
  "sek",
  "sekunder",
  "st",
  "stycken",
  "cm2",
  "cm²",
  "m2",
  "m²",
  "cm3",
  "cm³",
  "m3",
  "m³",
];

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*%\s*/g, "%");
}

function stripUnit(value: string): string {
  let normalized = normalizeText(value).replace(",", ".");
  for (const unit of UNIT_WORDS) {
    normalized = normalized.replace(new RegExp(`\\s*${unit}$`, "i"), "");
  }
  return normalized.trim();
}

function parseFraction(value: string): number | null {
  const match = stripUnit(value).match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function parseNumeric(value: string | number): number | null {
  if (typeof value === "number") return value;
  const fraction = parseFraction(value);
  if (fraction !== null) return fraction;

  const stripped = stripUnit(value).replace(/\s/g, "");
  if (!/^-?\d+(?:\.\d+)?$/.test(stripped)) return null;
  const numeric = Number(stripped);
  return Number.isFinite(numeric) ? numeric : null;
}

function valuesMatch(expected: string | number, actual: string): boolean {
  const expectedNumber = parseNumeric(expected);
  const actualNumber = parseNumeric(actual);
  if (expectedNumber !== null && actualNumber !== null) {
    return Math.abs(expectedNumber - actualNumber) < 0.000001;
  }

  return normalizeText(String(expected)) === normalizeText(actual);
}

export function validateAnswer(question: Question, answer: string): boolean {
  const expectedAnswers = [
    ...(Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]),
    ...(question.acceptedAnswers ?? []),
  ];

  return expectedAnswers.some((expected) => valuesMatch(expected, answer));
}
