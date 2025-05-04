import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  type: z.enum(["info", "success", "warning", "error", "default"]),
});
