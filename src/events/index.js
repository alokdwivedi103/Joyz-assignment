import { qs, delegate, on } from "../utils/dom.js";
import { TaskStatus } from "../storage/index.js";

export function bindForm({ onCreate, isTitleTaken }) {
  const form = qs("#task-form");
  if (!form) return () => {};

  const handler = (event) => {
    event.preventDefault();
    const titleInput = qs('#task-title');
    const titleError = qs('#task-title-error');
    const descInput = qs('#task-description');
    const descError = qs('#task-description-error');
    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    let hasError = false;
    if (!title) {
      if (titleError) titleError.textContent = "Title is required";
      titleInput?.classList.add('invalid');
      if (!hasError) titleInput?.focus();
      hasError = true;
    } else if (title.length < 4) {
      if (titleError) titleError.textContent = "Title must be at least 4 characters";
      titleInput?.classList.add('invalid');
      if (!hasError) titleInput?.focus();
      hasError = true;
    } else if (isTitleTaken && isTitleTaken(title)) {
      if (titleError) titleError.textContent = "Title must be unique";
      titleInput?.classList.add('invalid');
      if (!hasError) titleInput?.focus();
      hasError = true;
    } else {
      if (titleError) titleError.textContent = "";
      titleInput?.classList.remove('invalid');
    }

    if (!description) {
      if (descError) descError.textContent = "Description is required";
      descInput?.classList.add('invalid');
      if (!hasError) descInput?.focus();
      hasError = true;
    } else if (description.length < 20) {
      if (descError) descError.textContent = "Description must be at least 20 characters";
      descInput?.classList.add('invalid');
      if (!hasError) descInput?.focus();
      hasError = true;
    } else {
      if (descError) descError.textContent = "";
      descInput?.classList.remove('invalid');
    }

    if (hasError) return;
    onCreate({ title, description, status: TaskStatus.Todo });
    form.reset();
    if (titleError) titleError.textContent = "";
    if (descError) descError.textContent = "";
    titleInput?.classList.remove('invalid');
    descInput?.classList.remove('invalid');
  };

  on(form, "submit", handler);
  // Clear error on input
  const titleInputEl = qs('#task-title');
  const titleErrorEl = qs('#task-title-error');
  if (titleInputEl) {
    on(titleInputEl, 'input', () => {
      const v = titleInputEl.value.trim();
      if (!v) {
        titleInputEl.classList.add('invalid');
        if (titleErrorEl) titleErrorEl.textContent = 'Title is required';
      } else if (v.length < 4) {
        titleInputEl.classList.add('invalid');
        if (titleErrorEl) titleErrorEl.textContent = 'Title must be at least 4 characters';
      } else if (isTitleTaken && isTitleTaken(v)) {
        titleInputEl.classList.add('invalid');
        if (titleErrorEl) titleErrorEl.textContent = 'Title must be unique';
      } else {
        titleInputEl.classList.remove('invalid');
        if (titleErrorEl) titleErrorEl.textContent = '';
      }
    });
  }

  const descInputEl = qs('#task-description');
  const descErrorEl = qs('#task-description-error');
  if (descInputEl) {
    on(descInputEl, 'input', () => {
      const v = descInputEl.value.trim();
      if (!v) {
        descInputEl.classList.add('invalid');
        if (descErrorEl) descErrorEl.textContent = 'Description is required';
      } else if (v.length < 20) {
        descInputEl.classList.add('invalid');
        if (descErrorEl) descErrorEl.textContent = 'Description must be at least 20 characters';
      } else {
        descInputEl.classList.remove('invalid');
        if (descErrorEl) descErrorEl.textContent = '';
      }
    });
  }
  return () => form.removeEventListener("submit", handler);
}

export function bindDelete({ root, onDelete }) {
  return delegate(root, "click", 'button[data-action="delete"]', (event, button) => {
    const card = button.closest(".task-card");
    const taskId = card?.getAttribute("data-task-id");
    if (taskId) onDelete(taskId);
  });
}

export function bindEdit({ root, onStartEdit, onSaveEdit, onCancelEdit }) {
  // Start edit: replace view with inputs
  const offEdit = delegate(root, "click", 'button[data-action="edit"]', (event, button) => {
    const card = button.closest(".task-card");
    const taskId = card?.getAttribute("data-task-id");
    if (!taskId) return;
    onStartEdit(taskId);
  });

  // Save edit
  const offSave = delegate(root, "click", 'button[data-action="save"]', (event, button) => {
    const card = button.closest(".task-card");
    const taskId = card?.getAttribute("data-task-id");
    if (!taskId) return;
    const titleInput = card.querySelector('input[name="edit-title"]');
    const descInput = card.querySelector('textarea[name="edit-description"]');
    const title = String(titleInput?.value || "").trim();
    const description = String(descInput?.value || "").trim();
    if (!title) {
      titleInput?.focus();
      return;
    }
    onSaveEdit({ taskId, title, description });
  });

  // Cancel edit
  const offCancel = delegate(root, "click", 'button[data-action="cancel"]', (event, button) => {
    const card = button.closest(".task-card");
    const taskId = card?.getAttribute("data-task-id");
    if (!taskId) return;
    onCancelEdit(taskId);
  });

  return () => {
    offEdit();
    offSave();
    offCancel();
  };
}

export function bindMoveSelect({ root, onMove }) {
  // Delegate change event for mobile move select
  return delegate(root, 'change', 'select[data-move-select]', (event, select) => {
    const card = select.closest('.task-card');
    const taskId = card?.getAttribute('data-task-id');
    const newStatus = select.value;
    if (taskId && newStatus) onMove({ taskId, newStatus });
  });
}


