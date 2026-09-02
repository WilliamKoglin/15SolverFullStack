import Tile from "./Tile";
import { isMovable } from "../logic/puzzle";
import "./Board.css";

export default function Board({ board, onTileClick, interactive = true }) {
  return (
    <div className="board" role="grid" aria-label="15 puzzle board">
      {board.map((value, index) => (
        <Tile
          key={index}
          value={value}
          movable={interactive && value !== 0 && isMovable(board, index)}
          onClick={() => onTileClick && onTileClick(index)}
        />
      ))}
    </div>
  );
}