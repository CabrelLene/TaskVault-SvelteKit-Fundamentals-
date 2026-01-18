import { z } from "zod";

export const addTaskSchema = z.object({
  title: z.string().trim().min(2, "Titre trop court").max(120, "Titre trop long")
});

export const idSchema = z.object({
  id: z.string().trim().min(1, "ID manquant")
});
