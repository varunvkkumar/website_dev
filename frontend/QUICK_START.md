# Quick Start Guide - Run Locally

## 🚀 Run the Application

1. **Start the development server:**
   ```bash
   cd frontend
   npm start
   ```

2. **Open your browser and go to:**
   - `http://localhost:3000`

## ⚠️ Firebase Setup Required

To enable authentication, you need to:

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Click "Create a project"
   - Name: `shoonya-ai-website`
   - Disable Google Analytics (optional)

2. **Enable Authentication:**
   - In Firebase Console → Authentication → Get started
   - Sign-in method tab → Enable Email/Password
   - Sign-in method tab → Enable Google

3. **Get Configuration:**
   - Project Settings → Your apps → Web app
   - Register app name: `shoonya-ai-web`
   - Copy the firebaseConfig object

4. **Update Code:**
   - Open `src/services/firebase.js`
   - Replace the `firebaseConfig` object with your actual config

## 🔧 What Works Now

- ✅ Frontend application loads
- ✅ Navigation works
- ✅ UI components display
- ⚠️ Authentication requires Firebase setup

## 🧪 Test Without Firebase

You can still test the UI:
- Visit `/login` to see the login form
- Visit `/signup` to see the signup form
- All other pages work normally

## 🔥 After Firebase Setup

Once configured, you can:
- Sign up with email/password
- Sign in with Google
- Access protected routes
- Full authentication flow

## 📞 Need Help?

If you see console errors about Firebase:
1. Check `FIREBASE_SETUP_INSTRUCTIONS.md` for detailed setup
2. Make sure your Firebase config is correct
3. Verify authentication providers are enabled

---

**Ready to start?** Run `npm start` in the frontend directory! 