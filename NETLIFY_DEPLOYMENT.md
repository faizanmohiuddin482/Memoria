# Netlify Deployment Guide for Memoria

This guide will walk you through deploying your Memoria application to Netlify.

## Prerequisites

- A GitHub account with your Memoria repository
- A Netlify account (sign up at [netlify.com](https://netlify.com))
- Your Supabase project set up
- Your Google AI Studio API key

## Step 1: Push Your Code to GitHub

Make sure all your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Sign in to Netlify**

   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Add New Site**

   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub repositories
   - Select your `Memoria` repository

3. **Configure Build Settings**

   - Netlify should auto-detect Next.js
   - Build command: `npm run build`
   - Publish directory: `.next` (or leave empty, Netlify will handle it)
   - Click "Show advanced" and add:
     - Node version: `20`

4. **Set Environment Variables**
   Before deploying, click "Show advanced" → "New variable" and add:

   ```
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NODE_VERSION=20
   SECRETS_SCAN_OMIT_KEYS=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

   **Note:** `SECRETS_SCAN_OMIT_KEYS` tells Netlify to allow these variables in build output. This is safe because `NEXT_PUBLIC_*` variables are intentionally public (Next.js embeds them in the client bundle).

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize Netlify**

   ```bash
   cd memoria
   netlify init
   ```

   - Choose "Create & configure a new site"
   - Follow the prompts

4. **Set Environment Variables**

   ```bash
   netlify env:set GOOGLE_AI_API_KEY "your_google_ai_api_key"
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_project_url"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_supabase_anon_key"
   netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_supabase_service_role_key"
   netlify env:set SECRETS_SCAN_OMIT_KEYS "NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY"
   ```

   **Note:** `SECRETS_SCAN_OMIT_KEYS` tells Netlify to allow these variables in build output. This is safe because `NEXT_PUBLIC_*` variables are intentionally public.

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Supabase Redirect URLs

After deployment, you'll get a Netlify URL (e.g., `https://memoria-123.netlify.app`).

1. **Update Supabase Settings**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **URL Configuration**
   - Add your Netlify URL to "Site URL": `https://your-site.netlify.app`
   - Add to "Redirect URLs":
     - `https://your-site.netlify.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local development)

## Step 4: Update Environment Variables (if needed)

If you need to update environment variables after deployment:

1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Edit or add variables as needed
3. Trigger a new deploy (Deploys → Trigger deploy → Deploy site)

## Environment Variables Reference

| Variable                        | Description                | Where to Find                                                   |
| ------------------------------- | -------------------------- | --------------------------------------------------------------- |
| `GOOGLE_AI_API_KEY`             | Google AI Studio API key   | [Google AI Studio](https://aistudio.google.com/app/apikey)      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL       | Supabase Dashboard → Settings → API                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key          | Supabase Dashboard → Settings → API                             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key  | Supabase Dashboard → Settings → API                             |
| `NODE_VERSION`                  | Node.js version            | Set to `20`                                                     |
| `SECRETS_SCAN_OMIT_KEYS`        | Allow public vars in build | Set to `NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY` |

## Troubleshooting

### Build Fails

- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify Node version is set to 20
- Check that `netlify.toml` is in the root directory

### Secrets Scanning Error

If you see an error about secrets being detected in build output:

- **This is expected** for `NEXT_PUBLIC_*` variables - Next.js embeds them in the client bundle
- Add `SECRETS_SCAN_OMIT_KEYS` environment variable in Netlify with value: `NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY`
- This tells Netlify these variables are intentionally public and safe to include in build output
- After adding this variable, trigger a new deploy

### Authentication Not Working

- Verify Supabase redirect URLs include your Netlify URL
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Ensure environment variables are set in Netlify (not just in `.env.local`)

### API Errors

- Verify `GOOGLE_AI_API_KEY` is set correctly
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set (for server-side operations)
- Review Netlify function logs for detailed error messages

### Database Errors

- Ensure database schema is set up in Supabase
- Verify RLS policies are configured
- Check that `SUPABASE_SERVICE_ROLE_KEY` has proper permissions

## Custom Domain (Optional)

1. Go to Netlify Dashboard → Your Site → Domain settings
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Continuous Deployment

Netlify automatically deploys when you push to your main branch. To disable or configure:

1. Go to Site settings → Build & deploy → Continuous Deployment
2. Configure branch and build settings as needed
