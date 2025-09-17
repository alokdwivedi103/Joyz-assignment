import { delegate, on, qsa } from "../utils/dom.js";

export function enableDragAndDrop({ root, onDropTask }) {
  // Make task cards draggable and set dataTransfer
  delegate(root, "dragstart", ".task-card", (event, card) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/task-id",
      card.getAttribute("data-task-id")
    );
  });

  // Highlight drop targets
  const cleanup = [];
  qsa('[data-dropzone="true"]', root).forEach((zone) => {
    cleanup.push(
      on(zone, "dragover", (event) => {
        event.preventDefault();
        zone.classList.add("drop-target");
        event.dataTransfer.dropEffect = "move";
      })
    );
    cleanup.push(
      on(zone, "dragleave", () => {
        zone.classList.remove("drop-target");
      })
    );
    cleanup.push(
      on(zone, "drop", (event) => {
        event.preventDefault();
        zone.classList.remove("drop-target");
        const taskId = event.dataTransfer.getData("text/task-id");
        const column = zone.closest(".column");
        const newStatus = column?.getAttribute("data-status");
        if (taskId && newStatus) {
          onDropTask({ taskId, newStatus });
        }
      })
    );
  });

  return () => cleanup.forEach((off) => off());
}

// --- Touch support for mobile devices ---
// Many mobile browsers do not fire HTML5 drag events for elements.
// We emulate drag-and-drop with touch events and hit-testing the dropzones.
// Touch-specific drag is removed; we rely on mobile select to move tasks.
