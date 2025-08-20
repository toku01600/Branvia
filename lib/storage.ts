import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← サービスキーを使う
);

/**
 * バッファを Supabase Storage にアップロード
 */
export async function uploadBuffer(path: string, buffer: Buffer) {
  const { error } = await supabase.storage
    .from("artifacts") // ← バケット名（Supabaseのダッシュボードで作成）
    .upload(path, buffer, {
      contentType: "application/zip",
      upsert: true,
    });

  if (error) throw error;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artifacts/${path}`;
}
