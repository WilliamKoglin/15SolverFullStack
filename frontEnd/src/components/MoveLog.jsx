// Renders the full solution as a scrollable list of tile moves, highlighting
// the current step. `solution` is an array of tile VALUES.
import { useEffect, useRef } from "react";
import "./MoveLog.css";

export default function MoveLog({ solution, currentStep, onSelectStep }) {
  const activeRef = useRef(null);

  // Keep the active move scrolled into view during playback.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentStep]);

  if (!Array.isArray(solution) || solution.length === 0) {
    return null;
  }

  return (
    <div className="move-log">
      <div className="move-log__header">
        Moves <span className="move-log__count">({solution.length})</span>
      </div>
      <ol className="move-log__list">
        {solution.map((tileValue, i) => {
          // currentStep 0 = original board; move i corresponds to step i+1.
          const isActive = currentStep === i + 1;
          const isDone = currentStep > i + 1;
          return (
            <li
              key={i}
              ref={isActive ? activeRef : null}
              className={`move-log__item ${
                isActive ? "move-log__item--active" : ""
              } ${isDone ? "move-log__item--done" : ""}`}
              onClick={() => onSelectStep && onSelectStep(i + 1)}
            >
              <span className="move-log__index">{i + 1}.</span>
              <span className="move-log__tile">Move tile {tileValue}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}