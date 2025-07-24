# Firebase Authentication Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "shoonya-ai-website")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable" → Save
   - **Google**: Click on it, toggle "Enable", enter your project name and support email → Save

## Step 3: Get Your Firebase Configuration

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`") to add a web app
5. Register your app with a nickname (e.g., "shoonya-ai-web")
6. **Don't** check "Also set up Firebase Hosting"
7. Click "Register app"
8. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 4: Update Your Application

1. Open `frontend/src/services/firebase.js`
2. Replace the placeholder configuration with your actual Firebase configuration:

```javascript
// Replace this placeholder configuration:
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// With your actual configuration from Firebase Console
```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to "Authentication" → "Settings" → "Authorized domains"
2. Add your domains:
   - `localhost` (for development)
   - `shoonyaai.com` (your production domain)
   - Any other domains you'll use

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   cd frontend
   npm start
   ```
2. Go to `http://localhost:3000/signup`
3. Try creating an account with email/password
4. Try signing in with Google
5. Verify that authentication works correctly

## Step 7: Optional - Firebase Security Rules

For better security, you can set up Firestore security rules if you plan to use Firestore database in the future.

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Authorized domains in Firebase Console

2. **"Firebase: Error (auth/api-key-not-valid)"**
   - Double-check your API key in the configuration

3. **Google Sign-In not working**
   - Make sure Google provider is enabled in Firebase Console
   - Check if you've added the correct authorized domains

4. **"Firebase: Error (auth/configuration-not-found)"**
   - Verify your Firebase configuration is correct
   - Make sure you've registered your web app in Firebase Console

## Features Implemented

✅ Email/Password Authentication
✅ Google Sign-In
✅ User Registration
✅ User Login
✅ User Logout
✅ Protected Routes
✅ Authentication State Management
✅ Loading States
✅ Error Handling

## Next Steps

After completing the setup:

1. Your users can now sign up/login with email and password
2. Your users can sign in with their Google account
3. All authentication is handled by Firebase
4. User sessions are automatically managed
5. Protected routes will redirect unauthenticated users to login

## Important Notes

- **Security**: Never commit your Firebase configuration with actual keys to public repositories
- **Environment Variables**: Consider using environment variables for sensitive configuration
- **Backup**: Keep a backup of your Firebase project configuration
- **Testing**: Test thoroughly in both development and production environments

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration is correct
3. Make sure all required services are enabled in Firebase Console
4. Check that your domain is authorized in Firebase settings 