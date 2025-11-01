import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txpwopadzhgkskbgbbaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cHdvcGFkemhna3NrYmdiYmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUzODcsImV4cCI6MjA3NzU5MTM4N30.U5d_nK7FfJZFqtBKhETZRJEbG-vvsXIKgtkB0CWidSg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
