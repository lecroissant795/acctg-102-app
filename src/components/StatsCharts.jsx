import { useMemo, useState } from "react";
import { TOPIC_COLORS } from "../constants/topicColors.js";
import { theme, sectionLabelStyle, cardStyle } from "../styles/theme.js";
import {
  buildModeBreakdown,
  buildScoreTrend,
  buildTopicStats,
  buildWeeklyActivity,
  computeStudyStreak,
  scoreColor,
} from "../utils/statsCharts.js";
import { formatDateTime } from "../utils/stats.js";

function ChartCard({ title, subtitle, children, style }) {
  return (
    <section
      style={{
        ...cardStyle,
        padding: "18px 16px",
        marginBottom: 0,
        ...style,
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 4 }}>{subtitle}</div>
        )}
      </div>
      {children}
    </section>
  );
}

function AccuracyRing({ accuracy, totalCorrect, totalIncorrect }) {
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (accuracy / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={radius * 2} height={radius * 2} style={{ flexShrink: 0 }}>
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={theme.colors.bgTertiary}
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={scoreColor(accuracy)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        <text
          x={radius}
          y={radius - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme.colors.text}
          fontSize="22"
          fontWeight="700"
        >
          {accuracy}%
        </text>
        <text
          x={radius}
          y={radius + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme.colors.textTertiary}
          fontSize="10"
        >
          accuracy
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: theme.colors.success }}>Points earned</span>
              <span style={{ color: theme.colors.textSecondary }}>{totalCorrect}</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: theme.radius.pill,
                background: theme.colors.bgTertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${totalCorrect + totalIncorrect > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0}%`,
                  background: theme.colors.success,
                  borderRadius: theme.radius.pill,
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: theme.colors.error }}>Points missed</span>
              <span style={{ color: theme.colors.textSecondary }}>{totalIncorrect}</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: theme.radius.pill,
                background: theme.colors.bgTertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${totalCorrect + totalIncorrect > 0 ? (totalIncorrect / (totalCorrect + totalIncorrect)) * 100 : 0}%`,
                  background: theme.colors.error,
                  borderRadius: theme.radius.pill,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StreakStats({ streak }) {
  const items = [
    { label: "Current streak", value: streak.current, suffix: streak.current === 1 ? "day" : "days", color: theme.colors.accent },
    { label: "Best streak", value: streak.longest, suffix: streak.longest === 1 ? "day" : "days", color: theme.colors.warning },
    { label: "Active days", value: streak.activeDays, suffix: "total", color: theme.colors.success },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            textAlign: "center",
            padding: "12px 8px",
            background: theme.colors.bgTertiary,
            borderRadius: theme.radius.lg,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1 }}>
            {item.value}
          </div>
          <div style={{ fontSize: 10, color: theme.colors.textTertiary, marginTop: 6 }}>{item.suffix}</div>
          <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function ScoreTrendChart({ trend }) {
  const [hovered, setHovered] = useState(null);
  const width = 560;
  const height = 160;
  const padding = { top: 16, right: 12, bottom: 28, left: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (trend.length === 0) return null;

  const points = trend.map((point, index) => {
    const x =
      trend.length === 1
        ? padding.left + chartWidth / 2
        : padding.left + (index / (trend.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (point.percent / 100) * chartHeight;
    return { ...point, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = padding.top + chartHeight - (tick / 100) * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={theme.colors.border}
                strokeDasharray={tick === 0 ? undefined : "4 4"}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill={theme.colors.textTertiary}
                fontSize="10"
              >
                {tick}%
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="var(--color-accent-bg)" />
        <path
          d={linePath}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((point) => (
          <circle
            key={point.index}
            cx={point.x}
            cy={point.y}
            r={hovered?.index === point.index ? 6 : 4}
            fill={scoreColor(point.percent)}
            stroke={theme.colors.bg}
            strokeWidth="2"
            onMouseEnter={() => setHovered(point)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "8px 10px",
            background: theme.colors.bgSecondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            fontSize: 11,
            color: theme.colors.textSecondary,
            pointerEvents: "none",
          }}
        >
          <div style={{ color: theme.colors.text, fontWeight: 600 }}>{hovered.percent}%</div>
          <div>{hovered.modeLabel}</div>
          <div>{formatDateTime(hovered.completedAt)}</div>
        </div>
      )}
    </div>
  );
}

function WeeklyActivityChart({ weeks }) {
  const maxCount = Math.max(...weeks.map((week) => week.count), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
      {weeks.map((week) => {
        const height = week.count > 0 ? Math.max((week.count / maxCount) * 88, 12) : 4;
        return (
          <div
            key={week.label}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <div
              title={
                week.avgScore != null
                  ? `${week.count} quizzes · ${week.avgScore}% avg`
                  : `${week.count} quizzes`
              }
              style={{
                width: "100%",
                maxWidth: 36,
                height,
                borderRadius: `${theme.radius.md}px ${theme.radius.md}px 0 0`,
                background:
                  week.count > 0
                    ? `linear-gradient(180deg, ${theme.colors.accent} 0%, var(--color-accent-bg) 100%)`
                    : theme.colors.bgTertiary,
                border: week.count > 0 ? `1px solid ${theme.colors.accentBorder}` : `1px solid ${theme.colors.border}`,
                transition: "height 0.25s ease",
              }}
            />
            <div style={{ fontSize: 9, color: theme.colors.textTertiary, textAlign: "center" }}>
              {week.label}
            </div>
            {week.avgScore != null && (
              <div style={{ fontSize: 9, color: theme.colors.textSecondary }}>{week.avgScore}%</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBarList({ items, maxValue, colorForIndex }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, index) => {
        const value = item.count ?? item.accuracy ?? 0;
        const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const color = colorForIndex ? colorForIndex(index) : theme.colors.accent;

        return (
          <div key={item.label ?? item.topic}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 11,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  color: theme.colors.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label ?? item.topic}
              </span>
              <span style={{ color: theme.colors.textSecondary, whiteSpace: "nowrap" }}>
                {item.count != null ? `${item.count} quiz${item.count === 1 ? "" : "zes"}` : `${item.accuracy}%`}
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: theme.radius.pill,
                background: theme.colors.bgTertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${width}%`,
                  background: color,
                  borderRadius: theme.radius.pill,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopicPerformanceChart({ topics }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {topics.map((topic, index) => {
        const palette = TOPIC_COLORS[index % TOPIC_COLORS.length];
        return (
          <div key={topic.topic}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: theme.colors.text, fontWeight: 500 }}>{topic.topic}</span>
              <span style={{ color: theme.colors.textSecondary, whiteSpace: "nowrap" }}>
                {topic.accuracy}% · {topic.incorrect} wrong
              </span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: theme.radius.pill,
                background: theme.colors.bgTertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${topic.accuracy}%`,
                  background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.border} 100%)`,
                  borderRadius: theme.radius.pill,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreDistribution({ sessions }) {
  const buckets = [
    { label: "90–100%", min: 90, color: theme.colors.success },
    { label: "75–89%", min: 75, color: theme.colors.accent },
    { label: "50–74%", min: 50, color: theme.colors.warning },
    { label: "Below 50%", min: 0, color: theme.colors.error },
  ];

  const counts = buckets.map((bucket, index) => {
    const max = index === 0 ? 101 : buckets[index - 1].min;
    const count = sessions.filter(
      (session) => session.scorePercent >= bucket.min && session.scorePercent < max
    ).length;
    return { ...bucket, count };
  });

  const maxCount = Math.max(...counts.map((bucket) => bucket.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {counts.map((bucket) => (
        <div key={bucket.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 72, fontSize: 11, color: theme.colors.textSecondary }}>{bucket.label}</div>
          <div
            style={{
              flex: 1,
              height: 22,
              background: theme.colors.bgTertiary,
              borderRadius: theme.radius.md,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(bucket.count / maxCount) * 100}%`,
                minWidth: bucket.count > 0 ? 8 : 0,
                background: bucket.color,
                borderRadius: theme.radius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
                transition: "width 0.3s ease",
              }}
            >
              {bucket.count > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.colors.bg }}>{bucket.count}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCharts({ summary }) {
  const chartData = useMemo(() => {
    const sessions = summary.sessions ?? [];
    return {
      trend: buildScoreTrend(sessions),
      topics: buildTopicStats(sessions),
      modes: buildModeBreakdown(sessions),
      weeks: buildWeeklyActivity(sessions),
      streak: computeStudyStreak(sessions),
    };
  }, [summary.sessions]);

  const maxModeCount = Math.max(...chartData.modes.map((mode) => mode.count), 1);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ ...sectionLabelStyle, marginBottom: 12 }}>Visual Overview</div>

      <div
        className="stats-charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <ChartCard title="Accuracy" subtitle="Points earned vs missed">
          <AccuracyRing
            accuracy={summary.accuracy}
            totalCorrect={summary.totalCorrect}
            totalIncorrect={summary.totalIncorrect}
          />
        </ChartCard>

        <ChartCard title="Study streak" subtitle="Keep the momentum going">
          <StreakStats streak={chartData.streak} />
        </ChartCard>
      </div>

      {chartData.trend.length >= 2 && (
        <ChartCard
          title="Score trend"
          subtitle={`Last ${chartData.trend.length} quizzes — hover for details`}
          style={{ marginBottom: 12 }}
        >
          <ScoreTrendChart trend={chartData.trend} />
        </ChartCard>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <ChartCard title="Weekly activity" subtitle="Quizzes per week (avg score below bar)">
          <WeeklyActivityChart weeks={chartData.weeks} />
        </ChartCard>

        <ChartCard title="Score distribution" subtitle="How your quizzes cluster">
          <ScoreDistribution sessions={summary.sessions} />
        </ChartCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {chartData.modes.length > 0 && (
          <ChartCard title="Quiz modes" subtitle="Where you spend your time">
            <HorizontalBarList
              items={chartData.modes}
              maxValue={maxModeCount}
              colorForIndex={(index) => TOPIC_COLORS[index % TOPIC_COLORS.length].accent}
            />
          </ChartCard>
        )}

        {chartData.topics.length > 0 && (
          <ChartCard title="Topic performance" subtitle="Accuracy by chapter/topic">
            <TopicPerformanceChart topics={chartData.topics} />
          </ChartCard>
        )}
      </div>
    </div>
  );
}
