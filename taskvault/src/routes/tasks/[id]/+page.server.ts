import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals, params }) => {
  const task = db.getTask(locals.user!.id, params.id);
  if (!task) throw error(404, "Tâche introuvable");
  return { task };
};
