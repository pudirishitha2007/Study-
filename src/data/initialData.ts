import {
  SubjectItem,
  StudyPlanData,
  DoubtResponse,
  QuizData,
  QuizAttempt,
  NotesSummary,
  ExamPrepGuide,
  PomodoroSessionLog,
} from '../types/study';

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-os',
    name: 'Operating Systems',
    difficulty: 'Difficult',
    examDate: '2026-10-18',
    topics: [
      { id: 'os-1', title: 'Process Scheduling Algorithms', completed: true, estimatedMinutes: 45 },
      { id: 'os-2', title: 'Deadlock Prevention & Banker’s Algorithm', completed: true, estimatedMinutes: 50 },
      { id: 'os-3', title: 'Virtual Memory & Page Replacement', completed: false, estimatedMinutes: 45 },
      { id: 'os-4', title: 'Semaphores & Critical Section Problem', completed: false, estimatedMinutes: 40 },
    ],
  },
  {
    id: 'sub-dbms',
    name: 'Database Systems',
    difficulty: 'Moderate',
    examDate: '2026-10-21',
    topics: [
      { id: 'db-1', title: 'ER Diagrams & Relational Model', completed: true, estimatedMinutes: 35 },
      { id: 'db-2', title: 'SQL Joins & Aggregation Queries', completed: true, estimatedMinutes: 40 },
      { id: 'db-3', title: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: true, estimatedMinutes: 45 },
      { id: 'db-4', title: 'ACID Properties & Concurrency Control', completed: false, estimatedMinutes: 40 },
    ],
  },
  {
    id: 'sub-calc',
    name: 'Linear Algebra & Calculus',
    difficulty: 'Difficult',
    examDate: '2026-10-24',
    topics: [
      { id: 'ma-1', title: 'Matrix Transformations & Rank', completed: true, estimatedMinutes: 45 },
      { id: 'ma-2', title: 'Eigenvalues and Eigenvectors', completed: false, estimatedMinutes: 50 },
      { id: 'ma-3', title: 'Partial Derivatives & Gradients', completed: false, estimatedMinutes: 45 },
    ],
  },
  {
    id: 'sub-psych',
    name: 'Cognitive Psychology',
    difficulty: 'Easy',
    examDate: '2026-10-28',
    topics: [
      { id: 'ps-1', title: 'Working Memory vs. Long-Term Memory', completed: true, estimatedMinutes: 30 },
      { id: 'ps-2', title: 'Classical & Operant Conditioning', completed: true, estimatedMinutes: 30 },
      { id: 'ps-3', title: 'Cognitive Biases & Heuristics', completed: false, estimatedMinutes: 25 },
    ],
  },
];

