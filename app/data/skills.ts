// ╔══════════════════════════════════════════════════════════════════╗
// ║  XENOGEN SKILLS — Platform Data                                  ║
// ║  Self-contained mock data for the skills platform                ║
// ╚══════════════════════════════════════════════════════════════════╝

export type SkillCategory =
  | 'foundation'
  | 'ai'
  | 'consciousness'
  | 'critical-thinking'
  | 'soft-skill'
  | 'hard-skill'
  | 'workshop'

export type SkillStatus = 'available' | 'coming-soon' | 'locked'
export type TrackStatus = 'enrolled' | 'available' | 'locked'

export interface SkillModule {
  id: string
  title: string
  duration: string
  type: 'video' | 'text' | 'arbi' | 'practical' | 'quiz'
  completed?: boolean
}

export interface Skill {
  id: string
  title: string
  description: string
  category: SkillCategory
  level: 'beginner' | 'intermediate' | 'advanced'
  hours: number
  modules: SkillModule[]
  prerequisites: string[]
  status: SkillStatus
  enrolled?: boolean
  progress?: number
  outputsCredential: boolean
  outputsToMarket: boolean
  outputsToProfile: boolean
  color: string
  icon: string
  tags: string[]
}

export interface SkillTrack {
  id: string
  title: string
  description: string
  skills: string[]
  totalHours: number
  outcome: string
  status: TrackStatus
  progress?: number
  color: string
  icon: string
}

export interface Workshop {
  id: string
  title: string
  description: string
  provider: string
  type: 'online' | 'in-person' | 'hybrid'
  location?: string
  date?: string
  duration: string
  cost: number
  isFree: boolean
  spotsLeft?: number
  tags: string[]
  color: string
}

// ── SKILLS DATA ───────────────────────────────────────────────────

