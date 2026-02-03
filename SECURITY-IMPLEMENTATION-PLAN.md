# Security Implementation Plan
**Project:** Commons Youth Platform  
**Date:** February 3, 2026  
**Priority Level:** CRITICAL → HIGH → MEDIUM → LOW

---

## 🚨 PHASE 1: CRITICAL FIXES (DO IMMEDIATELY - TODAY)

### 1.1 Move Firebase Config to Environment Variables

**Current Risk:** API keys exposed in source code and version control  
**Timeline:** 1-2 hours  
**Files to modify:**
- `services/firebase.ts`
- `.env.example` (create)
- `.gitignore` (verify)

**Steps:**

1. **Create `.env.example` template:**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. **Create `.env` file locally (not committed):**
```env
VITE_FIREBASE_API_KEY=AIzaSyD11z3r_sCHypxzwGtrmonTz9_5Xv-VJQw
VITE_FIREBASE_AUTH_DOMAIN=commonsyouth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=commonsyouth
VITE_FIREBASE_STORAGE_BUCKET=commonsyouth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1003978591288
VITE_FIREBASE_APP_ID=1:1003978591288:web:6e751c922dc705f8fdaacd
```

3. **Update `.gitignore` to ensure `.env` is excluded:**
```
.env
.env.local
.env.*.local
```

4. **Update `services/firebase.ts`:**
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Missing required Firebase configuration. Check your .env file.');
}
```

5. **Remove Gemini API key from `vite.config.ts`:**
```typescript
// Remove these lines:
// define: {
//   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
//   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
// }
```

**Verification:**
- ✅ Run `npm run dev` - should work with .env file
- ✅ Search codebase for any hardcoded keys: `git grep "AIzaSy"`
- ✅ Check `.env` is in `.gitignore`

---

### 1.2 Tighten Firestore Security Rules

**Current Risk:** Anyone can read all user data without authentication  
**Timeline:** 2-3 hours  
**Files to modify:** `firestore.rules`

**Updated Rules:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.admin == true;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && 
             request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own profile, admins can read all
      allow read: if isOwner(userId) || isAdmin();
      // Users can only write their own profile
      allow write: if isOwner(userId);
    }
    
    // Groups collection
    match /groups/{groupId} {
      // Authenticated users can read groups
      allow read: if isAuthenticated();
      // Only admins and group owners can create/update
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin() || 
                               isOwner(resource.data.createdBy);
    }
    
    // Activities collection
    match /activities/{activityId} {
      // Authenticated users can read activities
      allow read: if isAuthenticated();
      // Only admins can write
      allow write: if isAdmin();
    }
    
    // Projects collection
    match /projects/{projectId} {
      // Authenticated users can read projects
      allow read: if isAuthenticated();
      // Admins and project owners can write
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin() || 
                               isOwner(resource.data.createdBy);
    }
    
    // Partners collection
    match /partners/{partnerId} {
      // Public read access (for homepage)
      allow read: if true;
      // Only admins can write
      allow write: if isAdmin();
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

**Verification:**
- ✅ Test unauthenticated access (should fail)
- ✅ Test authenticated user access
- ✅ Test admin access

---

### 1.3 Secure Firebase Storage Rules

**Current Risk:** No file size/type validation, unrestricted uploads  
**Timeline:** 1 hour  
**Files to modify:** `storage.rules`

**Updated Rules:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    function isValidImageFile() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      // Max 5MB
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // Group images - user can only upload to their own path
    match /groups/{userId}/{fileName} {
      allow read: if true; // Public read for group images
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      isValidImageFile() &&
                      isValidSize();
    }
    
    // Activity images - admin only
    match /activities/{fileName} {
      allow read: if true;
      allow write: if isAdmin() &&
                     isValidImageFile() &&
                     isValidSize();
    }
    
    // Project images - owner or admin
    match /projects/{userId}/{fileName} {
      allow read: if true;
      allow write: if (isAuthenticated() && request.auth.uid == userId) ||
                     isAdmin() &&
                     isValidImageFile() &&
                     isValidSize();
    }
    
    // User profile images
    match /users/{userId}/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      isValidImageFile() &&
                      isValidSize();
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only storage:rules
```

---

## 🔥 PHASE 2: HIGH PRIORITY (THIS WEEK)

### 2.1 Implement Firebase Custom Claims for Admin Roles

**Current Risk:** Client-side role assignment can be manipulated  
**Timeline:** 3-4 hours  
**Requires:** Firebase Cloud Functions setup

**Steps:**

1. **Initialize Cloud Functions:**
```bash
firebase init functions
# Select TypeScript
# Install dependencies
```

2. **Create `functions/src/index.ts`:**
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const ADMIN_EMAILS = [
  'demo@commonsyouth.org',
  'admin@commonsyouth.org'
];

// Automatically set admin claim when user is created
export const setAdminClaim = functions.auth.user().onCreate(async (user) => {
  if (user.email && ADMIN_EMAILS.includes(user.email)) {
    try {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`Admin claim set for ${user.email}`);
    } catch (error) {
      console.error('Error setting admin claim:', error);
    }
  }
});

