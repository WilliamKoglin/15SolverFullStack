import "./MoveCounter.css";

export default function MoveCounter({ label, count }) {
  return (
    <div className="move-counter">
      <span className="move-counter__label">{label}</span>
      <span className="move-counter__value">{count}</span>
    </div>
  );
}