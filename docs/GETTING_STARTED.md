# Getting Started with Magic Secure App

## Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/theLaxerz/Magic.git
   cd Magic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your secrets:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-session-secret-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/magic_secure
   ```
   
   **⚠️ Security Note:** Generate strong secrets using:
   ```bash
   # Generate JWT secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate session secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Start MongoDB**
   
   Using Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
   
   Or start your local MongoDB:
   ```bash
   mongod
   ```

5. **Run the application**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the application**
   - Open http://localhost:3000 in your browser
   - API endpoints are available at http://localhost:3000/api

## Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Save the `token` from the response.

### 3. Get CSRF token
```bash
curl -X GET http://localhost:3000/api/csrf-token \
  -c cookies.txt
```

Save the CSRF token from the response.

### 4. Create a post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "title": "My Secure Post",
    "content": "This is a secure post with proper validation",
    "tags": ["security", "nodejs"]
  }'
```

### 5. Submit AI prompt
```bash
curl -X POST http://localhost:3000/api/ai/prompt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-csrf-token: YOUR_CSRF_TOKEN" \
  -b cookies.txt \
  -d '{
    "prompt": "Explain web security best practices",
    "maxTokens": 2000,
    "temperature": 0.7
  }'
```

## Development Workflow

### Run linter
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

### Check for security vulnerabilities
```bash
npm run security:audit
```

### Run tests
```bash
npm test
```

## Project Structure

```
Magic/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.js    # Environment configuration
│   │   ├── database.js  # MongoDB connection
│   │   └── logger.js    # Winston logger setup
│   │
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── csrf.js      # CSRF protection
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   │
│   ├── routes/          # API route handlers
│   │   ├── aiRoutes.js  # AI/MCP endpoints
│   │   ├── authRoutes.js # Authentication endpoints
│   │   └── postRoutes.js # Post CRUD endpoints
│   │
│   ├── utils/           # Utility functions
│   │   ├── aiSecurity.js    # AI-specific security
│   │   ├── sanitization.js  # Input sanitization
│   │   └── security.js      # Password hashing, etc.
│   │
│   ├── validators/      # Input validation rules
│   │   ├── aiValidator.js
│   │   ├── postValidator.js
│   │   └── userValidator.js
│   │
│   └── server/
│       └── index.js     # Main Express application
│
├── docs/                # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY_BEST_PRACTICES.md
│   └── SECURITY_SUMMARY.md
│
├── public/              # Static files
│   └── index.html       # Frontend demo
│
├── logs/                # Application logs
├── .env.example         # Environment template
├── .eslintrc.json       # ESLint configuration
├── package.json         # Dependencies
├── README.md            # This file
└── SECURITY.md          # Security policy
```

## Security Features

This application implements comprehensive security measures:

- **Authentication**: JWT with bcrypt (12 rounds)
- **Input Validation**: express-validator + custom sanitization
- **XSS Protection**: xss-clean middleware
- **CSRF Protection**: Double Submit Cookie pattern
- **NoSQL Injection**: express-mongo-sanitize
- **Rate Limiting**: Tiered limits by endpoint type
- **Security Headers**: Helmet.js with CSP, HSTS, etc.
- **AI Security**: Prompt injection prevention, content filtering

See [SECURITY.md](../SECURITY.md) for complete security documentation.

## Common Issues

### MongoDB Connection Error
**Problem**: Cannot connect to MongoDB
**Solution**: Ensure MongoDB is running on port 27017 or update `MONGODB_URI` in `.env`

### Port Already in Use
**Problem**: Port 3000 is already in use
**Solution**: Change the `PORT` in `.env` or stop the process using port 3000

### CSRF Token Error
**Problem**: CSRF token validation fails
**Solution**: Ensure you're including both the CSRF token in headers and cookies in requests

### Rate Limit Exceeded
**Problem**: Too many requests error
**Solution**: Wait for the rate limit window to expire or adjust limits in `src/middleware/rateLimiter.js`

## Further Reading

- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Security Best Practices](../docs/SECURITY_BEST_PRACTICES.md)
- [Security Summary](../docs/SECURITY_SUMMARY.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Support

For security vulnerabilities, please email: security@magic-secure-app.com

For other issues, please open a GitHub issue.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
