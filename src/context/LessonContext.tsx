'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LessonLevel = 'easy' | 'medium' | 'hard';

interface Lesson {
  id: string;
  phrase: string;
  category: string; // e.g., "Hygiene", "Nutrition"
  level: LessonLevel;
}

interface Feedback {
  accuracy: number;
  fluency: number;
  comments: string;
}

interface LessonContextType {
  currentLesson: Lesson | null;
  lessonLevel: LessonLevel;
  feedback: Feedback | null;
  progress: number;
  setLessonLevel: (level: LessonLevel) => void;
  startLesson: (lesson: Lesson) => void;
  updateFeedback: (data: Feedback) => void;
  updateProgress: (value: number) => void;
  resetLesson: () => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider = ({ children }: { children: ReactNode }) => {
  const [lessonLevel, setLessonLevel] = useState<LessonLevel>('easy');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setFeedback(null);
  };

  const updateFeedback = (data: Feedback) => {
    setFeedback(data);
    // update progress based on accuracy, as an example
    const newProgress = Math.min(100, progress + Math.round(data.accuracy / 10));
    setProgress(newProgress);
  };

  const updateProgress = (value: number) => setProgress(value);

  const resetLesson = () => {
    setCurrentLesson(null);
    setFeedback(null);
    setProgress(0);
  };

  return (
    <LessonContext.Provider
      value={{
        currentLesson,
        lessonLevel,
        feedback,
        progress,
        setLessonLevel,
        startLesson,
        updateFeedback,
        updateProgress,
        resetLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

// Custom hook for easy access
export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within LessonProvider');
  }
  return context;
};
