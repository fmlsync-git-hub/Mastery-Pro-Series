import { LevelData, CourseData } from '../types';
import { beginnerQuestions } from './questions_beginner';
import { intermediateQuestions } from './questions_intermediate';
import { advancedQuestions } from './questions_advanced';
import { cssQuestions } from './questions_css';
import { jsQuestions } from './questions_js';

const createLevels = (qSet: Record<string, any[]>): Record<string, LevelData> => ({
  beginner: {
    title: 'Foundational Mastery',
    description: 'Establish a rock-solid understanding of core principles and field-specific specifications.',
    questions: qSet.beginner
  },
  intermediate: {
    title: 'Strategic Implementation',
    description: 'Apply advanced concepts in high-complexity environments, focusing on industrial-grade standards.',
    questions: qSet.intermediate
  },
  advanced: {
    title: 'Elite Competency Auditing',
    description: 'Expert-level verification for precision-led decision making and high-performance domain mastery.',
    questions: qSet.advanced
  }
});

// Original HTML levels
export const levels: Record<string, LevelData> = createLevels({
  beginner: beginnerQuestions,
  intermediate: intermediateQuestions,
  advanced: advancedQuestions
});

const cssLevels = createLevels(cssQuestions);
const jsLevels = createLevels(jsQuestions);

export const courses: Record<string, CourseData> = {
  html: {
    id: 'html',
    title: 'Semantic Web Engineering',
    description: 'Standardizing structure and accessibility for global digital infrastructure.',
    icon: 'Layout',
    levels: levels
  },
  css: {
    id: 'css',
    title: 'Visual Engineering Systems',
    description: 'Design systems, performance-led styling, and responsive interface protocols.',
    icon: 'Palette',
    levels: cssLevels
  },
  javascript: {
    id: 'javascript',
    title: 'Computational Logic (JS)',
    description: 'Advanced algorithm design, event-driven systems, and modern ES runtime standards.',
    icon: 'Code2',
    levels: jsLevels
  },
  python: {
    id: 'python',
    title: 'Python Intelligence Systems',
    description: 'Data science, automation protocols, and high-performance scripting standards.',
    icon: 'Terminal',
    levels: levels
  },
  oracle: {
    id: 'oracle',
    title: 'Oracle Database Engineering',
    description: 'Enterprise data management, PL/SQL optimization, and high-availability architecture.',
    icon: 'Database',
    levels: levels
  },
  java: {
    id: 'java',
    title: 'Enterprise Runtime (Java)',
    description: 'Object-oriented engineering patterns and distributed system reliability.',
    icon: 'Code2',
    levels: levels
  },
  golang: {
    id: 'golang',
    title: 'Cloud-Native Concurrency (Go)',
    description: 'Scalable backend architecture, microservices, and high-efficiency systems code.',
    icon: 'Cpu',
    levels: levels
  },
  rust: {
    id: 'rust',
    title: 'Systems Safety & Memory (Rust)',
    description: 'Proximity-to-metal engineering with strict memory safety and performance.',
    icon: 'Shield',
    levels: levels
  },
  cpp: {
    id: 'cpp',
    title: 'Advanced C++ Engineering',
    description: 'Metal-level performance, template metaprogramming, and low-latency systems.',
    icon: 'Cpu',
    levels: levels
  },
  csharp: {
    id: 'csharp',
    title: '.NET Enterprise Solutions (C#)',
    description: 'Full-stack enterprise application development and robust software design.',
    icon: 'Code2',
    levels: levels
  },
  sql: {
    id: 'sql',
    title: 'Relational Data Science (SQL)',
    description: 'Complex query optimization, database design, and data integrity protocols.',
    icon: 'Database',
    levels: levels
  },
  erlang: {
    id: 'erlang',
    title: 'Fault-Tolerant Patterns (Erlang)',
    description: 'Distributed systems, telecommunications standards, and high-availability logic.',
    icon: 'Activity',
    levels: levels
  },
  clojure: {
    id: 'clojure',
    title: 'Functional Logic Mastery (Clojure)',
    description: 'Immutable data structures, concurrent processing, and JVM-based functional code.',
    icon: 'Workflow',
    levels: levels
  },
  elixir: {
    id: 'elixir',
    title: 'Scalable Real-time Web (Elixir)',
    description: 'Productive and reliable web engineering on the Erlang VM.',
    icon: 'Zap',
    levels: levels
  },
  swift: {
    id: 'swift',
    title: 'Native iOS Ecosystem (Swift)',
    description: 'Declarative mobile architecture and high-performance Apple platform engineering.',
    icon: 'Smartphone',
    levels: levels
  },
  kotlin: {
    id: 'kotlin',
    title: 'Modern Android Stack (Kotlin)',
    description: 'Cross-platform mobile development and expressive backend engineering.',
    icon: 'Smartphone',
    levels: levels
  }
};
