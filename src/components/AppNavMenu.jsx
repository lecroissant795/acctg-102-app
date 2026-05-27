import { MINI_QUIZ_SIZES } from "../constants/topicColors.js";
import { theme } from "../styles/theme.js";
import { SidebarDivider, SidebarItem, SidebarSection } from "./AppShell.jsx";

export function AppNavMenu({
  topics,
  practiceGroups,
  questions,
  totalQuestionCount,
  statsSummary,
  planLoading,
  user,
  onSignIn,
  onSignOut,
  onStartMini,
  onStartAll,
  onStartChapter,
  onStartPracticeGroup,
  onOpenStats,
  onNavigate,
}) {
  const wrap = (handler) => () => {
    handler();
    onNavigate?.();
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        <SidebarSection label="Quick Start">
          {MINI_QUIZ_SIZES.map((size) => (
            <SidebarItem
              key={size}
              icon="⚡"
              label={`Mini Quiz · ${size} Qs`}
              disabled={planLoading}
              onClick={wrap(() => onStartMini(size))}
            />
          ))}
          <SidebarItem
            icon="🎯"
            label={`Full Exam · ${totalQuestionCount} Qs`}
            disabled={planLoading}
            onClick={wrap(onStartAll)}
          />
        </SidebarSection>

        <SidebarDivider />

        <SidebarSection label="Chapters">
          {topics.map((topic, index) => (
            <SidebarItem
              key={topic}
              label={topic}
              badge={`${questions[topic].length}`}
              indent
              disabled={planLoading}
              onClick={wrap(() => onStartChapter(index))}
            />
          ))}
        </SidebarSection>

        <SidebarDivider />

        <SidebarSection label="Practice">
          {practiceGroups.map((group) => (
            <SidebarItem
              key={group.label}
              label={group.label}
              badge={`${questions[group.label].length}`}
              indent
              disabled={planLoading}
              onClick={wrap(() => onStartPracticeGroup(group.label))}
            />
          ))}
        </SidebarSection>

        {statsSummary.totalQuizzes > 0 && (
          <>
            <SidebarDivider />
            <SidebarSection>
              <SidebarItem
                icon="📊"
                label="Quiz Stats"
                badge={`${statsSummary.accuracy}%`}
                onClick={wrap(onOpenStats)}
              />
            </SidebarSection>
          </>
        )}
      </div>

      <div
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          padding: "10px 12px",
        }}
      >
        {user ? (
          <div>
            <div
              style={{
                fontSize: 12,
                color: theme.colors.textSecondary,
                padding: "4px 12px 6px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </div>
            <SidebarItem label="Sign out" onClick={wrap(onSignOut)} />
          </div>
        ) : (
          <SidebarItem icon="👤" label="Sign in" onClick={wrap(onSignIn)} />
        )}
      </div>
    </>
  );
}
