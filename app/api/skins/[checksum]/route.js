export async function GET(request, { params }) {
  let { checksum } = await params;
  checksum = checksum.replace(/\.png$/, '');

  const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/skins/${checksum}.png`;

  try {
    const response = await fetch(supabaseUrl);

    if (!response.ok) {
      return Response.redirect(new URL('/404', request.url), 307);
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return Response.redirect(new URL('/error', request.url), 307);
  }
}