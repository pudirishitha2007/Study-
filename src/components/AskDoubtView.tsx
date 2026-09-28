import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageCircleHeart,
  Send,
  Sparkles,
} from 'lucide-react';
import { DoubtResponse, SubjectItem } from '../types/study';

interface AskDoubtViewProps {
  subjects: SubjectItem[];
  doubts: DoubtResponse[];
  initialSubject?: string;
  initialQuestion?: string;
  onAddDoubt: (doubt: DoubtResponse) => void;
  onClearPrefill?: () => void;
}

const STARTER_QUESTIONS = [
  {
    subject: 'Operating Systems',
    question: 'What is Virtual Memory and Page Fault in simple words?',
  },
  {
    subject: 'Database Systems',
    question: 'Explain ACID properties in DBMS using a real-life bank example.',
  },
  {
    subject: 'Linear Algebra & Calculus',
    question: 'What do Eigenvalues and Eigenvectors actually mean visually?',
  },
  {
    subject: 'Cognitive Psychology',
    question: 'What is the difference between Classical and Operant Conditioning?',
  },
];

export const AskDoubtView: React.FC<AskDoubtViewProps> = ({
  subjects,
  doubts,
  initialSubject,
  initialQuestion,
  onAddDoubt,
  onClearPrefill,
}) => {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [selectedSubject, setSelectedSubject] = useState(
    initialSubject || subjects[0]?.name || 'Operating Systems'
  );
  const [explainDepth, setExplainDepth] = useState<'Step-by-Step Beginner' | 'Super Simple (Analogy First)' | 'Exam-Focused Simple'>('Step-by-Step Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDoubtId, setActiveDoubtId] = useState<string>(doubts[0]?.id || '');

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      if (initialSubject) {
        setSelectedSubject(initialSubject);
      }
      if (onClearPrefill) {
        onClearPrefill();
      }
    }
  }, [initialQuestion, initialSubject, onClearPrefill]);

  const activeDoubt = doubts.find((d) => d.id === activeDoubtId) || doubts[0];

  const handleAskBuddy = async (customQuestion?: string, customSubject?: string) => {
    const qToAsk = (customQuestion ?? question).trim();
    const subToUse = customSubject ?? selectedSubject;
    if (!qToAsk) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-buddy/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qToAsk,
          subject: subToUse,
          explainDepth,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not reach your Study Buddy right now.');
      }

      const newDoubt: DoubtResponse = {
        id: `doubt-${Date.now()}`,
        question: qToAsk,
        subject: subToUse,
        createdAt: 'Just now',
        encouragingOpening: data.encouragingOpening,
        simpleExplanation: data.simpleExplanation,
        steps: data.steps || [],
        realLifeAnalogy: data.realLifeAnalogy || {
          title: 'Everyday Analogy',
          analogyText: '',
        },
        concreteExample: data.concreteExample || '',
        examTakeaway: data.examTakeaway || '',
        followUpQuestions: data.followUpQuestions || [],
      };

      onAddDoubt(newDoubt);
      setActiveDoubtId(newDoubt.id);
      setQuestion('');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while generating the explanation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Input Box */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#6E56CF]">
            No question is too basic · Judgment-free learning
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Ask Your Study Buddy Any Doubt
          </h1>
          <p className="text-sm text-slate-600">
            Stuck on a confusing paragraph or tricky theorem? Type your question below and I will break it down in plain English with a real-life analogy and step-by-step points.
          </p>
        </div>

        {/* Controls for Subject & Explanation Depth */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="doubt-subject" className="text-xs font-medium text-slate-600">
              Subject:
            </label>
            <select
              id="doubt-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-800 bg-[#F6F5FA] border border-slate-200 rounded-lg focus:outline-none focus:border-[#6E56CF]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="General College Concept">General College Concept</option>
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F6F5FA] rounded-lg overflow-x-auto">
            {(
              [
                'Step-by-Step Beginner',
                'Super Simple (Analogy First)',
                'Exam-Focused Simple',
              ] as const
            ).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setExplainDepth(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  explainDepth === mode
                    ? 'bg-white text-[#4C35A9] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Question Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskBuddy();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Why do we need Virtual Memory if we already have RAM? Explain it like I'm a beginner..."
              className="w-full rounded-xl bg-[#F6F5FA] border border-slate-200/90 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6E56CF] transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span>Try asking:</span>
              {STARTER_QUESTIONS.slice(0, 2).map((sq, idx) => (
                <React.Fragment key={sq.question}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sq.subject);
                      setQuestion(sq.question);
                      handleAskBuddy(sq.question, sq.subject);
                    }}
                    className="text-[#6E56CF] hover:text-[#4C35A9] font-medium underline underline-offset-2 cursor-pointer text-left"
                  >
                    “{sq.question}”
                  </button>
                </React.Fragment>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking Simply...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Explain Simply</span>
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

      {/* Main Answer & Doubt History */}
      {activeDoubt && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Explanation (8 cols) */}
          <section className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-[#5B43B8]">{activeDoubt.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDoubt.createdAt}</span>
                <span aria-hidden="true">·</span>
                <span>Beginner-Friendly Breakdown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                {activeDoubt.question}
              </h2>
            </div>

            {/* Warm Reassurance from Study Buddy */}
            <div className="p-4 rounded-xl bg-[#F3F0FF] text-[#3D2C8D] flex items-start gap-3">
              <MessageCircleHeart className="w-5 h-5 text-[#6E56CF] shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed font-medium">
                {activeDoubt.encouragingOpening}
              </p>
            </div>

            {/* 1. In Plain English */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E56CF]" />
                <span>1. The Simple Idea (In Plain English)</span>
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                {activeDoubt.simpleExplanation}
              </p>
            </div>

            {/* 2. Real-Life Analogy */}
            <div className="pt-5 border-t border-slate-100 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>2. Real-Life Analogy: {activeDoubt.realLifeAnalogy.title}</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-[#F6F5FA] p-4 rounded-xl">
                {activeDoubt.realLifeAnalogy.analogyText}
              </p>
            </div>

            {/* 3. Step-by-Step Breakdown */}
            <div className="pt-5 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6E56CF]" />
                <span>3. Step-by-Step Breakdown</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {activeDoubt.steps.map((step) => (
                  <div key={step.stepNumber} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-[#F3F0FF] text-[#4C35A9] font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        {step.title}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Practical Example & Exam One-Liner */}
            <div className="pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-900">
                  Concrete Example
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeDoubt.concreteExample}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Golden Sentence to Write in Your Exam</span>
                </h4>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  “{activeDoubt.examTakeaway}”
                </p>
              </div>
            </div>

            {/* Follow-up questions */}
            {activeDoubt.followUpQuestions.length > 0 && (
              <div className="pt-5 border-t border-slate-100 space-y-2.5">
                <p className="text-xs font-medium text-slate-500">
                  Want to dig a little deeper? Click a follow-up question:
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeDoubt.followUpQuestions.map((fq) => (
                    <button
                      key={fq}
                      onClick={() => {
                        setQuestion(fq);
                        handleAskBuddy(fq, activeDoubt.subject);
                      }}
                      disabled={loading}
                      className="px-3.5 py-2 rounded-xl bg-[#F6F5FA] hover:bg-[#F3F0FF] text-slate-700 hover:text-[#4C35A9] text-xs font-medium transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#6E56CF] shrink-0" />
                      <span>{fq}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Saved Doubts & Quick Topics Sidebar (4 cols) */}
          <aside className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 h-fit">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent Questions Explained
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revisit concepts you asked your Study Buddy earlier
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {doubts.map((item) => {
                const isSelected = item.id === activeDoubt.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDoubtId(item.id)}
                    className={`w-full text-left py-3 first:pt-1 last:pb-1 transition-colors cursor-pointer -mx-2 px-2 rounded-lg ${
                      isSelected ? 'bg-[#F3F0FF]/70' : 'hover:bg-[#F6F5FA]'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium line-clamp-2 ${
                        isSelected ? 'text-[#4C35A9]' : 'text-slate-900'
                      }`}
                    >
                      {item.question}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.subject} · {item.createdAt}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">
                More Common Exam Doubts
              </p>
              <div className="space-y-1.5">
                {STARTER_QUESTIONS.map((sq) => (
                  <button
                    key={sq.question}
                    onClick={() => {
                      setSelectedSubject(sq.subject);
                      setQuestion(sq.question);
                      handleAskBuddy(sq.question, sq.subject);
                    }}
                    disabled={loading}
                    className="w-full text-left p-2.5 rounded-lg bg-[#F6F5FA] hover:bg-[#F3F0FF] text-xs text-slate-700 hover:text-[#4C35A9] transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{sq.subject}:</span> {sq.question}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
