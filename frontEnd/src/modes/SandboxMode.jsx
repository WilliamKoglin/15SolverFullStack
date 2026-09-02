import { useState, useEffect, useCallback } from "react";
import Board from "../components/Board.jsx";
import MoveCounter from "../components/MoveCounter.jsx";
import MoveLog from "../components/MoveLog.jsx";
import ReplayControls from "../components/ReplayControls.jsx";
import useReplay from "../hooks/useReplay.js";
import { solvePuzzle } from "../api/solver.js";
import {
  generateShuffledBoard,
  moveTileAt,
  arrowKeyToBlankMove,
  applyBlankMove,
  isSolved,
} from "../logic/puzzle.js";
import "./mode.css";

export default function SandboxMode() {
  const [originalBoard, setOriginalBoard] = useState(() =>
    generateShuffledBoard()
  );
  const [board, setBoard] = useState(originalBoard);
  const [userMoves, setUserMoves] = useState(0);

  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReplay, setShowReplay] = useState(false);

  const replay = useReplay(originalBoard, showReplay ? solution : null, 400);

  const newPuzzle = useCallback(() => {
    const fresh = generateShuffledBoard();
    setOriginalBoard(fresh);
    setBoard(fresh);
    setUserMoves(0);
    setSolution(null);
    setError("");
    setShowReplay(false);
  }, []);

  // User tile move (click / tap).
  const handleTileClick = useCallback(
    (index) => {
      if (showReplay) return; // lock board during replay
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
    if (showReplay) return;
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

  const handleShowSolver = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { solution: sol } = await solvePuzzle(originalBoard);
      if (sol === "Board Not Solvable") {
        setError("Board Not Solvable");
        setSolution(null);
      } else {
        setSolution(sol);
      }
    } catch (e) {
      setError("Failed to reach solver. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [originalBoard]);

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

      {solved && !showReplay && <p className="status status--ok">Solved! 🎉</p>}

      {/* Result summary after solve */}
      {solution && (
        <p className="status">
          You: {userMoves} moves — Computer: {solution.length} moves
        </p>
      )}

      {error && <p className="status status--error">{error}</p>}

      <div className="mode__actions">
        <button className="btn" onClick={newPuzzle} disabled={loading}>
          New Puzzle
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleShowSolver}
          disabled={loading}
        >
          {loading ? "Solving…" : "Show Solver"}
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

      {/* Replay UI (only when animating the computer's solution) */}
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
            onSelectStep={(s) => {
              replay.pause();
              // jump handled by clicking; step is controlled inside hook via next/prev,
              // so we expose direct jump below
            }}
          />
        </>
      )}
    </section>
  );
}