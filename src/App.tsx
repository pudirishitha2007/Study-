/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import {
  DoubtResponse,
  ExamPrepGuide,
  NavTab,
  NotesSummary,
  PomodoroSessionLog,
  QuizAttempt,
  StudyPlanData,
  SubjectItem,
} from './types/study';
import {
  INITIAL_DOUBTS,
  INITIAL_EXAM_PREP,
  INITIAL_NOTES_SUMMARY,
  INITIAL_POMODORO_LOGS,
  INITIAL_QUIZ_DATA,
  INITIAL_QUIZ_HISTORY,
  INITIAL_STUDY_PLAN,
  INITIAL_SUBJECTS,
} from './data/initialData';
import { DashboardView } from './components/DashboardView';
import { AskDoubtView } from './components/AskDoubtView';
import { StudyPlanView } from './components/StudyPlanView';
import { QuizModeView } from './components/QuizModeView';
import { NotesSummarizerView } from './components/NotesSummarizerView';
import { ExamPrepView } from './components/ExamPrepView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { FocusTimerView } from './components/FocusTimerView';

const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ask', label: 'Ask Doubt', icon: HelpCircle },
  { id: 'plan', label: 'Study Plan', icon: Calendar },
  { id: 'quiz', label: 'Quiz', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'exam', label: 'Exam Prep', icon: Award },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'timer', label: 'Focus Timer', icon: Clock },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [studentName] = useState<string>('Alex');

  // Persistent state with localStorage fallback
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlanData>(() => {
    try {
      const saved = localStorage.getItem('lumina_study_plan');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_PLAN;
    } catch {
      return INITIAL_STUDY_PLAN;
    }
  });

  const [doubts, setDoubts] = useState<DoubtResponse[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_doubts');
      return saved ? JSON.parse(saved) : INITIAL_DOUBTS;
    } catch {
      return INITIAL_DOUBTS;
    }
  });

  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_quiz_history');
      return saved ? JSON.parse(saved) : INITIAL_QUIZ_HISTORY;
    } catch {
      return INITIAL_QUIZ_HISTORY;
    }
  });

  const [summaries, setSummaries] = useState<NotesSummary[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_summaries');
      return saved ? JSON.parse(saved) : [INITIAL_NOTES_SUMMARY];
    } catch {
      return [INITIAL_NOTES_SUMMARY];
    }
  });

  const [examGuides, setExamGuides] = useState<ExamPrepGuide[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_exam_guides');
      return saved ? JSON.parse(saved) : [INITIAL_EXAM_PREP];
    } catch {
      return [INITIAL_EXAM_PREP];
    }
  });

  const [pomodoroLogs, setPomodoroLogs] = useState<PomodoroSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_pomo_logs');
      return saved ? JSON.parse(saved) : INITIAL_POMODORO_LOGS;
    } catch {
      return INITIAL_POMODORO_LOGS;
    }
  });

  // Prefill state when clicking "Explain" or "Quiz" from Dashboard Pending Topics
  const [prefillAsk, setPrefillAsk] = useState<{
    subject?: string;
    question?: string;
  }>({});
  const [prefillQuiz, setPrefillQuiz] = useState<{
    subject?: string;
    topic?: string;
  }>({});

  // Global Pomodoro Timer State (25 min study / 5 min break)
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSubject, setTimerSubject] = useState<string>('Operating Systems');
  const [timerTask, setTimerTask] = useState<string>(
    'Virtual Memory & Page Replacement'
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_subjects', JSON.stringify(subjects));
    } catch {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_study_plan', JSON.stringify(studyPlan));
    } catch {}
  }, [studyPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_doubts', JSON.stringify(doubts));
    } catch {}
  }, [doubts]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_quiz_history', JSON.stringify(quizHistory));
    } catch {}
  }, [quizHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_summaries', JSON.stringify(summaries));
    } catch {}
  }, [summaries]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_exam_guides', JSON.stringify(examGuides));
    } catch {}
  }, [examGuides]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_pomo_logs', JSON.stringify(pomodoroLogs));
    } catch {}
  }, [pomodoroLogs]);

  // Pomodoro interval effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          if (timerMode === 'study') {
            setPomodoroLogs((logs) => [
              {
                id: `pomo-${Date.now()}`,
                subject: timerSubject,
                taskTitle: timerTask || 'Focused Study Block',
                durationMinutes: 25,
                completedAt: 'Just now',
                mode: 'study',
              },
              ...logs,
            ]);
            setTimerMode('break');
            return 5 * 60;
          } else {
            setTimerMode('study');
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, timerMode, timerSubject, timerTask]);

  const handleToggleStudyBlock = (blockId: string) => {
    setStudyPlan((prev) => ({
      ...prev,
      dailyBlocks: prev.dailyBlocks.map((b) =>
        b.id === blockId ? { ...b, completed: !b.completed } : b
      ),
    }));
  };

  const handleToggleTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === subjectId
          ? {
              ...sub,
              topics: sub.topics.map((t) =>
                t.id === topicId ? { ...t, completed: !t.completed } : t
              ),
            }
          : sub
      )
    );
  };

  const handleAddTopic = (subjectId: string, title: string) => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === subjectId
          ? {
              ...sub,
              topics: [
                ...sub.topics,
                {
                  id: `top-${Date.now()}`,
                  title,
                  completed: false,
                  estimatedMinutes: 35,
                },
              ],
            }
          : sub
      )
    );
  };

  const handleQuickAskTopic = (subject: string, topicTitle: string) => {
    setPrefillAsk({
      subject,
      question: `Explain "${topicTitle}" in ${subject} in very simple English with a real-life analogy and step-by-step points.`,
    });
    setActiveTab('ask');
  };

  const handleQuickQuizTopic = (subject: string, topicTitle: string) => {
    setPrefillQuiz({ subject, topic: topicTitle });
    setActiveTab('quiz');
  };

  const handleSwitchTimerMode = (mode: 'study' | 'break') => {
    setTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const handleCompleteSessionManual = () => {
    setPomodoroLogs((logs) => [
      {
        id: `pomo-${Date.now()}`,
        subject: timerSubject,
        taskTitle: timerTask || 'Focused Study Session',
        durationMinutes: 25,
        completedAt: 'Just now',
        mode: 'study',
      },
      ...logs,
    ]);
  };

  const formatMiniTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F6F5FA] text-slate-900">
      {/* Desktop Left Sidebar Navigation */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/90 justify-between p-5">
        <div className="space-y-6">
          {/* Brand Wordmark */}
          <div className="px-2 pt-1 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xl font-semibold tracking-tight text-slate-900 font-display flex items-center gap-2.5 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-xl bg-[#6E56CF] text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </span>
              <span>Lumina Buddy</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F3F0FF] text-[#4C35A9] font-semibold'
                      : 'text-slate-600 hover:bg-[#F6F5FA] hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#6E56CF]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Ask Study Buddy CTA & Mini Timer */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="px-3 py-2.5 rounded-xl bg-[#F6F5FA] flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {timerMode === 'study' ? 'Focus Timer' : 'Break Timer'}
            </span>
            <button
              onClick={() => setActiveTab('timer')}
              className="font-mono tabular-nums font-semibold text-[#5B43B8] hover:underline cursor-pointer"
            >
              {formatMiniTimer(timerSeconds)} {timerRunning ? '●' : ''}
            </button>
          </div>

          <button
            onClick={() => setActiveTab('ask')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Your Study Buddy</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar (3-Zone Contract) */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Zone 1: Brand / Current Context */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-base font-semibold text-slate-900 font-display cursor-pointer whitespace-nowrap"
          >
            Lumina Study Buddy
          </button>

          {/* Zone 2: Horizontal Quick Navigation on Tablet/Mobile */}
          <nav className="flex lg:hidden items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#F3F0FF] text-[#4C35A9] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ask')}
              className="px-4 py-2 rounded-lg bg-[#6E56CF] hover:bg-[#5B43B8] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Ask Your Study Buddy
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              studentName={studentName}
              subjects={subjects}
              studyPlan={studyPlan}
              quizHistory={quizHistory}
              pomodoroLogs={pomodoroLogs}
              onNavigate={setActiveTab}
              onToggleStudyBlock={handleToggleStudyBlock}
              onToggleTopic={handleToggleTopic}
              onQuickAskTopic={handleQuickAskTopic}
              onQuickQuizTopic={handleQuickQuizTopic}
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              timerMode={timerMode}
              onStartPauseTimer={() => setTimerRunning((r) => !r)}
              onResetTimer={handleResetTimer}
              onSwitchTimerMode={handleSwitchTimerMode}
            />
          )}

          {activeTab === 'ask' && (
            <AskDoubtView
              subjects={subjects}
              doubts={doubts}
              initialSubject={prefillAsk.subject}
              initialQuestion={prefillAsk.question}
              onAddDoubt={(d) => setDoubts((prev) => [d, ...prev])}
              onClearPrefill={() => setPrefillAsk({})}
            />
          )}

          {activeTab === 'plan' && (
            <StudyPlanView
              subjects={subjects}
              studyPlan={studyPlan}
              onUpdateStudyPlan={setStudyPlan}
              onToggleStudyBlock={handleToggleStudyBlock}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizModeView
              subjects={subjects}
              initialQuiz={INITIAL_QUIZ_DATA}
              prefillSubject={prefillQuiz.subject}
              prefillTopic={prefillQuiz.topic}
              onSaveQuizAttempt={(attempt) =>
                setQuizHistory((prev) => [...prev, attempt])
              }
              onClearPrefill={() => setPrefillQuiz({})}
            />
          )}

          {activeTab === 'notes' && (
            <NotesSummarizerView
              subjects={subjects}
              summaries={summaries}
              onAddSummary={(s) => setSummaries((prev) => [s, ...prev])}
            />
          )}

          {activeTab === 'exam' && (
            <ExamPrepView
              subjects={subjects}
              examGuides={examGuides}
              onAddExamGuide={(g) => setExamGuides((prev) => [g, ...prev])}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTrackerView
              subjects={subjects}
              studyPlan={studyPlan}
              quizHistory={quizHistory}
              pomodoroLogs={pomodoroLogs}
              onToggleTopic={handleToggleTopic}
              onAddTopic={handleAddTopic}
            />
          )}

          {activeTab === 'timer' && (
            <FocusTimerView
              subjects={subjects}
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              timerMode={timerMode}
              selectedSubject={timerSubject}
              selectedTask={timerTask}
              pomodoroLogs={pomodoroLogs}
              onStartPause={() => setTimerRunning((r) => !r)}
              onReset={handleResetTimer}
              onSwitchMode={handleSwitchTimerMode}
              onChangeSubject={setTimerSubject}
              onChangeTask={setTimerTask}
              onCompleteSessionNow={handleCompleteSessionManual}
            />
          )}
        </main>
      </div>
    </div>
  );
}