export const INITIAL_STUDY_PLAN: StudyPlanData = {
  planTitle: 'Balanced Mid-Semester Exam Timetable',
  encouragementMessage:
    "You're doing great! We placed your tougher subjects in the morning when your brain is freshest, with plenty of short breathers in between.",
  strategyTip:
    'Tackle Operating Systems and Linear Algebra in 45-minute deep focus blocks first, then wind down with lighter Database and Psychology review.',
  examDate: '2026-10-18',
  availableHours: 4,
  difficultSubjects: 'Operating Systems, Linear Algebra & Calculus',
  easySubjects: 'Cognitive Psychology, Database Systems',
  dailyBlocks: [
    {
      id: 'blk-1',
      timeRange: '09:00 AM – 09:45 AM',
      title: 'Virtual Memory & Page Faults (Step-by-Step)',
      subject: 'Operating Systems',
      blockType: 'study',
      difficultyTag: 'Difficult Focus',
      durationMinutes: 45,
      actionTip: 'Draw a quick 3-frame box on paper to trace FIFO vs LRU page replacement.',
      completed: true,
    },
    {
      id: 'blk-2',
      timeRange: '09:45 AM – 10:00 AM',
      title: 'Stretch, Hydrate & Screen Break',
      subject: 'Break',
      blockType: 'break',
      difficultyTag: 'Rest & Recharge',
      durationMinutes: 15,
      actionTip: 'Step away from your desk, drink water, and look out a window for 2 minutes.',
      completed: true,
    },
    {
      id: 'blk-3',
      timeRange: '10:00 AM – 10:50 AM',
      title: 'Eigenvalues & Characteristic Equation Practice',
      subject: 'Linear Algebra & Calculus',
      blockType: 'study',
      difficultyTag: 'Difficult Focus',
      durationMinutes: 50,
      actionTip: 'Solve just two 2x2 matrices slowly using det(A - λI) = 0 before trying 3x3.',
      completed: false,
    },
    {
      id: 'blk-4',
      timeRange: '10:50 AM – 11:05 AM',
      title: 'Coffee / Tea & Mindful Breather',
      subject: 'Break',
      blockType: 'break',
      difficultyTag: 'Rest & Recharge',
      durationMinutes: 15,
      actionTip: 'No scrolling social media—just rest your eyes so the math sinks in.',
      completed: false,
    },
    {
      id: 'blk-5',
      timeRange: '11:05 AM – 11:45 AM',
      title: 'ACID Properties & Transaction Logs',
      subject: 'Database Systems',
      blockType: 'study',
      difficultyTag: 'Moderate Practice',
      durationMinutes: 40,
      actionTip: 'Use the bank transfer analogy to remember Atomicity and Isolation.',
      completed: false,
    },
    {
      id: 'blk-6',
      timeRange: '04:30 PM – 05:00 PM',
      title: 'Cognitive Biases Flash Review & 5-Min Quiz',
      subject: 'Cognitive Psychology',
      blockType: 'revision',
      difficultyTag: 'Easy Review',
      durationMinutes: 30,
      actionTip: 'Think of one real-life example for Confirmation Bias and Anchoring Effect.',
      completed: false,
    },
  ],
  examCountdownPhases: [
    {
      phaseName: 'Phase 1: Core Concepts &Tough Topics',
      timeframe: 'Days 1 – 7',
      focusDescription: 'Understand the "why" behind Operating Systems and Linear Algebra using analogies.',
    },
    {
      phaseName: 'Phase 2: 3/5/10-Mark Answer Practice',
      timeframe: 'Days 8 – 14',
      focusDescription: 'Practice structured exam answers and underline key scoring terms.',
    },
    {
      phaseName: 'Phase 3: Light Revision & Confidence Quizzes',
      timeframe: 'Final 5 Days',
      focusDescription: 'Review short revision points, take 5-question quizzes, and get 8 hours of sleep.',
    },
  ],
};

export const INITIAL_DOUBTS: DoubtResponse[] = [
  {
    id: 'doubt-1',
    question: 'What is Deadlock in Operating Systems and how does it happen?',
    subject: 'Operating Systems',
    createdAt: 'Today, 09:20 AM',
    encouragingOpening:
      "I'm so glad you asked! Deadlock sounds intimidating in textbooks, but once you picture it in everyday life, it becomes super intuitive.",
    simpleExplanation:
      'A deadlock happens when two or more programs get stuck forever because each one is holding onto something the other needs, and neither is willing to let go first.',
    steps: [
      {
        stepNumber: 1,
        title: 'Process A grabs Resource 1',
        detail: 'Imagine Process A is holding the Printer and waiting for the Scanner to finish its job.',
      },
      {
        stepNumber: 2,
        title: 'Process B grabs Resource 2',
        detail: 'At the exact same time, Process B is holding the Scanner and waiting for the Printer.',
      },
      {
        stepNumber: 3,
        title: 'Circular Wait begins',
        detail: 'Neither Process A nor Process B can finish without the other tool, and neither will drop what it already holds.',
      },
      {
        stepNumber: 4,
        title: 'System freezes on those tasks',
        detail: 'Both processes wait endlessly unless the Operating System steps in to break the cycle.',
      },
    ],
    realLifeAnalogy: {
      title: 'Two Kids Sharing Drawing Supplies',
      analogyText:
        'Imagine Maya has the only pencil and Leo has the only ruler. Maya says, "I won’t give you the pencil until I use the ruler!" Leo says, "I won’t give you the ruler until I use the pencil!" Neither can draw their picture, and both sit stuck forever.',
    },
    concreteExample:
      'In a database, Transaction 1 locks the "Savings Account" row and waits to update "Checking Account", while Transaction 2 locks "Checking Account" and waits for "Savings Account".',
    examTakeaway:
      'Deadlock occurs when four Coffman conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
    followUpQuestions: [
      'How do we break or prevent a deadlock in simple terms?',
      'What is the Banker’s Algorithm analogy?',
      'What is the difference between Deadlock and Starvation?',
    ],
  },
];

