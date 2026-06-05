export const FULL_EXAM_TUTOR_USES = 30;

/** @deprecated Use getTutorUseLimit() for quiz-specific limits. */
export const MAX_TUTOR_USES_PER_QUIZ = 5;

export function getTutorUseLimit(questionCount, { isFullExam = false } = {}) {
  if (isFullExam) return FULL_EXAM_TUTOR_USES;
  if (questionCount >= 25) return 10;
  if (questionCount >= 15) return 8;
  if (questionCount >= 10) return 4;
  if (questionCount >= 5) return 2;
  return Math.max(1, questionCount);
}

export function createTutorUseState(maxUses = MAX_TUTOR_USES_PER_QUIZ) {
  return {
    remaining: maxUses,
    used: 0,
    max: maxUses,
  };
}

export function consumeTutorUse(state) {
  if (state.remaining <= 0) {
    return { state, consumed: false };
  }

  return {
    state: {
      ...state,
      remaining: state.remaining - 1,
      used: state.used + 1,
    },
    consumed: true,
  };
}

export function canUseTutor(state) {
  return state.remaining > 0;
}

export function formatTutorUsesRemaining(state) {
  if (state.remaining <= 0) return "No tutor uses left";
  if (state.remaining === 1) return "1 use left";
  return `${state.remaining} uses left`;
}
