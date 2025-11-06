# Memoria - AI-Powered Memory Assistant

Memoria is a personal memory assistant that helps you remember things using natural language. Store information like "I kept my credit card in the wooden shelf" and retrieve it later by asking "Where did I put my credit card?"

## Features

- 🧠 **Natural Language Storage**: Store memories in plain English
- 🔍 **Semantic Search**: Find memories using natural language queries
- 🤖 **AI-Powered**: Uses Google's Gemini AI for embeddings and query understanding
- 💾 **Vector Database**: Fast similarity search using Supabase with pgvector
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **AI**: Google AI Studio (Gemini API) - text-embedding-004 & gemini-pro
- **Database**: Supabase (PostgreSQL + pgvector)
- **Hosting**: Vercel (recommended)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google AI Studio API key (free tier available)

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `database/schema.sql`
3. Get your credentials:
   - Project URL (Settings > API > Project URL)
   - Anon key (Settings > API > anon public key)
   - Service role key (Settings > API > service_role secret key)

### 4. Get Google AI Studio API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 5. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Storing a Memory

1. Type your memory in natural language, e.g., "I kept my credit card in the wooden shelf"
2. Click "Remember This"
3. The memory is stored with an AI-generated embedding

### Searching Memories

1. Type your question, e.g., "Where did I put my credit card?"
2. Click "Ask Memoria"
3. Get an AI-generated answer based on your stored memories

## Project Structure

```
memoria/
├── app/
│   ├── api/
│   │   └── memories/        # API routes for memories
│   ├── page.tsx             # Main page
│   └── layout.tsx           # Root layout
├── components/
│   ├── MemoryInput.tsx      # Component for adding memories
│   ├── MemorySearch.tsx     # Component for searching
│   └── MemoryList.tsx       # Component for displaying memories
├── lib/
│   ├── ai/
│   │   └── gemini.ts        # Google AI integration
│   ├── db/
│   │   ├── memories.ts      # Database operations
│   │   └── types.ts         # TypeScript types
│   └── supabase/
│       ├── client.ts        # Supabase client (browser)
│       └── server.ts        # Supabase admin client (server)
└── database/
    └── schema.sql           # Database schema
```

## API Endpoints

### POST `/api/memories`

Store a new memory.

**Body:**

```json
{
  "userId": "user-id",
  "content": "I kept my credit card in the wooden shelf"
}
```

### GET `/api/memories?userId=user-id`

Get all memories for a user.

### POST `/api/memories/search`

Search memories using natural language.

**Body:**

```json
{
  "userId": "user-id",
  "query": "Where did I put my credit card?"
}
```

### DELETE `/api/memories/[id]?userId=user-id`

Delete a memory.

## Cost Estimates

- **Google AI Studio**: Free tier includes 60 requests/minute, 1,500 requests/day
- **Supabase**: Free tier includes 500MB database, 2GB bandwidth/month
- **Vercel**: Free tier includes 100GB bandwidth/month

For a prototype, you should be able to use everything for free!

## Future Enhancements

- [ ] User authentication (currently using demo user ID)
- [ ] Memory categories/tags
- [ ] Update existing memories
- [ ] Voice input/output
- [ ] Mobile app
- [ ] Memory sharing
- [ ] Export/import memories

## License

MIT
