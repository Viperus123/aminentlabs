/* ========================================
   AMINENT LABS — Supabase Configuration
   ======================================== */

const SUPABASE_URL = 'https://gtdiqljibqnmijqfypxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZGlxbGppYnFubWlqcWZ5cHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzIyNTAsImV4cCI6MjA4ODk0ODI1MH0.v062Kh-e2s61hDMFmdu0CjuX7Qh5ynO3rEOPesq9McE';

// Initialize Supabase client (UMD build exposes window.supabase)
var _sb = window.supabase;
var supabase = _sb.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
