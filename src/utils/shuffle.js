export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getOriginalOptionIndex(question, displayIndex) {
  if (!question.displayOptions) return displayIndex;
  const selectedText = question.displayOptions[displayIndex];
  return question.options.indexOf(selectedText);
}

export function getDisplayOptionIndex(question, originalIndex) {
  if (!question.displayOptions || typeof originalIndex !== "number") return originalIndex;
  const optionText = question.options[originalIndex];
  return question.displayOptions.indexOf(optionText);
}

export function shuffleQuestionOptions(question) {
  const indices = shuffleArray([...Array(question.options.length).keys()]);
  const displayOptions = indices.map((index) => question.options[index]);
  const correctIndex = question.answer?.correctIndex ?? question.answer;
  const displayAnswer = indices.indexOf(correctIndex);

  return {
    ...question,
    displayOptions,
    displayAnswer,
    optionsShuffled: true,
  };
}
