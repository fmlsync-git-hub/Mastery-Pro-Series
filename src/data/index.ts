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
    title: 'Data & Intelligence Systems (Py)',
    description: 'Scalable automation, data intelligence, and scientific computing protocols.',
    icon: 'Terminal',
    levels: levels // Default to HTML for now if no specific questions
  },
  java: {
    id: 'java',
    title: 'Enterprise Scalability (Java)',
    description: 'Object-oriented engineering patterns and distributed system reliability.',
    icon: 'Code2',
    levels: levels // Default to HTML for now if no specific questions
  }
};
