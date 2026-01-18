import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";

export const GET: RequestHandler = async ({ locals }) => {
  return json(db.listTasks(locals.user!.id));
};
