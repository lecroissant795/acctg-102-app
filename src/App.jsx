import { useEffect, useRef, useState } from "react";
import { AuthScreen } from "./components/AuthScreen.jsx";
import { ChapterQuizSetupModal } from "./components/ChapterQuizSetupModal.jsx";
import { HomeScreen } from "./components/HomeScreen.jsx";
import { MobileMenu } from "./components/MobileMenu.jsx";
import { QuizScreen } from "./components/QuizScreen.jsx";
import { ResultsScreen } from "./components/ResultsScreen.jsx";
import { StatsScreen } from "./components/StatsScreen.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.jsx";
import { useStats } from "./contexts/StatsContext.jsx";
import { useAppRouter } from "./hooks/useAppRouter.js";
import { useMobileClickSound } from "./hooks/useMobileClickSound.js";
import {
  PRACTICE_QUESTIONS,
  QUESTIONS,
  practiceGroups,
  topics,
  totalPracticeQuestionCount,
  totalQuestionCount,
} from "./data/index.js";
import { DEFAULT_CHAPTER_QUIZ_SIZE } from "./constants/chapterQuiz.js";
import {
  buildMcqQuizQuestions,
  buildPracticeQuestionPool,
  getPracticeLoadingMessage,
  resolveChapterQuizQuestions,
  resolvePracticeQuiz,
} from "./utils/quizPlan.js";
import { getOriginalOptionIndex } from "./utils/shuffle.js";
import { createAnswerRecord } from "./utils/scoring/index.js";
import {
  consumeTutorUse,
  createTutorUseState,
} from "./utils/tutorLimit.js";
import {
  chapterPath,
  isQuizStartRoute,
  isResultsRoute,
  practicePath,
  resultsPathForRoute,
  ROUTES,
} from "./routes.js";

