import { z } from "zod";

export const addTaskSchema = z.object({
  title: z.string().trim().min(2, "Titre trop court").max(120, "Titre trop long"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  // input HTML date => "YYYY-MM-DD" (ou "")
  dueDate: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null))
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), "Date invalide")
});

export const idSchema = z.object({
  id: z.string().trim().min(1, "ID manquant")
});
