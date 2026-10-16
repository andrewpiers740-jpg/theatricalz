// lib/adminAuth.js - Server-only passcode verification for Reply Portal
export function checkAdminPasscode(request) {
  // Configured server-only passcode (never expose via NEXT_PUBLIC_*)
  const expected = process.env.ADMIN_PASSCODE || 'theatricalz2026';

  if (!expected) {
    return new Response(JSON.stringify({ error: 'ADMIN_PASSCODE is not configured on the server' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const provided = request.headers.get('x-admin-passcode');

  if (!provided || provided.trim() !== expected.trim()) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Invalid admin passcode.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null; // Authorization passed
}
