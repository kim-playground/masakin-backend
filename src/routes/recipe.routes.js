const express = require("express");
const recipeController = require("../controllers/recipe.controller");
const commentController = require("../controllers/comment.controller");
const { authenticate, optionalAuth } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const {
  createRecipeSchema,
  updateRecipeSchema,
  queryRecipeSchema,
  reactionSchema,
} = require("../validations/recipe.validation");
const {
  createCommentSchema,
  queryCommentSchema,
} = require("../validations/comment.validation");

const router = express.Router();

// Public routes
router.get("/", validate(queryRecipeSchema), recipeController.getRecipes);
router.get("/:id", recipeController.getRecipeById);

// Protected routes
router.post(
  "/",
  authenticate,
  validate(createRecipeSchema),
  recipeController.createRecipe,
);
router.put(
  "/:id",
  authenticate,
  validate(updateRecipeSchema),
  recipeController.updateRecipe,
);
router.delete("/:id", authenticate, recipeController.deleteRecipe);

// Reaction routes
router.post(
  "/:id/react",
  authenticate,
  validate(reactionSchema),
  recipeController.reactToRecipe,
);
router.delete("/:id/react", authenticate, recipeController.removeReaction);

// Save/bookmark routes
router.post("/:id/save", authenticate, recipeController.saveRecipe);
router.delete("/:id/save", authenticate, recipeController.unsaveRecipe);

// Comment routes
router.post(
  "/:id/comments",
  authenticate,
  validate(createCommentSchema),
  commentController.createComment,
);
router.get(
  "/:id/comments",
  validate(queryCommentSchema),
  commentController.getComments,
);

module.exports = router;