export const INITIAL_QUIZ_DATA: QuizData = {
  quizTitle: 'Database Normalization & ACID Fundamentals',
  subject: 'Database Systems',
  topic: 'Normalization & ACID Properties',
  encouragement:
    'Take your time—there is no rush! Every question is a chance to make the concept stick better.',
  questions: [
    {
      id: 'q-1',
      question:
        'Suppose you transfer $50 from your savings account to your friend. Halfway through, the power goes out. Which ACID property ensures the money is either completely transferred or not deducted at all?',
      options: [
        'Atomicity ("All or Nothing")',
        'Isolation',
        'Durability',
        'Normalization',
      ],
      correctIndex: 0,
      explanation:
        'Atomicity treats an entire transaction like a single indivisible atom: either every step succeeds together, or if any step fails, the whole transaction is rolled back safely.',
      memoryTip: 'Atomicity = All or Nothing!',
    },
    {
      id: 'q-2',
      question: 'When is a database table officially in First Normal Form (1NF)?',
      options: [
        'When it has at least three foreign keys',
        'When every cell holds a single, atomic value (no comma-separated lists in one box)',
        'When all transitive dependencies are removed',
        'When the table has no primary key',
      ],
      correctIndex: 1,
      explanation:
        '1NF is the simplest rule of clean tables: one value per cell! For example, instead of stuffing "987654, 912345" into one Phone column, each phone number gets its own clean row.',
      memoryTip: '1NF = 1 single value per cell.',
    },
    {
      id: 'q-3',
      question:
        'Why do we normalize tables in a relational database in the first place?',
      options: [
        'To make SQL queries longer to type',
        'To intentionally duplicate data across many files',
        'To reduce data redundancy (unnecessary repetition) and prevent update/delete anomalies',
        'To slow down the computer hard drive',
      ],
      correctIndex: 2,
      explanation:
        'Normalization organizes data into tidy tables so you do not repeat the same information in 50 places. That way, updating a professor’s room number only takes 1 edit instead of 50!',
      memoryTip: 'Normalize = No messy duplicates.',
    },
    {
      id: 'q-4',
      question:
        'Once a transaction says "Success! Your ticket is booked," which ACID property guarantees that your booking stays saved even if the server crashes 1 second later?',
      options: [
        'Consistency',
        'Concurrency',
        'Durability',
        'Atomicity',
      ],
      correctIndex: 2,
      explanation:
        'Durability means once a transaction is committed, it is written to permanent storage (like disk logs) so a sudden crash will never erase it.',
      memoryTip: 'Durability = Durable like permanent ink.',
    },
  ],
};

export const INITIAL_QUIZ_HISTORY: QuizAttempt[] = [
  {
    id: 'att-1',
    subject: 'Cognitive Psychology',
    topic: 'Working vs Long-Term Memory',
    score: 5,
    total: 5,
    percentage: 100,
    dateLabel: '2 days ago',
  },
  {
    id: 'att-2',
    subject: 'Database Systems',
    topic: 'ER Diagrams & SQL Joins',
    score: 4,
    total: 5,
    percentage: 80,
    dateLabel: 'Yesterday',
  },
  {
    id: 'att-3',
    subject: 'Operating Systems',
    topic: 'Process Scheduling',
    score: 4,
    total: 5,
    percentage: 80,
    dateLabel: 'Today',
  },
];

