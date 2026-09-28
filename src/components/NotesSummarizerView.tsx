import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Key,
  ListChecks,
  Loader2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { NotesSummary, SubjectItem } from '../types/study';
import { SAMPLE_RAW_NOTES } from '../data/initialData';

interface NotesSummarizerViewProps {
  subjects: SubjectItem[];
  summaries: NotesSummary[];
  onAddSummary: (summary: NotesSummary) => void;
}

export const NotesSummarizerView: React.FC<NotesSummarizerViewProps> = ({
  subjects,
  summaries,
  onAddSummary,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(
    subjects[1]?.name || 'Database Systems'
  );
  const [notesText, setNotesText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSummaryId, setActiveSummaryId] = useState(summaries[0]?.id || '');

  const activeSummary =
    summaries.find((s) => s.id === activeSummaryId) || summaries[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        setNotesText(String(reader.result || ''));
        setUploadedFileData(null);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        const base64 = result.split(',')[1] || '';
        setUploadedFileData({
          base64,
          mimeType: file.type || 'image/png',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesText.trim() && !uploadedFileData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-buddy/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          notesText: notesText.trim(),
          fileData: uploadedFileData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not summarize notes.');
      }

      const newSummary: NotesSummary = {
        id: `note-${Date.now()}`,
        summaryTitle: data.summaryTitle || `${selectedSubject} Notes Summary`,
        subject: selectedSubject,
        createdAt: 'Just now',
        simpleExplanation: data.simpleExplanation || '',
        quickAnalogy: data.quickAnalogy || '',
        importantKeywords: data.importantKeywords || [],
        revisionPoints: data.revisionPoints || [],
        possibleExamQuestions: data.possibleExamQuestions || [],
      };

      onAddSummary(newSummary);
      setActiveSummaryId(newSummary.id);
      setNotesText('');
      setUploadedFileName(null);
      setUploadedFileData(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to summarize notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notes Input Card */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6E56CF]">
              Turn Long Lecture Notes into Quick Revision Sheets
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Notes Summarizer
            </h1>
            <p className="text-sm text-slate-600">
              Paste your messy lecture notes or upload a file/photo. I will turn them into simple explanations, important keywords, short revision points, and likely exam questions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedSubject('Database Systems');
              setNotesText(SAMPLE_RAW_NOTES);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#F3F0FF] hover:bg-[#E4DDFB] text-[#4C35A9] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap self-start"
          >
            Load Sample Lecture Notes
          </button>
        </div>

        <form onSubmit={handleSummarize} className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700">Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#F6F5FA] border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#6E56CF]"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F6F5FA] hover:bg-slate-200/70 text-slate-700 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#6E56CF]" />
              <span>
                {uploadedFileName
                  ? `Uploaded: ${uploadedFileName}`
                  : 'Upload Notes (.txt, .md, or image)'}
              </span>
              <input
                type="file"
                accept=".txt,.md,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={5}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Paste textbook paragraphs, lecture slides text, or class notes here..."
            className="w-full rounded-xl bg-[#F6F5FA] border border-slate-200/90 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6E56CF]"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || (!notesText.trim() && !uploadedFileData)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6E56CF] hover:bg-[#5B43B8] disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Summarizing Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert into Study Sheet</span>
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

      {/* Output Summary Sheet */}
      {activeSummary && (
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-[#5B43B8]">{activeSummary.subject}</span> ·{' '}
                {activeSummary.createdAt}
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                {activeSummary.summaryTitle}
              </h2>
            </div>

            {summaries.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {summaries.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSummaryId(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap ${
                      s.id === activeSummary.id
                        ? 'bg-[#F3F0FF] text-[#4C35A9]'
                        : 'bg-[#F6F5FA] text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.summaryTitle}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. Simple Explanation & Analogy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6E56CF]" />
                <span>1. Simple Explanation</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {activeSummary.simpleExplanation}
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#F3F0FF] rounded-xl p-5 space-y-1.5">
              <h4 className="text-xs font-semibold text-[#4C35A9]">
                Everyday Analogy to Picture It
              </h4>
              <p className="text-sm text-[#2D1F6E] leading-relaxed">
                {activeSummary.quickAnalogy}
              </p>
            </div>
          </div>

          {/* 2. Important Keywords */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#6E56CF]" />
              <span>2. Important Keywords (Underline These in Your Exam)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSummary.importantKeywords.map((kw) => (
                <div
                  key={kw.term}
                  className="p-3.5 rounded-xl bg-[#F6F5FA] space-y-1"
                >
                  <p className="text-sm font-semibold text-[#4C35A9]">
                    {kw.term}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {kw.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Short Revision Points */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#6E56CF]" />
              <span>3. Short Revision Points (Last-Minute Checklist)</span>
            </h3>
            <ul className="space-y-2">
              {activeSummary.revisionPoints.map((pt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="font-mono text-xs font-semibold text-[#6E56CF] mt-1">
                    0{i + 1}.
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Possible Exam Questions */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#6E56CF]" />
              <span>4. Possible Exam Questions from These Notes</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {activeSummary.possibleExamQuestions.map((eq, i) => (
                <div key={i} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Q{i + 1}. {eq.question}
                    </p>
                    <span className="text-xs font-mono tabular-nums font-semibold text-[#5B43B8] shrink-0">
                      {eq.marks}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">How to answer: </span>
                    {eq.answerHint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
