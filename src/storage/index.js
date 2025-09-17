// Local storage wrapper for tasks persistence

const STORAGE_KEY = "kanban.tasks.v1";

export const TaskStatus = {
  Todo: "todo",
  InProgress: "inprogress",
  Done: "done",
};

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Failed to load tasks", error);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks", error);
  }
}

export function addTask(tasks, task) {
  const updated = [...tasks, task];
  saveTasks(updated);
  return updated;
}

export function updateTask(tasks, taskId, updates) {
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
  saveTasks(updated);
  return updated;
}

export function moveTask(tasks, taskId, newStatus) {
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
  saveTasks(updated);
  return updated;
}

export function removeTask(tasks, taskId) {
  const updated = tasks.filter((t) => t.id !== taskId);
  saveTasks(updated);
  return updated;
}


