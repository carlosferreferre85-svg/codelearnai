import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cl-progress";

function loadProgress(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, string[]>>(loadProgress);

  const saveProgress = useCallback((next: Record<string, string[]>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProgress(next);
  }, []);

  const markComplete = useCallback(
    (topicId: string, lessonId: string) => {
      setProgress((prev) => {
        const topicLessons = prev[topicId] ?? [];
        if (topicLessons.includes(lessonId)) return prev;
        const next = { ...prev, [topicId]: [...topicLessons, lessonId] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const isComplete = useCallback(
    (topicId: string, lessonId: string) => {
      return (progress[topicId] ?? []).includes(lessonId);
    },
    [progress]
  );

  const getTopicProgress = useCallback(
    (topicId: string, total: number) => {
      const done = (progress[topicId] ?? []).length;
      return total > 0 ? Math.round((done / total) * 100) : 0;
    },
    [progress]
  );

  const totalCompleted = Object.values(progress).reduce((sum, arr) => sum + arr.length, 0);

  return { markComplete, isComplete, getTopicProgress, totalCompleted, progress };
}
