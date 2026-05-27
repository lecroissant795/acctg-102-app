import { CHAPTERS, practiceGroups, topics } from "./data/index.js";
import { MINI_QUIZ_SIZES } from "./constants/topicColors.js";

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const chapterSlugByTopic = Object.fromEntries(
  topics.map((topic) => [topic, slugify(topic)])
);

export const topicByChapterSlug = Object.fromEntries(
  topics.map((topic) => [chapterSlugByTopic[topic], topic])
);

export const practiceSlugByLabel = Object.fromEntries(
  practiceGroups.map((group) => [group.label, slugify(group.label)])
);

export const practiceLabelBySlug = Object.fromEntries(
  practiceGroups.map((group) => [practiceSlugByLabel[group.label], group.label])
);

export const topicIndexByChapterSlug = Object.fromEntries(
  topics.map((topic, index) => [chapterSlugByTopic[topic], index])
);

const MINI_SIZE_SET = new Set(MINI_QUIZ_SIZES.map(String));

export const ROUTES = {
  home: "/",
  auth: "/auth",
  stats: "/stats",
  quizMini: (size) => `/quiz/mini/${size}`,
  quizMiniResults: (size) => `/quiz/mini/${size}/results`,
  quizExam: "/quiz/exam",
  quizExamResults: "/quiz/exam/results",
  quizChapter: (slug) => `/quiz/chapter/${slug}`,
  quizChapterResults: (slug) => `/quiz/chapter/${slug}/results`,
  quizPractice: (slug) => `/quiz/practice/${slug}`,
  quizPracticeResults: (slug) => `/quiz/practice/${slug}/results`,
};

export function chapterPath(topic) {
  return ROUTES.quizChapter(chapterSlugByTopic[topic]);
}

export function practicePath(label) {
  return ROUTES.quizPractice(practiceSlugByLabel[label]);
}

export function resultsPathForRoute(route) {
  if (!route || route.name === "home" || route.name === "auth" || route.name === "stats") {
    return ROUTES.home;
  }

  if (route.name === "quiz-mini") return ROUTES.quizMiniResults(route.size);
  if (route.name === "quiz-exam") return ROUTES.quizExamResults;
  if (route.name === "quiz-chapter") return ROUTES.quizChapterResults(route.slug);
  if (route.name === "quiz-practice") return ROUTES.quizPracticeResults(route.slug);
  return ROUTES.home;
}

export function quizPathForMode({ mode, miniSize, selectedTopicIndex, selectedPracticeLabel }) {
  if (mode === "mini") return ROUTES.quizMini(miniSize);
  if (mode === "all") return ROUTES.quizExam;
  if (mode === "topic" && selectedTopicIndex !== null) {
    return ROUTES.quizChapter(chapterSlugByTopic[topics[selectedTopicIndex]]);
  }
  if (mode === "practice" && selectedPracticeLabel) {
    return ROUTES.quizPractice(practiceSlugByLabel[selectedPracticeLabel]);
  }
  return ROUTES.home;
}

/** @typedef {{ name: string } & Record<string, unknown>} AppRoute */

/** @param {string} pathname */
export function parseRoute(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === ROUTES.home) return { name: "home" };
  if (path === ROUTES.auth) return { name: "auth" };
  if (path === ROUTES.stats) return { name: "stats" };

  let match = path.match(/^\/quiz\/mini\/(\d+)(?:\/results)?$/);
  if (match) {
    const size = match[1];
    if (!MINI_SIZE_SET.has(size)) return { name: "not-found" };
    return {
      name: path.endsWith("/results") ? "quiz-mini-results" : "quiz-mini",
      size: Number(size),
    };
  }

  if (path === ROUTES.quizExam) return { name: "quiz-exam" };
  if (path === ROUTES.quizExamResults) return { name: "quiz-exam-results" };

  match = path.match(/^\/quiz\/chapter\/([^/]+)(?:\/results)?$/);
  if (match) {
    const slug = match[1];
    if (!topicByChapterSlug[slug]) return { name: "not-found" };
    return {
      name: path.endsWith("/results") ? "quiz-chapter-results" : "quiz-chapter",
      slug,
      topicIndex: topicIndexByChapterSlug[slug],
      topic: topicByChapterSlug[slug],
    };
  }

  match = path.match(/^\/quiz\/practice\/([^/]+)(?:\/results)?$/);
  if (match) {
    const slug = match[1];
    if (!practiceLabelBySlug[slug]) return { name: "not-found" };
    return {
      name: path.endsWith("/results") ? "quiz-practice-results" : "quiz-practice",
      slug,
      label: practiceLabelBySlug[slug],
    };
  }

  return { name: "not-found" };
}

export function isQuizStartRoute(route) {
  return (
    route?.name === "quiz-mini" ||
    route?.name === "quiz-exam" ||
    route?.name === "quiz-chapter" ||
    route?.name === "quiz-practice"
  );
}

export function isResultsRoute(route) {
  return (
    route?.name === "quiz-mini-results" ||
    route?.name === "quiz-exam-results" ||
    route?.name === "quiz-chapter-results" ||
    route?.name === "quiz-practice-results"
  );
}

export const ROUTE_CATALOG = {
  pages: [
    { path: ROUTES.home, screen: "Home", description: "Dashboard with quiz launchers and chapter list" },
    { path: ROUTES.auth, screen: "Auth", description: "Sign in / sign up" },
    { path: ROUTES.stats, screen: "Stats", description: "Quiz history and performance" },
  ],
  quizzes: [
    { path: ROUTES.quizMini(5), screen: "Quiz", mode: "mini", size: 5 },
    { path: ROUTES.quizMini(10), screen: "Quiz", mode: "mini", size: 10 },
    { path: ROUTES.quizMini(15), screen: "Quiz", mode: "mini", size: 15 },
    { path: ROUTES.quizExam, screen: "Quiz", mode: "all" },
    ...topics.map((topic) => ({
      path: chapterPath(topic),
      screen: "Quiz",
      mode: "topic",
      topic,
      slug: chapterSlugByTopic[topic],
    })),
    ...practiceGroups.map((group) => ({
      path: practicePath(group.label),
      screen: "Quiz",
      mode: "practice",
      label: group.label,
      slug: practiceSlugByLabel[group.label],
    })),
  ],
  results: [
    { path: ROUTES.quizMiniResults(10), screen: "Results", mode: "mini", size: 10 },
    { path: ROUTES.quizExamResults, screen: "Results", mode: "all" },
    ...topics.map((topic) => ({
      path: ROUTES.quizChapterResults(chapterSlugByTopic[topic]),
      screen: "Results",
      mode: "topic",
      topic,
    })),
    ...practiceGroups.map((group) => ({
      path: ROUTES.quizPracticeResults(practiceSlugByLabel[group.label]),
      screen: "Results",
      mode: "practice",
      label: group.label,
    })),
  ],
  chapters: CHAPTERS.map((chapter) => ({
    title: chapter.title,
    slug: slugify(chapter.title),
    mcqPath: topics.includes(chapter.title) ? chapterPath(chapter.title) : null,
  })),
};
