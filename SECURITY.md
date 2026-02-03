# Security Policy

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@commonsyouth.org**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Measures

The Commons Youth Platform implements multiple layers of security:

### Authentication & Authorization
- **Firebase Authentication** with Google OAuth
- **Custom Claims** for role-based access control (admin/user)
- **Protected routes** requiring authentication
- Mock authentication disabled in production

### Data Security
- **Firestore Security Rules** requiring authentication for data access
- **Role-based access control** for create/update/delete operations
- **Storage Rules** with file type and size validation (max 5MB)
- **Path-based restrictions** preventing unauthorized file access

### API Security
- **Environment variables** for all sensitive configuration
- **No hardcoded secrets** in source code
- **Firebase App Check** (recommended for production)
- Input validation and sanitization for all user inputs

### Infrastructure Security
- **Security headers** via Firebase Hosting:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(self), microphone=(), camera=()
- **HTTPS enforced** for all connections
- **Automated dependency scanning** via Dependabot
- **TypeScript strict mode** for type safety

### Development Practices
- **Code review** required for all changes
- **Automated security scanning** in CI/CD pipeline
- **Dependency updates** monitored weekly
- **Structured logging** with sensitive data filtering

## Security Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Security Rules Deployment

Deploy security rules after any changes:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy all
firebase deploy
```

### Recommended Production Setup

1. **Enable Firebase App Check**
   - Register your app in Firebase Console
   - Use reCAPTCHA v3 for web apps
   - Enforce App Check for Firestore and Storage

2. **Set Custom Claims for Admins**
   - Deploy Cloud Functions for admin management
   - Use server-side custom claims instead of email checks
   - See `SECURITY-IMPLEMENTATION-PLAN.md` Phase 2

3. **Configure Security Headers**
   - Already configured in `firebase.json`
   - Deployed automatically with Firebase Hosting

4. **Monitor Security**
   - Enable Firebase Security Rules logging
   - Review audit logs regularly
   - Monitor dependency vulnerabilities

## Best Practices for Contributors

### Code Security

1. **Never commit sensitive data**
   - No API keys, passwords, or tokens
   - Use environment variables
   - Check `.gitignore` includes `.env`

2. **Validate all inputs**
   - Use utilities from `services/sanitize.ts`
   - Validate on both client and server
   - Sanitize before database operations

3. **Follow principle of least privilege**
   - Request minimum permissions needed
   - Use specific Firestore/Storage rules
   - Limit admin access

4. **Handle errors securely**
   - Don't expose internal details in error messages
   - Use structured logging (`services/logger.ts`)
   - Log security-relevant events

### Code Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] Input validation for user data
- [ ] Proper error handling without information leakage
- [ ] Authentication checks for protected operations
- [ ] File upload validation (type, size, path)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (React handles most, but check dangerouslySetInnerHTML)
- [ ] CSRF protection for state-changing operations

## Dependencies

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Dependency Security

- **Dependabot** automatically creates PRs for security updates
- **npm audit** runs on every CI/CD build
- **Snyk scanning** (optional) for additional vulnerability detection

## Incident Response

In case of a security incident:

1. **Immediate Actions**
   - Assess the scope and impact
   - Contain the incident (disable affected features if needed)
   - Preserve evidence for investigation

2. **Communication**
   - Notify security team immediately
   - Inform affected users if data breach occurred
   - Document timeline and actions taken

3. **Remediation**
   - Fix the vulnerability
   - Deploy patch
   - Update security rules if needed

4. **Post-Incident**
   - Conduct post-mortem
   - Update security measures
   - Share learnings with team

## Compliance

### Data Protection

The application handles personal data and must comply with:

- **GDPR** (General Data Protection Regulation) - if serving EU users
- **PDPA** (Personal Data Protection Act) - Thailand
- Ensure privacy policy is up to date
- Obtain user consent for data collection
- Provide data export/deletion capabilities

### Accessibility

- Follow **WCAG 2.1 AA** guidelines
- Ensure keyboard navigation
- Provide alt text for images
- Test with screen readers

## Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [React Security Best Practices](https://react.dev/learn/security)

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-02-03 | 1.0.0 | Initial security policy |

---

**Last Updated:** February 3, 2026  
**Contact:** security@commonsyouth.org
