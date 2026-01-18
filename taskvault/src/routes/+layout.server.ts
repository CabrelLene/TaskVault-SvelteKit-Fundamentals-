import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isAuthRoute = url.pathname.startsWith("/login");
  if (!locals.user && !isAuthRoute) throw redirect(303, "/login");
  return { user: locals.user };
};
