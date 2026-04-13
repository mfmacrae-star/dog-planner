import { createClient } from "@supabase/supabase-js";

const projectId = "zkdqvxaihllzqtnuejqa";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF2eGFpaGxsenF0bnVlanFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjkwNjMsImV4cCI6MjA4MTY0NTA2M30.T_SA17QrITykMi4uKSEnLFXdEZ572rM8ghDFEM-T1BA";
const supabaseUrl = `https://${projectId}.supabase.co`;

const cookieStorage = {
  getItem: (key: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string) => {
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=86400;SameSite=Lax`;
  },
  removeItem: (key: string) => {
    document.cookie = `${key}=;path=/;max-age=0`;
  },
};

function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, publicAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: cookieStorage }
    });
  }

  if (!(window as any).__SUPABASE_CLIENT__) {
    (window as any).__SUPABASE_CLIENT__ = createClient(supabaseUrl, publicAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: cookieStorage }
    });
  }

  return (window as any).__SUPABASE_CLIENT__;
}

export const supabase = getSupabaseClient();
