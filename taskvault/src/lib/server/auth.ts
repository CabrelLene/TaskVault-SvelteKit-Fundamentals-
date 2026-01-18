import { prisma } from "./prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const signUpSchema = z.object({
  username: z.string().trim().min(2, "Username trop court").max(30, "Username trop long"),
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(6, "Mot de passe: 6 caractères minimum").max(100)
});

export const signInSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

const SESSION_DAYS = 7;

export async function createSessionForUser(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: { userId, expiresAt }
  });

  return session.id;
}

export async function signUpUser(input: z.infer<typeof signUpSchema>) {
  const passwordHash = await bcrypt.hash(input.password, 10);

  // unique email assuré par Prisma
  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash
    }
  });

  return user;
}

export async function signInUser(input: z.infer<typeof signInSchema>) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) return null;

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) return null;

  return user;
}

export async function getUserFromSession(sessionId: string | undefined) {
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    return null;
  }

  return { id: session.user.id, email: session.user.email };
}

export async function destroySession(sessionId: string | undefined) {
  if (!sessionId) return;
  await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
}
