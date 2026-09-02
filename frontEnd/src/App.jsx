import { useState } from "react";
import SandboxMode from "./modes/SandboxMode.jsx";
import InputMode from "./modes/InputMode.jsx";
import "./App.css";

const TABS = [
  { id: "sandbox", label: "Sandbox" },
  { id: "input", label: "Puzzle Input" },
];

export default function App() {
  const [mode, setMode] = useState("sandbox");

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">15-Puzzle Solver</h1>
        <nav className="app__tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mode === tab.id}
              className={`app__tab ${mode === tab.id ? "app__tab--active" : ""}`}
              onClick={() => setMode(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app__main">
        {mode === "sandbox" ? <SandboxMode /> : <InputMode />}
      </main>
    </div>
  );
}