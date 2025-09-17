import { createElement } from "../utils/dom.js";

export function createTaskCard(task) {
  const taskCard = createElement("div", { className: "task-card", attrs: { draggable: true, "data-task-id": task.id } });

  const titleElement = createElement("h3", { className: "task-title", text: task.title });
  const descriptionElement = createElement("p", { className: "task-desc", text: task.description || "" });

  const actionsContainer = createElement("div", { className: "task-actions" });
  const editButton = createElement("button", { className: "btn-icon", text: "Edit", attrs: { "data-action": "edit", "aria-label": "Edit task" } });
  const deleteButton = createElement("button", { className: "btn-icon", text: "Delete", attrs: { "data-action": "delete", "aria-label": "Delete task" } });
  // Mobile-only select to move between columns
  const moveSelect = createElement("select", { className: "move-select", attrs: { "data-move-select": true, "aria-label": "Move task to column" } });
  const placeholderOption = createElement("option", { attrs: { value: "" } });
  placeholderOption.textContent = "Move to...";
  placeholderOption.selected = true;
  placeholderOption.disabled = true;
  moveSelect.appendChild(placeholderOption);
  ["todo","inprogress","done"].filter((status) => status !== task.status).forEach((status) => {
    const option = createElement("option", { attrs: { value: status } });
    option.textContent = status === "todo" ? "Move to: To Do" : status === "inprogress" ? "Move to: In Progress" : "Move to: Done";
    moveSelect.appendChild(option);
  });
  actionsContainer.appendChild(moveSelect);
  actionsContainer.appendChild(editButton);
  actionsContainer.appendChild(deleteButton);

  taskCard.appendChild(titleElement);
  if (task.description) taskCard.appendChild(descriptionElement);
  taskCard.appendChild(actionsContainer);

  return taskCard;
}


