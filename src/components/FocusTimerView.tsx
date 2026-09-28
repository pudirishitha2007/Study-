import React from 'react';
import {
  CheckCircle2,
  Clock,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PomodoroSessionLog, SubjectItem } from '../types/study';

interface FocusTimerViewProps {
  subjects: SubjectItem[];
  timerSeconds: number;
  timerRunning: boolean;
  timerMode: 'study' | 'break';
  selectedSubject: string;
  selectedTask: string;
  pomodoroLogs: PomodoroSessionLog[];
  onStartPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: 'study' | 'break') => void;
  onChangeSubject: (subject: string) => void;
  onChangeTask: (task: string) => void;
  onCompleteSessionNow: () => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  subjects,
  timerSeconds,
  timerRunning,
  timerMode,
  selectedSubject,
  selectedTask,
  pomodoroLogs,
  onStartPause,
  onReset,
  onSwitchMode,
  onChangeSubject,
  onChangeTask,
  onCompleteSessionNow,
}) => {
  const totalSeconds = timerMode === 'study' ? 25 * 60 : 5 * 60;
  const elapsedPercent = Math.min(
    100,
    Math.max(0, Math.round(((totalSeconds - timerSeconds) / totalSeconds) * 100))
  );

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Pomodoro Clock Stage (7 cols) */}
      <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#6E56CF]">
            Pomodoro Focus Technique · 25m Study / 5m Break
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Calm Focus Timer
          </h1>
          <p className="text-sm text-slate-600 max-w-md">
            Focus deeply for 25 minutes on a single topic, then reward your brain with a guilt-free 5-minute recharge break.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F6F5FA] rounded-xl">
          <button
            type="button"
            onClick={() => onSwitchMode('study')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
              timerMode === 'study'
                ? 'bg-white text-[#4C35A9] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>25 Min Study</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode('break')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
              timerMode === 'break'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>5 Min Break</span>
          </button>
        </div>

        {/* Large Tabular Timer Display */}
        <div className="w-full max-w-md py-8 px-6 rounded-2xl bg-[#F6F5FA] space-y-5">
          <p className="text-6xl sm:text-7xl font-semibold font-mono tabular-nums text-slate-900 tracking-tight">
            {formatTimer(timerSeconds)}
          </p>

          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                timerMode === 'study' ? 'bg-[#6E56CF]' : 'bg-emerald-600'
              }`}
              style={{ width: `${elapsedPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-500">
            {timerRunning
              ? timerMode === 'study'
                ? `Studying ${selectedSubject}: ${selectedTask}`
                : 'Break time! Rest your eyes and stretch your shoulders.'
              : 'Press Start whenever you are ready to begin.'}
          </p>
        </div>

        {/* Large Start, Pause, Reset Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartPause}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white font-semibold text-base transition-colors cursor-pointer whitespace-nowrap"
          >
            {timerRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start {timerMode === 'study' ? 'Study Session' : 'Break'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#F6F5FA] hover:bg-slate-200/80 text-slate-700 font-semibold text-base transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Current Focus Goal & Session Log (5 cols) */}
      <aside className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 h-fit">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            What Are You Focusing On?
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => onChangeSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Topic or Goal for This 25-Min Block
              </label>
              <input
                type="text"
                value={selectedTask}
                onChange={(e) => onChangeTask(e.target.value)}
                placeholder="e.g., Read 3 pages of Virtual Memory notes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              />
            </div>

            <button
              type="button"
              onClick={onCompleteSessionNow}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F0FF] hover:bg-[#E4DDFB] text-[#4C35A9] text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Completed 25m Session to Progress Tracker</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6E56CF]" />
              <span>Recent Focus Sessions</span>
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {pomodoroLogs.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {pomodoroLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {log.taskTitle}
                  </p>
                  <p className="text-xs text-slate-500">
                    {log.subject} · {log.completedAt}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-xs font-semibold text-emerald-700 shrink-0">
                  {log.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
