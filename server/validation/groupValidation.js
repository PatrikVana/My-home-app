import Joi from "joi";

// ✅ Validace skupiny (název povinný, min. 3 znaky)
export const groupSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.empty": "Název skupiny je povinný",
    "string.min": "Název skupiny musí mít alespoň 3 znaky",
  }),
});