export const INITIAL_NOTES_SUMMARY: NotesSummary = {
  id: 'note-1',
  summaryTitle: 'Virtual Memory & Paging Made Simple',
  subject: 'Operating Systems',
  createdAt: 'Saved in Study Notebook',
  simpleExplanation:
    'Virtual Memory is a clever trick that lets your computer run big programs even when physical RAM is nearly full. Instead of loading an entire huge game or app into RAM at once, the Operating System slices the program into small equal-sized chunks called "Pages" and only keeps the actively used slices in RAM while parking the rest on the hard drive.',
  quickAnalogy:
    'Think of RAM as your small study desk and your hard drive as a huge bookshelf. You cannot fit all 20 textbooks on your desk at once—so you only keep the 2 pages you are reading right now on the desk, and swap pages with the bookshelf whenever you turn to a new chapter!',
  importantKeywords: [
    {
      term: 'Virtual Address Space',
      meaning: 'The illusion of a huge continuous memory space given to each running program.',
    },
    {
      term: 'Page & Frame',
      meaning: 'A Page is a fixed-size block in virtual memory; a Frame is the matching slot in physical RAM.',
    },
    {
      term: 'Page Table',
      meaning: 'The lookup map the OS uses to translate Virtual Pages into Physical RAM Frames.',
    },
    {
      term: 'Page Fault',
      meaning: 'When the CPU asks for a page that is not currently on the desk (RAM), so the OS fetches it from disk.',
    },
    {
      term: 'Thrashing',
      meaning: 'When the computer spends more time swapping pages back and forth than doing actual work.',
    },
  ],
  revisionPoints: [
    'Virtual memory separates logical memory (what the programmer sees) from physical RAM.',
    'Pages (logical) and Frames (physical) always have the exact same size (typically 4 KB).',
    'Memory Management Unit (MMU) translates virtual addresses to physical addresses using the Page Table.',
    'A Page Fault is NOT an error—it simply triggers the OS to load the missing page from disk into a free RAM frame.',
    'LRU (Least Recently Used) replaces the page that has not been touched for the longest time.',
  ],
  possibleExamQuestions: [
    {
      question: 'What is a Page Fault and what steps does the Operating System take to handle it?',
      marks: '5 Marks',
      answerHint: 'Define page fault -> Check page table bit -> Locate page on disk -> Load into free frame -> Update table & restart instruction.',
    },
    {
      question: 'Differentiate between Internal and External Fragmentation in memory management.',
      marks: '3 Marks',
      answerHint: 'Internal = wasted space inside an allocated block (Paging); External = scattered tiny gaps between blocks (Segmentation).',
    },
    {
      question: 'Explain Virtual Memory using Demand Paging and compare FIFO vs LRU replacement algorithms.',
      marks: '10 Marks',
      answerHint: 'Start with desk-bookshelf analogy, draw Page Table diagram, list Page Fault steps, and show a 3-frame example.',
    },
  ],
};

