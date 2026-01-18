import { redirect } from "@sveltejs/kit";
import { destroySession } from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  await destroySession(cookies.get("sid"));
  cookies.delete("sid", { path: "/" });
  throw redirect(303, "/login");
};
