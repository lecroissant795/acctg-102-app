import { describe, expect, test } from "bun:test";
import {
  chapterSlugByTopic,
  parseRoute,
  practiceSlugByLabel,
  quizPathForMode,
  resultsPathForRoute,
  ROUTES,
  slugify,
} from "./routes.js";
import { topics } from "./data/index.js";

describe("slugify", () => {
  test("normalizes chapter titles", () => {
    expect(slugify("Ch 1: Introduction to Accounting")).toBe("ch-1-introduction-to-accounting");
    expect(slugify("Numeric Input")).toBe("numeric-input");
  });
});

describe("parseRoute", () => {
  test("parses static pages", () => {
    expect(parseRoute("/")).toEqual({ name: "home" });
    expect(parseRoute("/auth")).toEqual({ name: "auth" });
    expect(parseRoute("/stats")).toEqual({ name: "stats" });
  });

  test("parses mini quiz routes", () => {
    expect(parseRoute("/quiz/mini/10")).toEqual({ name: "quiz-mini", size: 10 });
    expect(parseRoute("/quiz/mini/10/results")).toEqual({ name: "quiz-mini-results", size: 10 });
    expect(parseRoute("/quiz/mini/99")).toEqual({ name: "not-found" });
  });

  test("parses chapter and practice routes", () => {
    const topic = topics[0];
    const chapterSlug = chapterSlugByTopic[topic];

    expect(parseRoute(`/quiz/chapter/${chapterSlug}`)).toMatchObject({
      name: "quiz-chapter",
      slug: chapterSlug,
      topicIndex: 0,
      topic,
    });

    expect(parseRoute("/quiz/practice/written-practice")).toMatchObject({
      name: "quiz-practice",
      slug: "written-practice",
      label: "Written Practice",
    });
  });

  test("returns not-found for unknown paths", () => {
    expect(parseRoute("/quiz/chapter/does-not-exist")).toEqual({ name: "not-found" });
    expect(parseRoute("/unknown")).toEqual({ name: "not-found" });
  });
});

describe("quizPathForMode", () => {
  test("builds quiz paths from session state", () => {
    expect(quizPathForMode({ mode: "mini", miniSize: 15, selectedTopicIndex: null, selectedPracticeLabel: null })).toBe(
      ROUTES.quizMini(15)
    );
    expect(quizPathForMode({ mode: "all", miniSize: 10, selectedTopicIndex: null, selectedPracticeLabel: null })).toBe(
      ROUTES.quizExam
    );
    expect(
      quizPathForMode({
        mode: "topic",
        miniSize: 10,
        selectedTopicIndex: 0,
        selectedPracticeLabel: null,
      })
    ).toBe(ROUTES.quizChapter(chapterSlugByTopic[topics[0]]));
    expect(
      quizPathForMode({
        mode: "practice",
        miniSize: 10,
        selectedTopicIndex: null,
        selectedPracticeLabel: "Numeric Input",
      })
    ).toBe(ROUTES.quizPractice(practiceSlugByLabel["Numeric Input"]));
  });
});

describe("resultsPathForRoute", () => {
  test("maps active quiz routes to results routes", () => {
    expect(resultsPathForRoute(parseRoute("/quiz/mini/5"))).toBe(ROUTES.quizMiniResults(5));
    expect(resultsPathForRoute(parseRoute("/quiz/exam"))).toBe(ROUTES.quizExamResults);
  });
});
