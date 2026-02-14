const Joi = require("joi");

const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(100).optional(),
    avatar: Joi.string().uri().optional().allow(null, ""),
    bio: Joi.string().max(500).optional().allow(""),
  }).min(1),
};

module.exports = {
  updateProfileSchema,
};
