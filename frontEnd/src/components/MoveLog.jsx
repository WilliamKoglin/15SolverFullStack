// src/components/MoveLog.jsx
import { useEffect, useRef } from "react";
import "./MoveLog.css";

export default function MoveLog({ solution, currentStep, onSelectStep }) {
  const listRef = useRef(null);
  const activeRef = useRef(null);

  // Scroll WITHIN the log box only — never the page.
  useEffect(() => {
    const list = listRef.current;
    const active = activeRef.current;
    if (!list || !active) return;

    const listTop = list.scrollTop;
    const listBottom = listTop + list.clientHeight;
    const itemTop = active.offsetTop;
    const itemBottom = itemTop + active.offsetHeight;

    // Only scroll the container if the active item is out of view.
    if (itemTop < listTop) {
      list.scrollTop = itemTop;
    } else if (itemBottom > listBottom) {
      list.scrollTop = itemBottom - list.clientHeight;
    }
  }, [currentStep]);

  if (!Array.isArray(solution) || solution.length === 0) {
    return null;
  }

  return (
    <div className="move-log">
      <div className="move-log__header">
        Moves <span className="move-log__count">({solution.length})</span>
      </div>
      <ol className="move-log__list" ref={listRef}>
        {solution.map((tileValue, i) => {
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