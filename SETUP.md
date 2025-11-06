# Quick Setup Guide

Follow these steps to get Memoria running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)
4. Go to **SQL Editor** in the left sidebar
5. Copy the entire contents of `database/schema.sql`
6. Paste and run it in the SQL Editor
7. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key 
   - `service_role` secret key 

## 3. Get Google AI Studio API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key: AIzaSyA64S1S2hcUF5A8sSHp2Sc69ElrmxOvyvY

## 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:
   ```env
   GOOGLE_AI_API_KEY=paste_your_google_ai_key_here
   NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

1. **Store a memory**: Type "I kept my credit card in the wooden shelf" and click "Remember This"
2. **Search**: Type "Where did I put my credit card?" and click "Ask Memoria"
3. You should see the AI response with your stored memory!

## Troubleshooting

### "Missing environment variables" error

- Make sure `.env.local` exists and has all required variables
- Restart the dev server after adding environment variables

### Database errors

- Make sure you ran the SQL schema in Supabase
- Check that pgvector extension is enabled (it should be automatic)

### API errors

- Verify your Google AI API key is correct
- Check that your Supabase keys are correct
- Make sure your Supabase project is active

## Need Help?

Check the main [README.md](./README.md) for more details.
