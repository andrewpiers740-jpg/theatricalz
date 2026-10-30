// proxy.js (called middleware.js before Next.js 16) - Markdown content negotiation with q-value parser (WebForge v11.1 Section V5)
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|js/|fonts/|images/|.*\\..*).*)'],
};

function prefersMarkdownOverHtml(accept) {
  let mdQ = -1;
  let htmlQ = -1;

  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';').map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q);
    if (type === 'text/html') htmlQ = Math.max(htmlQ, q);
  }

  return mdQ > -1 && mdQ > htmlQ;
}

export function proxy(request) {
  const accept = request.headers.get('accept') || '';

  if (prefersMarkdownOverHtml(accept)) {
    const url = new URL('/llms.txt', request.url);
    return NextResponse.rewrite(url, {
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  return NextResponse.next();
}