export const INITIAL_EXAM_PREP: ExamPrepGuide = {
  id: 'exam-1',
  subject: 'Operating Systems',
  topicTitle: 'Virtual Memory, Paging & Thrashing',
  examinerTip:
    'Professors love when you underline technical terms like "Page Table", "Page Fault", and "Locality of Reference", and include a clean step-by-step sequence!',
  threeMarkQuestions: [
    {
      id: 'ep-3m-1',
      marks: 3,
      question: 'Define Virtual Memory and state its two main benefits.',
      introSummary:
        'Virtual Memory is a memory management technique that gives programs the illusion of having much more RAM than physically installed by storing inactive portions on secondary disk storage.',
      structuredPoints: [
        'Allows programs larger than physical RAM to execute smoothly via Demand Paging.',
        'Increases degree of multiprogramming because many apps can share physical frames simultaneously.',
        'Provides memory protection so one process cannot accidentally overwrite another process’s Page Table.',
      ],
      keywords: ['Virtual Memory', 'Demand Paging', 'physical RAM', 'multiprogramming', 'Page Table'],
      memoryTrick: 'Remember "B-M-P": Bigger programs, More apps at once (Multiprogramming), Protected memory.',
    },
    {
      id: 'ep-3m-2',
      marks: 3,
      question: 'What is Thrashing in an Operating System and how can it be resolved?',
      introSummary:
        'Thrashing occurs when a process does not have enough physical frames in RAM and spends almost all its time swapping pages in and out (high Page Fault rate) instead of executing CPU instructions.',
      structuredPoints: [
        'Caused when total memory demand of active processes exceeds available physical RAM.',
        'CPU utilization drops sharply while disk swapping activity hits 100%.',
        'Resolved by using the Working Set Model or allocating more frames to active processes.',
      ],
      keywords: ['Thrashing', 'Page Fault rate', 'CPU utilization', 'Working Set Model', 'physical frames'],
      memoryTrick: 'Thrashing = Too much swapping, zero working!',
    },
  ],
  fiveMarkQuestions: [
    {
      id: 'ep-5m-1',
      marks: 5,
      question: 'Explain the step-by-step mechanism of handling a Page Fault in Demand Paging.',
      introSummary:
        'A Page Fault happens when a running program tries to access a virtual page whose valid-invalid bit in the Page Table is marked "Invalid" (meaning the page is currently on disk, not in RAM).',
      structuredPoints: [
        'Step 1 (Trap to OS): The hardware Memory Management Unit (MMU) notices the invalid bit and triggers a Page Fault trap to the Operating System.',
        'Step 2 (Locate on Disk): The OS verifies the memory request is legal and finds the required page in secondary backing store (swap space).',
        'Step 3 (Find Free Frame): The OS checks physical RAM for a free frame; if none is free, it runs a Page Replacement Algorithm (like LRU) to free one.',
        'Step 4 (Disk Read): The OS schedules a disk I/O read to copy the needed page into the chosen physical frame.',
        'Step 5 (Update & Restart): Once loaded, the Page Table entry is updated to "Valid" with the new frame number, and the interrupted CPU instruction restarts seamlessly.',
      ],
      keywords: ['Page Fault', 'Page Table', 'Memory Management Unit (MMU)', 'backing store', 'Page Replacement Algorithm', 'physical frame'],
      memoryTrick: 'Mnemonic "T-L-F-R-U": Trap -> Locate on disk -> Find free frame -> Read into RAM -> Update table & restart.',
    },
    {
      id: 'ep-5m-2',
      marks: 5,
      question: 'Compare FIFO and LRU Page Replacement Algorithms with their pros and cons.',
      introSummary:
        'When physical RAM is full during a Page Fault, a Page Replacement Algorithm decides which existing page in RAM should be evicted to make room for the new page.',
      structuredPoints: [
        'FIFO (First-In, First-Out): Replaces the oldest page that was brought into memory first, using a simple queue.',
        'FIFO Drawback (Belady’s Anomaly): Sometimes giving more physical frames to FIFO paradoxically increases the number of Page Faults.',
        'LRU (Least Recently Used): Replaces the page that has not been accessed for the longest period of time, relying on Locality of Reference.',
        'LRU Advantage: Performs much closer to the Optimal algorithm and never suffers from Belady’s Anomaly.',
        'Implementation Trade-off: FIFO is cheap and easy to code, whereas LRU requires timestamps or stack hardware support.',
      ],
      keywords: ['Page Replacement Algorithm', 'FIFO', 'Belady’s Anomaly', 'LRU', 'Locality of Reference', 'Page Faults'],
      memoryTrick: 'FIFO looks at birth date (oldest in RAM); LRU looks at last activity (longest ignored).',
    },
  ],
  tenMarkQuestions: [
    {
      id: 'ep-10m-1',
      marks: 10,
      question:
        'Explain the complete architecture of Paging and Virtual Memory. Discuss address translation, Demand Paging, Page Replacement, and how Locality of Reference makes Virtual Memory practical.',
      introSummary:
        'Virtual Memory with Demand Paging is the foundation of modern multitasking Operating Systems. It decouples the logical address space seen by programmers from actual physical RAM by dividing memory into fixed-size blocks.',
      structuredPoints: [
        '1. Pages vs. Frames Architecture: Logical memory is split into fixed-size blocks called Pages (e.g., 4 KB), while physical RAM is split into equal-sized slots called Frames.',
        '2. Address Translation via MMU: The CPU generates a Logical Address consisting of a Page Number (p) and a Page Offset (d). The Memory Management Unit (MMU) uses "p" as an index in the Page Table to find the corresponding Frame Number (f) and combines it with offset "d" to form the Physical Address.',
        '3. Fast Lookup with TLB: To avoid double memory access overhead, hardware uses a fast associative cache called the Translation Lookaside Buffer (TLB) to store recent page-to-frame translations.',
        '4. Demand Paging Principle: Pages are loaded into RAM lazily—only when demanded by CPU execution. Pages never requested during a run are never loaded into RAM, saving time and memory.',
        '5. Page Replacement & Dirty Bit: When RAM is full, the OS selects a victim frame using LRU or Clock replacement. A Modify (Dirty) Bit tracks whether the victim page was edited; if unchanged, it does not need to be rewritten to disk.',
        '6. Locality of Reference: Virtual memory runs fast in real life because programs spend 90% of their time in small loops and nearby arrays (Temporal and Spatial Locality), keeping the Page Fault rate extremely low.',
      ],
      keywords: [
        'Logical Address',
        'Physical Address',
        'Memory Management Unit (MMU)',
        'Page Table',
        'Translation Lookaside Buffer (TLB)',
        'Demand Paging',
        'Dirty Bit',
        'Locality of Reference',
      ],
      memoryTrick:
        'Structure your 10-mark essay in 4 blocks: Paging Map (p+d -> f+d) -> Fast Cache (TLB) -> Lazy Loading (Demand Paging) -> Smart Eviction (LRU + Dirty Bit).',
    },
  ],
};

