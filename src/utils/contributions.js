const WEEKS = 53;
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const CONTRIBUTION_COLORS = [
  "var(--color-contrib-0)",
  "var(--color-contrib-1)",
  "var(--color-contrib-2)",
  "var(--color-contrib-3)",
  "var(--color-contrib-4)",
];

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getContributionLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function countSessionsByDate(sessions) {
  const counts = new Map();

  for (const session of sessions) {
    if (!session.completedAt) continue;
    const key = toLocalDateKey(new Date(session.completedAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function getMondayOfWeek(date) {
  const monday = startOfDay(date);
  const dayOfWeek = monday.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  monday.setDate(monday.getDate() - daysFromMonday);
  return monday;
}

export function buildContributionGrid(sessions, referenceDate = new Date()) {
  const today = startOfDay(referenceDate);
  const countsByDate = countSessionsByDate(sessions);
  const currentWeekMonday = getMondayOfWeek(today);
  const startDate = new Date(currentWeekMonday);
  startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7);

  const weeks = [];
  let totalInRange = 0;
  const current = new Date(startDate);

  for (let week = 0; week < WEEKS; week++) {
    const days = [];

    for (let day = 0; day < 7; day++) {
      const key = toLocalDateKey(current);
      const isFuture = current > today;
      const count = isFuture ? 0 : (countsByDate.get(key) ?? 0);

      if (!isFuture) totalInRange += count;

      days.push({
        date: new Date(current),
        dateKey: key,
        count,
        level: isFuture ? 0 : getContributionLevel(count),
        isFuture,
      });

      current.setDate(current.getDate() + 1);
    }

    weeks.push({ days });
  }

  const monthLabels = weeks.map((week, index) => {
    const firstDay = week.days[0].date;
    const prevWeek = weeks[index - 1]?.days[0]?.date;
    const isFirstWeek = index === 0;
    const monthChanged = !prevWeek || firstDay.getMonth() !== prevWeek.getMonth();
    const isFirstOfMonth = firstDay.getDate() <= 7;

    if (isFirstWeek || (monthChanged && isFirstOfMonth)) {
      return MONTH_LABELS[firstDay.getMonth()];
    }

    return "";
  });

  return {
    weeks,
    dayLabels: DAY_LABELS,
    monthLabels,
    totalInRange,
  };
}

export function formatContributionTooltip(day) {
  if (day.isFuture) return "";
  const label = day.date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (day.count === 0) return `No quizzes on ${label}`;
  if (day.count === 1) return `1 quiz on ${label}`;
  return `${day.count} quizzes on ${label}`;
}
