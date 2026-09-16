import { getBaseUrl } from '@repo/constants';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
User-agent: *
Disallow: /

Sitemap: ${(await getBaseUrl()).POS}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
