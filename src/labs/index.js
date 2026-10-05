/**
 * Registry of interactive laboratories.
 * Key -> () => import() factory for React.lazy().
 * Every lab is lazy-loaded so the initial bundle stays small.
 */
export const LAB_COMPONENTS = {
  "event-loop": () => import("./EventLoopVisualizer.jsx"),
  "call-stack": () => import("./CallStackVisualizer.jsx"),
  "variable-lab": () => import("./VariableLab.jsx"),
  "scope-explorer": () => import("./ScopeExplorer.jsx"),
  "hoisting-lab": () => import("./HoistingLab.jsx"),
  "array-lab": () => import("./ArrayLab.jsx"),
  "memory-reference": () => import("./MemoryReferenceLab.jsx"),
  "coercion-lab": () => import("./CoercionLab.jsx"),
  "decision-flow": () => import("./DecisionFlow.jsx"),
  "loop-visualizer": () => import("./LoopVisualizer.jsx"),
  "closure-explorer": () => import("./ClosureExplorer.jsx"),
  "promise-lab": () => import("./PromiseLab.jsx"),
  "async-race": () => import("./AsyncRace.jsx"),
  "dom-playground": () => import("./DomPlayground.jsx"),
  "event-propagation": () => import("./EventPropagation.jsx"),
  "storage-inspector": () => import("./StorageInspector.jsx"),
  "fetch-playground": () => import("./FetchPlayground.jsx"),
  "bug-lab": () => import("./BugLab.jsx"),
  "this-lab": () => import("./ThisLab.jsx"),
  "prototype-explorer": () => import("./PrototypeExplorer.jsx"),
  "object-explorer": () => import("./ObjectExplorer.jsx"),
  "module-graph": () => import("./ModuleGraph.jsx"),
  "recursion-visualizer": () => import("./RecursionVisualizer.jsx"),
  "runtime-visualizer": () => import("./RuntimeVisualizer.jsx"),
};

/** Human-readable lab metadata (titles come from lesson files; this is the fallback). */
export const LAB_META = {
  "event-loop": { icon: "🔁" },
  "call-stack": { icon: "📚" },
  "variable-lab": { icon: "🧪" },
  "scope-explorer": { icon: "🔭" },
  "hoisting-lab": { icon: "🎈" },
  "array-lab": { icon: "🧬" },
  "memory-reference": { icon: "🧠" },
  "coercion-lab": { icon: "🔄" },
  "decision-flow": { icon: "🔀" },
  "loop-visualizer": { icon: "➿" },
  "closure-explorer": { icon: "📦" },
  "promise-lab": { icon: "🤝" },
  "async-race": { icon: "🏁" },
  "dom-playground": { icon: "🌳" },
  "event-propagation": { icon: "🫧" },
  "storage-inspector": { icon: "💾" },
  "fetch-playground": { icon: "🌐" },
  "bug-lab": { icon: "🐞" },
  "this-lab": { icon: "👉" },
  "prototype-explorer": { icon: "⛓️" },
  "object-explorer": { icon: "🌲" },
  "module-graph": { icon: "🕸️" },
  "recursion-visualizer": { icon: "🪞" },
  "runtime-visualizer": { icon: "⚙️" },
};