export default function App() {
  useMobileClickSound();

  const { user, loading: authLoading, signOut } = useAuth();
  const { summary: statsSummary, saveSession } = useStats();
  const { route, navigate } = useAppRouter();
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [selectedPracticeLabel, setSelectedPracticeLabel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [mode, setMode] = useState("all");
  const [miniSize, setMiniSize] = useState(10);
  const [chapterQuizSize, setChapterQuizSize] = useState(DEFAULT_CHAPTER_QUIZ_SIZE);
  const [pendingChapterSetup, setPendingChapterSetup] = useState(null);
  const [quizSizeNotice, setQuizSizeNotice] = useState(null);
  const [quizStartedAt, setQuizStartedAt] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planLoadingLabel, setPlanLoadingLabel] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [tutorUses, setTutorUses] = useState(() => createTutorUseState());
  const savedSessionRef = useRef(false);
  const activeQuizPathRef = useRef(null);

  const resetQuizState = () => {
    setQuestionIndex(0);
    setCurrentAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setQuizStartedAt(Date.now());
    setTutorUses(createTutorUseState());
    savedSessionRef.current = false;
  };

  const clearQuizSession = () => {
    activeQuizPathRef.current = null;
    setQuestions([]);
    setSelectedTopicIndex(null);
    setSelectedPracticeLabel(null);
    setQuizSizeNotice(null);
  };

  const openChapterSetup = (topicIndex) => {
    setPendingChapterSetup({ topicIndex });
  };

  const closeChapterSetup = () => {
    setPendingChapterSetup(null);
    if (route.name === "quiz-chapter") {
      navigate(ROUTES.home, { replace: true });
    }
  };

  const confirmChapterQuiz = () => {
    if (!pendingChapterSetup) return;
    const { topicIndex } = pendingChapterSetup;
    setPendingChapterSetup(null);
    startChapterQuiz(topicIndex, chapterQuizSize);
  };

  const handleConsumeTutorUse = () => {
    let consumed = false;
    setTutorUses((current) => {
      const result = consumeTutorUse(current);
      consumed = result.consumed;
      return result.state;
    });
    return consumed;
  };

  const startMcqQuiz = ({ nextMode, topicIndex = null, size = null, quizPath }) => {
    const topic = topicIndex !== null ? topics[topicIndex] : null;
    const nextQuestions = buildMcqQuizQuestions(nextMode, topic, size);

    if (topicIndex !== null) setSelectedTopicIndex(topicIndex);
    else setSelectedTopicIndex(null);
    setSelectedPracticeLabel(null);

    setQuestions(nextQuestions);
    setMode(nextMode);
    if (size !== null) setMiniSize(size);
    resetQuizState();
    activeQuizPathRef.current = quizPath;
    navigate(quizPath, { replace: true });
  };

  const startChapterQuiz = (topicIndex, size = chapterQuizSize) => {
    const topic = topics[topicIndex];
    const { questions: nextQuestions, notice } = resolveChapterQuizQuestions(topic, size);

    setSelectedTopicIndex(topicIndex);
    setSelectedPracticeLabel(null);
    setQuestions(nextQuestions);
    setMode("topic");
    setChapterQuizSize(size);
    setQuizSizeNotice(notice);
    resetQuizState();
    activeQuizPathRef.current = chapterPath(topic);
    navigate(chapterPath(topic), { replace: true });
  };

  const startPracticeGroup = async (label) => {
    setPlanLoadingLabel(label);
    setPlanLoading(true);
    setPlanError(null);
    try {
      const quizPath = practicePath(label);
      const { pool, payload, questionType } = buildPracticeQuestionPool(label);
      const { questions: practiceQuestions } = await resolvePracticeQuiz(
        payload,
        pool,
        questionType
      );

      setSelectedTopicIndex(null);
      setSelectedPracticeLabel(label);
      setQuestions(practiceQuestions);
      setMode("practice");
      resetQuizState();
      activeQuizPathRef.current = quizPath;
      navigate(quizPath, { replace: true });
    } catch (error) {
      console.error("Failed to start practice quiz:", error);
      setPlanError(
        error instanceof Error
          ? `Could not start ${label}: ${error.message}`
          : `Could not start ${label}. Please try again.`
      );
      navigate(ROUTES.home, { replace: true });
    } finally {
      setPlanLoading(false);
      setPlanLoadingLabel(null);
    }
  };

  const startFullExam = () =>
    startMcqQuiz({ nextMode: "all", quizPath: ROUTES.quizExam });

  const startMiniQuiz = (size) =>
    startMcqQuiz({ nextMode: "mini", size, quizPath: ROUTES.quizMini(size) });

  const handleSubmitAnswer = (response) => {
    if (currentAnswer) return;
    const question = questions[questionIndex];
    let normalizedResponse = response;

    if (question.displayOptions && typeof response?.selectedIndex === "number") {
      normalizedResponse = {
        ...response,
        selectedIndex: getOriginalOptionIndex(question, response.selectedIndex),
      };
    }

    const answerRecord = createAnswerRecord(question, normalizedResponse);

    setCurrentAnswer(answerRecord);
    setShowExplanation(true);
    setScore((current) => current + answerRecord.evaluation.scoreAwarded);

    setAnswers((current) => [
      ...current,
      {
        ...answerRecord,
        questionIndex,
        topic: question.topic,
        question: question.prompt ?? question.q,
      },
    ]);
  };

  const restoreAnswerForIndex = (index) => {
    const stored = answers.find((entry) => entry.questionIndex === index) ?? null;
    setCurrentAnswer(stored);
    setShowExplanation(Boolean(stored));
  };

  const handleNext = () => {
    if (questionIndex + 1 >= questions.length) {
      navigate(resultsPathForRoute(route));
      return;
    }

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    restoreAnswerForIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (questionIndex <= 0) return;

    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);
    restoreAnswerForIndex(prevIndex);
  };

  const handleRetry = () => {
    if (mode === "mini") startMiniQuiz(miniSize);
    else if (mode === "topic" && selectedTopicIndex !== null) startChapterQuiz(selectedTopicIndex, chapterQuizSize);
    else if (mode === "practice" && selectedPracticeLabel) startPracticeGroup(selectedPracticeLabel);
    else startFullExam();
  };

  useEffect(() => {
    if (route.name === "not-found") {
      clearQuizSession();
      navigate(ROUTES.home, { replace: true });
    }
  }, [route.name, navigate]);

  useEffect(() => {
    if (authLoading || route.name === "not-found") return;

    if (isResultsRoute(route) && questions.length === 0) {
      navigate(ROUTES.home, { replace: true });
      return;
    }

    if (!isQuizStartRoute(route) || planLoading) return;
    if (activeQuizPathRef.current === window.location.pathname && questions.length > 0) return;

    if (route.name === "quiz-mini") startMiniQuiz(route.size);
    else if (route.name === "quiz-exam") startFullExam();
    else if (route.name === "quiz-chapter") {
      if (activeQuizPathRef.current === window.location.pathname && questions.length > 0) return;
      setPendingChapterSetup({ topicIndex: route.topicIndex });
    } else if (route.name === "quiz-practice") startPracticeGroup(route.label);
  }, [route, authLoading, planLoading, questions.length, navigate]);

  useEffect(() => {
    if (!isQuizStartRoute(route) && !isResultsRoute(route)) {
      if (route.name === "home" || route.name === "auth" || route.name === "stats") {
        if (questions.length > 0 || activeQuizPathRef.current) {
          clearQuizSession();
        }
      }
    }
  }, [route.name, questions.length]);

  useEffect(() => {
    if (!isResultsRoute(route) || savedSessionRef.current || questions.length === 0) return;

    const modeLabel =
      mode === "mini"
        ? `Mini Quiz (${questions.length} Qs)`
        : mode === "all"
          ? "Full Exam"
          : mode === "practice"
            ? selectedPracticeLabel
            : `Chapter Quiz (${questions.length} Qs) · ${topics[selectedTopicIndex]}`;
    const maxScore = questions.reduce(
      (sum, question) => sum + (typeof question.points === "number" ? question.points : question.type === "written" ? 0 : 1),
      0
    );

    saveSession({
      mode,
      modeLabel,
      topic: mode === "topic" ? topics[selectedTopicIndex] : null,
      questions,
      answers,
      score,
      maxScore,
      startedAt: quizStartedAt,
    }).catch((error) => {
      console.error("Failed to save quiz session:", error);
    });

    savedSessionRef.current = true;
  }, [
    route,
    mode,
    selectedTopicIndex,
    selectedPracticeLabel,
    questions,
    answers,
    score,
    quizStartedAt,
    saveSession,
  ]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--color-bg)",
          color: "var(--color-text-secondary)",
          fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        Loading...
      </div>
    );
  }

  const navigation = {
    topics,
    practiceGroups,
    questions: { ...QUESTIONS, ...PRACTICE_QUESTIONS },
    totalQuestionCount,
    statsSummary,
    planLoading,
    user,
    onSignIn: () => navigate(ROUTES.auth),
    onSignOut: () => signOut(),
    onStartMini: (size) => navigate(ROUTES.quizMini(size)),
    onStartAll: () => navigate(ROUTES.quizExam),
    onStartChapter: openChapterSetup,
    onStartPracticeGroup: (label) => navigate(practicePath(label)),
    onOpenStats: () => navigate(ROUTES.stats),
    onHome: () => navigate(ROUTES.home),
  };

  let screen = null;

  if (route.name === "auth") {
    screen = (
      <AuthScreen
        onBack={() => navigate(ROUTES.home)}
        onAuthenticated={() => navigate(ROUTES.home)}
      />
    );
  } else if (route.name === "home") {
    screen = (
      <HomeScreen
        topics={topics}
        practiceGroups={practiceGroups}
        questions={{ ...QUESTIONS, ...PRACTICE_QUESTIONS }}
        totalQuestionCount={totalQuestionCount}
        totalPracticeQuestionCount={totalPracticeQuestionCount}
        statsSummary={statsSummary}
        planLoading={planLoading}
        planLoadingLabel={planLoadingLabel}
        planError={planError}
        onDismissPlanError={() => setPlanError(null)}
        user={user}
        onSignIn={() => navigate(ROUTES.auth)}
        onSignOut={() => signOut()}
        onStartMini={(size) => navigate(ROUTES.quizMini(size))}
        onStartAll={() => navigate(ROUTES.quizExam)}
        onStartChapter={openChapterSetup}
        onStartPracticeGroup={(label) => navigate(practicePath(label))}
        onOpenStats={() => navigate(ROUTES.stats)}
      />
    );
  } else if (route.name === "stats") {
    screen = <StatsScreen onBack={() => navigate(ROUTES.home)} />;
  } else if (isQuizStartRoute(route) && !questions[questionIndex]) {
    const isPracticeLoading = planLoading && planLoadingLabel;

    screen = (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--color-bg)",
          color: "var(--color-text-secondary)",
          fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>
            {isPracticeLoading ? `Preparing ${planLoadingLabel}...` : "Loading quiz..."}
          </div>
          {isPracticeLoading && (
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{getPracticeLoadingMessage()}</div>
          )}
        </div>
      </div>
    );
  } else if (isQuizStartRoute(route) && questions[questionIndex]) {
    screen = (
      <QuizScreen
        mode={mode}
        topics={topics}
        selectedTopicIndex={selectedTopicIndex}
        questions={questions}
        questionIndex={questionIndex}
        currentAnswer={currentAnswer}
        showExplanation={showExplanation}
        score={score}
        quizSizeNotice={quizSizeNotice}
        onBack={() => navigate(ROUTES.home)}
        onSubmitAnswer={handleSubmitAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        tutorUses={tutorUses}
        onConsumeTutorUse={handleConsumeTutorUse}
      />
    );
  } else if (isResultsRoute(route)) {
    screen = (
      <ResultsScreen
        mode={mode}
        topics={topics}
        selectedTopicIndex={selectedTopicIndex}
        questions={questions}
        score={score}
        maxScore={questions.reduce(
          (sum, question) => sum + (typeof question.points === "number" ? question.points : question.type === "written" ? 0 : 1),
          0
        )}
        answers={answers}
        onRetry={handleRetry}
        onHome={() => navigate(ROUTES.home)}
        tutorUses={tutorUses}
        onConsumeTutorUse={handleConsumeTutorUse}
      />
    );
  }

  const chapterSetupModal =
    pendingChapterSetup != null ? (
      <ChapterQuizSetupModal
        topic={topics[pendingChapterSetup.topicIndex]}
        availableCount={QUESTIONS[topics[pendingChapterSetup.topicIndex]]?.length ?? 0}
        selectedSize={chapterQuizSize}
        onSelectSize={setChapterQuizSize}
        onStart={confirmChapterQuiz}
        onCancel={closeChapterSetup}
      />
    ) : null;

  return (
    <NavigationProvider value={navigation}>
      <MobileMenu />
      {screen}
      {chapterSetupModal}
    </NavigationProvider>
  );
}
