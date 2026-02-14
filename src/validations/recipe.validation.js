const Joi = require("joi");

const createRecipeSchema = {
  body: Joi.object({
    title: Joi.string().required().trim().max(200).messages({
      "string.empty": "Recipe title is required",
      "string.max": "Title cannot exceed 200 characters",
    }),
    description: Joi.string().required().max(2000).messages({
      "string.empty": "Recipe description is required",
      "string.max": "Description cannot exceed 2000 characters",
    }),
    ingredients: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({
        "array.min": "At least one ingredient is required",
        "array.base": "Ingredients must be an array",
      }),
    steps: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({
        "array.min": "At least one step is required",
        "array.base": "Steps must be an array",
      }),
    images: Joi.array().items(Joi.string().uri()).optional(),
    videoUrl: Joi.string().uri().optional().allow(null, ""),
    cookingTime: Joi.number().integer().min(1).required().messages({
      "number.base": "Cooking time must be a number",
      "number.min": "Cooking time must be at least 1 minute",
    }),
    portion: Joi.number().integer().min(1).required().messages({
      "number.base": "Portion must be a number",
      "number.min": "Portion must be at least 1",
    }),
    difficulty: Joi.string()
      .valid("easy", "medium", "hard")
      .required()
      .messages({
        "any.only": "Difficulty must be easy, medium, or hard",
      }),
    category: Joi.string().required().trim().messages({
      "string.empty": "Category is required",
    }),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    status: Joi.string()
      .valid("draft", "published")
      .optional()
      .default("draft"),
  }),
};

const updateRecipeSchema = {
  body: Joi.object({
    title: Joi.string().trim().max(200).optional(),
    description: Joi.string().max(2000).optional(),
    ingredients: Joi.array().items(Joi.string().required()).min(1).optional(),
    steps: Joi.array().items(Joi.string().required()).min(1).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    videoUrl: Joi.string().uri().optional().allow(null, ""),
    cookingTime: Joi.number().integer().min(1).optional(),
    portion: Joi.number().integer().min(1).optional(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    category: Joi.string().trim().optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    status: Joi.string().valid("draft", "published").optional(),
  }).min(1),
};

const queryRecipeSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    search: Joi.string().trim().optional(),
    category: Joi.string().trim().optional(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    tags: Joi.string().trim().optional(), // Comma-separated tags
    status: Joi.string().valid("draft", "published").optional(),
    author: Joi.string().optional(), // Author ID
  }),
};

const reactionSchema = {
  body: Joi.object({
    type: Joi.string().valid("like", "love", "fire").required().messages({
      "any.only": "Reaction type must be like, love, or fire",
      "string.empty": "Reaction type is required",
    }),
  }),
};

module.exports = {
  createRecipeSchema,
  updateRecipeSchema,
  queryRecipeSchema,
  reactionSchema,
};
