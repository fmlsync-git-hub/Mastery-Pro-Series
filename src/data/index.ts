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
    subjectShortName: 'HTML',
    description: 'Standardizing structure and accessibility for global digital infrastructure.',
    icon: 'Layout',
    color: 'orange',
    levels: levels
  },
  css: {
    id: 'css',
    title: 'Visual Engineering Systems',
    subjectShortName: 'CSS',
    description: 'Design systems, performance-led styling, and responsive interface protocols.',
    icon: 'Palette',
    color: 'blue',
    levels: cssLevels
  },
  javascript: {
    id: 'javascript',
    title: 'Computational Logic (JS)',
    subjectShortName: 'JAVASCRIPT',
    description: 'Advanced algorithm design, event-driven systems, and modern ES runtime standards.',
    icon: 'Code2',
    color: 'amber',
    levels: jsLevels
  },
  python: {
    id: 'python',
    title: 'Python Intelligence Systems',
    subjectShortName: 'PYTHON',
    description: 'Data science, automation protocols, and high-performance scripting standards.',
    icon: 'Terminal',
    color: 'sky',
    levels: levels
  },
  oracle: {
    id: 'oracle',
    title: 'Oracle Database Engineering',
    subjectShortName: 'ORACLE',
    description: 'Enterprise data management, PL/SQL optimization, and high-availability architecture.',
    icon: 'Database',
    color: 'red',
    levels: levels
  },
  java: {
    id: 'java',
    title: 'Enterprise Runtime (Java)',
    subjectShortName: 'JAVA',
    description: 'Object-oriented engineering patterns and distributed system reliability.',
    icon: 'Code2',
    color: 'rose',
    levels: levels
  },
  golang: {
    id: 'golang',
    title: 'Cloud-Native Concurrency (Go)',
    subjectShortName: 'GOLANG',
    description: 'Scalable backend architecture, microservices, and high-efficiency systems code.',
    icon: 'Cpu',
    color: 'cyan',
    levels: levels
  },
  rust: {
    id: 'rust',
    title: 'Systems Safety & Memory (Rust)',
    subjectShortName: 'RUST',
    description: 'Proximity-to-metal engineering with strict memory safety and performance.',
    icon: 'Shield',
    color: 'orange',
    levels: levels
  },
  cpp: {
    id: 'cpp',
    title: 'Advanced C++ Engineering',
    subjectShortName: 'C++',
    description: 'Metal-level performance, template metaprogramming, and low-latency systems.',
    icon: 'Cpu',
    color: 'indigo',
    levels: levels
  },
  csharp: {
    id: 'csharp',
    title: '.NET Enterprise Solutions (C#)',
    subjectShortName: 'C SHARP',
    description: 'Full-stack enterprise application development and robust software design.',
    icon: 'Code2',
    color: 'purple',
    levels: levels
  },
  sql: {
    id: 'sql',
    title: 'Relational Data Science (SQL)',
    subjectShortName: 'SQL',
    description: 'Complex query optimization, database design, and data integrity protocols.',
    icon: 'Database',
    color: 'emerald',
    levels: levels
  },
  erlang: {
    id: 'erlang',
    title: 'Fault-Tolerant Patterns (Erlang)',
    subjectShortName: 'ERLANG',
    description: 'Distributed systems, telecommunications standards, and high-availability logic.',
    icon: 'Activity',
    color: 'rose',
    levels: levels
  },
  clojure: {
    id: 'clojure',
    title: 'Functional Logic Mastery (Clojure)',
    subjectShortName: 'CLOJURE',
    description: 'Immutable data structures, concurrent processing, and JVM-based functional code.',
    icon: 'Workflow',
    color: 'teal',
    levels: levels
  },
  elixir: {
    id: 'elixir',
    title: 'Scalable Real-time Web (Elixir)',
    subjectShortName: 'ELIXIR',
    description: 'Productive and reliable web engineering on the Erlang VM.',
    icon: 'Zap',
    color: 'violet',
    levels: levels
  },
  swift: {
    id: 'swift',
    title: 'Native iOS Ecosystem (Swift)',
    subjectShortName: 'SWIFT',
    description: 'Declarative mobile architecture and high-performance Apple platform engineering.',
    icon: 'Smartphone',
    color: 'orange',
    levels: levels
  },
  kotlin: {
    id: 'kotlin',
    title: 'Modern Android Stack (Kotlin)',
    subjectShortName: 'KOTLIN',
    description: 'Cross-platform mobile development and expressive backend engineering.',
    icon: 'Smartphone',
    color: 'indigo',
    levels: levels
  }
};
