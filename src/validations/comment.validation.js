const Joi = require("joi");

const createCommentSchema = {
  body: Joi.object({
    message: Joi.string().required().trim().max(1000).messages({
      "string.empty": "Comment message is required",
      "string.max": "Comment cannot exceed 1000 characters",
    }),
    parentComment: Joi.string().optional().allow(null, ""), // Optional for threaded comments
  }),
};

const queryCommentSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(20),
  }),
};

module.exports = {
  createCommentSchema,
  queryCommentSchema,
};
