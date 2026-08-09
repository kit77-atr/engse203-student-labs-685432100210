export async function fetchLearningTasks({ simulateError = false } = {}) {
  if (simulateError) {
    throw new Error("Simulated error: data source is unavailable");
  }

  // ใช้ relative path ชี้ตรงไปยังไฟล์ JSON ในโฟลเดอร์ public/data/
  const response = await fetch("./data/learning-tasks.json");

  if (!response.ok) {
    throw new Error(`Unable to load tasks (HTTP ${response.status})`);
  }

  const tasks = await response.json();

  if (!Array.isArray(tasks)) {
    throw new Error("The data source returned an invalid task collection");
  }

  return tasks;
}