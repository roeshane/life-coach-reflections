// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://blcikbuuzfkubdnhnnid.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsY2lrYnV1emZrdWJkbmhubmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDIyMzEsImV4cCI6MjA2MjYxODIzMX0.vwtOf7AvTyyrE5wAG1buz3pMshvTif_Lq3Ya-3RN-Hs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);