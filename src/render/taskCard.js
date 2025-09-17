import { createEl } from "../utils/dom.js";

export function createTaskCard(task) {
  const card = createEl("div", { className: "task-card", attrs: { draggable: true, "data-task-id": task.id } });

  const title = createEl("h3", { className: "task-title", text: task.title });
  const desc = createEl("p", { className: "task-desc", text: task.description || "" });

  const actions = createEl("div", { className: "task-actions" });
  const editBtn = createEl("button", { className: "btn-icon", text: "Edit", attrs: { "data-action": "edit", "aria-label": "Edit task" } });
  const deleteBtn = createEl("button", { className: "btn-icon", text: "Delete", attrs: { "data-action": "delete", "aria-label": "Delete task" } });
  // Mobile-only select to move between columns
  const moveSelect = createEl("select", { className: "move-select", attrs: { "data-move-select": true, "aria-label": "Move task to column" } });
  const placeholder = createEl("option", { attrs: { value: "" } });
  placeholder.textContent = "Move to...";
  placeholder.selected = true;
  placeholder.disabled = true;
  moveSelect.appendChild(placeholder);
  ["todo","inprogress","done"].filter((s) => s !== task.status).forEach((status) => {
    const opt = createEl("option", { attrs: { value: status } });
    opt.textContent = status === "todo" ? "Move to: To Do" : status === "inprogress" ? "Move to: In Progress" : "Move to: Done";
    moveSelect.appendChild(opt);
  });
  actions.appendChild(moveSelect);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  if (task.description) card.appendChild(desc);
  card.appendChild(actions);

  return card;
}


