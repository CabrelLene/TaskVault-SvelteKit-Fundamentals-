import { prisma } from "./prisma";

export async function ensureDemoUser() {
  await prisma.user.upsert({
    where: { email: "demo@taskvault.com" },
    update: {},
    create: { email: "demo@taskvault.com" }
  });
}
