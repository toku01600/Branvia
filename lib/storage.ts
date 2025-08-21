import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signDownloadUrl(key: string) {
  const { data, error } = await supabase.storage
    .from('artifacts') // ← bucket名（正しい名前にしてください）
    .createSignedUrl(key, 60 * 60); // 1時間有効

  if (error) throw error;
  return data.signedUrl;
}


export async function uploadBuffer(key: string, buffer: Buffer) {
  const { error } = await supabase.storage
    .from('artifacts') // ← bucket名
    .upload(key, buffer, {
      contentType: 'application/zip',
      upsert: true, // 上書き許可したい場合
    });

  if (error) throw error;
}
