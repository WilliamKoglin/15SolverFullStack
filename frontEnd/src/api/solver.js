// The ONLY file that talks to the network.

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === undefined
    ? true
    : import.meta.env.VITE_USE_MOCK === "true";

const SIZE = 4;

/* ---------------- MOCK HELPERS ---------------- */

function isSolvableBoard(board) {
  const tiles = board.filter((n) => n !== 0);
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++)
    for (let j = i + 1; j < tiles.length; j++)
      if (tiles[i] > tiles[j]) inversions++;
  const blankRowFromBottom = SIZE - Math.floor(board.indexOf(0) / SIZE);
  return (inversions + blankRowFromBottom) % 2 === 0;
}

// Returns an array of TILE VALUES to swap with the blank (matching real contract).
function mockSolve(board) {
  if (!isSolvableBoard(board)) return "Board Not Solvable";

  const b = [...board];
  const path = [];
  const idxToRC = (i) => [Math.floor(i / SIZE), i % SIZE];
  const manhattan = (arr) =>
    arr.reduce((s, val, i) => {
      if (val === 0) return s;
      const [r1, c1] = idxToRC(i);
      const [r2, c2] = idxToRC(val - 1);
      return s + Math.abs(r1 - r2) + Math.abs(c1 - c2);
    }, 0);
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (let step = 0; step < 800 && manhattan(b) > 0; step++) {
    const blank = b.indexOf(0);
    const [br, bc] = idxToRC(blank);
    let best = null;
    let bestScore = Infinity;
    for (const [dr, dc] of deltas) {
      const nr = br + dr;
      const nc = bc + dc;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
      const swapIdx = nr * SIZE + nc;
      const trial = [...b];
      [trial[blank], trial[swapIdx]] = [trial[swapIdx], trial[blank]];
      const score = manhattan(trial) + Math.random() * 0.6;
      if (score < bestScore) {
        bestScore = score;
        best = swapIdx;
      }
    }
    if (best == null) break;
    const tileValue = b[best]; // the numbered tile being swapped with blank
    [b[blank], b[best]] = [b[best], b[blank]];
    path.push(tileValue);
  }
  return path;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- PUBLIC API ---------------- */

/**
 * @param {number[]} board flat 16-length array, 0 = blank
 * @returns {Promise<{ solution: number[] | "Board Not Solvable" }>}
 */
export async function solvePuzzle(board) {
  if (USE_MOCK) {
    await delay(600);
    return { solution: mockSolve(board) };
  }
  const res = await fetch(`${API_BASE}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puzz: board }),
  });
  if (!res.ok) throw new Error(`solve failed: ${res.status}`);
  return res.json();
}

/**
 * @param {number[]} board
 * @returns {Promise<{ solvable: boolean }>}
 */
export async function validateBoard(board) {
  if (USE_MOCK) {
    await delay(300);
    return { solvable: isSolvableBoard(board) };
  }
  const res = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board }),
  });
  if (!res.ok) throw new Error(`validate failed: ${res.status}`);
  return res.json();
}