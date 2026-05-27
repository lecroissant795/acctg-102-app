export const MAX_TUTOR_USES_PER_QUIZ = 5;

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
  if (state.remaining <= 0) return "No AI tutor uses left";
  if (state.remaining === 1) return "1 use left";
  return `${state.remaining} uses left`;
}