export const SKILLS: Skill[] = [
  // FOUNDATION
  {
    id: 'literacy',
    title: 'Literacy & Reading',
    description: 'Foundation reading, writing and comprehension. Start here if you need to build from the ground up.',
    category: 'foundation',
    level: 'beginner',
    hours: 20,
    prerequisites: [],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#ff9a3c',
    icon: '◈',
    tags: ['reading', 'writing', 'foundation'],
    modules: [
      { id: 'lit-1', title: 'Letters and Sounds', duration: '45 min', type: 'arbi' },
      { id: 'lit-2', title: 'Reading Simple Sentences', duration: '60 min', type: 'text' },
      { id: 'lit-3', title: 'Writing Your Name and Address', duration: '45 min', type: 'practical' },
      { id: 'lit-4', title: 'Reading Signs and Forms', duration: '60 min', type: 'arbi' },
      { id: 'lit-5', title: 'Assessment', duration: '30 min', type: 'quiz' },
    ],
  },
  {
    id: 'numeracy',
    title: 'Numeracy & Money Basics',
    description: 'Numbers, counting, basic arithmetic, budgeting and understanding money in everyday life.',
    category: 'foundation',
    level: 'beginner',
    hours: 15,
    prerequisites: [],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#ff9a3c',
    icon: '⊕',
    tags: ['numbers', 'money', 'budgeting', 'foundation'],
    modules: [
      { id: 'num-1', title: 'Counting and Basic Arithmetic', duration: '60 min', type: 'arbi' },
      { id: 'num-2', title: 'Understanding Money', duration: '45 min', type: 'text' },
      { id: 'num-3', title: 'Budgeting Basics', duration: '60 min', type: 'practical' },
      { id: 'num-4', title: 'Assessment', duration: '30 min', type: 'quiz' },
    ],
  },
  {
    id: 'digital',
    title: 'Digital Literacy',
    description: 'Smartphones, internet, email, online forms. Navigate the digital world with confidence.',
    category: 'foundation',
    level: 'beginner',
    hours: 12,
    prerequisites: [],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#ff9a3c',
    icon: '▣',
    tags: ['digital', 'internet', 'smartphone', 'email'],
    modules: [
      { id: 'dig-1', title: 'Your Smartphone — The Basics', duration: '60 min', type: 'arbi' },
      { id: 'dig-2', title: 'Internet and Browsing', duration: '45 min', type: 'text' },
      { id: 'dig-3', title: 'Email and Communication', duration: '60 min', type: 'practical' },
      { id: 'dig-4', title: 'Online Safety', duration: '30 min', type: 'text' },
      { id: 'dig-5', title: 'Assessment', duration: '20 min', type: 'quiz' },
    ],
  },

  // AI UPSKILLING
  {
    id: 'ai-literacy',
    title: 'AI Literacy',
    description: 'What AI is, what it can do, and how it will affect your work and life. Not theory — practical reality.',
    category: 'ai',
    level: 'beginner',
    hours: 8,
    prerequisites: ['digital'],
    status: 'available',
    enrolled: true,
    progress: 40,
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#00e5ff',
    icon: '◎',
    tags: ['ai', 'technology', 'future-of-work'],
    modules: [
      { id: 'ai-1', title: 'What Is AI — Plain Language', duration: '45 min', type: 'arbi', completed: true },
      { id: 'ai-2', title: 'AI Tools You Can Use Right Now', duration: '60 min', type: 'text', completed: true },
      { id: 'ai-3', title: 'How to Talk to AI — Prompting', duration: '60 min', type: 'arbi' },
      { id: 'ai-4', title: 'AI for Your Work or Business', duration: '90 min', type: 'practical' },
      { id: 'ai-5', title: 'Assessment', duration: '30 min', type: 'quiz' },
    ],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools for Work',
    description: 'Use ChatGPT, Claude, and other tools to write, plan, design and run a small business.',
    category: 'ai',
    level: 'intermediate',
    hours: 10,
    prerequisites: ['ai-literacy'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: true,
    outputsToProfile: true,
    color: '#00e5ff',
    icon: '⬡',
    tags: ['ai', 'productivity', 'business', 'writing'],
    modules: [
      { id: 'ait-1', title: 'Writing with AI', duration: '60 min', type: 'practical' },
      { id: 'ait-2', title: 'AI for Business Planning', duration: '90 min', type: 'practical' },
      { id: 'ait-3', title: 'AI for Customer Service', duration: '60 min', type: 'arbi' },
      { id: 'ait-4', title: 'Final Project: Solve a Real Problem', duration: '120 min', type: 'practical' },
    ],
  },

  // CONSCIOUSNESS & VALUES
  {
    id: 'values',
    title: 'Values, Purpose & Inner Foundation',
    description: 'Who are you? What do you want to create? Self-knowledge is the foundation of everything else.',
    category: 'consciousness',
    level: 'beginner',
    hours: 10,
    prerequisites: [],
    status: 'available',
    outputsCredential: false,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#e040fb',
    icon: '△',
    tags: ['self-knowledge', 'values', 'purpose', 'consciousness'],
    modules: [
      { id: 'val-1', title: 'A Conversation About Who You Are', duration: '60 min', type: 'arbi' },
      { id: 'val-2', title: 'What You Value — And Why', duration: '60 min', type: 'arbi' },
      { id: 'val-3', title: 'What Kind of Life Do You Want?', duration: '90 min', type: 'arbi' },
      { id: 'val-4', title: 'From Vision to First Step', duration: '60 min', type: 'practical' },
    ],
  },

  // CRITICAL THINKING
  {
    id: 'critical-thinking',
    title: 'Critical Thinking & Problem Solving',
    description: 'Question what you\'re told. Evaluate information. Solve problems without waiting to be told what to do.',
    category: 'critical-thinking',
    level: 'beginner',
    hours: 12,
    prerequisites: ['literacy'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#40c4ff',
    icon: '✦',
    tags: ['thinking', 'problem-solving', 'media-literacy', 'systems'],
    modules: [
      { id: 'ct-1', title: 'Questioning What You\'re Told', duration: '60 min', type: 'text' },
      { id: 'ct-2', title: 'How to Spot Fake News and Manipulation', duration: '60 min', type: 'arbi' },
      { id: 'ct-3', title: 'Systems Thinking', duration: '90 min', type: 'text' },
      { id: 'ct-4', title: 'Practical: Analyse a Real Problem', duration: '90 min', type: 'practical' },
      { id: 'ct-5', title: 'Assessment', duration: '30 min', type: 'quiz' },
    ],
  },

  // SOFT SKILLS
  {
    id: 'communication',
    title: 'Communication & Presentation',
    description: 'Speak clearly, listen actively, present yourself and your ideas with confidence in any room.',
    category: 'soft-skill',
    level: 'beginner',
    hours: 10,
    prerequisites: ['literacy'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#00e676',
    icon: '◉',
    tags: ['communication', 'speaking', 'listening', 'presentation'],
    modules: [
      { id: 'com-1', title: 'Voice, Posture and Presence', duration: '60 min', type: 'text' },
      { id: 'com-2', title: 'Listening — The Half People Forget', duration: '45 min', type: 'arbi' },
      { id: 'com-3', title: 'How to Structure What You Say', duration: '60 min', type: 'text' },
      { id: 'com-4', title: 'Record a 2-Minute Introduction', duration: '60 min', type: 'practical' },
    ],
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy',
    description: 'Banking, savings, credit, investing basics, and building a financial foundation from zero.',
    category: 'soft-skill',
    level: 'intermediate',
    hours: 14,
    prerequisites: ['numeracy'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: false,
    outputsToProfile: true,
    color: '#ffca28',
    icon: '◆',
    tags: ['finance', 'banking', 'savings', 'money'],
    modules: [
      { id: 'fin-1', title: 'The SA Banking System', duration: '60 min', type: 'text' },
      { id: 'fin-2', title: 'Saving — Even on Very Little', duration: '60 min', type: 'arbi' },
      { id: 'fin-3', title: 'Credit — What It Is and How to Avoid Traps', duration: '60 min', type: 'text' },
      { id: 'fin-4', title: 'Building Your First Budget', duration: '90 min', type: 'practical' },
      { id: 'fin-5', title: 'Assessment', duration: '30 min', type: 'quiz' },
    ],
  },

  // HARD SKILLS
  {
    id: 'electrical',
    title: 'Basic Electrical Work',
    description: 'Safety, basic wiring, fault finding, maintenance. Real trade skills for the Joburg market.',
    category: 'hard-skill',
    level: 'beginner',
    hours: 40,
    prerequisites: ['literacy', 'numeracy'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: true,
    outputsToProfile: true,
    color: '#ffd740',
    icon: '⊛',
    tags: ['electrical', 'trade', 'maintenance', 'wiring'],
    modules: [
      { id: 'elec-1', title: 'Electrical Safety — Non-Negotiable', duration: '120 min', type: 'text' },
      { id: 'elec-2', title: 'Reading Basic Circuits', duration: '90 min', type: 'text' },
      { id: 'elec-3', title: 'Basic Wiring Techniques', duration: '120 min', type: 'video' },
      { id: 'elec-4', title: 'Fault Finding Basics', duration: '90 min', type: 'arbi' },
      { id: 'elec-5', title: 'Practical: Complete a Wiring Task', duration: '240 min', type: 'practical' },
      { id: 'elec-6', title: 'Assessment', duration: '60 min', type: 'quiz' },
    ],
  },
  {
    id: 'plumbing',
    title: 'Basic Plumbing',
    description: 'Pipes, taps, toilets and leak repair. High-demand trade skill across Joburg.',
    category: 'hard-skill',
    level: 'beginner',
    hours: 35,
    prerequisites: ['literacy'],
    status: 'coming-soon',
    outputsCredential: true,
    outputsToMarket: true,
    outputsToProfile: true,
    color: '#69f0ae',
    icon: '⟳',
    tags: ['plumbing', 'trade', 'maintenance', 'repairs'],
    modules: [],
  },
  {
    id: 'small-business',
    title: 'Start Your Own Business',
    description: 'From idea to registered business. Joburg-specific steps, real costs, real obstacles, real solutions.',
    category: 'hard-skill',
    level: 'intermediate',
    hours: 25,
    prerequisites: ['financial-literacy', 'communication'],
    status: 'available',
    outputsCredential: true,
    outputsToMarket: true,
    outputsToProfile: true,
    color: '#ff6b35',
    icon: '▣',
    tags: ['business', 'entrepreneurship', 'cipc', 'registration'],
    modules: [
      { id: 'biz-1', title: 'Is Your Idea Viable?', duration: '90 min', type: 'arbi' },
      { id: 'biz-2', title: 'Registering with CIPC', duration: '60 min', type: 'text' },
      { id: 'biz-3', title: 'Your First Customers', duration: '90 min', type: 'arbi' },
      { id: 'biz-4', title: 'Money In, Money Out — Business Finances', duration: '90 min', type: 'practical' },
      { id: 'biz-5', title: 'Marketing on Zero Budget', duration: '60 min', type: 'text' },
      { id: 'biz-6', title: 'Business Plan — Your Draft', duration: '180 min', type: 'practical' },
    ],
  },
]

// ── SKILL TRACKS ─────────────────────────────────────────────────

export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'track-foundation',
    title: 'Foundation Track',
    description: 'Literacy, numeracy, digital skills — the platform everything else is built on.',
    skills: ['literacy', 'numeracy', 'digital'],
    totalHours: 47,
    outcome: 'Ready to enter any other skill track in the ecosystem',
    status: 'available',
    color: '#ff9a3c',
    icon: '◈',
  },
  {
    id: 'track-ai-ready',
    title: 'AI-Ready Worker',
    description: 'Understand AI, use it practically, and position yourself ahead of most people in the job market.',
    skills: ['digital', 'ai-literacy', 'ai-tools', 'critical-thinking'],
    totalHours: 42,
    outcome: 'AI-literate credential + portfolio of AI-assisted work',
    status: 'available',
    color: '#00e5ff',
    icon: '◎',
  },
  {
    id: 'track-trade',
    title: 'Joburg Trade Skills',
    description: 'Electrical and maintenance skills in high demand across Johannesburg and Gauteng.',
    skills: ['literacy', 'numeracy', 'electrical'],
    totalHours: 75,
    outcome: 'Trade credential + portfolio of practical work + Guuz marketplace listing',
    status: 'available',
    color: '#ffd740',
    icon: '⊛',
  },
  {
    id: 'track-entrepreneur',
    title: 'From Zero to Business Owner',
    description: 'Everything you need to go from no business to a registered, operating enterprise.',
    skills: ['literacy', 'numeracy', 'financial-literacy', 'communication', 'small-business'],
    totalHours: 84,
    outcome: 'Business registration credential + business plan + Guuz listing',
    status: 'available',
    color: '#ff6b35',
    icon: '▣',
  },
  {
    id: 'track-consciousness',
    title: 'Inner Foundation',
    description: 'Values, purpose, critical thinking — the inner infrastructure of any lasting outer achievement.',
    skills: ['values', 'critical-thinking', 'communication'],
    totalHours: 32,
    outcome: 'Self-knowledge profile fed into your XenoGen career engine',
    status: 'available',
    color: '#e040fb',
    icon: '△',
  },
]

// ── WORKSHOPS ─────────────────────────────────────────────────────

export const WORKSHOPS: Workshop[] = [
  {
    id: 'ws-digital-jobs',
    title: 'Digital Skills for Job Seekers',
    description: 'Practical intro to computers, email, and online job applications. Walk in uncertain, walk out capable.',
    provider: 'XenoGen Skills',
    type: 'in-person',
    location: 'Germiston Community Centre',
    date: 'Every second Saturday',
    duration: '2 days',
    cost: 0,
    isFree: true,
    spotsLeft: 6,
    tags: ['digital', 'employment', 'free', 'gauteng'],
    color: '#ff9a3c',
  },
  {
    id: 'ws-ai-tools',
    title: 'AI Tools for Small Business',
    description: 'Use free AI tools to market your business, write proposals, and serve customers better.',
    provider: 'Sentient Labs',
    type: 'online',
    date: 'Every Friday, 18:00',
    duration: '3 hours',
    cost: 0,
    isFree: true,
    spotsLeft: 33,
    tags: ['ai', 'business', 'online', 'free'],
    color: '#00e5ff',
  },
  {
    id: 'ws-start-business',
    title: 'Start Your Business in 30 Days',
    description: 'From idea to registered business. Joburg-specific, practical, and free.',
    provider: 'XenoGen Skills',
    type: 'hybrid',
    location: 'Johannesburg CBD + Online',
    date: 'Starting 1st of each month',
    duration: '4 weeks',
    cost: 0,
    isFree: true,
    spotsLeft: 8,
    tags: ['business', 'entrepreneurship', 'free', 'johannesburg'],
    color: '#ff6b35',
  },
  {
    id: 'ws-electrical',
    title: 'Intro to Electrical — Weekend Bootcamp',
    description: 'Get hands-on with basic wiring, safety, and fault finding. Bring your tools or borrow ours.',
    provider: 'XenoGen Skills',
    type: 'in-person',
    location: 'Germiston Technical Space',
    date: 'Monthly — next: 22 March',
    duration: '2 days',
    cost: 0,
    isFree: true,
    spotsLeft: 4,
    tags: ['electrical', 'trade', 'free', 'gauteng'],
    color: '#ffd740',
  },
]

// ── STATS ─────────────────────────────────────────────────────────

export const PLATFORM_STATS = {
  learnersEnrolled: 2847,
  credentialsIssued: 1203,
  skillsAvailable: SKILLS.filter(s => s.status === 'available').length,
  workshopsRunning: WORKSHOPS.length,
  completionRate: 78,
  averageHoursToCredential: 24,
}
