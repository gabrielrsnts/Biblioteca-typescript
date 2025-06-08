import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository {
    protected constructor(protected db: SupabaseClient) {}
} 