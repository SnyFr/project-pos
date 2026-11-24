import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().required().messages({
    "string.empty": "Nama lengkap wajib diisi",
    "string.min": "Nama minimal 3 karakter",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Format email tidak valid",
    "string.empty": "Email wajib diisi",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Password minimal 6 karakter",
    "string.empty": "Password wajib diisi",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Format email tidak valid",
    "string.empty": "Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password wajib diisi",
  }),
});