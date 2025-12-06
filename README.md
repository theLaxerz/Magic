# Magic Secure App 🔒

An exemplary security project showcasing best practices for JavaScript, web applications, and AI/MCPs. This project demonstrates comprehensive security implementations that benefit the modern web development ecosystem.

[![Security](https://img.shields.io/badge/security-best--practices-green.svg)](./SECURITY.md)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 🌟 Key Security Features

### Authentication & Authorization
- ✅ JWT-based authentication with secure token handling
- ✅ Bcrypt password hashing (12 rounds minimum)
- ✅ Role-based access control (RBAC)
- ✅ Strong password requirements enforced
- ✅ Secure session management

### Input Validation & Sanitization
- ✅ Comprehensive input validation using `express-validator`
- ✅ XSS protection with `xss-clean`
- ✅ NoSQL injection prevention with `express-mongo-sanitize`
- ✅ Parameter pollution prevention with `hpp`
- ✅ Request body size limits

### API Security
- ✅ Rate limiting on all endpoints
- ✅ Strict rate limiting on authentication (5 requests/15min)
- ✅ AI endpoint rate limiting (10 requests/min)
- ✅ CORS properly configured
- ✅ Request validation and error handling

### Security Headers
- ✅ Helmet.js for comprehensive security headers
- ✅ Content Security Policy (CSP)
- ✅ HSTS with preload
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: no-referrer

### Database Security
- ✅ Secure MongoDB connections with authentication
- ✅ Parameterized queries to prevent injection
- ✅ TLS/SSL support in production
- ✅ Connection pooling and timeouts
- ✅ Proper error handling without information leakage

### AI/MCP Security 🤖
- ✅ Prompt injection prevention
- ✅ Input validation for AI prompts
- ✅ Content filtering for sensitive data
- ✅ Audit logging for AI interactions
- ✅ Rate limiting for AI endpoints
- ✅ Suspicious pattern detection

### Additional Security
- ✅ Comprehensive logging with Winston
- ✅ Graceful error handling
- ✅ Environment variable validation
- ✅ Secure cookie handling
- ✅ CSRF protection with Double Submit Cookie pattern
- ✅ Compression with security considerations

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/theLaxerz/Magic.git
cd Magic
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and update the following:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/magic_secure
```

**⚠️ Important:** Never use default secrets in production!

### 4. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB instance
mongod
```

### 5. Run the application
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Get Profile
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Post Endpoints

#### Get All Posts
```bash
GET /api/posts?page=1&limit=10
```

#### Create Post
```bash
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Secure Post",
  "content": "This is a secure post with proper validation",
  "tags": ["security", "nodejs"]
}
```

### AI Endpoints

#### Submit AI Prompt
```bash
POST /api/ai/prompt
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Explain web security best practices",
  "maxTokens": 2000,
  "temperature": 0.7
}
```

#### Execute MCP Tool
```bash
POST /api/ai/mcp/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "toolName": "search",
  "parameters": {
    "query": "nodejs security"
  }
}
```

## 🔐 Security Best Practices

This project implements security best practices based on:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

See [SECURITY.md](./SECURITY.md) for our security policy and [docs/SECURITY_BEST_PRACTICES.md](./docs/SECURITY_BEST_PRACTICES.md) for detailed implementation guides.

## 🛠️ Development

### Linting
```bash
# Run ESLint with security plugins
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Security Auditing
```bash
# Check for vulnerabilities
npm run security:audit

# Check with moderate threshold
npm run security:check
```

### Testing
```bash
npm test
```

## 📁 Project Structure

```
Magic/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.js    # Environment configuration
│   │   ├── database.js  # MongoDB setup
│   │   └── logger.js    # Winston logger
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/           # Utility functions
│   │   ├── security.js
│   │   ├── sanitization.js
│   │   └── aiSecurity.js
│   ├── validators/      # Input validators
│   │   ├── userValidator.js
│   │   ├── postValidator.js
│   │   └── aiValidator.js
│   └── server/
│       └── index.js     # Main server file
├── docs/                # Documentation
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .eslintrc.json       # ESLint configuration
├── package.json
├── SECURITY.md          # Security policy
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please read our security guidelines before submitting pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-security`)
3. Commit your changes (`git commit -m 'Add amazing security feature'`)
4. Push to the branch (`git push origin feature/amazing-security`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security Disclosure

If you discover a security vulnerability, please email security@magic-secure-app.com instead of creating a public issue. See [SECURITY.md](./SECURITY.md) for details.

## 🌐 Resources

- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

## ⭐ Features Showcase

This project demonstrates:
- ✅ Modern Node.js/Express.js architecture
- ✅ Comprehensive security middleware stack
- ✅ JWT authentication with best practices
- ✅ Input validation and sanitization
- ✅ Rate limiting and DDoS protection
- ✅ Secure MongoDB integration
- ✅ AI/MCP security considerations
- ✅ Audit logging and monitoring
- ✅ Error handling without information leakage
- ✅ Security headers and CSP
- ✅ CORS configuration
- ✅ Dependency security scanning

---

**Built with ❤️ and 🔒 for the JavaScript, Web, and AI communities**
