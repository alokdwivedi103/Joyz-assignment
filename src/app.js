import { qs } from "./utils/dom.js";
import { generateId } from "./utils/id.js";
import { addTask, loadTasks, moveTask, removeTask, saveTasks, TaskStatus } from "./storage/index.js";
import { renderBoard } from "./render/board.js";
import { bindForm, bindDelete, bindEdit, bindMoveSelect } from "./events/index.js";
import { enableDragAndDrop } from "./dnd/index.js";

let state = {
  tasks: [],
};

function init() {
  state.tasks = loadTasks();
  renderBoard(state.tasks);

  bindForm({
    onCreate: ({ title, description, status }) => {
      const task = { id: generateId(), title, description, status };
      state.tasks = addTask(state.tasks, task);
      renderBoard(state.tasks);
    },
    isTitleTaken: (title) => {
      const t = title.trim().toLowerCase();
      return state.tasks.some((task) => task.title.trim().toLowerCase() === t);
    },
  });

  bindDelete({
    root: document,
    onDelete: (taskId) => {
      state.tasks = removeTask(state.tasks, taskId);
      renderBoard(state.tasks);
    },
  });

  bindEdit({
    root: document,
    onStartEdit: (taskId) => {
      // Rerender this card into edit mode by replacing its DOM with inputs
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
      if (!card) return;
      card.innerHTML = "";
      const titleInput = document.createElement("input");
      titleInput.name = "edit-title";
      titleInput.type = "text";
      titleInput.value = task.title;
      titleInput.className = "edit-input";
      const descInput = document.createElement("textarea");
      descInput.name = "edit-description";
      descInput.value = task.description || "";
      descInput.rows = 3;
      descInput.className = "edit-textarea";
      const actions = document.createElement("div");
      actions.className = "task-actions";
      const saveBtn = document.createElement("button");
      saveBtn.className = "btn-icon";
      saveBtn.textContent = "Save";
      saveBtn.setAttribute("data-action", "save");
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn-icon";
      cancelBtn.textContent = "Cancel";
      cancelBtn.setAttribute("data-action", "cancel");
      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);
      card.appendChild(titleInput);
      card.appendChild(descInput);
      card.appendChild(actions);
    },
    onSaveEdit: ({ taskId, title, description }) => {
      const normalized = title.trim().toLowerCase();
      const isTaken = state.tasks.some((t) => t.id !== taskId && t.title.trim().toLowerCase() === normalized);
      if (isTaken) {
        const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
        if (card) {
          let error = card.querySelector('.form-error');
          if (!error) {
            error = document.createElement('div');
            error.className = 'form-error';
            card.appendChild(error);
          }
          error.textContent = 'Title must be unique';
          const input = card.querySelector('input[name="edit-title"]');
          input?.classList.add('invalid');
          input?.focus();
        }
        return;
      }
      state.tasks = state.tasks.map((t) => (t.id === taskId ? { ...t, title, description } : t));
      saveTasks(state.tasks);
      renderBoard(state.tasks);
    },
    onCancelEdit: (taskId) => {
      renderBoard(state.tasks);
    },
  });

  bindMoveSelect({
    root: document,
    onMove: ({ taskId, newStatus }) => {
      if (!Object.values(TaskStatus).includes(newStatus)) return;
      state.tasks = moveTask(state.tasks, taskId, newStatus);
      renderBoard(state.tasks);
    },
  });

  enableDragAndDrop({
    root: document,
    onDropTask: ({ taskId, newStatus }) => {
      if (!Object.values(TaskStatus).includes(newStatus)) return;
      state.tasks = moveTask(state.tasks, taskId, newStatus);
      renderBoard(state.tasks);
    },
  });

}

document.addEventListener("DOMContentLoaded", init);


