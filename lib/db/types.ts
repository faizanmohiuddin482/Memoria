export interface Memory {
  id: string;
  user_id: string;
  content: string;
  embedding: number[];
  created_at: string;
  updated_at: string;
}

export interface MemoryInsert {
  user_id: string;
  content: string;
  embedding: number[];
}

export interface MemorySearchResult {
  id: string;
  content: string;
  created_at: string;
  similarity: number;
}
