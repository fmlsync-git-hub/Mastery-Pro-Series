import { LevelData, CourseData } from '../types';
import { beginnerQuestions } from './questions_beginner';
import { intermediateQuestions } from './questions_intermediate';
import { advancedQuestions } from './questions_advanced';

export const levels: Record<string, LevelData> = {
  beginner: {
    title: 'Foundational Mastery',
    description: 'Establish a rock-solid understanding of core principles and field-specific specifications.',
    questions: beginnerQuestions
  },
  intermediate: {
    title: 'Strategic Implementation',
    description: 'Apply advanced concepts in high-complexity environments, focusing on industrial-grade standards.',
    questions: intermediateQuestions
  },
  advanced: {
    title: 'Elite Competency Auditing',
    description: 'Expert-level verification for precision-led decision making and high-performance domain mastery.',
    questions: advancedQuestions
  }
};

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
    levels: levels
  },
  javascript: {
    id: 'javascript',
    title: 'Computational Logic (JS)',
    description: 'Advanced algorithm design, event-driven systems, and modern ES runtime standards.',
    icon: 'Code2',
    levels: levels
  },
  python: {
    id: 'python',
    title: 'Data & Intelligence Systems (Py)',
    description: 'Scalable automation, data intelligence, and scientific computing protocols.',
    icon: 'Terminal',
    levels: levels
  },
  java: {
    id: 'java',
    title: 'Enterprise Scalability (Java)',
    description: 'Object-oriented engineering patterns and distributed system reliability.',
    icon: 'Code2',
    levels: levels
  }
};
