import { QUESTION_TYPES } from "../../data/schema/questionTypes.js";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundScore(value) {
  return Math.round(value * 100) / 100;
}

function buildResult({
  correct,
  scoreAwarded,
  maxScore,
  feedback,
  breakdown = {},
  responseSummary = null,
}) {
  return {
    correct,
    scoreAwarded: roundScore(scoreAwarded),
    maxScore,
    feedback,
    breakdown,
    responseSummary,
  };
}

function getMaxScore(question) {
  return question.points ?? 1;
}

function normalizeSelectedIndices(selectedIndices = []) {
  return [...new Set(selectedIndices)].sort((a, b) => a - b);
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function compareNumber(actual, expected, tolerance = 0) {
  return Math.abs(actual - expected) <= tolerance;
}

function evaluateMcq(question, response = {}) {
  const maxScore = getMaxScore(question);
  const selectedIndex = response.selectedIndex;
  const correctIndex = question.answer?.correctIndex ?? question.answer;
  const correct = selectedIndex === correctIndex;

  return buildResult({
    correct,
    scoreAwarded: correct ? maxScore : 0,
    maxScore,
    feedback: correct ? "Correct." : "Incorrect.",
    breakdown: { selectedIndex, correctIndex },
    responseSummary: { selectedIndex },
  });
}

function evaluateWritten(question, response = {}) {
  const maxScore = getMaxScore(question);
  const text = String(response.text ?? "").trim();
  const keyPoints = question.answer?.keyPoints ?? [];

  if (keyPoints.length === 0) {
    return buildResult({
      correct: false,
      scoreAwarded: 0,
      maxScore,
      feedback: "Written response captured for review.",
      breakdown: { graded: false },
      responseSummary: { text },
    });
  }

  const normalizedText = normalizeText(text);
  const matchedPoints = keyPoints.filter((point) =>
    normalizedText.includes(normalizeText(point))
  );
  const ratio = keyPoints.length === 0 ? 0 : matchedPoints.length / keyPoints.length;

  return buildResult({
    correct: matchedPoints.length === keyPoints.length && keyPoints.length > 0,
    scoreAwarded: maxScore * ratio,
    maxScore,
    feedback:
      matchedPoints.length === keyPoints.length
        ? "All expected points covered."
        : `Covered ${matchedPoints.length} of ${keyPoints.length} expected points.`,
    breakdown: {
      graded: true,
      matchedPoints,
      missingPoints: keyPoints.filter((point) => !matchedPoints.includes(point)),
    },
    responseSummary: { text },
  });
}

function evaluateSelectMultiple(question, response = {}) {
  const maxScore = getMaxScore(question);
  const selected = normalizeSelectedIndices(response.selectedIndices);
  const correctIndices = normalizeSelectedIndices(question.answer?.correctIndices ?? []);
  const scoringMode = question.answer?.scoringMode ?? "partial";

  const correctSelections = selected.filter((index) => correctIndices.includes(index)).length;
  const wrongSelections = selected.filter((index) => !correctIndices.includes(index)).length;
  const missedSelections = correctIndices.filter((index) => !selected.includes(index)).length;

  let rawRatio = 0;
  if (scoringMode === "exact") {
    rawRatio =
      wrongSelections === 0 && missedSelections === 0 && selected.length === correctIndices.length
        ? 1
        : 0;
  } else {
    rawRatio =
      correctIndices.length === 0
        ? 0
        : clamp((correctSelections - wrongSelections) / correctIndices.length, 0, 1);
  }

  return buildResult({
    correct: rawRatio === 1,
    scoreAwarded: maxScore * rawRatio,
    maxScore,
    feedback:
      rawRatio === 1
        ? "All correct choices selected."
        : `Selected ${correctSelections} correct and ${wrongSelections} incorrect options.`,
    breakdown: {
      selected,
      correctIndices,
      correctSelections,
      wrongSelections,
      missedSelections,
      scoringMode,
    },
    responseSummary: { selectedIndices: selected },
  });
}

function evaluateNumericInput(question, response = {}) {
  const maxScore = getMaxScore(question);
  const expected = question.answer?.value;
  const tolerance = question.answer?.tolerance ?? 0;
  const actual = toNumber(response.value);
  const correct = actual !== null && compareNumber(actual, expected, tolerance);

  return buildResult({
    correct,
    scoreAwarded: correct ? maxScore : 0,
    maxScore,
    feedback:
      actual === null
        ? "Enter a valid number."
        : correct
          ? "Correct value."
          : `Expected ${expected} within tolerance ${tolerance}.`,
    breakdown: { actual, expected, tolerance },
    responseSummary: { value: actual },
  });
}

function evaluateMatching(question, response = {}) {
  const maxScore = getMaxScore(question);
  const expectedPairs = question.answer?.pairs ?? {};
  const actualPairs = response.pairs ?? {};
  const total = Object.keys(expectedPairs).length;
  const correctPairs = Object.entries(expectedPairs).filter(
    ([leftId, rightId]) => actualPairs[leftId] === rightId
  ).length;
  const ratio = total === 0 ? 0 : correctPairs / total;

  return buildResult({
    correct: total > 0 && correctPairs === total,
    scoreAwarded: maxScore * ratio,
    maxScore,
    feedback:
      correctPairs === total ? "All matches are correct." : `${correctPairs} of ${total} matches are correct.`,
    breakdown: { total, correctPairs, expectedPairs, actualPairs },
    responseSummary: { pairs: actualPairs },
  });
}

function evaluateOrdering(question, response = {}) {
  const maxScore = getMaxScore(question);
  const expectedOrder = question.answer?.correctOrder ?? [];
  const actualOrder = response.orderedIds ?? [];
  const total = expectedOrder.length;
  const correctlyPlaced = expectedOrder.filter((id, index) => actualOrder[index] === id).length;
  const ratio = total === 0 ? 0 : correctlyPlaced / total;

  return buildResult({
    correct: total > 0 && correctlyPlaced === total,
    scoreAwarded: maxScore * ratio,
    maxScore,
    feedback:
      correctlyPlaced === total
        ? "Correct order."
        : `${correctlyPlaced} of ${total} positions are correct.`,
    breakdown: { expectedOrder, actualOrder, correctlyPlaced, total },
    responseSummary: { orderedIds: actualOrder },
  });
}

function normalizeAccountName(accountName) {
  return normalizeText(accountName).replace(/[.,]/g, "");
}

function getJournalLineSide(line) {
  if (line.side) return line.side;
  if (line.debit != null) return "debit";
  if (line.credit != null) return "credit";
  return null;
}

function getJournalLineAmount(line) {
  if (line.amount != null) return toNumber(line.amount);
  if (line.debit != null) return toNumber(line.debit);
  if (line.credit != null) return toNumber(line.credit);
  return null;
}

function buildJournalAliasMap(answerRules = {}) {
  const aliasMap = {};
  const aliases = answerRules.acceptedAccountAliases ?? {};

  Object.entries(aliases).forEach(([canonical, aliasList]) => {
    const canonicalKey = normalizeAccountName(canonical);
    aliasMap[canonicalKey] = canonicalKey;
    aliasList.forEach((alias) => {
      aliasMap[normalizeAccountName(alias)] = canonicalKey;
    });
  });

  return aliasMap;
}

function canonicalizeJournalLine(line, aliasMap) {
  const normalizedAccount = normalizeAccountName(line.account);
  return {
    account: aliasMap[normalizedAccount] ?? normalizedAccount,
    side: getJournalLineSide(line),
    amount: getJournalLineAmount(line),
  };
}

function isBalancedJournal(lines) {
  let debits = 0;
  let credits = 0;

  lines.forEach((line) => {
    if (line.side === "debit") debits += line.amount ?? 0;
    if (line.side === "credit") credits += line.amount ?? 0;
  });

  return compareNumber(debits, credits, 0.01);
}

function evaluateJournalEntry(question, response = {}) {
  const maxScore = getMaxScore(question);
  const answerLines = question.answer?.lines ?? [];
  const rules = question.answer?.rules ?? {};
  const aliasMap = buildJournalAliasMap(rules);

  const expected = answerLines.map((line) => canonicalizeJournalLine(line, aliasMap));
  const actual = (response.lines ?? []).map((line) => canonicalizeJournalLine(line, aliasMap));

  const expectedAccounts = expected.map((line) => line.account);
  const actualAccounts = actual.map((line) => line.account);

  const matchedAccountCount = actualAccounts.filter((account) => expectedAccounts.includes(account)).length;
  const accountScore =
    expected.length === 0 ? 0 : clamp(matchedAccountCount / expected.length, 0, 1);

  let sideMatches = 0;
  let amountMatches = 0;

  expected.forEach((expectedLine) => {
    const matchingActual = actual.find((actualLine) => actualLine.account === expectedLine.account);
    if (!matchingActual) return;
    if (matchingActual.side === expectedLine.side) sideMatches += 1;
    if (
      matchingActual.side === expectedLine.side &&
      matchingActual.amount !== null &&
      expectedLine.amount !== null &&
      compareNumber(matchingActual.amount, expectedLine.amount, 0.01)
    ) {
      amountMatches += 1;
    }
  });

  const sideScore = expected.length === 0 ? 0 : sideMatches / expected.length;
  const amountScore = expected.length === 0 ? 0 : amountMatches / expected.length;
  const balanced = isBalancedJournal(actual);
  const balancePenalty = rules.requireBalancedEntry && !balanced ? 0 : 1;

  const weightedRatio =
    (accountScore * 0.4 + sideScore * 0.3 + amountScore * 0.3) * balancePenalty;

  const fullyCorrect =
    accountScore === 1 && sideScore === 1 && amountScore === 1 && (!rules.requireBalancedEntry || balanced);

  return buildResult({
    correct: fullyCorrect,
    scoreAwarded: maxScore * weightedRatio,
    maxScore,
    feedback: fullyCorrect
      ? "Correct journal entry."
      : rules.requireBalancedEntry && !balanced
        ? "Entry is not balanced."
        : "Journal entry is partially correct.",
    breakdown: {
      expected,
      actual,
      balanced,
      accountScore,
      sideScore,
      amountScore,
      weights: { accounts: 0.4, sides: 0.3, amounts: 0.3 },
    },
    responseSummary: { lines: response.lines ?? [] },
  });
}

function evaluateTableClassification(question, response = {}) {
  const maxScore = getMaxScore(question);
  const expected = question.answer?.mapping ?? {};
  const actual = response.mapping ?? {};
  const total = Object.keys(expected).length;
  const correctRows = Object.entries(expected).filter(
    ([rowId, column]) => actual[rowId] === column
  ).length;
  const ratio = total === 0 ? 0 : correctRows / total;

  return buildResult({
    correct: total > 0 && correctRows === total,
    scoreAwarded: maxScore * ratio,
    maxScore,
    feedback:
      correctRows === total
        ? "All classifications are correct."
        : `${correctRows} of ${total} classifications are correct.`,
    breakdown: { expected, actual, correctRows, total },
    responseSummary: { mapping: actual },
  });
}

function evaluateCaseSet(question, response = {}) {
  const subquestions = question.subquestions ?? [];
  const actualResponses = response.subresponses ?? {};
  const subresults = subquestions.map((subquestion) => ({
    id: subquestion.id,
    result: evaluateQuestion(subquestion, actualResponses[subquestion.id]),
  }));

  const scoreAwarded = subresults.reduce((sum, entry) => sum + entry.result.scoreAwarded, 0);
  const maxScore = subresults.reduce((sum, entry) => sum + entry.result.maxScore, 0);

  return buildResult({
    correct: subresults.every((entry) => entry.result.correct),
    scoreAwarded,
    maxScore,
    feedback:
      subresults.every((entry) => entry.result.correct)
        ? "All case components are correct."
        : "Case set completed with partial credit.",
    breakdown: { subresults },
    responseSummary: { subresponses: actualResponses },
  });
}

export function evaluateQuestion(question, response) {
  switch (question.type) {
    case QUESTION_TYPES.MCQ:
      return evaluateMcq(question, response);
    case QUESTION_TYPES.WRITTEN:
      return evaluateWritten(question, response);
    case QUESTION_TYPES.SELECT_MULTIPLE:
      return evaluateSelectMultiple(question, response);
    case QUESTION_TYPES.NUMERIC_INPUT:
      return evaluateNumericInput(question, response);
    case QUESTION_TYPES.MATCHING:
      return evaluateMatching(question, response);
    case QUESTION_TYPES.ORDERING:
      return evaluateOrdering(question, response);
    case QUESTION_TYPES.JOURNAL_ENTRY:
      return evaluateJournalEntry(question, response);
    case QUESTION_TYPES.TABLE_CLASSIFICATION:
      return evaluateTableClassification(question, response);
    case QUESTION_TYPES.CASE_SET:
      return evaluateCaseSet(question, response);
    default:
      throw new Error(`Unsupported question type: ${question.type}`);
  }
}

export function createAnswerRecord(question, response) {
  const evaluation = evaluateQuestion(question, response);

  return {
    questionId: question.id,
    questionType: question.type,
    response,
    evaluation,
    answeredAt: new Date().toISOString(),
  };
}
