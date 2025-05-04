// src/validation/userValidation.js
import Joi from "joi";

// ✅ Schéma pro registraci
export const registrationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Uživatelské jméno je povinné",
        "string.min": "Uživatelské jméno musí mít alespoň 3 znaky",
        "string.max": "Uživatelské jméno nesmí být delší než 30 znaků",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Neplatný formát e-mailu",
        "string.empty": "E-mail je povinný",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Heslo je povinné",
        "string.min": "Heslo musí mít alespoň 6 znaků",
    }),
    gender: Joi.string().valid("male", "female", "other").optional().messages({
        "any.only": "Pohlaví musí být 'male', 'female' nebo 'other'",
    }),
});

// ✅ Schéma pro přihlášení
export const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Uživatelské jméno je povinné",
        "string.min": "Uživatelské jméno musí mít alespoň 3 znaky",
        "string.max": "Uživatelské jméno nesmí být delší než 30 znaků",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Heslo je povinné",
    }),
});
