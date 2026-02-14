const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { updateProfileSchema } = require("../validations/user.validation");

const router = express.Router();

// Analytics route (must be before /:id routes)
router.get("/me/analytics", authenticate, userController.getAnalytics);

// Profile routes
router.get("/:id", userController.getUserProfile);
router.put(
  "/:id",
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile,
);

// User recipes
router.get("/:id/recipes", userController.getUserRecipes);

// Follow/unfollow routes
router.post("/:id/follow", authenticate, userController.followUser);
router.delete("/:id/follow", authenticate, userController.unfollowUser);

module.exports = router;
