const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Recipe description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    steps: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: null,
    },
    cookingTime: {
      type: Number, // in minutes
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
    },
    portion: {
      type: Number,
      required: [true, "Portion size is required"],
      min: [1, "Portion must be at least 1"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty level is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      love: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      fire: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    savesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
recipeSchema.index({ title: "text", description: "text" });
recipeSchema.index({ category: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ status: 1 });
recipeSchema.index({ author: 1 });
recipeSchema.index({ createdAt: -1 });

// Virtual for total reactions count
recipeSchema.virtual("totalReactions").get(function () {
  return (
    this.reactions.like.length +
    this.reactions.love.length +
    this.reactions.fire.length
  );
});

// Ensure virtuals are included in JSON
recipeSchema.set("toJSON", { virtuals: true });
recipeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Recipe", recipeSchema);
