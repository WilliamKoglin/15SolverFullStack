// The ONLY file that talks to the network.
const API_BASE = import.meta.env.VITE_BASE_URL;

export async function solvePuzzle(board) {
  const res = await fetch(`${API_BASE}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puzz: board }),
  });
  if (!res.ok) throw new Error(`solve failed: ${res.status}`);
  return res.json();
}

export async function genPuzzle() {
  const res = await fetch(`${API_BASE}/shuffle`, {
    method: "GET",
  });
  if (!res.ok) throw new Error(`shuffle failed: ${res.status}`);
  const data = await res.json();  
  return data.board;               
}