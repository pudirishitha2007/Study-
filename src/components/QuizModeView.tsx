import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { QuizAttempt, QuizData, SubjectItem } from '../types/study';

interface QuizModeViewProps {
  subjects: SubjectItem[];
  initialQuiz: QuizData;
  prefillSubject?: string;
  prefillTopic?: string;
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  onClearPrefill?: () => void;
}

export const QuizModeView: React.FC<QuizModeViewProps> = ({
  subjects,
  initialQuiz,
  prefillSubject,
  prefillTopic,
  onSaveQuizAttempt,
  onClearPrefill,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(
    prefillSubject || subjects[1]?.name || 'Database Systems'
  );
  const [topicInput, setTopicInput] = useState(
    prefillTopic || 'Normalization & ACID Properties'
  );
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [quizData, setQuizData] = useState<QuizData>(initialQuiz);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answersRecord, setAnswersRecord] = useState<
    { questionId: string; selected: number; isCorrect: boolean }[]
  >([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefillTopic) {
      setTopicInput(prefillTopic);
      if (prefillSubject) {
        setSelectedSubject(prefillSubject);
      }
      if (onClearPrefill) {
        onClearPrefill();
      }
    }
  }, [prefillSubject, prefillTopic, onClearPrefill]);

  const currentQuestion = quizData.questions[currentIndex];

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-buddy/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: topicInput.trim(),
          count: questionCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not generate quiz questions.');
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions returned. Please try another topic.');
      }

      setQuizData({
        quizTitle: data.quizTitle || `${topicInput} Practice Quiz`,
        subject: selectedSubject,
        topic: topicInput.trim(),
        encouragement:
          data.encouragement ||
          "Take your time! Every question helps reinforce what you've learned.",
        questions: data.questions,
      });
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswersRecord([]);
      setQuizFinished(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: optionIndex,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizData.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score and save attempt
      const total = quizData.questions.length;
      const score = answersRecord.filter((a) => a.isCorrect).length;
      const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

      onSaveQuizAttempt({
        id: `att-${Date.now()}`,
        subject: quizData.subject,
        topic: quizData.topic,
        score,
        total,
        percentage,
        dateLabel: 'Just now',
      });
      setQuizFinished(true);
    }
  };

  const handleRestartSameQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswersRecord([]);
    setQuizFinished(false);
  };

  const currentSubjectObj = subjects.find((s) => s.name === selectedSubject);
  const suggestedTopics = currentSubjectObj ? currentSubjectObj.topics.map((t) => t.title) : [];

  const finalScore = answersRecord.filter((a) => a.isCorrect).length;
  const totalQuestions = quizData.questions.length;
  const finalPercentage =
    totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Subject & Topic Quiz Generator Bar */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#6E56CF]">
            Active Recall Practice · One Question at a Time
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Practice Quiz Mode
          </h1>
          <p className="text-sm text-slate-600">
            Choose a subject and topic to generate multiple-choice questions. After every answer, I will explain the reasoning in simple words so you learn as you go.
          </p>
        </div>

        <form
          onSubmit={handleGenerateQuiz}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100 items-end"
        >
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                const found = subjects.find((s) => s.name === e.target.value);
                if (found && found.topics[0]) {
                  setTopicInput(found.topics[0].title);
                }
              }}
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
              Topic to Practice
            </label>
            <input
              type="text"
              required
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., Virtual Memory, SQL Joins, Eigenvalues..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <div className="w-24 shrink-0 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl bg-[#F6F5FA] border border-slate-200 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
              >
                <option value={4}>4 Qs</option>
                <option value={5}>5 Qs</option>
                <option value={8}>8 Qs</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !topicInput.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap h-[42px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>New Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggested Quick Topic Buttons */}
        {suggestedTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Topics in {selectedSubject}:</span>
            {suggestedTopics.map((t, idx) => (
              <React.Fragment key={t}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <button
                  type="button"
                  onClick={() => setTopicInput(t)}
                  className={`hover:text-[#4C35A9] cursor-pointer ${
                    topicInput === t
                      ? 'text-[#6E56CF] font-semibold underline underline-offset-2'
                      : 'text-slate-600'
                  }`}
                >
                  {t}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}
      </section>

      {/* Active Single-Question Stage OR Final Score Stage */}
      {!quizFinished && currentQuestion ? (
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          {/* Top Progress Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-[#5B43B8]">{quizData.subject}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{quizData.topic}</span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-slate-800">
                Question {currentIndex + 1} of {quizData.questions.length}
              </span>
            </div>

            <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6E56CF] rounded-full transition-transform duration-200 origin-left"
                style={{
                  width: `${Math.round(
                    ((currentIndex + 1) / quizData.questions.length) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Question Stem */}
          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((optionText, idx) => {
              const isAnswered = selectedOption !== null;
              const isThisSelected = selectedOption === idx;
              const isThisCorrect = idx === currentQuestion.correctIndex;

              let btnStyle =
                'bg-[#F6F5FA] hover:bg-[#F3F0FF] border-slate-200/90 text-slate-800';
              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle =
                    'bg-emerald-50/90 border-emerald-500 text-emerald-950 font-semibold';
                } else if (isThisSelected && !isThisCorrect) {
                  btnStyle =
                    'bg-red-50/90 border-red-400 text-red-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200/60 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/80 text-slate-700 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed">
                      {optionText}
                    </span>
                  </div>

                  {isAnswered && isThisCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct</span>
                    </span>
                  )}
                  {isAnswered && isThisSelected && !isThisCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 shrink-0 mt-0.5">
                      <XCircle className="w-4 h-4" />
                      <span>Your Choice</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback & Simple Explanation Box */}
          {selectedOption !== null && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div
                className={`p-5 rounded-xl space-y-2 ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50/70 text-emerald-950'
                    : 'bg-[#F3F0FF] text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {selectedOption === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-900">
                        Spot on! You got it right!
                      </span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5 text-[#6E56CF] shrink-0" />
                      <span className="text-[#3D2C8D]">
                        Good try! Don’t worry—here is the simple reason why:
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-700">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.memoryTip && (
                  <p className="text-xs font-medium text-[#5B43B8] pt-1">
                    Memory Tip: {currentQuestion.memoryTip}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {currentIndex + 1 < quizData.questions.length
                      ? 'Next Question'
                      : 'Finish & See Final Score'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Final Score Screen */
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#6E56CF] flex items-center justify-center mx-auto">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#6E56CF]">
              Quiz Completed · Saved to Progress Tracker
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              You scored{' '}
              <span className="font-mono tabular-nums text-[#5B43B8]">
                {finalScore} / {totalQuestions}
              </span>{' '}
              ({finalPercentage}%)
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              {finalPercentage >= 75
                ? 'Fantastic work! You have a strong grasp of these core concepts. Keep this momentum going!'
                : 'Great effort completing the quiz! Every question you reviewed today makes the real exam much easier.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestartSameQuiz}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F6F5FA] hover:bg-slate-200/70 text-slate-800 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Same Questions</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateQuiz()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Fresh Questions</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
