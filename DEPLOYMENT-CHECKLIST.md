# 🚀 Deployment Checklist

Copy this checklist to ensure all security measures are properly deployed.

## Pre-Deployment Checklist

### Local Development
- [ ] `.env` file exists with all Firebase credentials
- [ ] Application runs locally (`npm run dev`)
- [ ] No console errors related to Firebase initialization
- [ ] Authentication works (login/logout)

### Code Quality
- [ ] Run `npm run type-check` - passes without errors
- [ ] Run `npm run audit` - no high/critical vulnerabilities
- [ ] No hardcoded secrets: `grep -r "AIzaSy" . --exclude-dir=node_modules --exclude=.env`
- [ ] `.env` is listed in `.gitignore` and not committed

### Firebase Configuration
- [ ] Firestore rules deployed: `firebase deploy --only firestore:rules`
- [ ] Storage rules deployed: `firebase deploy --only storage:rules`
- [ ] Test authentication (create/login user)
- [ ] Test data access (should require authentication)
- [ ] Test file upload (should validate size/type)

### GitHub Setup (for CI/CD)
- [ ] Repository has all required secrets set:
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_STORAGE_BUCKET
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
  - [ ] VITE_FIREBASE_APP_ID
  - [ ] FIREBASE_SERVICE_ACCOUNT
  - [ ] FIREBASE_TOKEN
- [ ] GitHub Actions workflows are enabled
- [ ] Dependabot is enabled

### Security Verification
- [ ] Security headers active (check browser DevTools → Network → Headers)
- [ ] HTTPS enforced (no mixed content warnings)
- [ ] Admin functions work correctly
- [ ] Non-admin users have limited access
- [ ] File upload rejects files > 5MB
- [ ] File upload rejects non-image files

### Team Communication
- [ ] Team notified of changes
- [ ] `.env.example` shared with team
- [ ] Security guidelines communicated
- [ ] Deployment process documented

## Post-Deployment Verification

### After First Deploy
- [ ] Website loads without errors
- [ ] Authentication works in production
- [ ] Data reads/writes work correctly
- [ ] File uploads work correctly
- [ ] No security rule errors in Firebase Console

### Ongoing Monitoring
- [ ] Weekly: Review Dependabot PRs
- [ ] Weekly: Check GitHub Actions results
- [ ] Monthly: Run `npm audit`
- [ ] Quarterly: Full security review

## Optional Enhancements

### Firebase App Check (Recommended)
- [ ] Enabled in Firebase Console
- [ ] reCAPTCHA v3 configured
- [ ] Site key added to `.env`
- [ ] App Check code uncommented in `firebase.ts`
- [ ] Tested in production

### Cloud Functions for Admin
- [ ] Cloud Functions initialized
- [ ] Admin claim functions deployed
- [ ] Tested admin role assignment
- [ ] Email-based checks replaced with custom claims

### Additional Security
- [ ] Content Security Policy configured (if needed)
- [ ] Rate limiting implemented (if needed)
- [ ] Logging service integrated (if needed)
- [ ] Error monitoring setup (e.g., Sentry)

## Emergency Rollback Plan

If something goes wrong:

### Rollback Firestore Rules
```bash
# Use previous version from git
git checkout HEAD~1 firestore.rules
firebase deploy --only firestore:rules
```

### Rollback Storage Rules
```bash
git checkout HEAD~1 storage.rules
firebase deploy --only storage:rules
```

### Disable Authentication Requirement Temporarily
In `firestore.rules`, temporarily add:
```javascript
allow read: if true; // TEMPORARY - REMOVE ASAP
```

## Success Criteria

✅ All checklist items completed  
✅ No security errors in production  
✅ Team can develop and deploy successfully  
✅ Security rating improved to 8.5/10  

---

**Date Completed:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________
