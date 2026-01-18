import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createSession } from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(303, "/tasks");
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get("email") ?? "").trim();

    if (!email) return fail(400, { message: "Email requis." });

    const session = createSession(email);
    if (!session) return fail(401, { message: "Email inconnu. Essaie demo@taskvault.com" });

    cookies.set("sid", session.sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false // mets true en prod HTTPS
    });

    throw redirect(303, "/tasks");
  }
};
