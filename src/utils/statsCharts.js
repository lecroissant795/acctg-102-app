import { toLocalDateKey } from "./contributions.js";

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getMondayOfWeek(date) {
  const monday = startOfDay(date);
  const dayOfWeek = monday.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  monday.setDate(monday.getDate() - daysFromMonday);
  return monday;
}

export function buildScoreTrend(sessions, limit = 20) {
  const chronological = [...sessions].reverse().slice(-limit);
  return chronological.map((session, index) => ({
    index: index + 1,
    percent: session.scorePercent ?? 0,
    completedAt: session.completedAt,
    modeLabel: session.modeLabel,
  }));
}

export function buildTopicStats(sessions) {
  const byTopic = new Map();

  for (const session of sessions) {
    for (const answer of session.answers ?? []) {
      const topic = answer.topic || "Other";
      const existing = byTopic.get(topic) ?? {
        score: 0,
        max: 0,
        incorrect: 0,
      };
      existing.score += answer.scoreAwarded ?? (answer.correct ? 1 : 0);
      existing.max += answer.maxScore ?? 1;
      if (!answer.correct) existing.incorrect += 1;
      byTopic.set(topic, existing);
    }
  }

  return [...byTopic.entries()]
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.max > 0 ? Math.round((stats.score / stats.max) * 100) : 0,
      incorrect: stats.incorrect,
      attempts: stats.max,
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 10);
}

export function buildModeBreakdown(sessions) {
  const counts = new Map();

  for (const session of sessions) {
    const label = session.modeLabel || session.mode || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildWeeklyActivity(sessions, weeks = 8, referenceDate = new Date()) {
  const today = startOfDay(referenceDate);
  const currentMonday = getMondayOfWeek(today);
  const buckets = [];

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(weekStart.getDate() - index * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    buckets.push({
      weekStart: new Date(weekStart),
      weekEnd,
      label: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: 0,
      avgScore: null,
    });
  }

  const scoresByBucket = buckets.map(() => []);

  for (const session of sessions) {
    if (!session.completedAt) continue;
    const completed = new Date(session.completedAt);

    for (let index = 0; index < buckets.length; index += 1) {
      const bucket = buckets[index];
      if (completed >= bucket.weekStart && completed <= bucket.weekEnd) {
        bucket.count += 1;
        scoresByBucket[index].push(session.scorePercent ?? 0);
        break;
      }
    }
  }

  for (let index = 0; index < buckets.length; index += 1) {
    const scores = scoresByBucket[index];
    if (scores.length > 0) {
      buckets[index].avgScore = Math.round(
        scores.reduce((sum, value) => sum + value, 0) / scores.length
      );
    }
  }

  return buckets;
}

export function computeStudyStreak(sessions, referenceDate = new Date()) {
  const activeDays = new Set();

  for (const session of sessions) {
    if (!session.completedAt) continue;
    activeDays.add(toLocalDateKey(new Date(session.completedAt)));
  }

  if (activeDays.size === 0) {
    return { current: 0, longest: 0, activeDays: 0 };
  }

  const today = startOfDay(referenceDate);
  const todayKey = toLocalDateKey(today);

  let current = 0;
  const cursor = new Date(today);

  if (activeDays.has(todayKey)) {
    current = 1;
    cursor.setDate(cursor.getDate() - 1);
    while (activeDays.has(toLocalDateKey(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (activeDays.has(toLocalDateKey(yesterday))) {
      current = 1;
      cursor.setDate(cursor.getDate() - 2);
      while (activeDays.has(toLocalDateKey(cursor))) {
        current += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }
  }

  const sortedKeys = [...activeDays].sort();
  let longest = 0;
  let run = 0;
  let previous = null;

  for (const key of sortedKeys) {
    const date = new Date(`${key}T12:00:00`);
    if (previous) {
      const diffDays = Math.round((date - previous) / (1000 * 60 * 60 * 24));
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = date;
  }

  return { current, longest, activeDays: activeDays.size };
}

export function scoreColor(percent) {
  if (percent >= 75) return "var(--color-success)";
  if (percent >= 50) return "var(--color-warning)";
  return "var(--color-error)";
}
