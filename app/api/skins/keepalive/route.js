import { supabase } from '/lib/supabase.js';

const KEEPALIVE_CHECKSUM = process.env.NEXT_PUBLIC_SUPABASE_KEEP_ALIVE;
const KEEPALIVE_FILE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/skins/${KEEPALIVE_CHECKSUM}.png`;

export async function GET() {
  try {
    if (!supabase) {
      return Response.json({ ok: false, error: '500 Internal Server Error' });
    }

    const { error: upsertError } = await supabase
      .from('skins')
      .upsert(
        { checksum: KEEPALIVE_CHECKSUM, file_url: KEEPALIVE_FILE_URL, uploaded_at: new Date().toISOString() },
        { onConflict: 'checksum' }
      );

    if (upsertError) throw upsertError;

    const { error: deleteError } = await supabase
      .from('skins')
      .delete()
      .eq('checksum', KEEPALIVE_CHECKSUM);

    if (deleteError) throw deleteError;

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Keepalive ping failed:', error.message);
    return Response.json({ ok: false, error: error.message });
  }
}