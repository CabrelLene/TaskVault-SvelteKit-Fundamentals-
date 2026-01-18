import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals, params }) => {
  const task = await prisma.task.findFirst({
    where: { id: params.id, userId: locals.user!.id }
  });

  if (!task) throw error(404, "Tâche introuvable");
  return { task };
};
