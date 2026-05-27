import { MINI_QUIZ_SIZES, TOPIC_COLORS } from "../constants/topicColors.js";
import { theme, pageTitleStyle, sectionLabelStyle } from "../styles/theme.js";
import {
  AppShell,
  SidebarCollapseButton,
  SidebarDivider,
  SidebarItem,
  SidebarSection,
} from "./AppShell.jsx";

function Callout({ icon, title, description, children, variant = "default" }) {
  const bg =
    variant === "blue"
      ? theme.colors.calloutBlue
      : variant === "orange"
        ? theme.colors.calloutOrange
        : theme.colors.bgTertiary;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        padding: "16px 18px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: children ? 14 : 0 }}>
        {icon && <span style={{ fontSize: 20, lineHeight: 1.3 }}>{icon}</span>}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text }}>{title}</div>
          {description && (
            <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2, lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function DatabaseRow({ label, badge, accent, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 12px",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${theme.colors.border}`,
        color: theme.colors.text,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: 14,
        textAlign: "left",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = theme.colors.bgHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {accent && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: accent,
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
      {badge != null && (
        <span
          style={{
            fontSize: 12,
            color: theme.colors.textTertiary,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function DatabaseTable({ children }) {
  return (
    <div
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        marginBottom: 32,
      }}
    >
      {children}
    </div>
  );
}

function HomeSidebar({
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
}) {
  return (
    <>
      <div style={{ padding: "12px 14px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "4px 6px",
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 20 }}>📒</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text }}>
              ACCTG 102
            </span>
          </div>
          <SidebarCollapseButton />
        </div>
        <div style={{ fontSize: 12, color: theme.colors.textTertiary, paddingLeft: 34 }}>
          Exam Prep
        </div>
      </div>

      <SidebarDivider />

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        <SidebarSection label="Quick Start">
          {MINI_QUIZ_SIZES.map((size) => (
            <SidebarItem
              key={size}
              icon="⚡"
              label={`Mini Quiz · ${size} Qs`}
              disabled={planLoading}
              onClick={() => onStartMini(size)}
            />
          ))}
          <SidebarItem
            icon="🎯"
            label={`Full Exam · ${totalQuestionCount} Qs`}
            disabled={planLoading}
            onClick={onStartAll}
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
              onClick={() => onStartChapter(index)}
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
              onClick={() => onStartPracticeGroup(group.label)}
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
                onClick={onOpenStats}
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
            <SidebarItem label="Sign out" onClick={onSignOut} />
          </div>
        ) : (
          <SidebarItem icon="👤" label="Sign in" onClick={onSignIn} />
        )}
      </div>
    </>
  );
}

export function HomeScreen({
  topics,
  practiceGroups,
  questions,
  totalQuestionCount,
  totalPracticeQuestionCount,
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
}) {
  const sidebar = (
    <HomeSidebar
      topics={topics}
      practiceGroups={practiceGroups}
      questions={questions}
      totalQuestionCount={totalQuestionCount}
      statsSummary={statsSummary}
      planLoading={planLoading}
      user={user}
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      onStartMini={onStartMini}
      onStartAll={onStartAll}
      onStartChapter={onStartChapter}
      onStartPracticeGroup={onStartPracticeGroup}
      onOpenStats={onOpenStats}
    />
  );

  return (
    <AppShell sidebar={sidebar} footerAttribution>
      <header className="screen-header" style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <h1 className="page-title" style={pageTitleStyle}>ACCTG 102 Exam Prep</h1>
          <p
            className="page-subtitle"
            style={{
              color: theme.colors.textSecondary,
              marginTop: 8,
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            {totalQuestionCount} MCQs across {topics.length} chapters ·{" "}
            {totalPracticeQuestionCount} practice questions across {practiceGroups.length} types
          </p>
        </div>
      </header>

      {planLoading && (
        <Callout
          icon="⏳"
          title="Building your quiz..."
          description="Please wait a moment"
          variant="blue"
        />
      )}

      <Callout
        icon="⚡"
        title="Mini Quiz"
        description="Quick-fire MCQs across all chapters"
        variant="orange"
      >
        <div className="mini-quiz-buttons" style={{ display: "flex", gap: 8 }}>
          {MINI_QUIZ_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onStartMini(size)}
              disabled={planLoading}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: theme.colors.bg,
                border: `1px solid ${theme.colors.borderStrong}`,
                borderRadius: theme.radius.md,
                color: theme.colors.text,
                fontSize: 14,
                fontWeight: 500,
                cursor: planLoading ? "not-allowed" : "pointer",
                opacity: planLoading ? 0.5 : 1,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!planLoading) e.currentTarget.style.background = theme.colors.bgHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.colors.bg;
              }}
            >
              {size} questions
            </button>
          ))}
        </div>
      </Callout>

      <button
        type="button"
        onClick={onStartAll}
        disabled={planLoading}
        style={{
          width: "100%",
          padding: "10px 16px",
          marginBottom: 40,
          background: theme.colors.buttonPrimaryBg,
          color: theme.colors.buttonPrimaryText,
          border: "none",
          borderRadius: theme.radius.md,
          fontSize: 14,
          fontWeight: 500,
          cursor: planLoading ? "not-allowed" : "pointer",
          opacity: planLoading ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}
      >
        Start Full Exam — {totalQuestionCount} questions
      </button>

      {statsSummary.totalQuizzes > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={sectionLabelStyle}>Your progress</div>
          <button
            type="button"
            onClick={onOpenStats}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 14px",
              background: theme.colors.bgTertiary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.lg,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: theme.colors.text }}>
                {statsSummary.totalQuizzes} quizzes completed
              </div>
              <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                {statsSummary.accuracy}% accuracy · View detailed stats
              </div>
            </div>
            <span style={{ color: theme.colors.textTertiary, fontSize: 18 }}>→</span>
          </button>
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <div style={sectionLabelStyle}>MCQ Chapters</div>
      </div>
      <DatabaseTable>
        {topics.map((topic, index) => {
          const colors = TOPIC_COLORS[index % TOPIC_COLORS.length];
          return (
            <DatabaseRow
              key={topic}
              label={topic}
              badge={`${questions[topic].length} Qs`}
              accent={colors.accent}
              disabled={planLoading}
              onClick={() => onStartChapter(index)}
            />
          );
        })}
      </DatabaseTable>

      <div style={{ marginBottom: 8 }}>
        <div style={sectionLabelStyle}>Practice by Type</div>
      </div>
      <DatabaseTable>
        {practiceGroups.map((group) => (
          <DatabaseRow
            key={group.label}
            label={group.label}
            badge={`${questions[group.label].length} Qs`}
            accent={group.textColor}
            disabled={planLoading}
            onClick={() => onStartPracticeGroup(group.label)}
          />
        ))}
      </DatabaseTable>
    </AppShell>
  );
}
