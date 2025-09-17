// Local storage wrapper for tasks persistence

const STORAGE_KEY = "kanban.tasks.v1";

export const TaskStatus = {
  Todo: "todo",
  InProgress: "inprogress",
  Done: "done",
};

export function loadTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsedTasks = JSON.parse(rawData);
    if (!Array.isArray(parsedTasks)) return [];
    return parsedTasks;
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

export function addTask(tasks, newTask) {
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function updateTask(tasks, taskId, taskUpdates) {
  const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...taskUpdates } : task));
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function moveTask(tasks, taskId, newStatus) {
  const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task));
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function removeTask(tasks, taskId) {
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(updatedTasks);
  return updatedTasks;
}


