import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const supabaseUrl = 'https://fsnwrgskggwopdauhggs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbndyZ3NrZ2d3b3BkYXVoZ2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzEwMzgsImV4cCI6MjA2NDU0NzAzOH0.OfvLottXr5O-8gy7DHybhCyhVDNg44za7bNAUywVtLw';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('As credenciais do Supabase não foram configuradas corretamente no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey); 