import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user!.id;
  return { tasks: db.listTasks(userId) };
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    if (title.length < 2) return fail(400, { message: "Titre trop court." });

    db.addTask(locals.user!.id, title);
    return { ok: true };
  },

  toggle: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const updated = db.toggleTask(locals.user!.id, id);
    if (!updated) return fail(404, { message: "Tâche introuvable." });
    return { ok: true };
  },

  del: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const ok = db.deleteTask(locals.user!.id, id);
    if (!ok) return fail(404, { message: "Tâche introuvable." });
    return { ok: true };
  }
};