export const INITIAL_POMODORO_LOGS: PomodoroSessionLog[] = [
  {
    id: 'pomo-1',
    subject: 'Operating Systems',
    taskTitle: 'Virtual Memory & Page Replacement',
    durationMinutes: 25,
    completedAt: 'Today, 09:30 AM',
    mode: 'study',
  },
  {
    id: 'pomo-2',
    subject: 'Database Systems',
    taskTitle: 'Normalization (1NF, 2NF, 3NF)',
    durationMinutes: 25,
    completedAt: 'Yesterday, 04:15 PM',
    mode: 'study',
  },
  {
    id: 'pomo-3',
    subject: 'Cognitive Psychology',
    taskTitle: 'Working Memory Notes Review',
    durationMinutes: 25,
    completedAt: 'Yesterday, 11:00 AM',
    mode: 'study',
  },
];

export const SAMPLE_RAW_NOTES = `Lecture 7: Database Transactions & ACID Properties
A transaction is a single logical unit of work that accesses and possibly modifies the contents of a database. Transactions access data using read and write operations.
To preserve the integrity of data in the database system, the database must ensure four properties, commonly known as ACID properties:
1. Atomicity: Either all operations of the transaction are reflected properly in the database, or none are. For example, transferring $100 from Account A to Account B involves debiting A and crediting B. Both must happen together.
2. Consistency: Execution of a transaction in isolation preserves the consistency of the database (total money before transfer = total money after transfer).
3. Isolation: Even though multiple transactions may execute concurrently, the system guarantees that for every pair of transactions Ti and Tj, it appears to Ti that either Tj finished execution before Ti started, or Tj started execution after Ti finished.
4. Durability: After a transaction completes successfully (commits), the changes it has made to the database persist, even if there are system failures or power loss.`;
