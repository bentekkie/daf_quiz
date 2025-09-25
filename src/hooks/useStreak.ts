'use client';

import { useState, useEffect, useCallback } from 'react';
import { isToday, isYesterday, parseISO, format } from 'date-fns';

const STREAK_KEY = 'dafQuizStreak';

interface StreakData {
  count: number;
  lastCompletedDate: string; // ISO date string
}

export const useStreak = () => {
  const [streak, setStreak] = useState(0);

  const getStreakData = (): StreakData | null => {
    try {
      const data = localStorage.getItem(STREAK_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading streak from localStorage", error);
      return null;
    }
  };

  const setStreakData = (data: StreakData) => {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data));
      setStreak(data.count);
    } catch (error) {
      console.error("Error saving streak to localStorage", error);
    }
  };

  const updateStreak = useCallback(() => {
    const streakData = getStreakData();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    if (!streakData) {
      // No streak data, start a new streak
      setStreakData({ count: 1, lastCompletedDate: todayStr });
      return;
    }

    const lastCompleted = parseISO(streakData.lastCompletedDate);

    if (isToday(lastCompleted)) {
      // Already completed today, do nothing
      return;
    }

    if (isYesterday(lastCompleted)) {
      // Completed yesterday, increment streak
      setStreakData({
        count: streakData.count + 1,
        lastCompletedDate: todayStr,
      });
    } else {
      // Missed a day, reset streak to 1
      setStreakData({ count: 1, lastCompletedDate: todayStr });
    }
  }, []);

  useEffect(() => {
    // On initial load, check and set the streak
    const streakData = getStreakData();
    if (streakData) {
        const lastCompleted = parseISO(streakData.lastCompletedDate);
        if (isToday(lastCompleted) || isYesterday(lastCompleted)) {
            setStreak(streakData.count);
        } else {
            // Streak is broken
            setStreakData({ count: 0, lastCompletedDate: streakData.lastCompletedDate });
        }
    }
  }, []);

  return { streak, updateStreak };
};
