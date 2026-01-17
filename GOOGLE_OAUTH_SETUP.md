# Google OAuth Setup Checklist

## Error: 401 invalid_client

This error means Google is rejecting your OAuth credentials. Follow these steps:

### 1. Check Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID that matches:
- `1004287388783-8m0tercsc1lndg3gdo4sp30vi4951kfo.apps.googleusercontent.com`

### 2. Verify Authorized Redirect URIs

In Google Cloud Console, edit your OAuth client and ensure these URIs are added:

```
http://localhost:3000/api/auth/callback/google
```

**IMPORTANT**: 
- Must be EXACTLY this format (no trailing slash)
- Case-sensitive
- Must include `http://` not `https://` for localhost

### 3. Check OAuth Consent Screen

Go to: https://console.cloud.google.com/apis/credentials/consent

- Must have a consent screen configured
- Can be "Internal" if using Google Workspace, or "External" for public
- Must add your email as a test user if in "Testing" mode

### 4. Verify .env File Format

Your `.env` file should have NO quotes around values:

```env
GOOGLE_CLIENT_ID=1004287388783-8m0tercsc1lndg3gdo4sp30vi4951kfo.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=vnOvCqP86VSQcA/cxURg1VjeSj1lFr7vezrurTkuVHc=
```

**Remove quotes if present!**

### 5. Create a New OAuth Client (if still not working)

1. In Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: "F1 Travel"
5. **Authorized redirect URIs**: 
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Click "Create"
7. Copy the **Client ID** and **Client secret**
8. Update your `.env` file with new credentials
9. **Restart your dev server** (`npm run dev`)

### 6. Test Again

After making changes:
1. Restart the dev server
2. Clear browser cache/cookies for localhost:3000
3. Try signing in again

### Quick Debug Check

If still not working, verify your client ID format:
- Should end with `.apps.googleusercontent.com`
- Should be the Client ID (not the Client secret)
- Should not have quotes in .env
