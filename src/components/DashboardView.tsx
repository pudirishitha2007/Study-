import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import {
  NavTab,
  PomodoroSessionLog,
  QuizAttempt,
  StudyPlanData,
  SubjectItem,
} from '../types/study';

interface DashboardViewProps {
  studentName: string;
  subjects: SubjectItem[];
  studyPlan: StudyPlanData;
  quizHistory: QuizAttempt[];
  pomodoroLogs: PomodoroSessionLog[];
  onNavigate: (tab: NavTab) => void;
  onToggleStudyBlock: (blockId: string) => void;
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onQuickAskTopic: (subject: string, topicTitle: string) => void;
  onQuickQuizTopic: (subject: string, topicTitle: string) => void;
  // Shared Pomodoro timer state
  timerSeconds: number;
  timerRunning: boolean;
  timerMode: 'study' | 'break';
  onStartPauseTimer: () => void;
  onResetTimer: () => void;
  onSwitchTimerMode: (mode: 'study' | 'break') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studentName,
  subjects,
  studyPlan,
  quizHistory,
  pomodoroLogs,
  onNavigate,
  onToggleStudyBlock,
  onToggleTopic,
  onQuickAskTopic,
  onQuickQuizTopic,
  timerSeconds,
  timerRunning,
  timerMode,
  onStartPauseTimer,
  onResetTimer,
  onSwitchTimerMode,
}) => {
  // Compute overall topic completion
  const allTopics = subjects.flatMap((s) =>
    s.topics.map((t) => ({ ...t, subjectId: s.id, subjectName: s.name, difficulty: s.difficulty }))
  );
  const completedTopicsCount = allTopics.filter((t) => t.completed).length;
  const totalTopicsCount = allTopics.length;
  const overallProgressPercent =
    totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  const pendingTopics = allTopics.filter((t) => !t.completed);

  // Compute study plan completion today
  const completedBlocksCount = studyPlan.dailyBlocks.filter((b) => b.completed).length;
  const totalBlocksCount = studyPlan.dailyBlocks.length;

  // Compute average quiz score
  const avgQuizPercentage =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length
        )
      : 0;

  const latestQuiz = quizHistory[quizHistory.length - 1];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Good Morning Hero Banner + Primary "Ask Your Study Buddy" CTA */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#6E56CF] tracking-wide">
            Daily Study Companion · Let’s take it one step at a time
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Good morning, {studentName}! Ready for a calm, focused study day?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            You have completed <span className="font-mono font-medium text-slate-900">{completedTopicsCount}/{totalTopicsCount}</span> core topics across your subjects. Whenever a concept feels confusing, ask me—I will explain it in plain English with everyday examples.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('ask')}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Your Study Buddy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F3F0FF] hover:bg-[#E7E0FF] text-[#4C35A9] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Practice Quiz</span>
          </button>
        </div>
      </section>

      {/* Key Study Progress, Quiz Score, and Focus Timer Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Study Progress & Quiz Score Summary (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Study Progress & Quiz Score
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Steady daily progress matters much more than cramming all at once
              </p>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-[#6E56CF] hover:text-[#4C35A9] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Full Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate-700">Overall Syllabus Completion</span>
              <span className="font-mono font-semibold text-[#5B43B8] tabular-nums">
                {overallProgressPercent}% ({completedTopicsCount} of {totalTopicsCount} topics)
              </span>
            </div>
            <div className="w-full h-3 bg-[#F3F0FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6E56CF] rounded-full transition-transform duration-200 origin-left"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
          </div>

          {/* 3 Clean Metric Columns separated by hairlines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 pt-4 border-t border-slate-100 gap-4 sm:gap-0 sm:divide-x sm:divide-slate-100">
            <div className="sm:pr-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Trophy className="w-4 h-4 text-[#6E56CF]" />
                <span>Average Quiz Score</span>
              </div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1.5">
                {avgQuizPercentage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {latestQuiz
                  ? `Latest: ${latestQuiz.score}/${latestQuiz.total} in ${latestQuiz.subject}`
                  : 'No quizzes taken yet'}
              </p>
            </div>

            <div className="sm:px-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Target className="w-4 h-4 text-[#6E56CF]" />
                <span>Today’s Plan Progress</span>
              </div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1.5">
                {completedBlocksCount}/{totalBlocksCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Scheduled blocks completed today
              </p>
            </div>

            <div className="sm:pl-5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-[#6E56CF]" />
                <span>Focus Sessions Logged</span>
              </div>
              <p className="text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1.5">
                {pomodoroLogs.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-mono tabular-nums">
                  {pomodoroLogs.reduce((acc, s) => acc + s.durationMinutes, 0)}
                </span>{' '}
                mins total deep focus
              </p>
            </div>
          </div>
        </section>

        {/* Quick Focus Timer Card (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Focus Timer</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                25 min study · 5 min brain break
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F6F5FA] p-1 rounded-lg">
              <button
                onClick={() => onSwitchTimerMode('study')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'study'
                    ? 'bg-white text-[#4C35A9] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                25m Study
              </button>
              <button
                onClick={() => onSwitchTimerMode('break')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  timerMode === 'break'
                    ? 'bg-white text-[#4C35A9] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5m Break
              </button>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between gap-4 border-y border-slate-100">
            <div>
              <p className="text-4xl sm:text-5xl font-semibold font-mono tabular-nums text-slate-900 tracking-tight">
                {formatTimer(timerSeconds)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {timerRunning
                  ? timerMode === 'study'
                    ? 'Stay focused—you’ve got this!'
                    : 'Relax your eyes and stretch.'
                  : timerMode === 'study'
                  ? 'Ready for a 25-minute focus sprint'
                  : 'Ready for a 5-minute recharge break'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onStartPauseTimer}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </>
                )}
              </button>
              <button
                onClick={onResetTimer}
                aria-label="Reset Timer"
                className="p-3 rounded-xl bg-[#F6F5FA] hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pomodoro Technique keeps fatigue away</span>
            <button
              onClick={() => onNavigate('timer')}
              className="font-semibold text-[#6E56CF] hover:text-[#4C35A9] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Open Full Timer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Main Two-Column Grid: Today's Study Plan & Pending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Study Plan (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Today’s Study Plan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {studyPlan.planTitle} · Click any session to mark complete
              </p>
            </div>
            <button
              onClick={() => onNavigate('plan')}
              className="px-3.5 py-2 rounded-lg bg-[#F3F0FF] hover:bg-[#E7E0FF] text-[#4C35A9] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Customize Plan
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {studyPlan.dailyBlocks.map((block) => {
              const isBreak = block.blockType === 'break';
              return (
                <div
                  key={block.id}
                  onClick={() => onToggleStudyBlock(block.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleStudyBlock(block.id);
                    }
                  }}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3.5 group cursor-pointer hover:bg-[#F6F5FA]/60 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <span className="mt-0.5 text-[#6E56CF] shrink-0">
                    {block.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-[#6E56CF]" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-mono tabular-nums font-medium text-slate-700">
                        {block.timeRange}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={isBreak ? 'text-emerald-700 font-medium' : 'text-[#5B43B8] font-medium'}>
                        {block.subject}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{block.durationMinutes} min</span>
                      <span aria-hidden="true">·</span>
                      <span>{block.difficultyTag}</span>
                    </div>

                    <p
                      className={`text-sm font-medium mt-1 ${
                        block.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      }`}
                    >
                      {block.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tip: {block.actionTip}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pending Topics & Quick Actions (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pending Topics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off as you finish, or ask your Study Buddy to explain
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {pendingTopics.length} remaining
            </span>
          </div>

          {pendingTopics.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-medium text-emerald-700">
                Amazing job! You have completed all listed topics!
              </p>
              <p className="text-xs text-slate-500">
                Head to Quiz Mode or Exam Prep to test your memory.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTopic(topic.subjectId, topic.id)}
                      aria-label={`Mark ${topic.title} as completed`}
                      className="mt-0.5 text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    >
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span>{topic.subjectName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{topic.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">~{topic.estimatedMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onQuickAskTopic(topic.subjectName, topic.title)}
                      title="Ask Study Buddy to explain this topic simply"
                      className="px-2.5 py-1.5 rounded-lg bg-[#F3F0FF] hover:bg-[#E4DDFB] text-[#4C35A9] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Explain</span>
                    </button>
                    <button
                      onClick={() => onQuickQuizTopic(topic.subjectName, topic.title)}
                      title="Take a quick quiz on this topic"
                      className="px-2.5 py-1.5 rounded-lg bg-[#F6F5FA] hover:bg-slate-200/70 text-slate-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Subjects Overview Section */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Your Subjects
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track progress by subject and jump into 3/5/10-mark exam prep
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap"
            >
              Summarize Notes
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('exam')}
              className="text-xs font-semibold text-[#6E56CF] hover:text-[#4C35A9] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Exam Preparation (3/5/10 Marks)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-2 border-t border-slate-100">
          {subjects.map((sub) => {
            const done = sub.topics.filter((t) => t.completed).length;
            const total = sub.topics.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={sub.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#6E56CF] shrink-0" />
                      <span>{sub.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sub.difficulty} · Exam <span className="font-mono tabular-nums">{sub.examDate}</span>
                    </p>
                  </div>
                  <span className="text-sm font-mono font-semibold tabular-nums text-[#5B43B8]">
                    {pct}%
                  </span>
                </div>

                <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6E56CF] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono tabular-nums">
                    {done}/{total} topics completed
                  </span>
                  <button
                    onClick={() => {
                      const nextTopic = sub.topics.find((t) => !t.completed) || sub.topics[0];
                      if (nextTopic) {
                        onQuickAskTopic(sub.name, nextTopic.title);
                      }
                    }}
                    className="font-medium text-[#6E56CF] hover:text-[#4C35A9] cursor-pointer whitespace-nowrap"
                  >
                    Study Next →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
