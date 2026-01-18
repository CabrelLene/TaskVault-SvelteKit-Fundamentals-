import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { addTaskSchema, idSchema } from "$lib/server/taskSchemas";

type Priority = "low" | "normal" | "high";

type TaskRow = {
  id: string;
  userId: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
};

type TaskRowWithBadges = TaskRow & {
  isDueToday: boolean;
  isOverdue: boolean;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const userId = locals.user!.id;

  const q = (url.searchParams.get("q") ?? "").trim();
  const status = url.searchParams.get("status") ?? "all"; // all | open | done
  const sort = url.searchParams.get("sort") ?? "created"; // created | due | priority

  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(50, Math.max(5, Number(url.searchParams.get("limit") ?? "10") || 10));

  // on garde simple, sans types Prisma
  const where: Record<string, any> = { userId };
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status === "open") where.done = false;
  if (status === "done") where.done = true;

  const orderBy =
    sort === "due"
      ? [{ dueDate: "asc" as const }, { createdAt: "desc" as const }]
      : sort === "priority"
      ? [{ priority: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const total = await prisma.task.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;

  const tasks = (await prisma.task.findMany({
    where,
    orderBy,
    skip,
    take: limit
  })) as TaskRow[];

  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const now = new Date();

  const enriched: TaskRowWithBadges[] = tasks.map((t) => {
    const due = t.dueDate ? new Date(t.dueDate) : null;
    const isDueToday = due ? due >= todayStart && due <= todayEnd : false;
    const isOverdue = due ? due < now && !t.done : false;
    return { ...t, isDueToday, isOverdue };
  });

  return {
    tasks: enriched,
    q,
    status,
    sort,
    page: safePage,
    limit,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages
  };
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = addTaskSchema.safeParse({
      title: String(form.get("title") ?? ""),
      priority: String(form.get("priority") ?? "normal"),
      dueDate: String(form.get("dueDate") ?? "")
    });

    if (!parsed.success) return fail(400, { ok: false, message: parsed.error.issues[0]?.message });

    const dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate + "T12:00:00") : null;

    await prisma.task.create({
      data: {
        userId: locals.user!.id,
        title: parsed.data.title,
        priority: parsed.data.priority,
        dueDate
      }
    });

    return { ok: true, message: "Tâche ajoutée ✅" };
  },

  toggle: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = idSchema.safeParse({ id: String(form.get("id") ?? "") });
    if (!parsed.success) return fail(400, { ok: false, message: parsed.error.issues[0]?.message });

    const t = await prisma.task.findFirst({
      where: { id: parsed.data.id, userId: locals.user!.id }
    });
    if (!t) return fail(404, { ok: false, message: "Tâche introuvable." });

    await prisma.task.update({
      where: { id: t.id },
      data: { done: !t.done }
    });

    return { ok: true, message: t.done ? "Marquée à faire ⬜" : "Terminée ✅" };
  },

  del: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = idSchema.safeParse({ id: String(form.get("id") ?? "") });
    if (!parsed.success) return fail(400, { ok: false, message: parsed.error.issues[0]?.message });

    const t = await prisma.task.findFirst({
      where: { id: parsed.data.id, userId: locals.user!.id }
    });
    if (!t) return fail(404, { ok: false, message: "Tâche introuvable." });

    await prisma.task.delete({ where: { id: t.id } });

    return { ok: true, message: "Tâche supprimée 🗑️" };
  }
};
