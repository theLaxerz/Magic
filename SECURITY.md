Contact: security@magic-secure-app.com
Expires: 2025-12-31T23:59:59.000Z
Encryption: https://keys.openpgp.org/search?q=security@magic-secure-app.com
Preferred-Languages: en
Canonical: https://magic-secure-app.com/.well-known/security.txt

# Security Policy

We take the security of our application seriously. If you discover a security vulnerability, please report it responsibly.

## Reporting a Vulnerability

Please report security vulnerabilities by emailing security@magic-secure-app.com. Do not create public GitHub issues for security vulnerabilities.

Include the following information in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge your report within 48 hours and provide updates on our progress.

## Security Features

This application implements the following security measures:

### Authentication & Authorization
- JWT-based authentication with secure token handling
- Bcrypt password hashing with configurable rounds
- Role-based access control (RBAC)
- Password strength requirements

### Input Validation & Sanitization
- Comprehensive input validation using express-validator
- XSS protection with xss-clean
- NoSQL injection prevention with express-mongo-sanitize
- Parameter pollution prevention with hpp

### API Security
- Rate limiting on all endpoints
- Strict rate limiting on authentication endpoints
- AI/MCP endpoint rate limiting
- Request body size limits

### Security Headers
- Helmet.js for security headers
- Content Security Policy (CSP)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer

### Database Security
- Secure MongoDB connections with authentication
- Parameterized queries to prevent injection
- TLS/SSL support in production
- Connection pooling and timeouts

### AI/MCP Security
- Input validation for AI prompts
- Prompt injection prevention
- Content filtering for sensitive data
- Audit logging for AI interactions
- Rate limiting for AI endpoints

### Additional Security Measures
- CORS configuration
- CSRF protection with Double Submit Cookie pattern
- Cookie security with httpOnly and secure flags
- Compression with gzip
- Graceful error handling
- Comprehensive logging
- Environment variable validation

## Disclosure Policy

When we receive a security bug report, we will:
1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release security updates as soon as possible

## Security Updates

Security updates will be released as patch versions and announced through:
- GitHub Security Advisories
- Email notifications to registered users
- Security mailing list

Thank you for helping keep our application and users safe!
