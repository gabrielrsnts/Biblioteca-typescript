import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();


if (!supabaseUrl || !supabaseKey) {
    throw new Error('As credenciais do Supabase não foram configuradas corretamente');
}

export const supabase = createClient(supabaseUrl, supabaseKey); 
