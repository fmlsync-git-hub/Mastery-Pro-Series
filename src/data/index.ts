import { LevelData, CourseData } from '../types';
import { beginnerQuestions } from './questions_beginner';
import { intermediateQuestions } from './questions_intermediate';
import { advancedQuestions } from './questions_advanced';

export const levels: Record<string, LevelData> = {
  beginner: {
    title: 'Beginner',
    description: 'Master the fundamentals of HTML structure, tags, and basic elements.',
    questions: beginnerQuestions
  },
  intermediate: {
    title: 'Intermediate',
    description: 'Level up with semantic HTML, accessibility, forms, and tables.',
    questions: intermediateQuestions
  },
  advanced: {
    title: 'Advanced',
    description: 'Master advanced topics like SEO, parsing rules, performance, and best practices.',
    questions: advancedQuestions
  }
};

export const courses: Record<string, CourseData> = {
  html: {
    id: 'html',
    title: 'HTML Architecture',
    description: 'Structure, semantics, and standard compliance.',
    icon: 'Layout',
    levels: levels
  },
  css: {
    id: 'css',
    title: 'CSS Engineering',
    description: 'Styling, layout systems, and responsive design.',
    icon: 'Palette',
    levels: levels // Placeholder: use existing levels for now or empty
  },
  javascript: {
    id: 'javascript',
    title: 'JavaScript Logic',
    description: 'Algorithm design, DOM manipulation, and ES6+.',
    icon: 'Code2',
    levels: levels
  },
  python: {
    id: 'python',
    title: 'Python Core',
    description: 'Data science, automation, and backend logic.',
    icon: 'Terminal',
    levels: levels
  },
  java: {
    id: 'java',
    title: 'Java Enterprise',
    description: 'Object-oriented patterns, JVM, and scalable backend.',
    icon: 'Code2',
    levels: levels
  }
};
