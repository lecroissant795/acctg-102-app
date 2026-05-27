import { useState } from "react";
import {
  buildContributionGrid,
  CONTRIBUTION_COLORS,
  formatContributionTooltip,
} from "../utils/contributions.js";
import { theme } from "../styles/theme.js";

function ContributionCell({ day, onHover }) {
  const tooltip = formatContributionTooltip(day);

  return (
    <div
      role="gridcell"
      title={tooltip}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(day)}
      onBlur={() => onHover(null)}
      tabIndex={day.isFuture ? -1 : 0}
      style={{
        width: 11,
        height: 11,
        borderRadius: 2,
        background: day.isFuture ? "transparent" : CONTRIBUTION_COLORS[day.level],
        border: day.isFuture ? "1px solid transparent" : `1px solid ${theme.colors.border}`,
        flexShrink: 0,
        cursor: day.isFuture ? "default" : "pointer",
      }}
    />
  );
}

export function ContributionGraph({ sessions }) {
  const grid = buildContributionGrid(sessions);
  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <section
      style={{
        marginBottom: 28,
        padding: "18px 16px",
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          <strong style={{ color: theme.colors.text, fontWeight: 600 }}>{grid.totalInRange}</strong>{" "}
          {grid.totalInRange === 1 ? "quiz" : "quizzes"} in the last year
        </div>
        {hoveredDay && (
          <div style={{ fontSize: 12, color: theme.colors.textTertiary }}>
            {formatContributionTooltip(hoveredDay)}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ minWidth: 720 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px repeat(53, 13px)",
              gap: "2px 2px",
              marginBottom: 4,
              paddingLeft: 2,
            }}
          >
            <div />
            {grid.monthLabels.map((label, index) => (
              <div
                key={`month-${index}`}
                style={{
                  fontSize: 10,
                  color: theme.colors.textTertiary,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingTop: 1,
                width: 32,
                flexShrink: 0,
              }}
            >
              {grid.dayLabels.map((label, index) => (
                <div
                  key={`day-label-${index}`}
                  style={{
                    height: 11,
                    fontSize: 9,
                    color: theme.colors.textTertiary,
                    lineHeight: "11px",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div
              role="grid"
              aria-label="Quiz activity in the last year"
              style={{ display: "flex", gap: 2 }}
            >
              {grid.weeks.map((week, weekIndex) => (
                <div
                  key={`week-${weekIndex}`}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {week.days.map((day) => (
                    <ContributionCell
                      key={day.dateKey}
                      day={day}
                      onHover={setHoveredDay}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 12,
          fontSize: 10,
          color: theme.colors.textTertiary,
        }}
      >
        <span>Less</span>
        {CONTRIBUTION_COLORS.map((color, index) => (
          <div
            key={`legend-${index}`}
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: color,
              border: `1px solid ${theme.colors.border}`,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
