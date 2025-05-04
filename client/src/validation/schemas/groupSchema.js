import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(3, "Název skupiny musí mít alespoň 3 znaky"),
});