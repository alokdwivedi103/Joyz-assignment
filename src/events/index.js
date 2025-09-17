import { querySelector, delegateEvent, addEventListener } from "../utils/dom.js";
import { TaskStatus } from "../storage/index.js";

export function bindTaskForm({ onCreate, isTitleTaken }) {
  const taskForm = querySelector("#task-form");
  if (!taskForm) return () => {};

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const titleInput = querySelector('#task-title');
    const titleErrorElement = querySelector('#task-title-error');
    const descriptionInput = querySelector('#task-description');
    const descriptionErrorElement = querySelector('#task-description-error');
    const formData = new FormData(taskForm);
    const taskTitle = String(formData.get("title") || "").trim();
    const taskDescription = String(formData.get("description") || "").trim();
    let hasValidationError = false;
    if (!taskTitle) {
      if (titleErrorElement) titleErrorElement.textContent = "Title is required";
      titleInput?.classList.add('invalid');
      if (!hasValidationError) titleInput?.focus();
      hasValidationError = true;
    } else if (taskTitle.length < 4) {
      if (titleErrorElement) titleErrorElement.textContent = "Title must be at least 4 characters";
      titleInput?.classList.add('invalid');
      if (!hasValidationError) titleInput?.focus();
      hasValidationError = true;
    } else if (isTitleTaken && isTitleTaken(taskTitle)) {
      if (titleErrorElement) titleErrorElement.textContent = "Title must be unique";
      titleInput?.classList.add('invalid');
      if (!hasValidationError) titleInput?.focus();
      hasValidationError = true;
    } else {
      if (titleErrorElement) titleErrorElement.textContent = "";
      titleInput?.classList.remove('invalid');
    }

    if (!taskDescription) {
      if (descriptionErrorElement) descriptionErrorElement.textContent = "Description is required";
      descriptionInput?.classList.add('invalid');
      if (!hasValidationError) descriptionInput?.focus();
      hasValidationError = true;
    } else if (taskDescription.length < 20) {
      if (descriptionErrorElement) descriptionErrorElement.textContent = "Description must be at least 20 characters";
      descriptionInput?.classList.add('invalid');
      if (!hasValidationError) descriptionInput?.focus();
      hasValidationError = true;
    } else {
      if (descriptionErrorElement) descriptionErrorElement.textContent = "";
      descriptionInput?.classList.remove('invalid');
    }

    if (hasValidationError) return;
    onCreate({ title: taskTitle, description: taskDescription, status: TaskStatus.Todo });
    taskForm.reset();
    if (titleErrorElement) titleErrorElement.textContent = "";
    if (descriptionErrorElement) descriptionErrorElement.textContent = "";
    titleInput?.classList.remove('invalid');
    descriptionInput?.classList.remove('invalid');
  };

  addEventListener(taskForm, "submit", formSubmitHandler);
  // Clear error on input
  const titleInputElement = querySelector('#task-title');
  const titleErrorElement = querySelector('#task-title-error');
  if (titleInputElement) {
    addEventListener(titleInputElement, 'input', () => {
      const inputValue = titleInputElement.value.trim();
      if (!inputValue) {
        titleInputElement.classList.add('invalid');
        if (titleErrorElement) titleErrorElement.textContent = 'Title is required';
      } else if (inputValue.length < 4) {
        titleInputElement.classList.add('invalid');
        if (titleErrorElement) titleErrorElement.textContent = 'Title must be at least 4 characters';
      } else if (isTitleTaken && isTitleTaken(inputValue)) {
        titleInputElement.classList.add('invalid');
        if (titleErrorElement) titleErrorElement.textContent = 'Title must be unique';
      } else {
        titleInputElement.classList.remove('invalid');
        if (titleErrorElement) titleErrorElement.textContent = '';
      }
    });
  }

  const descriptionInputElement = querySelector('#task-description');
  const descriptionErrorElement = querySelector('#task-description-error');
  if (descriptionInputElement) {
    addEventListener(descriptionInputElement, 'input', () => {
      const inputValue = descriptionInputElement.value.trim();
      if (!inputValue) {
        descriptionInputElement.classList.add('invalid');
        if (descriptionErrorElement) descriptionErrorElement.textContent = 'Description is required';
      } else if (inputValue.length < 20) {
        descriptionInputElement.classList.add('invalid');
        if (descriptionErrorElement) descriptionErrorElement.textContent = 'Description must be at least 20 characters';
      } else {
        descriptionInputElement.classList.remove('invalid');
        if (descriptionErrorElement) descriptionErrorElement.textContent = '';
      }
    });
  }
  return () => taskForm.removeEventListener("submit", formSubmitHandler);
}

export function bindDeleteButton({ rootElement, onDelete }) {
  return delegateEvent(rootElement, "click", 'button[data-action="delete"]', (event, deleteButton) => {
    const taskCard = deleteButton.closest(".task-card");
    const taskId = taskCard?.getAttribute("data-task-id");
    if (taskId) onDelete(taskId);
  });
}

export function bindEditButton({ rootElement, onStartEdit, onSaveEdit, onCancelEdit }) {
  // Start edit: replace view with inputs
  const removeEditListener = delegateEvent(rootElement, "click", 'button[data-action="edit"]', (event, editButton) => {
    const taskCard = editButton.closest(".task-card");
    const taskId = taskCard?.getAttribute("data-task-id");
    if (!taskId) return;
    onStartEdit(taskId);
  });

  // Save edit
  const removeSaveListener = delegateEvent(rootElement, "click", 'button[data-action="save"]', (event, saveButton) => {
    const taskCard = saveButton.closest(".task-card");
    const taskId = taskCard?.getAttribute("data-task-id");
    if (!taskId) return;
    const titleInput = taskCard.querySelector('input[name="edit-title"]');
    const descriptionInput = taskCard.querySelector('textarea[name="edit-description"]');
    const editedTitle = String(titleInput?.value || "").trim();
    const editedDescription = String(descriptionInput?.value || "").trim();
    if (!editedTitle) {
      titleInput?.focus();
      return;
    }
    onSaveEdit({ taskId, title: editedTitle, description: editedDescription });
  });

  // Cancel edit
  const removeCancelListener = delegateEvent(rootElement, "click", 'button[data-action="cancel"]', (event, cancelButton) => {
    const taskCard = cancelButton.closest(".task-card");
    const taskId = taskCard?.getAttribute("data-task-id");
    if (!taskId) return;
    onCancelEdit(taskId);
  });

  return () => {
    removeEditListener();
    removeSaveListener();
    removeCancelListener();
  };
}

export function bindMoveSelect({ rootElement, onMove }) {
  // Delegate change event for mobile move select
  return delegateEvent(rootElement, 'change', 'select[data-move-select]', (event, moveSelect) => {
    const taskCard = moveSelect.closest('.task-card');
    const taskId = taskCard?.getAttribute('data-task-id');
    const newStatus = moveSelect.value;
    if (taskId && newStatus) onMove({ taskId, newStatus });
  });
}


