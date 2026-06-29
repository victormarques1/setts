"use client";

import { useEffect, useRef, useState } from "react";

export type RestTimerState = {
  elapsedMs: number;
  startedAt: number | null;
};

const STORAGE_KEY_PREFIX = "rest-timer";

export function getRestTimerStorageKey(sessionId: string): string {
  return `${STORAGE_KEY_PREFIX}-${sessionId}`;
}

export function formatRestTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function loadTimerState(storageKey: string): RestTimerState {
  if (typeof window === "undefined") {
    return { elapsedMs: 0, startedAt: null };
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as RestTimerState;
    }
  } catch {
    // ignore parse errors
  }

  return { elapsedMs: 0, startedAt: null };
}

function computeDisplayMs(state: RestTimerState): number {
  if (state.startedAt === null) {
    return state.elapsedMs;
  }

  return state.elapsedMs + (Date.now() - state.startedAt);
}

export function useRestTimer(sessionId: string) {
  const storageKey = getRestTimerStorageKey(sessionId);
  const [timerState, setTimerState] = useState<RestTimerState>(() =>
    loadTimerState(storageKey),
  );
  const [, forceUpdate] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = timerState.startedAt !== null;
  const displayMs = computeDisplayMs(timerState);
  const hasTime = displayMs > 0;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(timerState));
    } catch {
      // ignore storage errors
    }
  }, [timerState, storageKey]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        forceUpdate((value) => value + 1);
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  function start() {
    setTimerState((previous) => ({ ...previous, startedAt: Date.now() }));
  }

  function pause() {
    setTimerState((previous) => {
      if (previous.startedAt === null) {
        return previous;
      }

      return {
        elapsedMs: previous.elapsedMs + (Date.now() - previous.startedAt),
        startedAt: null,
      };
    });
  }

  function reset() {
    setTimerState({ elapsedMs: 0, startedAt: null });
  }

  return {
    displayMs,
    formattedTime: formatRestTime(displayMs),
    hasTime,
    isRunning,
    start,
    pause,
    reset,
  };
}
