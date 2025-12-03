import { useEffect, useMemo, useState } from 'react';

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

type CountdownResult = {
  msRemaining: number;
  parts: TimeParts;
  percentElapsed: number;
};

export function useCountdown(
  target: Date,
  durationMinutes: number
): CountdownResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const end = target.getTime();
    const durationMs = durationMinutes * 60 * 1000;
    const start = end - durationMs;

    const msRemaining = Math.max(end - now, 0);

    const parts: TimeParts = {
      days: Math.floor(msRemaining / (24 * 60 * 60 * 1000)),
      hours: Math.floor((msRemaining / (60 * 60 * 1000)) % 24),
      minutes: Math.floor((msRemaining / (60 * 1000)) % 60),
      seconds: Math.floor((msRemaining / 1000) % 60),
      milliseconds: msRemaining % 1000,
    };

    const total = Math.max(durationMs, 1); // avoid div-by-zero
    const elapsed = Math.min(Math.max(now - start, 0), total);
    const percentElapsed = (elapsed / total) * 100;

    return {
      msRemaining,
      parts,
      percentElapsed,
    };
  }, [target, durationMinutes, now]);
}
