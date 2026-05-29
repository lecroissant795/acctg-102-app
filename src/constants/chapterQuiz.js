export const CHAPTER_QUIZ_SIZES = [10, 15, 25];
export const CHAPTER_QUIZ_ALL = "all";
export const DEFAULT_CHAPTER_QUIZ_SIZE = 10;

export function isChapterQuizAll(size) {
  return size === CHAPTER_QUIZ_ALL;
}

export function resolveChapterQuizSize(size, availableCount) {
  if (isChapterQuizAll(size)) return availableCount;
  return Math.min(size, availableCount);
}
