import { querySelector } from "../utils/dom.js";
import { TaskStatus } from "../storage/index.js";
import { createTaskCard } from "./taskCard.js";

const COLUMN_ID_MAP = {
  [TaskStatus.Todo]: "column-todo",
  [TaskStatus.InProgress]: "column-inprogress",
  [TaskStatus.Done]: "column-done",
};

export function clearTaskBoard() {
  Object.values(COLUMN_ID_MAP).forEach((columnId) => {
    const column = querySelector(`#${columnId}`);
    if (column) column.innerHTML = "";
  });
}

export function renderTaskBoard(tasks) {
  clearTaskBoard();
  tasks.forEach((task) => {
    const columnId = COLUMN_ID_MAP[task.status] || COLUMN_ID_MAP[TaskStatus.Todo];
    const column = querySelector(`#${columnId}`);
    if (!column) return;
    const taskCard = createTaskCard(task);
    column.appendChild(taskCard);
  });
}


