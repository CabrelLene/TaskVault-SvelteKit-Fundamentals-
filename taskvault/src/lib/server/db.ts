import type { Task, User } from "./types";

const users: User[] = [{ id: "u1", email: "demo@taskvault.com" }];

const tasksByUser = new Map<string, Task[]>();
tasksByUser.set("u1", [
  { id: "t1", title: "Lire la doc SvelteKit", done: false, createdAt: Date.now() - 60000 },
  { id: "t2", title: "Comprendre load() et actions", done: true, createdAt: Date.now() - 30000 }
]);

export const db = {
  findUserByEmail(email: string) {
    return users.find((u) => u.email === email) ?? null;
  },

  listTasks(userId: string) {
    return tasksByUser.get(userId) ?? [];
  },

  getTask(userId: string, taskId: string) {
    return (tasksByUser.get(userId) ?? []).find((t) => t.id === taskId) ?? null;
  },

  addTask(userId: string, title: string) {
    const task: Task = { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() };
    const arr = tasksByUser.get(userId) ?? [];
    tasksByUser.set(userId, [task, ...arr]);
    return task;
  },

  toggleTask(userId: string, taskId: string) {
    const arr = tasksByUser.get(userId) ?? [];
    const t = arr.find((x) => x.id === taskId);
    if (!t) return null;
    t.done = !t.done;
    return t;
  },

  deleteTask(userId: string, taskId: string) {
    const arr = tasksByUser.get(userId) ?? [];
    const next = arr.filter((t) => t.id !== taskId);
    tasksByUser.set(userId, next);
    return next.length !== arr.length;
  }
};
