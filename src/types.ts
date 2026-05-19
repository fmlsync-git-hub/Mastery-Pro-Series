/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string | number;
  question: string;
  options: string[];
  answer: string;
}

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'kids' | 'elementary' | 'highschool' | 'academic' | 'pro';
export type AppMode = 'certification' | 'training';

export interface LevelData {
  title: string;
  description: string;
  questions: Question[];
  trainingContent?: string; // Markdown for the training module
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  subjectShortName?: string;
  levels: Record<string, LevelData>;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  registeredAt: string;
  isAdmin?: boolean;
  purchasedLevels?: string[]; // format: "courseId_level"
}

export interface AppState {
  user: UserProfile | null;
  mode: AppMode;
  currentCourseId: string | null;
  currentLevel: Level | null;
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string>;
  isFinished: boolean;
  showMilestone: boolean;
  viewingReview: boolean;
  viewingAdmin: boolean;
  hasSeenLanding: boolean;
}
