# Magic Secure App - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register New User
**POST** `/auth/register`

Register a new user account with strong password requirements.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Rate Limit:** 5 requests per 15 minutes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
**GET** `/auth/me`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastLogin": "2024-01-15T15:45:00.000Z"
  }
}
```

#### Update Password
**PUT** `/auth/password`

Update the current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### Posts

#### Get All Posts
**GET** `/posts`

Retrieve all posts with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example:**
```
GET /posts?page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Secure Coding Practices",
      "content": "Here are some best practices...",
      "tags": ["security", "coding"],
      "author": {
        "id": "507f1f77bcf86cd799439012",
        "username": "johndoe"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "likes": 42,
      "comments": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Get Single Post
**GET** `/posts/:id`

Get a specific post by ID.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Secure Coding Practices",
    "content": "Here are some best practices...",
    "tags": ["security", "coding"],
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "username": "johndoe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "likes": 42,
    "comments": []
  }
}
```

#### Create Post
**POST** `/posts`

Create a new post (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Secure Post",
  "content": "This is a post about web security best practices...",
  "tags": ["security", "web", "nodejs"]
}
```

**Validation:**
- Title: 3-200 characters
- Content: 10-5000 characters
- Tags: Array of alphanumeric strings with hyphens/underscores

**Success Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "My Secure Post",
    "content": "This is a post about web security...",
    "tags": ["security", "web", "nodejs"],
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "username": "johndoe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "likes": 0,
    "comments": []
  }
}
```

#### Update Post
**PUT** `/posts/:id`

Update an existing post (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["security", "updated"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Post updated successfully"
}
```

#### Delete Post
**DELETE** `/posts/:id`

Delete a post (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### Add Comment
**POST** `/posts/:id/comments`

Add a comment to a post (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Great post! Very informative."
}
```

**Validation:**
- Content: 1-1000 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "content": "Great post! Very informative.",
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "username": "johndoe"
    },
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### AI Endpoints

#### Submit AI Prompt
**POST** `/ai/prompt`

Submit a prompt to the AI with security measures.

**Headers:**
```
Authorization: Bearer <token>
```

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "prompt": "Explain web security best practices",
  "maxTokens": 2000,
  "temperature": 0.7
}
```

**Validation:**
- Prompt: 1-10000 characters
- Suspicious pattern detection enabled
- Prompt injection prevention active
- maxTokens: 1-4000 (optional)
- temperature: 0-2 (optional)

**Success Response (200):**
```json
{
  "success": true,
  "response": "Web security best practices include...",
  "metadata": {
    "promptLength": 37,
    "responseLength": 500,
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
```

#### Execute MCP Tool
**POST** `/ai/mcp/execute`

Execute an MCP tool with security validation.

**Headers:**
```
Authorization: Bearer <token>
```

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "toolName": "search",
  "parameters": {
    "query": "nodejs security"
  }
}
```

**Allowed Tools:**
- `search`
- `summarize`
- `translate`
- `analyze`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tool": "search",
    "result": "Executed search successfully",
    "parameters": {
      "query": "nodejs security"
    }
  }
}
```

#### Get AI Usage Statistics
**GET** `/ai/usage`

Get AI usage statistics for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "totalRequests": 42,
    "tokensUsed": 15000,
    "lastRequest": "2024-01-15T15:45:00.000Z",
    "remainingQuota": 85000
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "You are not logged in. Please log in to access this resource."
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource."
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Cannot GET /api/invalid-endpoint"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Error",
  "message": "Something went wrong. Please try again later."
}
```

## Security Features

All API endpoints implement:

- **Input Validation**: Comprehensive validation using express-validator
- **Sanitization**: XSS and NoSQL injection prevention
- **Rate Limiting**: Endpoint-specific rate limits
- **Authentication**: JWT-based with secure token handling
- **Authorization**: Role-based access control
- **Logging**: All requests and security events logged
- **Error Handling**: Secure error messages without information leakage

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 minutes |
| Authentication | 5 requests / 15 minutes |
| AI Endpoints | 10 requests / minute |

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"johndoe","password":"SecurePass123!"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Create Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Post","content":"This is a test post with secure validation"}'
```

### AI Prompt
```bash
curl -X POST http://localhost:3000/api/ai/prompt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"prompt":"Explain web security"}'
```
