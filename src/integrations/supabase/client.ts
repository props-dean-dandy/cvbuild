// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dsoizqpngqespqjxgchp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb2l6cXBuZ3Flc3BxanhnY2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjAyMTEsImV4cCI6MjA1OTkzNjIxMX0.zIBqFTejIj6k99ha3v_DxhlBOcNYPiAbI1_ZJSC6e_c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);