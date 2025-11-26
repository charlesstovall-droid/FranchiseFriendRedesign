# Gmail OAuth Setup Guide

The Gmail login feature for your admin panel is ready. Follow these steps to complete the setup:

## Step 1: Create OAuth Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web Application** as the application type
6. Set the following:
   - **Name**: "Franchise Friend Admin" (or your preferred name)
   - **Authorized redirect URIs**: Add your Replit app URL with the callback:
     ```
     https://[your-replit-domain].replit.dev/api/auth/google/callback
     ```
     For development/testing:
     ```
     https://[your-replit-dev-domain].replit.dev/api/auth/google/callback
     ```

7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Add Credentials to Replit Secrets

Once you have your Client ID and Client Secret:

1. In your Replit project, click the **Secrets** tab (lock icon)
2. Add two new secrets:
   - **GOOGLE_CLIENT_ID**: Paste your Client ID
   - **GOOGLE_CLIENT_SECRET**: Paste your Client Secret
3. Restart the application

## Step 3: Test Gmail Login

1. Navigate to `/members-admin`
2. Click the **Login with Gmail** button
3. Sign in with your Gmail account (charles@franchisefriend.net)
4. You should be redirected to the admin panel

## Finding Your Replit Domain

Your Replit domain URL can be found:
- In the **Webview** tab at the top of your project
- Typically formatted as: `https://[project-name]-[username].replit.dev`

## Notes

- Only the email `charles@franchisefriend.net` is authorized to access the admin panel
- The OAuth flow is secure and encrypted
- You can update credentials anytime by changing the secrets
