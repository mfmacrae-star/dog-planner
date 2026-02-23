import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info.tsx";

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

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: cookieStorage,
    },
  }
);
