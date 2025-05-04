import { z } from "zod";

export const noteSchema = z.object({
  header: z.string().min(3, "Název poznámky musí mít alespoň 3 znaky"),
  text: z.string().min(1, "Text poznámky je povinný"),
  color: z.string().optional(),
  taskId: z.string().optional(),         // vazba na úkol
  groupId: z.string().optional(),        // vazba na skupinu
});