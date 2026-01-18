import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  createSessionForUser,
  signInSchema,
  signInUser,
  signUpSchema,
  signUpUser
} from "$lib/server/auth";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(303, "/tasks");
};

export const actions: Actions = {
  signin: async ({ request, cookies }) => {
    const form = await request.formData();
    const parsed = signInSchema.safeParse({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? "")
    });

    if (!parsed.success) {
      return fail(400, { mode: "signin", ok: false, message: parsed.error.issues[0]?.message });
    }

    const user = await signInUser(parsed.data);
    if (!user) {
      return fail(401, { mode: "signin", ok: false, message: "Email ou mot de passe invalide." });
    }

    const sid = await createSessionForUser(user.id);

    cookies.set("sid", sid, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false // true en prod HTTPS
    });

    throw redirect(303, "/tasks");
  },

  signup: async ({ request, cookies }) => {
    const form = await request.formData();
    const parsed = signUpSchema.safeParse({
      username: String(form.get("username") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? "")
    });

    if (!parsed.success) {
      return fail(400, { mode: "signup", ok: false, message: parsed.error.issues[0]?.message });
    }

    try {
      const user = await signUpUser(parsed.data);
      const sid = await createSessionForUser(user.id);

      cookies.set("sid", sid, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false
      });

      throw redirect(303, "/tasks");
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        return fail(409, { mode: "signup", ok: false, message: "Cet email est déjà utilisé." });
      }

      // message propre pour le portfolio (pas de crash)
      return fail(500, { mode: "signup", ok: false, message: "Erreur serveur. Réessaie." });
    }
  }
};
