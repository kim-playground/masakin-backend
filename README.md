# Masakin Backend API

> **Solusi sebelum kamu pesan online** - A production-ready RESTful API backend for a social cooking platform.

## 🚀 Features

### Core Features

- ✅ User authentication with JWT (Access + Refresh tokens)
- ✅ Recipe CRUD operations with draft/publish system
- ✅ Reaction system (like, love, fire)
- ✅ Save/bookmark recipes
- ✅ Follow/unfollow users
- ✅ Threaded comment system
- ✅ User profile management
- ✅ Author analytics
- ✅ Search, filter, and pagination
- ✅ Comprehensive API documentation with Swagger

### Security & Performance

- 🔒 Password hashing with bcrypt
- 🔒 JWT authentication
- 🔒 Helmet security headers
- 🔒 CORS enabled
- 🔒 Rate limiting
- 🔒 Input validation with Joi
- ⚡ MongoDB indexing for performance
- ⚡ Optimized queries with population

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd masakin-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root directory:

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=5001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/masakin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
```

4. **Start MongoDB**

Make sure MongoDB is running locally, or use MongoDB Atlas connection string.

5. **Run the server**

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:5001`

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:5001/api-docs
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Recipes

- `GET /api/v1/recipes` - Get all recipes (with filters)
- `GET /api/v1/recipes/:id` - Get single recipe
- `POST /api/v1/recipes` - Create recipe (protected)
- `PUT /api/v1/recipes/:id` - Update recipe (protected)
- `DELETE /api/v1/recipes/:id` - Delete recipe (protected)
- `POST /api/v1/recipes/:id/react` - React to recipe (protected)
- `DELETE /api/v1/recipes/:id/react` - Remove reaction (protected)
- `POST /api/v1/recipes/:id/save` - Save recipe (protected)
- `DELETE /api/v1/recipes/:id/save` - Unsave recipe (protected)
- `POST /api/v1/recipes/:id/comments` - Add comment (protected)
- `GET /api/v1/recipes/:id/comments` - Get comments

### Users

- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update profile (protected)
- `GET /api/v1/users/:id/recipes` - Get user's recipes
- `POST /api/v1/users/:id/follow` - Follow user (protected)
- `DELETE /api/v1/users/:id/follow` - Unfollow user (protected)
- `GET /api/v1/users/me/analytics` - Get analytics (protected)

## 📦 Project Structure

```
masakin-backend/
├── src/
│   ├── config/          # Database and Swagger configuration
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── validations/     # Joi validation schemas
│   ├── utils/           # Utility functions
│   ├── docs/            # API documentation
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── package.json
├── .env.example
└── .gitignore
```

## 🧪 Testing the API

### Using Swagger UI (Recommended)

1. Start the server
2. Navigate to `http://localhost:5001/api-docs`
3. Try out the endpoints directly from the UI

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create a recipe (requires token):**

```bash
curl -X POST http://localhost:5001/api/v1/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Nasi Goreng Special",
    "description": "Delicious Indonesian fried rice",
    "ingredients": ["2 cups rice", "2 eggs", "Garlic"],
    "steps": ["Cook rice", "Fry eggs", "Mix ingredients"],
    "cookingTime": 30,
    "portion": 4,
    "difficulty": "medium",
    "category": "Indonesian",
    "tags": ["rice", "spicy"],
    "status": "published"
  }'
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Helmet**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Joi schema validation
- **Error Handling**: Consistent error responses without sensitive data leaks

## 📊 Database Models

### User Model

- Personal info (name, email, password, avatar, bio)
- Social features (followers, following, saved recipes)
- Authentication (refresh token, role)

### Recipe Model

- Content (title, description, ingredients, steps)
- Media (images, video URL)
- Metadata (cooking time, portion, difficulty, category, tags)
- Engagement (reactions, saves, comments count)
- Status (draft/published)

### Comment Model

- User reference
- Recipe reference
- Message content
- Parent comment (for threading)

## 🌟 Key Features Explained

### Reaction System

Users can react to recipes with three types: `like`, `love`, or `fire`. Each user can only have one active reaction per recipe, which can be changed or removed.

### Save/Bookmark System

Users can save recipes to their collection. The system tracks the save count on recipes and maintains a list of saved recipes per user.

### Follow System

Bidirectional follow system where users can follow other users. Both followers and following lists are maintained.

### Threaded Comments

Comments support threading by allowing a `parentComment` field, enabling nested discussions.

### Analytics

Authors can view their statistics including:

- Total recipes (published/draft)
- Engagement metrics (reactions, saves, comments)
- Social stats (followers/following)

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production-grade MongoDB instance (MongoDB Atlas recommended)
3. Generate strong random secrets for JWT tokens
4. Configure CORS to allow only your frontend domain
5. Use a process manager like PM2 or run in a container
6. Enable HTTPS/TLS
7. Set up proper logging and monitoring

## 📝 Environment Variables

| Variable               | Description                          | Default     |
| ---------------------- | ------------------------------------ | ----------- |
| NODE_ENV               | Environment (development/production) | development |
| PORT                   | Server port                          | 5001        |
| MONGO_URI              | MongoDB connection string            | -           |
| JWT_SECRET             | Secret for access tokens             | -           |
| JWT_REFRESH_SECRET     | Secret for refresh tokens            | -           |
| JWT_EXPIRES_IN         | Access token expiration              | 30m         |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration             | 7d          |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Masakin Development Team

---

**Masakin** - Solusi sebelum kamu pesan online 🍳