// Manual function to set admin claim
export const makeAdmin = functions.https.onCall(async (data, context) => {
  // Only existing admins can make other users admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can make other users admin'
    );
  }
  
  const { email } = data;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { success: true, message: `Admin claim set for ${email}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error setting admin claim');
  }
});
```

3. **Update `services/authContext.tsx`:**
```typescript
// Remove hardcoded admin check, use custom claim
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // Force token refresh to get latest claims
    const idTokenResult = await firebaseUser.getIdTokenResult();
    
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      role: idTokenResult.claims.admin ? 'admin' : 'user'
    };
    setUser(userData);
  } else {
    setUser(null);
  }
  setLoading(false);
});
```

4. **Deploy Functions:**
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

**Verification:**
- ✅ Create new user with admin email
- ✅ Verify custom claim set in Firebase Console
- ✅ Test admin access in app

---

### 2.2 Remove Mock Authentication in Production

**Current Risk:** Demo credentials bypass real security  
**Timeline:** 1 hour  
**Files to modify:** `services/authContext.tsx`

**Update `authContext.tsx`:**
```typescript
// At the top, add environment check
const USE_MOCK_AUTH = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Wrap mock login with environment check
const mockLogin = async () => {
  if (!USE_MOCK_AUTH) {
    throw new Error('Mock authentication is disabled in production');
  }
  // ... existing mock login code
};

const mockLogout = () => {
  if (!USE_MOCK_AUTH) {
    throw new Error('Mock authentication is disabled in production');
  }
  // ... existing mock logout code
};
```

**Add to `.env.example`:**
```env
# Development only - enable mock authentication
VITE_USE_MOCK_AUTH=false
```

---

### 2.3 Add Security Headers to Firebase Hosting

**Current Risk:** Missing CSP, X-Frame-Options, etc.  
**Timeline:** 30 minutes  
**Files to modify:** `firebase.json`

**Update `firebase.json`:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(self), microphone=(), camera=()"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

**Note:** CSP header requires careful tuning based on your exact dependencies. Start without it and add incrementally.

---

### 2.4 Implement Firebase App Check

**Current Risk:** No protection against abuse and quota exhaustion  
**Timeline:** 2 hours  

**Steps:**

1. **Enable App Check in Firebase Console:**
   - Go to Project Settings → App Check
   - Register your web app
   - Select reCAPTCHA v3 as provider

2. **Install App Check SDK:**
```bash
npm install firebase/app-check
```

3. **Update `services/firebase.ts`:**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// ... existing config ...

const app = initializeApp(firebaseConfig);

// Initialize App Check
if (import.meta.env.PROD) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
} else {
  // Use debug token in development
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

4. **Add to `.env`:**
```env
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

5. **Enforce App Check in Firebase Console** for Firestore and Storage

---

## ⚠️ PHASE 3: MEDIUM PRIORITY (THIS MONTH)

### 3.1 Implement Automated Dependency Scanning

**Timeline:** 2 hours

**Steps:**

1. **Add npm scripts to `package.json`:**
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=high",
    "audit:fix": "npm audit fix",
    "type-check": "tsc --noEmit"
  }
}
```

2. **Create `.github/workflows/security.yml`:**
```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run npm audit
        run: npm audit --audit-level=high
        
      - name: Run TypeScript check
        run: npm run type-check
        
      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

3. **Enable Dependabot:**

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "visarutforthaipbs"
```

---

### 3.2 Enable TypeScript Strict Mode

**Timeline:** 2-4 hours (may require fixing type errors)

**Update `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // STRICT MODE - Add these:
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Fix resulting type errors** (will likely be in `api.ts`, `authContext.tsx`)

---

### 3.3 Implement Structured Logging

**Timeline:** 3 hours

**Create `services/logger.ts`:**
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };
    
    if (this.isDevelopment) {
      // Console in development
      const logFn = console[level] || console.log;
      logFn(`[${level.toUpperCase()}]`, message, context || '', error || '');
    } else {
      // In production, send to logging service (e.g., Cloud Logging)
      // For now, only log errors
      if (level === 'error') {
        console.error(entry);
        // TODO: Send to Firebase Analytics or Cloud Logging
      }
    }
  }
  
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }
  
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }
  
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }
  
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
```

**Replace all `console.log` with logger:**
```typescript
// Old:
console.error('Error fetching groups:', error);

// New:
logger.error('Error fetching groups', error, { function: 'fetchGroups' });
```

---

### 3.4 Add Input Sanitization

**Timeline:** 2 hours

**Install DOMPurify:**
```bash
npm install dompurify
npm install -D @types/dompurify
```

**Create `utils/sanitize.ts`:**
```typescript
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove path traversal attempts
  const name = fileName.replace(/\.\./g, '');
  // Allow only alphanumeric, dash, underscore, and dot
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
```

**Use in forms and API calls**

---

### 3.5 Implement Rate Limiting

**Timeline:** 3-4 hours (requires Cloud Functions)

**Create `functions/src/rateLimiter.ts`:**
```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const checkRateLimit = async (
  userId: string,
  action: string,
  config: RateLimitConfig
): Promise<boolean> => {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  const rateLimitRef = db.collection('rateLimits').doc(`${userId}_${action}`);
  
  try {
    const doc = await rateLimitRef.get();
    
    if (!doc.exists) {
      await rateLimitRef.set({
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }
    
    const data = doc.data()!;
    
    // Reset if window expired
    if (data.firstRequest < windowStart) {
      await rateLimitRef.set({
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }
    
    // Check if limit exceeded
    if (data.count >= config.maxRequests) {
      return false;
    }
    
    // Increment count
    await rateLimitRef.update({
      count: admin.firestore.FieldValue.increment(1),
      lastRequest: now
    });
    
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Fail open
  }
};

// Example usage in a Cloud Function
export const createGroup = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  const allowed = await checkRateLimit(
    context.auth.uid,
    'createGroup',
    { maxRequests: 10, windowMs: 60 * 60 * 1000 } // 10 per hour
  );
  
  if (!allowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  
  // ... create group logic
});
```

---

## 🔧 PHASE 4: BEST PRACTICES (ONGOING)

### 4.1 Create CI/CD Pipeline

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: commonsyouth
```

**Add secrets to GitHub repository settings**

---

### 4.2 Add Unit Tests with Security Focus

**Install testing libraries:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Create `src/__tests__/security.test.ts`:**
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeFileName, validateEmail, validateUrl } from '../utils/sanitize';

describe('Security Utilities', () => {
  describe('sanitizeFileName', () => {
    it('should remove path traversal attempts', () => {
      expect(sanitizeFileName('../../../etc/passwd')).not.toContain('..');
    });
    
    it('should remove special characters', () => {
      expect(sanitizeFileName('file<script>.txt')).not.toContain('<');
      expect(sanitizeFileName('file<script>.txt')).not.toContain('>');
    });
  });
  
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    it('should reject invalid emails', () => {
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });
});
```

---

### 4.3 Document Security Practices

**Create `SECURITY.md`:**
```markdown
# Security Policy

## Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@commonsyouth.org

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Measures

- Firebase Authentication with email/password
- Firestore security rules requiring authentication
- Storage rules with file type/size validation
- Custom claims for role-based access control
- Firebase App Check for abuse protection
- Environment variables for sensitive configuration
- Security headers via Firebase Hosting
- Automated dependency scanning via Dependabot

## Best Practices for Contributors

1. Never commit API keys or secrets
2. Use environment variables for configuration
3. Validate all user inputs
4. Follow principle of least privilege
5. Keep dependencies updated
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Critical (Complete Today)
- [ ] Move Firebase config to environment variables
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Create `.env.example`
- [ ] Update Firestore rules to require authentication
- [ ] Update Storage rules with file validation
- [ ] Deploy updated security rules
- [ ] Verify no hardcoded secrets in codebase

### High Priority (This Week)
- [ ] Set up Firebase Cloud Functions
- [ ] Implement Custom Claims for admin roles
- [ ] Remove/disable mock auth in production
- [ ] Add security headers to Firebase hosting
- [ ] Implement Firebase App Check
- [ ] Test all security changes

### Medium Priority (This Month)
- [ ] Set up GitHub Actions for security scanning
- [ ] Enable Dependabot
- [ ] Enable TypeScript strict mode
- [ ] Implement structured logging
- [ ] Add input sanitization utilities
- [ ] Implement rate limiting (Cloud Functions)

### Ongoing
- [ ] Create CI/CD pipeline
- [ ] Add security-focused unit tests
- [ ] Create SECURITY.md
- [ ] Regular dependency audits
- [ ] Quarterly security reviews

---

## 🧪 TESTING PLAN

After each phase, test:

1. **Authentication Flow:**
   - Create new user
   - Login/logout
   - Admin access vs regular user

2. **Data Access:**
   - Try accessing data without authentication (should fail)
   - Verify users can only modify their own data
   - Verify admins have elevated permissions

3. **File Uploads:**
   - Try uploading >5MB file (should fail)
   - Try uploading non-image file (should fail)
   - Verify path restrictions work

4. **Environment Configuration:**
   - Build production bundle
   - Verify no secrets in bundle: `grep -r "AIzaSy" dist/`
   - Test with missing env vars (should error gracefully)

---

## 📊 SUCCESS METRICS

After implementation, security rating should improve from **6.5/10 to 8.5/10**:

| Metric | Before | After |
|--------|--------|-------|
| Exposed secrets | 3 | 0 |
| Auth vulnerabilities | 4 | 0 |
| Missing security headers | 5 | 0 |
| Dependency vulnerabilities | Unknown | 0 |
| Security test coverage | 0% | 70%+ |

---

## 🆘 SUPPORT & RESOURCES

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**End of Implementation Plan**
