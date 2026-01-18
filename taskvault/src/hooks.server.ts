import type { Handle } from "@sveltejs/kit";
import { getUserFromSession } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const sid = event.cookies.get("sid");
  event.locals.user = getUserFromSession(sid);

  return resolve(event);
};

declare module "@sveltejs/kit" {
  interface Locals {
    user: { id: string; email: string } | null;
  }
}
