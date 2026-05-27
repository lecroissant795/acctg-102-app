import { useEffect, useRef, useState } from "react";
import { AuthScreen } from "./components/AuthScreen.jsx";
import { HomeScreen } from "./components/HomeScreen.jsx";
import { MobileMenu } from "./components/MobileMenu.jsx";
import { QuizScreen } from "./components/QuizScreen.jsx";
import { ResultsScreen } from "./components/ResultsScreen.jsx";
import { StatsScreen } from "./components/StatsScreen.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.jsx";
import { useStats } from "./contexts/StatsContext.jsx";
import { useAppRouter } from "./hooks/useAppRouter.js";
import {
  PRACTICE_QUESTIONS,
  QUESTIONS,
  practiceGroups,
  topics,
  totalPracticeQuestionCount,
  totalQuestionCount,
} from "./data/index.js";
import {
  buildMcqQuizQuestions,
  buildPracticeQuestionPool,
  buildPracticePlanNotice,
  getPracticeLoadingMessage,
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
  const [quizStartedAt, setQuizStartedAt] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planLoadingLabel, setPlanLoadingLabel] = useState(null);
  const [planRationale, setPlanRationale] = useState(null);
  const [planUsedFallback, setPlanUsedFallback] = useState(false);
  const [planFallbackReason, setPlanFallbackReason] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [showPlanRationale, setShowPlanRationale] = useState(true);
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
    setShowPlanRationale(true);
    setTutorUses(createTutorUseState());
    savedSessionRef.current = false;
  };

  const clearQuizSession = () => {
    activeQuizPathRef.current = null;
    setQuestions([]);
    setSelectedTopicIndex(null);
    setSelectedPracticeLabel(null);
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
    setPlanRationale(null);
    setMode(nextMode);
    if (size !== null) setMiniSize(size);
    resetQuizState();
    activeQuizPathRef.current = quizPath;
    navigate(quizPath, { replace: true });
  };

  const startChapterQuiz = (topicIndex) =>
    startMcqQuiz({
      nextMode: "topic",
      topicIndex,
      quizPath: chapterPath(topics[topicIndex]),
    });

  const startPracticeGroup = async (label) => {
    setPlanLoadingLabel(label);
    setPlanLoading(true);
    setPlanError(null);
    setPlanFallbackReason(null);

    try {
      const quizPath = practicePath(label);
      const { pool, payload, questionType } = buildPracticeQuestionPool(label);
      const {
        questions: practiceQuestions,
        rationale,
        usedFallback,
        errorMessage,
      } = await resolvePracticeQuiz(payload, pool, questionType);

      setSelectedTopicIndex(null);
      setSelectedPracticeLabel(label);
      setQuestions(practiceQuestions);
      setPlanRationale(rationale);
      setPlanUsedFallback(usedFallback);
      setPlanFallbackReason(errorMessage ?? null);
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

  const handleNext = () => {
    if (questionIndex + 1 >= questions.length) {
      navigate(resultsPathForRoute(route));
      return;
    }

    setQuestionIndex((current) => current + 1);
    setCurrentAnswer(null);
    setShowExplanation(false);
  };

  const handleRetry = () => {
    if (mode === "mini") startMiniQuiz(miniSize);
    else if (mode === "topic" && selectedTopicIndex !== null) startChapterQuiz(selectedTopicIndex);
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
    else if (route.name === "quiz-chapter") startChapterQuiz(route.topicIndex);
    else if (route.name === "quiz-practice") startPracticeGroup(route.label);
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
            : topics[selectedTopicIndex];
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
    onStartChapter: (topicIndex) => navigate(chapterPath(topics[topicIndex])),
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
        onStartChapter={(topicIndex) => navigate(chapterPath(topics[topicIndex]))}
        onStartPracticeGroup={(label) => navigate(practicePath(label))}
        onOpenStats={() => navigate(ROUTES.stats)}
      />
    );
  } else if (route.name === "stats") {
    screen = <StatsScreen onBack={() => navigate(ROUTES.home)} />;
  } else if (isQuizStartRoute(route) && !questions[questionIndex]) {
    const loadingMessage =
      planLoading && planLoadingLabel
        ? getPracticeLoadingMessage(planLoadingLabel, PRACTICE_QUESTIONS[planLoadingLabel]?.length)
        : null;

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
            {planLoading && planLoadingLabel
              ? `Preparing ${planLoadingLabel}...`
              : "Loading quiz..."}
          </div>
          {loadingMessage && (
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{loadingMessage}</div>
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
        planNotice={
          showPlanRationale && mode === "practice" && selectedPracticeLabel
            ? buildPracticePlanNotice({
                usedFallback: planUsedFallback,
                rationale: planRationale,
                label: selectedPracticeLabel,
                errorMessage: planFallbackReason,
              })
            : null
        }
        onDismissPlanNotice={() => setShowPlanRationale(false)}
        onBack={() => navigate(ROUTES.home)}
        onSubmitAnswer={handleSubmitAnswer}
        onNext={handleNext}
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

  return (
    <NavigationProvider value={navigation}>
      <MobileMenu />
      {screen}
    </NavigationProvider>
  );
}
