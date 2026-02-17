# Supabase Authentication Setup Guide

## 🎯 Overview

This guide walks you through setting up Supabase authentication for the Gift AI frontend with:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Protected routes
- ✅ Session management with cookies
- ✅ User profile page
- ✅ Automatic session refresh

---

## 📋 Prerequisites

- Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed
- Git (optional)

---

## 🚀 Quick Start

### 1. Configure Supabase Project

#### A. Enable Authentication Providers

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider (enabled by default)
4. Enable **Google** provider:
   - Click on Google provider
   - Enable it
   - Add your Google OAuth credentials (see below)

#### B. Setup Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if needed
6. Select **Web application**
7. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for local development)
   ```
8. Copy **Client ID** and **Client Secret**
9. In Supabase Dashboard → Authentication → Providers → Google:
   - Paste Client ID
   - Paste Client Secret
   - Click Save

#### C. Configure Site URL

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (development)
3. Add **Redirect URLs**: `http://localhost:3000/auth/callback`

For production, update to your production URL:
```
Site URL: https://your-domain.com
Redirect URLs: https://your-domain.com/auth/callback
```

---

### 2. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- `next` (14.1.0)
- `react` & `react-dom` (18.2.0)
- `@supabase/supabase-js` (Supabase client)
- `@supabase/auth-helpers-nextjs` (Next.js auth helpers)
- `@supabase/auth-ui-react` (Pre-built auth components)
- `tailwindcss` (Styling)

---

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API (your FastAPI backend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find your Supabase credentials:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **IMPORTANT**: Never commit `.env.local` to git!

---

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx             # Home page
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── profile/
│   │   └── page.tsx         # User profile page (protected)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts     # OAuth callback handler
│   └── globals.css          # Global styles
├── contexts/
│   └── AuthContext.tsx      # Authentication context & hooks
├── lib/
│   └── supabase/
│       ├── client.ts        # Client-side Supabase client
│       └── server.ts        # Server-side Supabase client
├── types/
│   └── database.ts          # TypeScript database types
├── middleware.ts            # Protected route middleware
├── .env.local.example       # Environment variables template
└── .env.local              # Your actual env vars (DO NOT COMMIT)
```

---

## 🔐 How It Works

### Authentication Flow

#### Email/Password Signup
```
1. User fills signup form
2. `signUp()` creates account in Supabase
3. Verification email sent to user
4. User clicks link to verify email
5. User can now log in
```

#### Email/Password Login
```
1. User fills login form
2. `signIn()` authenticates with Supabase
3. Session created and stored in cookies
4. User redirected to home/dashboard
```

#### Google OAuth
```
1. User clicks "Sign in with Google"
2. Redirected to Google login
3. Google redirects back to /auth/callback
4. Session created automatically
5. User redirected to home
```

### Protected Routes

The middleware (`middleware.ts`) automatically:
- Checks for valid session on every request
- Redirects to `/login` if accessing protected route without session
- Redirects to `/` if accessing auth pages with active session
- Refreshes expired sessions automatically

**Protected routes** (require login):
- `/profile`
- `/preferences` (if you create it)
- `/favorites` (if you create it)

**Auth routes** (redirect to home if logged in):
- `/login`
- `/signup`

---

## 💻 Usage Examples

### Check if User is Logged In

```tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  return <div>Welcome, {user.email}!</div>
}
```

### Sign Up

```tsx
const { signUp } = useAuth()

const handleSignup = async () => {
  const { data, error } = await signUp(email, password, {
    full_name: name
  })

  if (error) {
    console.error('Signup error:', error.message)
  } else {
    console.log('Check your email for verification!')
  }
}
```

### Sign In

```tsx
const { signIn } = useAuth()

const handleLogin = async () => {
  const { data, error } = await signIn(email, password)

  if (error) {
    console.error('Login error:', error.message)
  } else {
    console.log('Logged in successfully!')
  }
}
```

### Sign In with Google

```tsx
const { signInWithGoogle } = useAuth()

const handleGoogleLogin = async () => {
  try {
    await signInWithGoogle()
    // User will be redirected to Google
  } catch (error) {
    console.error('Google login error:', error)
  }
}
```

### Sign Out

```tsx
const { signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  // User redirected to /login
}
```

### Get Current User

```tsx
const { user, session } = useAuth()

