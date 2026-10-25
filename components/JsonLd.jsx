// components/JsonLd.jsx - Safe JSON-LD schema renderer
// Email addresses are written with a JSON unicode escape for "@" (a valid JSON string, read back as a normal "@"
// by parsers) so addresses are not sitting as plain text in the page source.
const EMAIL = /([A-Za-z0-9._%+-]+)@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;

export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(EMAIL, '$1\\u0040$2') }}
    />
  );
}
