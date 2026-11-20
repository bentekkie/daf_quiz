'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { isToday, isYesterday, parseISO, format } from 'date-fns';

const STREAK_KEY = 'dafQuizStreak';

interface StreakData {
  count: number;
  lastCompletedDate: string; // ISO date string
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getStreakData(): StreakData | null {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? (JSON.parse(data) as StreakData) : null;
  } catch (error) {
    console.error("Error reading streak from localStorage", error);
    return null;
  }
}

function getStreakSnapshot(): number {
  const streakData = getStreakData();
  if (!streakData) return 0;
  const lastCompleted = parseISO(streakData.lastCompletedDate);
  if (isToday(lastCompleted) || isYesterday(lastCompleted)) {
    return streakData.count;
  }
  return 0;
}

function getServerSnapshot(): number {
  return 0;
}

function saveStreakData(data: StreakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    notifyListeners();
  } catch (error) {
    console.error("Error saving streak to localStorage", error);
  }
}

export const useStreak = () => {
  const streak = useSyncExternalStore(subscribe, getStreakSnapshot, getServerSnapshot);

  const updateStreak = useCallback(() => {
    const streakData = getStreakData();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    if (!streakData) {
      // No streak data, start a new streak
      saveStreakData({ count: 1, lastCompletedDate: todayStr });
      return;
    }

    const lastCompleted = parseISO(streakData.lastCompletedDate);

    if (isToday(lastCompleted)) {
      // Already completed today, do nothing
      return;
    }

    if (isYesterday(lastCompleted)) {
      // Completed yesterday, increment streak
      saveStreakData({
        count: streakData.count + 1,
        lastCompletedDate: todayStr,
      });
    } else {
      // Missed a day, reset streak to 1
      saveStreakData({ count: 1, lastCompletedDate: todayStr });
    }
  }, []);

  useEffect(() => {
    // Persist reset if a stored streak has expired
    const streakData = getStreakData();
    if (streakData && streakData.count !== 0) {
      const lastCompleted = parseISO(streakData.lastCompletedDate);
      if (!isToday(lastCompleted) && !isYesterday(lastCompleted)) {
        saveStreakData({ count: 0, lastCompletedDate: streakData.lastCompletedDate });
      }
    }
  }, []);

  return { streak, updateStreak };
};
