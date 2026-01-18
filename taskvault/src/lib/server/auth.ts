import { db } from "./db";
import type { User } from "./types";

const sessions = new Map<string, string>(); // sessionId -> userId

export function createSession(email: string) {
  const user = db.findUserByEmail(email);
  if (!user) return null;

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, user.id);
  return { sessionId, user };
}

export function getUserFromSession(sessionId: string | undefined): User | null {
  if (!sessionId) return null;
  const userId = sessions.get(sessionId);
  if (!userId) return null;

  // mini lookup
  const user = db.findUserByEmail("demo@taskvault.com");
  return user && user.id === userId ? user : null;
}

export function destroySession(sessionId: string | undefined) {
  if (sessionId) sessions.delete(sessionId);
}
