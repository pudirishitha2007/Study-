import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Target,
  Trophy,
} from 'lucide-react';
import {
  PomodoroSessionLog,
  QuizAttempt,
  StudyPlanData,
  SubjectItem,
} from '../types/study';

interface ProgressTrackerViewProps {
  subjects: SubjectItem[];
  studyPlan: StudyPlanData;
  quizHistory: QuizAttempt[];
  pomodoroLogs: PomodoroSessionLog[];
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onAddTopic: (subjectId: string, title: string) => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  subjects,
  studyPlan,
  quizHistory,
  pomodoroLogs,
  onToggleTopic,
  onAddTopic,
}) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');

  const allTopics = subjects.flatMap((s) => s.topics);
  const completedTopics = allTopics.filter((t) => t.completed).length;
  const totalTopics = allTopics.length;
  const overallTopicPct =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const completedPlanBlocks = studyPlan.dailyBlocks.filter(
    (b) => b.completed
  ).length;
  const totalPlanBlocks = studyPlan.dailyBlocks.length;
  const planPct =
    totalPlanBlocks > 0
      ? Math.round((completedPlanBlocks / totalPlanBlocks) * 100)
      : 0;

  const avgQuizScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + q.percentage, 0) /
            quizHistory.length
        )
      : 0;

  const totalFocusMinutes = pomodoroLogs.reduce(
    (acc, log) => acc + log.durationMinutes,
    0
  );

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedSubId) return;
    onAddTopic(selectedSubId, newTopicTitle.trim());
    setNewTopicTitle('');
  };

  return (
    <div className="space-y-8">
      {/* Top Progress Summary Card */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#6E56CF]">
            Celebrate Every Small Win · Visual Study Milestones
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Your Study Progress Tracker
          </h1>
          <p className="text-sm text-slate-600">
            Track your completed study sessions, quiz scores, and syllabus topics across every subject.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Topics Mastered</p>
            <p className="text-3xl font-semibold font-mono tabular-nums text-slate-900 mt-1">
              {completedTopics}/{totalTopics}{' '}
              <span className="text-base text-[#6E56CF]">({overallTopicPct}%)</span>
            </p>
            <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#6E56CF] rounded-full"
                style={{ width: `${overallTopicPct}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500">Today’s Study Sessions</p>
            <p className="text-3xl font-semibold font-mono tabular-nums text-slate-900 mt-1">
              {completedPlanBlocks}/{totalPlanBlocks}{' '}
              <span className="text-base text-[#6E56CF]">({planPct}%)</span>
            </p>
            <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#6E56CF] rounded-full"
                style={{ width: `${planPct}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500">Average Quiz Accuracy</p>
            <p className="text-3xl font-semibold font-mono tabular-nums text-slate-900 mt-1">
              {avgQuizScore}%
            </p>
            <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${avgQuizScore}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500">Pomodoro Focus Time</p>
            <p className="text-3xl font-semibold font-mono tabular-nums text-slate-900 mt-1">
              {totalFocusMinutes}m
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Across {pomodoroLogs.length} completed focus sessions
            </p>
          </div>
        </div>
      </section>

      {/* Subject-by-Subject Syllabus Checklist & Add Topic */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6E56CF]" />
              <span>Subjects & Topics Completed</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any topic checkbox as you finish studying it
            </p>
          </div>

          <form onSubmit={handleAddCustomTopic} className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSubId}
              onChange={(e) => setSelectedSubId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#F6F5FA] border border-slate-200 text-xs font-medium text-slate-800"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Add a new topic..."
              className="px-3 py-2 rounded-lg bg-[#F6F5FA] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#6E56CF] hover:bg-[#5B43B8] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((sub) => {
            const doneCount = sub.topics.filter((t) => t.completed).length;
            const totalCount = sub.topics.length;
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

            return (
              <div key={sub.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {sub.difficulty} · <span className="font-mono tabular-nums">{doneCount}/{totalCount}</span> topics done
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#5B43B8]">
                    {pct}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#F3F0FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6E56CF] rounded-full transition-all duration-200"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="divide-y divide-slate-100 pt-1">
                  {sub.topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onToggleTopic(sub.id, topic.id)}
                      className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-[#F6F5FA]/70 px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {topic.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span
                          className={`text-sm truncate ${
                            topic.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {topic.title}
                        </span>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                        {topic.completed ? 'Done' : `${topic.estimatedMinutes}m`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quiz Scores & Completed Pomodoro Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quiz Score History Bar Chart (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#6E56CF]" />
                <span>Quiz Scores History</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your recent multiple-choice quiz performances
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {quizHistory.map((attempt) => (
              <div key={attempt.id} className="py-3.5 first:pt-1 last:pb-1 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold text-slate-900">
                      {attempt.topic}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      {attempt.subject} · {attempt.dateLabel}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#5B43B8]">
                    {attempt.score}/{attempt.total} ({attempt.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F6F5FA] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      attempt.percentage >= 80 ? 'bg-emerald-600' : 'bg-[#6E56CF]'
                    }`}
                    style={{ width: `${attempt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed Focus Sessions Log (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6E56CF]" />
              <span>Completed Study Sessions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged Pomodoro sessions and focus blocks
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {pomodoroLogs.map((log) => (
              <div
                key={log.id}
                className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {log.taskTitle}
                  </p>
                  <p className="text-xs text-slate-500">
                    {log.subject} · {log.completedAt}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-xs font-semibold text-emerald-700 shrink-0">
                  +{log.durationMinutes} min
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
