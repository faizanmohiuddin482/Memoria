# Database Setup

## Supabase Setup Instructions

1. **Create a Supabase project** at https://supabase.com
2. **Get your credentials**:

   - Project URL (Settings > API > Project URL)
   - Anon key (Settings > API > anon public key)
   - Service role key (Settings > API > service_role secret key)

3. **Run the SQL schema**:

   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `schema.sql`
   - Run the query

4. **Enable pgvector extension** (if not already enabled):

   - The schema.sql includes `CREATE EXTENSION IF NOT EXISTS vector;`
   - If you get an error, you may need to enable it manually in Database > Extensions

5. **Add environment variables** to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Notes

- The `memories` table stores user memories with vector embeddings
- The `match_memories` function performs cosine similarity search
- Vector dimension is 768 (Google's text-embedding-004)
