# Masakin Backend - API Documentation

This folder contains the OpenAPI (Swagger) documentation for the Masakin API.

## Accessing the Documentation

When the server is running, you can access the interactive API documentation at:

```
http://localhost:5001/api-docs
```

## Documentation File

- `swagger.yaml` - Complete OpenAPI 3.0 specification

## Features

The API documentation includes:

- **Authentication Endpoints**: Register, login, refresh token, logout
- **Recipe Management**: CRUD operations, search, filter, pagination
- **Social Features**: Reactions (like, love, fire), save/bookmark
- **Comments**: Threaded comment system
- **User Management**: Profile, follow/unfollow, analytics
- **Request/Response Schemas**: Complete data models
- **Error Responses**: Standardized error format
- **Authentication**: JWT Bearer token security scheme

## Testing Endpoints

You can test all endpoints directly from the Swagger UI using the "Try it out" feature.

1. For protected endpoints, first:
   - Register or login via `/api/v1/auth/register` or `/api/v1/auth/login`
   - Copy the `accessToken` from the response
   - Click the "Authorize" button at the top of the Swagger UI
   - Enter: `Bearer <your-access-token>`
   - Click "Authorize"

2. Now you can test protected endpoints directly from the UI.
