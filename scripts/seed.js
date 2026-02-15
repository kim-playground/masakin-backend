require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Recipe = require("../src/models/Recipe");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Mock users data
const mockUsers = [
  {
    name: "Chef Lanisa",
    email: "lanisa@masakin.com",
    password: "password123",
    bio: "Passionate about creating delicious pasta dishes",
  },
  {
    name: "Chef Jisoo",
    email: "jisoo@masakin.com",
    password: "password123",
    bio: "Rice and Asian cuisine specialist",
  },
  {
    name: "Chef Jennie",
    email: "jennie@masakin.com",
    password: "password123",
    bio: "Health and wellness food advocate",
  },
  {
    name: "Chef Rose",
    email: "rose@masakin.com",
    password: "password123",
    bio: "Curry and spice master",
  },
  {
    name: "Chef Lalisa",
    email: "lalisa@masakin.com",
    password: "password123",
    bio: "Italian pizza artisan",
  },
];

// Mock recipes data (based on user's provided data)
const mockRecipes = [
  {
    title: "Creamy Salmon Macaroni with Lemon Sour Crunchy Cheese",
    description:
      "Spice is a highlight of this simple soup recipe from a variety of spices and seasonings. Nutmeg provides an earthy sweetness, while ground pepper provides a bit of peppery notes to balance the richness.",
    category: "Dinner",
    cookingTime: 45,
    portion: 4,
    difficulty: "medium",
    tags: ["pasta", "salmon", "cheese", "lemon"],
    ingredients: [
      "400g macaroni",
      "200g smoked salmon",
      "200ml heavy cream",
      "100g crunchy cheese",
      "2 lemons",
      "Salt & pepper",
      "Fresh dill",
    ],
    steps: [
      "Boil macaroni until al dente",
      "Prepare cream sauce with lemon zest",
      "Fold in smoked salmon",
      "Top with crunchy cheese",
      "Bake at 180°C for 15 minutes",
    ],
    images: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/OMn5wkE2zJU?si=row0vEfSaBRFRfZb",
    status: "published",
    authorEmail: "lanisa@masakin.com",
  },
  {
    title: "Rice with Chili Sauce and Chicken",
    description:
      "Chili oil and red sauce is a staple of rice as an easy appetizer in a restaurant. A balance of spice with the freshness of green beans make it a great side dish.",
    category: "Lunch",
    cookingTime: 35,
    portion: 2,
    difficulty: "easy",
    tags: ["rice", "chicken", "spicy", "asian"],
    ingredients: [
      "300g jasmine rice",
      "250g chicken breast",
      "3 tbsp chili sauce",
      "Green onions",
      "Soy sauce",
      "Garlic",
    ],
    steps: [
      "Cook rice until fluffy",
      "Marinate chicken with soy sauce",
      "Grill chicken until golden",
      "Prepare chili sauce",
      "Serve rice topped with chicken and sauce",
    ],
    images: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/ahFCDNEog9o?si=jH6f0lPAlRhcw9tR",
    status: "published",
    authorEmail: "jisoo@masakin.com",
  },
  {
    title: "Healthy Oat with Almond",
    description:
      "According to what nutritionists tell us, oatmeal contains a high amount of fiber and nutrients that is good for a healthy lifestyle. Perfect breakfast recipe.",
    category: "Breakfast",
    cookingTime: 15,
    portion: 1,
    difficulty: "easy",
    tags: ["breakfast", "healthy", "oat", "almond"],
    ingredients: [
      "100g rolled oats",
      "50g sliced almonds",
      "Fresh blueberries",
      "Honey",
      "Almond milk",
      "Cinnamon",
    ],
    steps: [
      "Warm almond milk",
      "Add oats and cook for 5 minutes",
      "Top with almonds and berries",
      "Drizzle with honey",
      "Sprinkle cinnamon",
    ],
    images: [
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/VZOHHCosuzY?si=A0wxQ5TwaSH4rCcf",
    status: "published",
    authorEmail: "jennie@masakin.com",
  },
  {
    title: "Spicy Curry with Chili Powder",
    description:
      "Spice is a highlight of this simple curry recipe. The combination of vegetables such as meat, chicken and vegetables makes this dish incredibly flavorful.",
    category: "Dinner",
    cookingTime: 25,
    portion: 4,
    difficulty: "medium",
    tags: ["curry", "spicy", "indian", "chicken"],
    ingredients: [
      "500g chicken thighs",
      "2 tbsp curry powder",
      "1 can coconut milk",
      "Chili flakes",
      "Onion",
      "Garlic",
      "Ginger",
    ],
    steps: [
      "Sauté onion, garlic and ginger",
      "Add curry powder and chili",
      "Add chicken pieces",
      "Pour coconut milk",
      "Simmer for 20 minutes",
    ],
    images: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/mzZKAa4GUcc?si=EIgkQiiiY_3iHKTI",
    status: "published",
    authorEmail: "rose@masakin.com",
  },
  {
    title: "Mushroom Pizza and Onion with Vegetables Topping",
    description:
      "Treat yourself with a satisfying combination of mushrooms and family-style pizza crust. The parchment of golden-brown crust is a signature of satisfying texture and flavor.",
    category: "Lunch",
    cookingTime: 30,
    portion: 6,
    difficulty: "medium",
    tags: ["pizza", "italian", "mushroom", "vegetarian"],
    ingredients: [
      "Pizza dough",
      "200g mushrooms",
      "1 onion",
      "Mozzarella",
      "Tomato sauce",
      "Olive oil",
      "Fresh basil",
    ],
    steps: [
      "Roll out dough",
      "Spread tomato sauce",
      "Add sliced mushrooms and onions",
      "Top with mozzarella",
      "Bake at 220°C for 12 minutes",
    ],
    images: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/dvd1-b21MxY?si=S8MrVqPZ_NosQJJ2",
    status: "published",
    authorEmail: "lalisa@masakin.com",
  },
  {
    title: "Cow Steak with Vegetables and Sauce",
    description:
      "Perfectly seared steak with a creamy garlic sauce. This high-protein dish is perfect for meat lovers and pairs well with seasonal vegetables.",
    category: "Dinner",
    cookingTime: 40,
    portion: 2,
    difficulty: "hard",
    tags: ["steak", "beef", "meat", "premium"],
    ingredients: [
      "300g beef steak",
      "Mixed vegetables",
      "Garlic butter",
      "Green herb sauce",
      "Salt & pepper",
      "Olive oil",
    ],
    steps: [
      "Season steak with salt and pepper",
      "Sear on high heat 3 min each side",
      "Rest for 5 minutes",
      "Grill vegetables",
      "Serve with green sauce",
    ],
    images: [
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/SGqal-DGPNo?si=lc5w8aUvem8iQQRl",
    status: "published",
    authorEmail: "rose@masakin.com",
  },
  {
    title: "Fish Meat and Vegetables with Potato",
    description:
      "Salmon and vegetables that perfectly balance a gourmet protein dish. It pairs well with potatoes, making it both comforting and wholesome.",
    category: "Dinner",
    cookingTime: 35,
    portion: 3,
    difficulty: "medium",
    tags: ["fish", "seafood", "healthy", "potato"],
    ingredients: [
      "400g white fish fillet",
      "Baby potatoes",
      "Cherry tomatoes",
      "Fresh rosemary",
      "Lemon",
      "Olive oil",
    ],
    steps: [
      "Season fish with herbs",
      "Roast potatoes at 200°C",
      "Pan-sear fish 4 min each side",
      "Roast tomatoes",
      "Plate and garnish with rosemary",
    ],
    images: [
      "https://images.unsplash.com/photo-1560070094-e1f2ddec4337?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/DXqO6qUh5FA?si=qjO4pZyYq6Kz2opM",
    status: "published",
    authorEmail: "jisoo@masakin.com",
  },
  {
    title: "Tropical Fruit Salad",
    description:
      "A refreshing mix of seasonal tropical fruits, perfect for a light dessert or healthy snack. Drizzled with a lime-honey dressing.",
    category: "Dessert",
    cookingTime: 10,
    portion: 4,
    difficulty: "easy",
    tags: ["fruit", "salad", "dessert", "healthy"],
    ingredients: [
      "1 mango, cubed",
      "1 cup pineapple chunks",
      "2 kiwis, sliced",
      "1 cup strawberries",
      "Mint leaves",
      "Honey",
      "Lime juice",
    ],
    steps: [
      "Prepare all fruits by peeling and chopping",
      "Mix honey and lime juice for dressing",
      "Combine fruits in a large bowl",
      "Drizzle dressing over fruit",
      "Garnish with fresh mint leaves",
    ],
    images: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    ],
    videoUrl: "https://youtu.be/OX1Bxv5Hw3U?si=qjkgcjkmHCexc__6",
    status: "published",
    authorEmail: "lanisa@masakin.com",
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log("\n🌱 Starting database seed...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Recipe.deleteMany({});
    try {
      await mongoose.connection.collection("comments").drop();
      console.log("🗑️  Comments collection dropped");
    } catch (error) {
      if (error.code === 26) {
        console.log("ℹ️  Comments collection does not exist");
      } else {
        console.error("❌ Error dropping comments collection:", error);
      }
    }
    console.log("✅ Existing data cleared\n");

    // Create users one by one to trigger pre-save hooks (password hashing)
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const user of mockUsers) {
      const newUser = await User.create(user);
      createdUsers.push(newUser);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create a map of email to user ID
    const userMap = {};
    createdUsers.forEach((user) => {
      userMap[user.email] = user._id;
    });

    // Add author IDs to recipes
    const recipesWithAuthors = mockRecipes.map((recipe) => {
      const { authorEmail, ...recipeData } = recipe;
      return {
        ...recipeData,
        author: userMap[authorEmail],
      };
    });

    // Create recipes
    console.log("📝 Creating recipes...");
    const createdRecipes = await Recipe.insertMany(recipesWithAuthors);
    console.log(`✅ Created ${createdRecipes.length} recipes\n`);

    // --- Generate Random Follows ---
    console.log("🤝 Generating random follows...");
    for (const currentUser of createdUsers) {
      // Randomly follow 1-4 other users
      const numToFollow = Math.floor(Math.random() * 4) + 1;
      const potentialTargets = createdUsers.filter(
        (u) => u._id.toString() !== currentUser._id.toString(),
      );

      // Shuffle potential targets
      const shuffled = potentialTargets.sort(() => 0.5 - Math.random());
      const selectedTargets = shuffled.slice(0, numToFollow);

      for (const targetUser of selectedTargets) {
        // Add to following of current user
        await User.findByIdAndUpdate(currentUser._id, {
          $addToSet: { following: targetUser._id },
        });
        // Add to followers of target user
        await User.findByIdAndUpdate(targetUser._id, {
          $addToSet: { followers: currentUser._id },
        });
      }
    }
    console.log("✅ Random follows generated\n");

    // --- Generate Random Saves ---
    console.log("💾 Generating random saves...");
    for (const user of createdUsers) {
      // Randomly save 1-5 recipes
      const numToSave = Math.floor(Math.random() * 5) + 1;
      const shuffledRecipes = createdRecipes.sort(() => 0.5 - Math.random());
      const selectedRecipes = shuffledRecipes.slice(0, numToSave);

      for (const recipe of selectedRecipes) {
        // Add to savedRecipes of user
        await User.findByIdAndUpdate(user._id, {
          $addToSet: { savedRecipes: recipe._id },
        });
        // Increment savesCount of recipe
        await Recipe.findByIdAndUpdate(recipe._id, { $inc: { savesCount: 1 } });
      }
    }
    console.log("✅ Random saves generated\n");

    console.log("📊 Seed Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📝 Recipes: ${createdRecipes.length}\n`);

    console.log("🎉 Database seeded successfully!\n");
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log("👋 Connection closed");
  process.exit(0);
};

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
