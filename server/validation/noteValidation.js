import Joi from "joi";

export const noteSchema = Joi.object({
  header: Joi.string().min(3).required().messages({
    "string.empty": "Nadpis je povinný",
    "string.min": "Nadpis musí mít alespoň 3 znaky",
  }),
  text: Joi.string().required().messages({
    "string.empty": "Text poznámky je povinný",
  }),
  color: Joi.string().optional(),
  group: Joi.string().optional().allow(null),
  task: Joi.string().optional().allow(null),
});