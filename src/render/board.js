import { qs } from "../utils/dom.js";
import { TaskStatus } from "../storage/index.js";
import { createTaskCard } from "./taskCard.js";

const COLUMN_ID_BY_STATUS = {
  [TaskStatus.Todo]: "column-todo",
  [TaskStatus.InProgress]: "column-inprogress",
  [TaskStatus.Done]: "column-done",
};

export function clearBoard() {
  Object.values(COLUMN_ID_BY_STATUS).forEach((id) => {
    const col = qs(`#${id}`);
    if (col) col.innerHTML = "";
  });
}

export function renderBoard(tasks) {
  clearBoard();
  tasks.forEach((task) => {
    const columnId = COLUMN_ID_BY_STATUS[task.status] || COLUMN_ID_BY_STATUS[TaskStatus.Todo];
    const column = qs(`#${columnId}`);
    if (!column) return;
    const card = createTaskCard(task);
    column.appendChild(card);
  });
}


