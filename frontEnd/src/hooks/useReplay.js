// Drives step-by-step replay of a solution (array of tile VALUES) from an
// original board state. Used by both modes.
import { useState, useEffect, useRef, useCallback } from "react";
import { applyTileValueMove } from "../logic/puzzle";

// Precompute every board state so stepping/scrubbing is O(1).
function buildFrames(originalBoard, solution) {
  const frames = [originalBoard];
  let current = originalBoard;
  for (const tileValue of solution) {
    const next = applyTileValueMove(current, tileValue);
    if (!next) break; // defensive: illegal move in solution
    frames.push(next);
    current = next;
  }
  return frames;
}

export default function useReplay(originalBoard, solution, speedMs = 500) {
  const [frames, setFrames] = useState([originalBoard || []]);
  const [step, setStep] = useState(0); // 0 = original board
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  // Rebuild frames whenever the puzzle/solution changes.
  useEffect(() => {
    if (!originalBoard || !Array.isArray(solution)) {
      setFrames([originalBoard || []]);
      setStep(0);
      setPlaying(false);
      return;
    }
    setFrames(buildFrames(originalBoard, solution));
    setStep(0);
    setPlaying(false);
  }, [originalBoard, solution]);

  const lastStep = frames.length - 1;

  // Auto-advance while playing.
  useEffect(() => {
    if (!playing) return;
    if (step >= lastStep) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), speedMs);
    return () => clearTimeout(timerRef.current);
  }, [playing, step, lastStep, speedMs]);

  const play = useCallback(() => {
    if (step >= lastStep) setStep(0); // replay from start if finished
    setPlaying(true);
  }, [step, lastStep]);

  const pause = useCallback(() => setPlaying(false), []);
  const next = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.min(s + 1, lastStep));
  }, [lastStep]);
  const prev = useCallback(() => {
    setPlaying(false);
    setStep((s) => Math.max(s - 1, 0));
  }, []);
  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

// ...inside useReplay, add alongside the other callbacks:
const goTo = useCallback(
  (target) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(target, frames.length - 1)));
  },
  [frames.length]
);

// ...and include it in the returned object:
return {
  board: frames[step] || [],
  step,
  lastStep,
  playing,
  play,
  pause,
  next,
  prev,
  reset,
  goTo, // <-- new
};
}