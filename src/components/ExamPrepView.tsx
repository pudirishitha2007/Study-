import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Lightbulb,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { ExamPrepGuide, ExamPrepQuestion, SubjectItem } from '../types/study';

interface ExamPrepViewProps {
  subjects: SubjectItem[];
  examGuides: ExamPrepGuide[];
  onAddExamGuide: (guide: ExamPrepGuide) => void;
}

// Helper to highlight important keywords inside answer text
function renderTextWithHighlightedKeywords(text: string, keywords: string[]) {
  if (!keywords || keywords.length === 0) return text;
  const escaped = keywords
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (escaped.length === 0) return text;
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const isMatch = keywords.some(
      (k) => k.trim().toLowerCase() === part.toLowerCase()
    );
    if (isMatch) {
      return (
        <mark
          key={idx}
          className="bg-[#E8E2FF] text-[#3B2691] font-semibold px-1 rounded-xs"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({
  subjects,
  examGuides,
  onAddExamGuide,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0]?.name || 'Operating Systems'
  );
  const [topicInput, setTopicInput] = useState(
    'Virtual Memory, Paging & Thrashing'
  );
  const [activeMarksFilter, setActiveMarksFilter] = useState<'all' | 3 | 5 | 10>(
    'all'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGuideId, setActiveGuideId] = useState(examGuides[0]?.id || '');

  const activeGuide =
    examGuides.find((g) => g.id === activeGuideId) || examGuides[0];

  const handleGenerateExamPrep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-buddy/exam-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: topicInput.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not generate exam prep questions.');
      }

      const newGuide: ExamPrepGuide = {
        id: `exam-${Date.now()}`,
        subject: selectedSubject,
        topicTitle: data.topicTitle || topicInput.trim(),
        examinerTip:
          data.examinerTip ||
          'Underline the highlighted keywords in your answer sheet to help examiners award full marks quickly.',
        threeMarkQuestions: data.threeMarkQuestions || [],
        fiveMarkQuestions: data.fiveMarkQuestions || [],
        tenMarkQuestions: data.tenMarkQuestions || [],
      };

      onAddExamGuide(newGuide);
      setActiveGuideId(newGuide.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate exam answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionList = (questions: ExamPrepQuestion[], sectionLabel: string) => {
    if (questions.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#6E56CF]" />
            <span>{sectionLabel}</span>
          </h3>
          <span className="text-xs text-slate-500">
            Highlighted terms = High-scoring exam keywords
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {questions.map((q) => (
            <div key={q.id} className="py-6 first:pt-2 last:pb-2 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                  Q. {q.question}
                </h4>
                <span className="font-mono tabular-nums text-xs font-semibold text-[#5B43B8] shrink-0">
                  {q.marks} Marks
                </span>
              </div>

              {/* Simple Opening Definition */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {renderTextWithHighlightedKeywords(q.introSummary, q.keywords)}
              </p>

              {/* Easy-to-remember bullet points */}
              <ul className="space-y-2 pl-1">
                {q.structuredPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                  >
                    <span className="font-mono text-xs font-semibold text-[#6E56CF] mt-1 shrink-0">
                      •
                    </span>
                    <span>
                      {renderTextWithHighlightedKeywords(pt, q.keywords)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Keywords list & Memory Trick */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#F6F5FA] p-3.5 rounded-xl">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Keywords to Underline:{' '}
                  </span>
                  <span>{q.keywords.join(' · ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#4C35A9] font-medium shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{q.memoryTrick}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Exam Prep Generator Header */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#6E56CF]">
            3-Mark, 5-Mark & 10-Mark Answers · Highlighted Keywords
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Exam Preparation Answer Bank
          </h1>
          <p className="text-sm text-slate-600">
            Generate structured 3-mark, 5-mark, and 10-mark university exam questions with easy-to-remember answers and automatically highlighted keywords.
          </p>
        </div>

        <form
          onSubmit={handleGenerateExamPrep}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100 items-end"
        >
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Chapter or Topic
            </label>
            <input
              type="text"
              required
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., Deadlock & Banker's Algorithm, SQL Normalization..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading || !topicInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap h-[42px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Q&A</span>
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

      {/* Active Exam Prep Guide */}
      {activeGuide && (
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-[#5B43B8]">{activeGuide.subject}</span> · Exam Answer Sheet
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-0.5">
                {activeGuide.topicTitle}
              </h2>
            </div>

            {/* Interactive Filter Tabs for Marks */}
            <div className="flex items-center gap-1 p-1 bg-[#F6F5FA] rounded-lg self-start">
              {(
                [
                  { label: 'All Marks', val: 'all' },
                  { label: '3-Mark Qs', val: 3 },
                  { label: '5-Mark Qs', val: 5 },
                  { label: '10-Mark Qs', val: 10 },
                ] as const
              ).map((tab) => (
                <button
                  key={String(tab.val)}
                  onClick={() => setActiveMarksFilter(tab.val)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeMarksFilter === tab.val
                      ? 'bg-white text-[#4C35A9] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F3F0FF] text-[#3D2C8D] flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-[#6E56CF] shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-semibold">Study Buddy Exam Tip: </span>
              {activeGuide.examinerTip}
            </p>
          </div>

          {(activeMarksFilter === 'all' || activeMarksFilter === 3) &&
            renderQuestionList(
              activeGuide.threeMarkQuestions,
              '3-Mark Short Answer Questions (Crisp Definition + Core Points)'
            )}

          {(activeMarksFilter === 'all' || activeMarksFilter === 5) &&
            renderQuestionList(
              activeGuide.fiveMarkQuestions,
              '5-Mark Structured Questions (Step-by-Step Mechanism)'
            )}

          {(activeMarksFilter === 'all' || activeMarksFilter === 10) &&
            renderQuestionList(
              activeGuide.tenMarkQuestions,
              '10-Mark Long Essay Questions (Comprehensive Breakdown)'
            )}
        </section>
      )}
    </div>
  );
};
