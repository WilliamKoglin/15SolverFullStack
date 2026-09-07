// src/modes/SandboxMode.jsx
import { useState, useEffect, useCallback } from "react";
import Board from "../components/Board.jsx";
import MoveCounter from "../components/MoveCounter.jsx";
import MoveLog from "../components/MoveLog.jsx";
import ReplayControls from "../components/ReplayControls.jsx";
import useReplay from "../hooks/useReplay.js";
import { solvePuzzle, genPuzzle } from "../api/solver.js";
import {
  moveTileAt,
  arrowKeyToBlankMove,
  applyBlankMove,
  isSolved,
} from "../logic/puzzle.js";
import "./mode.css";

export default function SandboxMode() {
  // Board state — null until the backend gives us one.
  const [originalBoard, setOriginalBoard] = useState(null);
  const [board, setBoard] = useState(null);
  const [userMoves, setUserMoves] = useState(0);

  // Board-loading state (for genPuzzle).
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [boardError, setBoardError] = useState("");

  // Solver state (for solvePuzzle).
  const [solution, setSolution] = useState(null);
  const [solving, setSolving] = useState(false);
  const [solveError, setSolveError] = useState("");
  const [showReplay, setShowReplay] = useState(false);

  // Replay engine — only fed a solution when we're in replay mode.
  const replay = useReplay(originalBoard, showReplay ? solution : null, 400);

  /* -------------------- Fetch a new puzzle -------------------- */
  const newPuzzle = useCallback(async () => {
    setLoadingBoard(true);
    setBoardError("");
    // reset everything tied to the old board
    setSolution(null);
    setSolveError("");
    setShowReplay(false);
    setUserMoves(0);
    try {
      const freshBoard = await genPuzzle(); // returns the array directly
      setOriginalBoard(freshBoard);
      setBoard(freshBoard);
    } catch (e) {
      setBoardError("Couldn't load a new puzzle. Is the backend running?");
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  // Load one on first mount.
  useEffect(() => {
    newPuzzle();
  }, [newPuzzle]);

  /* -------------------- User moves -------------------- */
  const handleTileClick = useCallback(
    (index) => {
      if (showReplay || !board) return; // locked during replay / not loaded
      const next = moveTileAt(board, index);
      if (next) {
        setBoard(next);
        setUserMoves((m) => m + 1);
      }
    },
    [board, showReplay]
  );

  // Keyboard controls.
  useEffect(() => {
    if (showReplay || !board) return;
    const onKey = (e) => {
      const dir = arrowKeyToBlankMove(e.key);
      if (!dir) return;
      e.preventDefault();
      const next = applyBlankMove(board, dir);
      if (next) {
        setBoard(next);
        setUserMoves((m) => m + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, showReplay]);

  /* -------------------- Ask the solver -------------------- */
  const handleShowSolver = useCallback(async () => {
    if (!originalBoard) return;
    setSolving(true);
    setSolveError("");
    try {
      const { solution: sol } = await solvePuzzle(originalBoard);
      if (sol === "Board Not Solvable") {
        setSolveError("Board Not Solvable");
        setSolution(null);
      } else {
        setSolution(sol);
      }
    } catch (e) {
      setSolveError("Failed to reach solver. Please try again.");
    } finally {
      setSolving(false);
    }
  }, [originalBoard]);

  if (loadingBoard) {
    return (
      <section className="mode">
        <p className="status">Loading puzzle…</p>
      </section>
    );
  }

  if (boardError) {
    return (
      <section className="mode">
        <p className="status status--error">{boardError}</p>
        <div className="mode__actions">
          <button className="btn" onClick={newPuzzle}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!board) {
    //should not normally hit this.
    return (
      <section className="mode">
        <p className="status">No puzzle loaded.</p>
      </section>
    );
  }

  /* -------------------- Main render (board guaranteed to be an array) -------------------- */
  const solved = isSolved(board);
  const displayBoard = showReplay ? replay.board : board;

  return (
    <section className="mode">
      <div className="mode__counters">
        <MoveCounter label="You" count={userMoves} />
        {solution && <MoveCounter label="Computer" count={solution.length} />}
      </div>

      <Board
        board={displayBoard}
        onTileClick={handleTileClick}
        interactive={!showReplay}
      />

      {solved && !showReplay && (
        <p className="status status--ok">Solved! 🎉</p>
      )}

      {solution && (
        <p className="status">
          You: {userMoves} moves — Computer: {solution.length} moves
        </p>
      )}

      {solveError && <p className="status status--error">{solveError}</p>}

      <div className="mode__actions">
        <button className="btn" onClick={newPuzzle} disabled={solving}>
          New Puzzle
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleShowSolver}
          disabled={solving}
        >
          {solving ? "Solving…" : "Show Solver"}
        </button>
        {solution && (
          <button
            className="btn btn--secondary"
            onClick={() => setShowReplay((s) => !s)}
          >
            {showReplay ? "Exit Replay" : "Animate Solve"}
          </button>
        )}
      </div>

      {showReplay && solution && (
        <>
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
        </>
      )}
    </section>
  );
}