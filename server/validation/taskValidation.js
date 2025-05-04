import Joi from "joi";

export const taskSchema = Joi.object({
  text: Joi.string().min(3).required().messages({
    "string.empty": "Text úkolu je povinný",
    "string.min": "Text úkolu musí mít alespoň 3 znaky",
  }),
  priority: Joi.string().valid("No Important", "Important", "High Important"),
  group: Joi.string().allow("default", "").optional(),
});