import { generateId } from "./utils/id.js";
import { addTask, loadTasks, moveTask, removeTask, saveTasks, TaskStatus } from "./storage/index.js";
import { renderTaskBoard } from "./render/board.js";
import { bindTaskForm, bindDeleteButton, bindEditButton, bindMoveSelect } from "./events/index.js";
import { enableDragAndDrop } from "./dnd/index.js";

let applicationState = {
  tasks: [],
};

function initializeApplication() {
  applicationState.tasks = loadTasks();
  renderTaskBoard(applicationState.tasks);

  bindTaskForm({
    onCreate: ({ title, description, status }) => {
      const newTask = { id: generateId(), title, description, status };
      applicationState.tasks = addTask(applicationState.tasks, newTask);
      renderTaskBoard(applicationState.tasks);
    },
    isTitleTaken: (title) => {
      const normalizedTitle = title.trim().toLowerCase();
      return applicationState.tasks.some((task) => task.title.trim().toLowerCase() === normalizedTitle);
    },
  });

  bindDeleteButton({
    rootElement: document,
    onDelete: (taskId) => {
      applicationState.tasks = removeTask(applicationState.tasks, taskId);
      renderTaskBoard(applicationState.tasks);
    },
  });

  bindEditButton({
    rootElement: document,
    onStartEdit: (taskId) => {
      // Rerender this card into edit mode by replacing its DOM with inputs
      const taskToEdit = applicationState.tasks.find((task) => task.id === taskId);
      if (!taskToEdit) return;
      const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
      if (!taskCard) return;
      taskCard.innerHTML = "";
      const titleInput = document.createElement("input");
      titleInput.name = "edit-title";
      titleInput.type = "text";
      titleInput.value = taskToEdit.title;
      titleInput.className = "edit-input";
      const descriptionInput = document.createElement("textarea");
      descriptionInput.name = "edit-description";
      descriptionInput.value = taskToEdit.description || "";
      descriptionInput.rows = 3;
      descriptionInput.className = "edit-textarea";
      const actionsContainer = document.createElement("div");
      actionsContainer.className = "task-actions";
      const saveButton = document.createElement("button");
      saveButton.className = "btn-icon";
      saveButton.textContent = "Save";
      saveButton.setAttribute("data-action", "save");
      const cancelButton = document.createElement("button");
      cancelButton.className = "btn-icon";
      cancelButton.textContent = "Cancel";
      cancelButton.setAttribute("data-action", "cancel");
      actionsContainer.appendChild(saveButton);
      actionsContainer.appendChild(cancelButton);
      taskCard.appendChild(titleInput);
      taskCard.appendChild(descriptionInput);
      taskCard.appendChild(actionsContainer);
    },
    onSaveEdit: ({ taskId, title, description }) => {
      const normalizedTitle = title.trim().toLowerCase();
      const isTitleAlreadyTaken = applicationState.tasks.some((task) => task.id !== taskId && task.title.trim().toLowerCase() === normalizedTitle);
      if (isTitleAlreadyTaken) {
        const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
        if (taskCard) {
          let errorElement = taskCard.querySelector('.form-error');
          if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            taskCard.appendChild(errorElement);
          }
          errorElement.textContent = 'Title must be unique';
          const titleInput = taskCard.querySelector('input[name="edit-title"]');
          titleInput?.classList.add('invalid');
          titleInput?.focus();
        }
        return;
      }
      applicationState.tasks = applicationState.tasks.map((task) => (task.id === taskId ? { ...task, title, description } : task));
      saveTasks(applicationState.tasks);
      renderTaskBoard(applicationState.tasks);
    },
    onCancelEdit: (taskId) => {
      renderTaskBoard(applicationState.tasks);
    },
  });

  bindMoveSelect({
    rootElement: document,
    onMove: ({ taskId, newStatus }) => {
      if (!Object.values(TaskStatus).includes(newStatus)) return;
      applicationState.tasks = moveTask(applicationState.tasks, taskId, newStatus);
      renderTaskBoard(applicationState.tasks);
    },
  });

  enableDragAndDrop({
    root: document,
    onDropTask: ({ taskId, newStatus }) => {
      if (!Object.values(TaskStatus).includes(newStatus)) return;
      applicationState.tasks = moveTask(applicationState.tasks, taskId, newStatus);
      renderTaskBoard(applicationState.tasks);
    },
  });

}

document.addEventListener("DOMContentLoaded", initializeApplication);


