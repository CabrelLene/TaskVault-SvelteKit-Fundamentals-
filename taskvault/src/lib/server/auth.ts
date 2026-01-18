import { prisma } from "./prisma";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalide")
});

const SESSION_DAYS = 7;

export async function createSession(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt }
  });

  return { sessionId: session.id, user };
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
