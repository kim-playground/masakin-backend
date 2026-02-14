const Joi = require("joi");

const registerSchema = {
  body: Joi.object({
    name: Joi.string().required().trim().max(100).messages({
      "string.empty": "Name is required",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: Joi.string().required().email().lowercase().trim().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    avatar: Joi.string().uri().optional().allow(null, ""),
    bio: Joi.string().max(500).optional().allow(""),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().required().email().lowercase().trim().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
};

const refreshSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required().messages({
      "string.empty": "Refresh token is required",
    }),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};
