import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Coffee,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { StudyBlock, StudyPlanData, SubjectItem } from '../types/study';

interface StudyPlanViewProps {
  subjects: SubjectItem[];
  studyPlan: StudyPlanData;
  onUpdateStudyPlan: (plan: StudyPlanData) => void;
  onToggleStudyBlock: (blockId: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  subjects,
  studyPlan,
  onUpdateStudyPlan,
  onToggleStudyBlock,
}) => {
  const [subjectsInput, setSubjectsInput] = useState(
    subjects.map((s) => s.name).join(', ')
  );
  const [examDate, setExamDate] = useState(studyPlan.examDate || '2026-10-18');
  const [availableHours, setAvailableHours] = useState<number>(
    studyPlan.availableHours || 4
  );
  const [difficultSubjects, setDifficultSubjects] = useState(
    studyPlan.difficultSubjects || 'Operating Systems, Linear Algebra & Calculus'
  );
  const [easySubjects, setEasySubjects] = useState(
    studyPlan.easySubjects || 'Cognitive Psychology, Database Systems'
  );
  const [startTime, setStartTime] = useState('09:00 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-buddy/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: subjectsInput,
          examDate,
          availableHours,
          difficultSubjects,
          easySubjects,
          startTime,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not generate study plan.');
      }

      const blocks: StudyBlock[] = (data.dailyBlocks || []).map(
        (b: any, index: number) => ({
          id: b.id || `blk-${Date.now()}-${index}`,
          timeRange: b.timeRange,
          title: b.title,
          subject: b.subject,
          blockType:
            b.blockType === 'break' || b.blockType === 'revision'
              ? b.blockType
              : 'study',
          difficultyTag: b.difficultyTag || 'Balanced Focus',
          durationMinutes: Number(b.durationMinutes) || 40,
          actionTip: b.actionTip || 'Take steady notes and focus on one step at a time.',
          completed: false,
        })
      );

      onUpdateStudyPlan({
        planTitle: data.planTitle || 'Personalized Exam Study Timetable',
        encouragementMessage:
          data.encouragementMessage ||
          "Here is your realistic daily schedule! Remember to honor the short breaks so your mind stays fresh.",
        strategyTip:
          data.strategyTip ||
          'Start with difficult subjects when your energy is highest, followed by short breaks.',
        examDate,
        availableHours,
        difficultSubjects,
        easySubjects,
        dailyBlocks: blocks,
        examCountdownPhases: data.examCountdownPhases || studyPlan.examCountdownPhases,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to build your timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = studyPlan.dailyBlocks.filter((b) => b.completed).length;
  const totalCount = studyPlan.dailyBlocks.length;

  return (
    <div className="space-y-8">
      {/* Top Planner Form Card */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#6E56CF]">
            Realistic Pacing · Built-in Short Breaks
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Smart Daily Study Plan Generator
          </h1>
          <p className="text-sm text-slate-600">
            Tell me your subjects, exam date, how many hours you can realistically study each day, and which subjects feel tough vs. easy. I will build a balanced timetable that prevents burnout.
          </p>
        </div>

        <form onSubmit={handleGeneratePlan} className="space-y-5 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                1. Your Subjects (comma-separated)
              </label>
              <input
                type="text"
                required
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="e.g., Operating Systems, Database Systems, Linear Algebra, Psychology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                2. Target Exam Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                3. Difficult Subjects (Need Extra Focus)
              </label>
              <input
                type="text"
                required
                value={difficultSubjects}
                onChange={(e) => setDifficultSubjects(e.target.value)}
                placeholder="e.g., Operating Systems, Linear Algebra"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                4. Easy Subjects (Lighter Review)
              </label>
              <input
                type="text"
                required
                value={easySubjects}
                onChange={(e) => setEasySubjects(e.target.value)}
                placeholder="e.g., Cognitive Psychology, Database Systems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  5. Daily Study Hours
                </label>
                <select
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
                >
                  {[2, 3, 4, 5, 6, 8].map((hr) => (
                    <option key={hr} value={hr}>
                      {hr} hrs / day
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
                >
                  {['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '06:00 PM'].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Includes automatic 10–15 minute brain breaks between deep focus blocks.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Timetable...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Daily Timetable</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}
      </section>

      {/* Generated Timetable & Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Timetable Schedule (8 cols) */}
        <section className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {studyPlan.planTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exam Target: <span className="font-mono tabular-nums">{studyPlan.examDate}</span> ·{' '}
                <span className="font-mono tabular-nums">{studyPlan.availableHours}h</span> daily commitment
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-[#5B43B8]">
              {completedCount}/{totalCount} blocks done
            </span>
          </div>

          {/* Buddy Encouragement Note */}
          <div className="p-4 rounded-xl bg-[#F3F0FF] text-[#3D2C8D] space-y-1">
            <p className="text-sm font-medium">{studyPlan.encouragementMessage}</p>
            <p className="text-xs text-[#5B43B8]">
              Strategy: {studyPlan.strategyTip}
            </p>
          </div>

          {/* Schedule Rows */}
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
                  className={`py-4 first:pt-1 last:pb-1 flex items-start gap-4 cursor-pointer rounded-xl -mx-2 px-2 transition-colors ${
                    isBreak ? 'bg-[#F6F5FA]/70 hover:bg-[#F6F5FA]' : 'hover:bg-[#F6F5FA]/50'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {block.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isBreak ? (
                      <Coffee className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-mono tabular-nums font-semibold text-slate-800">
                        {block.timeRange}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          isBreak
                            ? 'text-amber-700 font-semibold'
                            : 'text-[#5B43B8] font-semibold'
                        }
                      >
                        {block.subject}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {block.durationMinutes} mins
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{block.difficultyTag}</span>
                    </div>

                    <h3
                      className={`text-base font-semibold ${
                        block.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {block.title}
                    </h3>

                    <p className="text-xs text-slate-600">
                      Study Buddy Tip: {block.actionTip}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Exam Countdown Phases & Balance Summary (4 cols) */}
        <aside className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 h-fit">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6E56CF]" />
              <span>Exam Countdown Roadmap</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              How to pace yourself calmly until exam day
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {studyPlan.examCountdownPhases.map((phase, idx) => (
              <div key={phase.phaseName} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#5B43B8]">
                    0{idx + 1}. {phase.phaseName}
                  </span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {phase.timeframe}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {phase.focusDescription}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6E56CF]" />
              <span>Subject Difficulty Balance</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">High-Focus Morning: </span>
                <span>{studyPlan.difficultSubjects}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Lighter Afternoon Review: </span>
                <span>{studyPlan.easySubjects}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
