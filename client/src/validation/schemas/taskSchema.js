import { z } from "zod";

export const taskSchema = z.object({
  text: z.string().min(3, "Text úkolu musí mít alespoň 3 znaky"),
  priority: z.enum(["No Important", "Important", "High Important"]).optional(), // nebo string().optional() dle implementace
  groupId: z.string().optional(),
});