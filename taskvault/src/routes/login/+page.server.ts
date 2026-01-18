import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createSession, loginSchema } from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(303, "/tasks");
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const raw = { email: String(form.get("email") ?? "") };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { message: parsed.error.issues[0]?.message ?? "Données invalides" });
    }

    const session = await createSession(parsed.data.email);
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
