import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const isAuthRoute = url.pathname.startsWith("/auth");
  const isLogout = url.pathname.startsWith("/logout");

  if (!locals.user && !isAuthRoute && !isLogout) throw redirect(303, "/auth");
  return { user: locals.user };
};