console.log('User:', user)
console.log('Email:', user?.email)
console.log('User ID:', user?.id)
console.log('Session:', session)
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
        // etc.
      },
    },
  },
},
```

### Add More Protected Routes

Edit `middleware.ts`:

```ts
const protectedRoutes = [
  '/profile',
  '/preferences',
  '/favorites',
  '/your-new-route'  // Add here
]
```

### Customize Login/Signup Pages

The pages are in:
- `app/login/page.tsx`
- `app/signup/page.tsx`

Edit the JSX and styling as needed.

---

## 🐛 Troubleshooting

### "Invalid login credentials"

**Problem:** User can't log in

**Solutions:**
1. Check email is verified (check inbox/spam)
2. Verify credentials are correct
3. Check Supabase Dashboard → Authentication → Users
4. Try password reset

### "Invalid API key"

**Problem:** Environment variables not loaded

**Solutions:**
1. Verify `.env.local` file exists
2. Check variable names match exactly
3. Restart dev server (`npm run dev`)
4. Clear browser cache

### Google OAuth not working

**Problem:** Google login fails or redirects to error page

**Solutions:**
1. Verify Google OAuth credentials in Supabase
2. Check authorized redirect URIs match exactly
3. Ensure Site URL is correct in Supabase
4. Check Google Cloud Console for errors

### Session not persisting

**Problem:** User logged out on page refresh

**Solutions:**
1. Check cookies are enabled in browser
2. Verify middleware is running (check `middleware.ts`)
3. Check console for cookie errors
4. Try clearing browser cookies

### Middleware redirect loop

**Problem:** Page keeps redirecting

**Solutions:**
1. Check `matcher` config in `middleware.ts`
2. Verify protected routes array
3. Check for conflicting redirects
4. Look at browser network tab for redirect chain

---

## 🚢 Production Deployment

### Update Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.com
```

### Update Supabase Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL**: `https://your-domain.com`
3. Add **Redirect URLs**: `https://your-domain.com/auth/callback`

### Update Google OAuth

If using Google OAuth:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add production redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://your-domain.com/auth/callback
   ```

---

## 🔒 Security Best Practices

### Environment Variables

✅ **Do:**
- Use `NEXT_PUBLIC_` prefix for client-side variables only
- Keep service role keys in backend only
- Use `.env.local` for local development
- Set variables in hosting platform for production

❌ **Don't:**
- Commit `.env.local` to git
- Expose service role key in frontend
- Hardcode secrets in code

### Session Management

✅ **Do:**
- Use HTTP-only cookies (automatic with Supabase)
- Implement CSRF protection (automatic with Next.js)
- Refresh sessions automatically (handled by middleware)
- Clear sessions on logout

❌ **Don't:**
- Store tokens in localStorage (vulnerable to XSS)
- Share sessions across users
- Skip email verification

### API Keys

✅ **Do:**
- Use `anon` key for frontend
- Use `service_role` key for backend only
- Rotate keys periodically
- Monitor usage in Supabase Dashboard

❌ **Don't:**
- Expose service role key
- Commit keys to version control
- Share keys publicly

---

## 📊 Features Checklist

After setup, you should have:

- [x] Email/password signup
- [x] Email/password login
- [x] Google OAuth login
- [x] Email verification
- [x] Protected routes (middleware)
- [x] Session persistence (cookies)
- [x] Automatic session refresh
- [x] User profile page
- [x] Logout functionality
- [x] Loading states
- [x] Error handling
- [x] Responsive design
- [x] Type-safe database access

---

## 🎯 Next Steps

1. **Test authentication:**
   - Create an account
   - Verify email
   - Log in
   - Try Google OAuth
   - Access profile page
   - Log out

2. **Customize:**
   - Update branding/colors
   - Add more fields to profile
   - Create additional protected pages
   - Integrate with your backend

3. **Deploy:**
   - Deploy to Vercel/Netlify
   - Update environment variables
   - Test production authentication
   - Monitor for errors

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Auth Helpers**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🆘 Support

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Check browser console for errors
3. Check Supabase Dashboard → Logs
4. Review Next.js server logs
5. Check Supabase Discord: https://discord.supabase.com

---

**Authentication setup complete! 🎉**

You now have a production-ready authentication system with email/password and Google OAuth support.
