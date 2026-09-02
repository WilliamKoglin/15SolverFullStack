// Sequential entry: user types tile values one at a time, row by row,
// left to right. Then solve + animated replay with full controls.
import { useState, useCallback, useRef } from "react";
import Board from "../components/Board.jsx";
import MoveLog from "../components/MoveLog.jsx";
import ReplayControls from "../components/ReplayControls.jsx";
import useReplay from "../hooks/useReplay.js";
import { solvePuzzle } from "../api/solver.js";
import "./mode.css";

const EMPTY = Array(16).fill(null); // null = not yet entered

export default function InputMode() {
  const [entries, setEntries] = useState(EMPTY);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const [submittedBoard, setSubmittedBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const inputRef = useRef(null);

  const filledCount = entries.filter((v) => v !== null).length;
  const complete = filledCount === 16;

  const replay = useReplay(submittedBoard, solution, 500);

  // Add the next value in sequence.
  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      setInputError("");
      const trimmed = inputValue.trim();
      if (trimmed === "") return;

      const num = Number(trimmed);
      if (!Number.isInteger(num) || num < 0 || num > 15) {
        setInputError("Enter a whole number from 0 to 15.");
        return;
      }
      if (entries.includes(num)) {
        setInputError(`${num} has already been placed.`);
        return;
      }
      const nextEmpty = entries.indexOf(null);
      if (nextEmpty === -1) return;

      const next = [...entries];
      next[nextEmpty] = num;
      setEntries(next);
      setInputValue("");
      inputRef.current?.focus();
    },
    [inputValue, entries]
  );

  const handleUndo = useCallback(() => {
    const lastFilled = entries.reduce(
      (acc, v, i) => (v !== null ? i : acc),
      -1
    );
    if (lastFilled === -1) return;
    const next = [...entries];
    next[lastFilled] = null;
    setEntries(next);
    setInputError("");
  }, [entries]);

  const handleClear = useCallback(() => {
    setEntries(EMPTY);
    setInputValue("");
    setInputError("");
    setSubmittedBoard(null);
    setSolution(null);
    setApiError("");
  }, []);

  const handleSolve = useCallback(async () => {
    if (!complete) return;
    // Every value 0–15 is present exactly once (uniqueness enforced on
    // entry), so it's a structurally valid board. Solvability is decided
    // by the backend.
    const board = entries.map((v) => v);
    setSubmittedBoard(board);
    setSolution(null);
    setApiError("");
    setLoading(true);
    try {
      const { solution: sol } = await solvePuzzle(board);
      if (sol === "Board Not Solvable") {
        setApiError("Board Not Solvable");
      } else {
        setSolution(sol);
      }
    } catch (e) {
      setApiError("Failed to reach solver. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [complete, entries]);

  // What to render: live replay if solved, else the in-progress entry board.
  const previewBoard = entries.map((v) => (v === null ? 0 : v));
  const displayBoard =
    submittedBoard && solution ? replay.board : previewBoard;

  return (
    <section className="mode">
      <Board board={displayBoard} interactive={false} />

      {/* Entry controls (hidden once we have a solution to replay) */}
      {!solution && (
        <form className="input-form" onSubmit={handleAdd}>
          <label className="input-form__label">
            Enter the tile # at index {Math.min(filledCount + 1, 16)} of 16 (row by row,
            left→right). Use <strong>0</strong> for the blank.
          </label>
          <div className="input-form__row">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min="0"
              max="15"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={complete || loading}
              className="input-form__field"
              autoFocus
            />
            <button
              type="submit"
              className="btn"
              disabled={complete || loading}
            >
              Add
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleUndo}
              disabled={filledCount === 0 || loading}
            >
              Undo
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {inputError && <p className="status status--error">{inputError}</p>}

          <div className="input-form__progress">
            {filledCount} / 16 tiles placed
          </div>

          <button
            type="button"
            className="btn input-form__solve"
            onClick={handleSolve}
            disabled={!complete || loading}
          >
            {loading ? "Solving…" : "Solve"}
          </button>
        </form>
      )}

      {apiError && <p className="status status--error">{apiError}</p>}

      {/* Replay UI once solved */}
      {solution && (
        <>
          <p className="status">Solved in {solution.length} moves.</p>

          <ReplayControls
            playing={replay.playing}
            step={replay.step}
            lastStep={replay.lastStep}
            onPlay={replay.play}
            onPause={replay.pause}
            onNext={replay.next}
            onPrev={replay.prev}
            onReset={replay.reset}
          />

          <MoveLog
            solution={solution}
            currentStep={replay.step}
            onSelectStep={(s) => replay.goTo(s)}
          />

          <div className="mode__actions">
            <button className="btn btn--secondary" onClick={handleClear}>
              New Board
            </button>
          </div>
        </>
      )}
    </section>
  );
}