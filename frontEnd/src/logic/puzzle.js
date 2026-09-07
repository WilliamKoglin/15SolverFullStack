// Handles puzzle logic (tile moves and generating boards)

export const SIZE = 4;
export const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

export const isSolved = (board) => board.every((v, i) => v === SOLVED[i]);

const idxToRC = (i) => [Math.floor(i / SIZE), i % SIZE];
const rcToIdx = (r, c) => r * SIZE + c;

const DIR_DELTA = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

// Move the blank in a direction. Returns new board or null.
export function applyBlankMove(board, dir) {
  const blank = board.indexOf(0);
  const [br, bc] = idxToRC(blank);
  const [dr, dc] = DIR_DELTA[dir];
  const nr = br + dr;
  const nc = bc + dc;
  if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) return null;
  const swap = rcToIdx(nr, nc);
  const next = [...board];
  [next[blank], next[swap]] = [next[swap], next[blank]];
  return next;
}

// Move the tile at `index` if adjacent to blank. Returns new board or null.
export function moveTileAt(board, index) {
  const blank = board.indexOf(0);
  const [br, bc] = idxToRC(blank);
  const [tr, tc] = idxToRC(index);
  const adjacent =
    (Math.abs(br - tr) === 1 && bc === tc) ||
    (Math.abs(bc - tc) === 1 && br === tr);
  if (!adjacent) return null;
  const next = [...board];
  [next[blank], next[index]] = [next[index], next[blank]];
  return next;
}

// Given a board and a TILE VALUE (from the solution), swap it with the blank.
// This is how we replay the backend's solution. Returns new board or null
// (null if the tile isn't adjacent — shouldn't happen with valid solutions).
export function applyTileValueMove(board, tileValue) {
  const index = board.indexOf(tileValue);
  if (index === -1) return null;
  return moveTileAt(board, index);
}

// Is `index` adjacent to the blank (i.e. movable by click)?
export function isMovable(board, index) {
  const blank = board.indexOf(0);
  const [br, bc] = idxToRC(blank);
  const [tr, tc] = idxToRC(index);
  return (
    (Math.abs(br - tr) === 1 && bc === tc) ||
    (Math.abs(bc - tc) === 1 && br === tr)
  );
}

// Arrow key -> blank move. ArrowUp slides a tile up => blank moves DOWN.
export function arrowKeyToBlankMove(key) {
  switch (key) {
    case "ArrowUp":
      return "D";
    case "ArrowDown":
      return "U";
    case "ArrowLeft":
      return "R";
    case "ArrowRight":
      return "L";
    default:
      return null;
  }
}
