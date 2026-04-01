import { supabase } from './info';

export async function kvGet(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single();
  if (error || !data) return null;
  return data.value;
}

export async function kvSet(key: string, value: string): Promise<void> {
  await supabase
    .from('kv_store')
    .upsert({ key, value }, { onConflict: 'key' });
}

export async function kvDelete(key: string): Promise<void> {
  await supabase
    .from('kv_store')
    .delete()
    .eq('key', key);
}

export async function kvGetByPrefix(prefix: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('kv_store')
    .select('key, value')
    .like('key', `${prefix}%`);
  if (error || !data) return {};
  const result: Record<string, string> = {};
  for (const row of data) {
    result[row.key] = row.value;  // preserve full key, not stripped
  }
  return result;
}