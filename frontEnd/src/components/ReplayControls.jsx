// Play / pause / step / reset controls shared by replay UIs.
import "./ReplayControls.css";

export default function ReplayControls({
  playing,
  step,
  lastStep,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
}) {
  return (
    <div className="replay-controls">
      <button
        className="btn btn--secondary"
        onClick={onReset}
        disabled={step === 0 && !playing}
        aria-label="Reset to start"
      >
        ⏮
      </button>
      <button
        className="btn btn--secondary"
        onClick={onPrev}
        disabled={step === 0}
        aria-label="Previous move"
      >
        ◀
      </button>
      {playing ? (
        <button className="btn" onClick={onPause} aria-label="Pause">
          ⏸ Pause
        </button>
      ) : (
        <button
          className="btn"
          onClick={onPlay}
          disabled={lastStep === 0}
          aria-label="Play"
        >
          ▶ Play
        </button>
      )}
      <button
        className="btn btn--secondary"
        onClick={onNext}
        disabled={step >= lastStep}
        aria-label="Next move"
      >
        ▶
      </button>
      <span className="replay-controls__progress">
        {step} / {lastStep}
      </span>
    </div>
  );
}