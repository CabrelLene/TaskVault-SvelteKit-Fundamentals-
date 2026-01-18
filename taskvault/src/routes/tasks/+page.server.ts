import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { addTaskSchema, idSchema } from "$lib/server/taskSchemas";

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user!.id;

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return { tasks };
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = addTaskSchema.safeParse({ title: String(form.get("title") ?? "") });

    if (!parsed.success) return fail(400, { message: parsed.error.issues[0]?.message });

    await prisma.task.create({
      data: { userId: locals.user!.id, title: parsed.data.title }
    });

    return { ok: true };
  },

  toggle: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = idSchema.safeParse({ id: String(form.get("id") ?? "") });
    if (!parsed.success) return fail(400, { message: parsed.error.issues[0]?.message });

    const t = await prisma.task.findFirst({
      where: { id: parsed.data.id, userId: locals.user!.id }
    });
    if (!t) return fail(404, { message: "Tâche introuvable." });

    await prisma.task.update({
      where: { id: t.id },
      data: { done: !t.done }
    });

    return { ok: true };
  },

  del: async ({ request, locals }) => {
    const form = await request.formData();
    const parsed = idSchema.safeParse({ id: String(form.get("id") ?? "") });
    if (!parsed.success) return fail(400, { message: parsed.error.issues[0]?.message });

    const t = await prisma.task.findFirst({
      where: { id: parsed.data.id, userId: locals.user!.id }
    });
    if (!t) return fail(404, { message: "Tâche introuvable." });

    await prisma.task.delete({ where: { id: t.id } });
    return { ok: true };
  }
};
