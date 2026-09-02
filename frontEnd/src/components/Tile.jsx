import "./Tile.css";

export default function Tile({ value, onClick, movable }) {
  const isBlank = value === 0;
  return (
    <button
      type="button"
      className={`tile ${isBlank ? "tile--blank" : ""} ${
        movable ? "tile--movable" : ""
      }`}
      onClick={onClick}
      disabled={isBlank || !movable}
      aria-label={isBlank ? "empty space" : `tile ${value}`}
    >
      {isBlank ? "" : value}
    </button>
  );
}