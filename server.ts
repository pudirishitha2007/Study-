import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const STUDY_BUDDY_PERSONALITY = `You are Lumina, a warm, friendly, patient, and encouraging AI Study Buddy for college students.
Your core rules:
1. Always use very simple, clear, everyday English. Avoid intimidating academic jargon—if a technical term is required for exams, define it immediately in plain words.
2. Never make the student feel bad, judged, or behind for not understanding something. Validate their curiosity warmly.
3. Explain difficult concepts like a caring favorite professor or senior mentor explaining to a complete beginner over coffee.
4. Use relatable real-life analogies (like cooking, traffic, Spotify playlists, organizing a dorm room, or sports) whenever helpful.
5. Break complex ideas into digestible step-by-step points.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // 1. Ask Doubts Endpoint
  app.post('/api/study-buddy/ask', async (req, res) => {
    try {
      const { question, subject, explainDepth = 'step-by-step' } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Please enter a question to ask your Study Buddy.' });
      }

      const ai = getAiClient();
      const prompt = `Subject context: ${subject || 'General College Studies'}
Explanation mode requested: ${explainDepth}
Student's question: "${question}"

Please explain this concept in very simple English for a college student. Include a warm encouraging opening, a plain-English core explanation, a clear step-by-step breakdown, a relatable real-life analogy, a concrete academic/practical example, a one-sentence key takeaway for exams, and 3 natural follow-up questions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: STUDY_BUDDY_PERSONALITY,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              encouragingOpening: {
                type: Type.STRING,
                description: 'Warm, reassuring 1-2 sentence validation that makes the student feel supported.',
              },
              simpleExplanation: {
                type: Type.STRING,
                description: 'Direct, beginner-friendly explanation in very simple English.',
              },
              steps: {
                type: Type.ARRAY,
                description: 'Step-by-step breakdown of how the concept works.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'detail'],
                },
              },
              realLifeAnalogy: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Short title for the analogy, e.g., Like a Restaurant Kitchen' },
                  analogyText: { type: Type.STRING, description: 'How the everyday situation works and maps to the concept.' },
                },
                required: ['title', 'analogyText'],
              },
              concreteExample: {
                type: Type.STRING,
                description: 'A clear, practical example or mini worked problem.',
              },
              examTakeaway: {
                type: Type.STRING,
                description: 'One crisp, easy-to-memorize sentence the student can write in an exam.',
              },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 simple follow-up questions the student might want to explore next.',
              },
            },
            required: [
              'encouragingOpening',
              'simpleExplanation',
              'steps',
              'realLifeAnalogy',
              'concreteExample',
              'examTakeaway',
              'followUpQuestions',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from model');
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error in /api/study-buddy/ask:', error);
      res.status(500).json({
        error: error?.message || 'Could not generate explanation right now. Please try again.',
      });
    }
  });

  // 2. Study Plan Generator Endpoint
  app.post('/api/study-buddy/study-plan', async (req, res) => {
    try {
      const {
        subjects,
        examDate,
        availableHours,
        difficultSubjects,
        easySubjects,
        startTime = '09:00 AM',
      } = req.body;

      const ai = getAiClient();
      const prompt = `Create a realistic, balanced daily study timetable for a college student with the following details:
- All Subjects: ${Array.isArray(subjects) ? subjects.join(', ') : subjects}
- Target Exam Date: ${examDate || 'In 3 weeks'}
- Available Study Time per Day: ${availableHours || 4} hours
- Difficult Subjects (need fresher focus & step-by-step practice): ${difficultSubjects || 'None specified'}
- Easy Subjects (good for lighter review): ${easySubjects || 'None specified'}
- Preferred Daily Start Time: ${startTime}

Rules for the timetable:
1. Schedule difficult subjects earlier when the student's mind is fresh.
2. Include explicit short breaks (10-15 mins) between study blocks so the student never burns out.
3. Mix in active recall / quick quiz or revision blocks for easy subjects.
4. Provide 6 to 8 realistic daily blocks (including study blocks and break blocks).
5. Provide a 3-stage countdown roadmap leading up to the exam date.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: STUDY_BUDDY_PERSONALITY,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              planTitle: { type: Type.STRING },
              encouragementMessage: { type: Type.STRING },
              strategyTip: { type: Type.STRING },
              dailyBlocks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    timeRange: { type: Type.STRING, description: 'e.g., 09:00 AM – 09:50 AM' },
                    title: { type: Type.STRING, description: 'Specific study activity or break title' },
                    subject: { type: Type.STRING, description: 'Subject name or Break' },
                    blockType: {
                      type: Type.STRING,
                      description: 'Must be one of: study, break, revision',
                    },
                    difficultyTag: {
                      type: Type.STRING,
                      description: 'Must be one of: Difficult Focus, Moderate Practice, Easy Review, Rest & Recharge',
                    },
                    durationMinutes: { type: Type.INTEGER },
                    actionTip: { type: Type.STRING, description: '1-sentence friendly tip for this block' },
                  },
                  required: [
                    'id',
                    'timeRange',
                    'title',
                    'subject',
                    'blockType',
                    'difficultyTag',
                    'durationMinutes',
                    'actionTip',
                  ],
                },
              },
              examCountdownPhases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseName: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    focusDescription: { type: Type.STRING },
                  },
                  required: ['phaseName', 'timeframe', 'focusDescription'],
                },
              },
            },
            required: [
              'planTitle',
              'encouragementMessage',
              'strategyTip',
              'dailyBlocks',
              'examCountdownPhases',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from model');
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error in /api/study-buddy/study-plan:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate study plan. Please try again.',
      });
    }
  });

  // 3. Quiz Mode Endpoint
  app.post('/api/study-buddy/quiz', async (req, res) => {
    try {
      const { subject, topic, count = 5, difficulty = 'Balanced' } = req.body;
      if (!subject || !topic) {
        return res.status(400).json({ error: 'Please provide both a subject and a topic.' });
      }

      const ai = getAiClient();
      const prompt = `Generate a ${count}-question multiple-choice quiz for a college student.
Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty}

For each question:
- Write a clear, fair, concept-checking question.
- Provide exactly 4 options.
- Indicate the 0-based index (0, 1, 2, or 3) of the correct option.
- Write a warm, very simple explanation of WHY the correct answer is right and why common misconceptions happen.
- Include a short memory tip.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: STUDY_BUDDY_PERSONALITY,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quizTitle: { type: Type.STRING },
              encouragement: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    memoryTip: { type: Type.STRING },
                  },
                  required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'memoryTip'],
                },
              },
            },
            required: ['quizTitle', 'encouragement', 'questions'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from model');
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error in /api/study-buddy/quiz:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate quiz questions. Please try again.',
      });
    }
  });

  // 4. Notes Summarizer Endpoint (supports text and optional uploaded image/document base64)
  app.post('/api/study-buddy/summarize-notes', async (req, res) => {
    try {
      const { notesText, subject, fileData } = req.body;
      if (!notesText && !fileData) {
        return res.status(400).json({ error: 'Please paste your notes or upload a file to summarize.' });
      }

      const ai = getAiClient();
      const promptText = `Summarize and simplify the following college lecture notes for a student preparing for exams.
Subject Context: ${subject || 'College Course'}
${notesText ? `Lecture Notes:\n"""\n${notesText}\n"""` : 'Please read the attached lecture notes image/document and summarize it.'}

Convert these notes into:
1. A very simple, beginner-friendly explanation of the core concept (with a relatable analogy).
2. Important keywords with simple 1-line definitions to underline in exams.
3. Short, high-yield revision bullet points for last-minute review.
4. Possible exam questions with mark weights and brief answer hints.`;

      const parts: any[] = [];
      if (fileData && fileData.base64 && fileData.mimeType) {
        parts.push({
          inlineData: {
            data: fileData.base64,
            mimeType: fileData.mimeType,
          },
        });
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: STUDY_BUDDY_PERSONALITY,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryTitle: { type: Type.STRING },
              simpleExplanation: { type: Type.STRING },
              quickAnalogy: { type: Type.STRING },
              importantKeywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                  },
                  required: ['term', 'meaning'],
                },
              },
              revisionPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              possibleExamQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    marks: { type: Type.STRING, description: 'e.g., 3 Marks, 5 Marks, or 10 Marks' },
                    answerHint: { type: Type.STRING },
                  },
                  required: ['question', 'marks', 'answerHint'],
                },
              },
            },
            required: [
              'summaryTitle',
              'simpleExplanation',
              'quickAnalogy',
              'importantKeywords',
              'revisionPoints',
              'possibleExamQuestions',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from model');
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error in /api/study-buddy/summarize-notes:', error);
      res.status(500).json({
        error: error?.message || 'Failed to summarize notes. Please try again.',
      });
    }
  });

  // 5. Exam Preparation Endpoint (3-mark, 5-mark, and 10-mark questions with highlighted keywords)
  app.post('/api/study-buddy/exam-prep', async (req, res) => {
    try {
      const { subject, topic } = req.body;
      if (!subject || !topic) {
        return res.status(400).json({ error: 'Please specify a subject and topic for exam preparation.' });
      }

      const ai = getAiClient();
      const prompt = `Create a comprehensive university Exam Preparation guide for:
Subject: ${subject}
Topic: ${topic}

Generate:
- Two 3-Mark Questions (short, crisp definition + core point + example, ~40-60 words each)
- Two 5-Mark Questions (structured 4-5 bullet points with clear subheadings, ~100-140 words each)
- One 10-Mark Question (complete essay/long-answer structure: Introduction, Core Mechanism/Steps, Real-world Application/Diagram idea, and Conclusion, ~200-250 words)

Rules:
- Write answers in simple, easy-to-remember language that a student can recall under exam pressure.
- For each answer, list 4 to 6 exact "keywords" that actually appear in your answer text or points so the UI can highlight them for the student.
- Include a quick mnemonic or memory trick for each question.`;

      const questionSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          marks: { type: Type.INTEGER },
          question: { type: Type.STRING },
          introSummary: { type: Type.STRING, description: 'Opening definition or direct answer in simple English' },
          structuredPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Easy-to-memorize bullet points to write in the exam paper',
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Important exam keywords used in the answer that fetch full marks when underlined',
          },
          memoryTrick: {
            type: Type.STRING,
            description: 'A friendly acronym, rhyme, or mental picture to remember the points',
          },
        },
        required: ['id', 'marks', 'question', 'introSummary', 'structuredPoints', 'keywords', 'memoryTrick'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: STUDY_BUDDY_PERSONALITY,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topicTitle: { type: Type.STRING },
              examinerTip: { type: Type.STRING },
              threeMarkQuestions: {
                type: Type.ARRAY,
                items: questionSchema,
              },
              fiveMarkQuestions: {
                type: Type.ARRAY,
                items: questionSchema,
              },
              tenMarkQuestions: {
                type: Type.ARRAY,
                items: questionSchema,
              },
            },
            required: [
              'topicTitle',
              'examinerTip',
              'threeMarkQuestions',
              'fiveMarkQuestions',
              'tenMarkQuestions',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from model');
      }
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error('Error in /api/study-buddy/exam-prep:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate exam preparation questions. Please try again.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumina Study Buddy server running on http://localhost:${PORT}`);
  });
}

startServer();
