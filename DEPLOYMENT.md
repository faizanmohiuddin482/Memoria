# Deployment Guide for Memoria

This guide will help you deploy Memoria to Vercel (recommended for Next.js apps).

## Prerequisites

1. **Supabase Account** - Already set up
2. **Google AI Studio API Key** - Already set up
3. **GitHub Account** - For version control
4. **Vercel Account** - Free tier available

## Step 1: Enable Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider (should be enabled by default)
4. (Optional) Enable **Google** or **GitHub** for OAuth:
   - For Google: Add OAuth credentials from Google Cloud Console
   - For GitHub: Add OAuth app credentials from GitHub

## Step 2: Update Database Schema

Run the updated schema in Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase
2. Run the SQL from `database/schema-updated.sql` (includes RLS policies)
3. This will:
   - Add foreign key constraint to `auth.users`
   - Enable Row Level Security (RLS)
   - Create policies so users can only access their own memories

## Step 3: Configure Supabase Redirect URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add to **Redirect URLs**:
   - `http://localhost:3000/app`
   - `http://localhost:3000/auth/callback`
   - (You'll add your production URL after deployment)

## Step 4: Set Up Vercel

1. **Push your code to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Add authentication"
   git push origin main
   ```

2. **Sign up/Login to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

3. **Import your project**:

   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**:
   In Vercel project settings → Environment Variables, add:

   ```
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app.vercel.app`

## Step 5: Update Supabase Redirect URLs for Production

After deployment, update Supabase:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/app`
   - `https://your-app.vercel.app/auth/callback`

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Click "Get Started" on the landing page
3. Sign up with email/password
4. Test storing and searching memories

## Environment Variables Reference

| Variable                        | Description               | Where to Find                                              |
| ------------------------------- | ------------------------- | ---------------------------------------------------------- |
| `GOOGLE_AI_API_KEY`             | Google AI Studio API key  | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL      | Supabase Dashboard → Settings → API                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key         | Supabase Dashboard → Settings → API                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key | Supabase Dashboard → Settings → API                        |
| `NEXT_PUBLIC_APP_URL`           | Your app URL              | Your Vercel deployment URL                                 |

## Troubleshooting

### Auth not working

- Check that Supabase Auth is enabled
- Verify redirect URLs in Supabase settings match your deployment URL
- Check browser console for errors
- Ensure email provider is enabled in Supabase

### API errors

- Verify all environment variables are set in Vercel
- Check Vercel function logs for errors
- Ensure Supabase keys are correct

### Database errors

- Verify the database schema is correct (run `schema-updated.sql`)
- Check that pgvector extension is enabled
- Ensure RLS policies are created
- Verify foreign key constraint to `auth.users`

### "User not found" errors

- Make sure you've run the updated schema with RLS policies
- Check that the `user_id` foreign key references `auth.users(id)`

## Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs

## Security Checklist

- ✅ Environment variables are set in Vercel (not in code)
- ✅ Supabase service role key is kept secret
- ✅ Auth is properly configured
- ✅ RLS policies are enabled
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ CORS is configured in Supabase

## Features Included

- ✅ Email/password authentication
- ✅ Protected routes (AuthGuard)
- ✅ User-specific memories (RLS)
- ✅ Sign up / Sign in pages
- ✅ Sign out functionality
- ✅ Session management

Your app is now live with authentication! 🚀
