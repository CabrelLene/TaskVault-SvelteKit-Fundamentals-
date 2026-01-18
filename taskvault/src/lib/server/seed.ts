import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function ensureDemoUser() {
  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  await prisma.user.upsert({
    where: { email: "demo@taskvault.com" },
    update: {
      username: "demo"
    },
    create: {
      username: "demo",
      email: "demo@taskvault.com",
      passwordHash
    }
  });
}
