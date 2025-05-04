import { z } from 'zod';

export const registrationSchema = z.object({
  username: z.string().min(1, "Uživatelské jméno je povinné"),
  email: z.string().email("Neplatný formát e-mailu"),
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
  gender: z.string().refine((val) => val !== "", {
    message: "Zvolte pohlaví",
  }),
});