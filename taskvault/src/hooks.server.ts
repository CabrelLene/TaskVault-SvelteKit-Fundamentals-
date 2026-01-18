import type { Handle } from "@sveltejs/kit";
import { getUserFromSession } from "$lib/server/auth";
import { ensureDemoUser } from "$lib/server/seed";

export const handle: Handle = async ({ event, resolve }) => {
  if (process.env.NODE_ENV !== "production") {
    await ensureDemoUser();
  }

  const sid = event.cookies.get("sid");
  event.locals.user = await getUserFromSession(sid);

  return resolve(event);
};
