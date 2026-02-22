# Create a Fresh Google OAuth Client

If nothing else works, create a brand new OAuth client:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the CORRECT project
3. Click "Create Credentials" → "OAuth client ID"
4. Application type: **Web application**
5. Name: "F1 Travel Dev"
6. **Authorized redirect URIs** (add this EXACTLY):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (NO trailing slash, NO https://)

7. Click "Create"
8. Copy the **Client ID** (ends with .apps.googleusercontent.com)
9. Copy the **Client secret** (starts with GOCSPX-)

10. Update your .env file (NO QUOTES):
    ```
    GOOGLE_CLIENT_ID=your-new-client-id-here
    GOOGLE_CLIENT_SECRET=your-new-client-secret-here
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=next-auth-secret-key
    ```

11. **Save .env and restart dev server completely** (Ctrl+C, then npm run dev)

12. Try signing in again

