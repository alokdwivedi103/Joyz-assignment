import { delegateEvent, addEventListener, querySelectorAll } from "../utils/dom.js";

export function enableDragAndDrop({ root, onDropTask }) {
  // Make task cards draggable and set dataTransfer
  delegateEvent(root, "dragstart", ".task-card", (event, taskCard) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/task-id",
      taskCard.getAttribute("data-task-id")
    );
  });

  // Highlight drop targets
  const cleanupFunctions = [];
  querySelectorAll('[data-dropzone="true"]', root).forEach((dropZone) => {
    cleanupFunctions.push(
      addEventListener(dropZone, "dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("drop-target");
        event.dataTransfer.dropEffect = "move";
      })
    );
    cleanupFunctions.push(
      addEventListener(dropZone, "dragleave", () => {
        dropZone.classList.remove("drop-target");
      })
    );
    cleanupFunctions.push(
      addEventListener(dropZone, "drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("drop-target");
        const taskId = event.dataTransfer.getData("text/task-id");
        const targetColumn = dropZone.closest(".column");
        const newStatus = targetColumn?.getAttribute("data-status");
        if (taskId && newStatus) {
          onDropTask({ taskId, newStatus });
        }
      })
    );
  });

  return () => cleanupFunctions.forEach((removeEventListener) => removeEventListener());
}

