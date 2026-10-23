// scripts/gen-agent-files.mjs - Regenerates all agent-ready files from config/site.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const { SITE, CONTACT, SHOP, BRAND, CATEGORIES, REDIRECTS = [] } = await import('../config/site.js');
  const domain = SITE.domain;
  const name = SITE.name;
  const tagline = SITE.tagline;

  // Ensure directories exist
  const publicDir = path.join(rootDir, 'public');
  const wellKnownDir = path.join(publicDir, '.well-known');
  const agentSkillsDir = path.join(wellKnownDir, 'agent-skills');
  const mcpDir = path.join(wellKnownDir, 'mcp');
  const jsDir = path.join(publicDir, 'js');

  [publicDir, wellKnownDir, agentSkillsDir, mcpDir, jsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 1. robots.txt
  const robotsContent = `User-agent: *
Disallow: /admin/
Disallow: /order/payment-details/
Disallow: /order/confirm-payment/
Disallow: /thank-you-contact/
Disallow: /thank-you-order/
Disallow: /thank-you-wholesale/
Sitemap: https://${domain}/sitemap.xml

Content-Signal: search=yes, ai-input=yes, ai-train=no

# AI crawlers — welcome to index pro camera and audio catalog
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: cohere-ai
Allow: /

# Agent-readable resources
# llms.txt: https://${domain}/llms.txt
# API Catalog: https://${domain}/.well-known/api-catalog
# Agent Skills: https://${domain}/.well-known/agent-skills/index.json
# MCP Server Card: https://${domain}/.well-known/mcp/server-card.json
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf8');

  // 2. llms.txt
  const llmsContent = `# ${name}
> ${tagline}

Founded in ${BRAND.foundingYear} in Melbourne, Australia, ${name} is an authorized pro cinema, photo, broadcast video, and location audio equipment retailer supplying production houses, DP cinematographers, and creators nationwide.

## Contact & Location
- Address: ${CONTACT.address}
- Phone: ${CONTACT.phone} (${CONTACT.phoneDisplay})
- WhatsApp Gear Desk: https://wa.me/${CONTACT.whatsapp}
- Email: ${CONTACT.email}
- ABN: ${SITE.abn} · ACN: ${SITE.acn}

## Order Rules & Policies
- Free Shipping: Orders over $${SHOP.freeShippingThreshold} AUD receive complimentary StarTrack Express freight with transit insurance.
- Shipping Fee: Standard $${SHOP.shippingFee} AUD / Express $${SHOP.expressShippingFee} AUD.
- Crypto Discount: 10% instant discount when paying with BTC, USDT, ETH, BNB, or SOL.
- Payment Methods: Cryptocurrency (BTC, USDT, ETH, BNB, SOL), PayID and Australian Bank Transfer (EFT).
- Financing: Pay in 4 interest-free installments on eligible pro equipment.
- Stock Guarantee: 100% Genuine Australian Stock with local manufacturer warranties.

## Product Categories
${CATEGORIES.map((c) => `- [${c.name}](https://${domain}/shop/${c.slug}/): ${c.description}`).join(String.fromCharCode(10))}

## Customer Resources
- [Shop Catalog](https://${domain}/shop/): Full pro gear inventory with real-time stock levels.
- [Clearance Deals](https://${domain}/clearance/): Ex-demo, open-box, and overstock cinema equipment.
- [Finance Calculator](https://${domain}/financing/): Calculate commercial lease repayments and installment options.
- [Order Tracking](https://${domain}/tracking/): Real-time lookup for dispatched StarTrack express consignments.
- [Educational Articles](https://${domain}/blog/): Technical comparisons, lens mount guides, and 32-bit float audio workflows.
- [Help & FAQ](https://${domain}/faq/): Warranties, returns, and payment rail guidance.

## Optional Machine-Readable Resources
- [API Catalog](https://${domain}/.well-known/api-catalog): RFC 9727 linkset for machine exploration.
- [Agent Skills](https://${domain}/.well-known/agent-skills/index.json): Declarative commerce skills catalog.
- [MCP Server Card](https://${domain}/.well-known/mcp/server-card.json): Model Context Protocol streamable HTTP manifest.
- [Auth Specification](https://${domain}/auth.md): Agent authentication policy (no auth required for public discovery).
`;
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsContent, 'utf8');

  // 3. auth.md (Starts strictly with # Auth.md)
  const authContent = `# Auth.md

## Site: ${name} — Professional Cinema, Photo & Audio Supply

## Agent Registration
No authentication required. All product catalog resources, specifications, and educational articles are publicly accessible.

## Public Resources
| Resource | URL |
|---|---|
| Product Catalog | https://${domain}/shop/ |
| Categories API | https://${domain}/api/categories |
| Products API | https://${domain}/api/products |
| MCP Streamable Server | https://${domain}/api/mcp |
| Blog & Technical Guides | https://${domain}/blog/ |
| FAQ & Policies | https://${domain}/faq/ |
| Finance Calculator | https://${domain}/financing/ |

## Authentication

\`\`\`json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All catalog resources are publicly accessible."
  }
}
\`\`\`

## Ordering
Human-in-the-loop required. Agents may browse catalog items and prepare order drafts via the MCP \`create_order_draft\` tool. Final payment and identity verification are completed by a human via WhatsApp or secure online checkout.
`;
  fs.writeFileSync(path.join(publicDir, 'auth.md'), authContent, 'utf8');

  // 4. .well-known/api-catalog
  const apiCatalogContent = {
    linkset: [
      { anchor: `https://${domain}/`, 'https://www.iana.org/assignments/link-relations/service-doc': [{ href: `https://${domain}/faq/` }], title: `${name} — ${tagline}` },
      { anchor: `https://${domain}/shop/`, type: 'text/html', title: `${name} Pro Equipment Catalog` },
      { anchor: `https://${domain}/financing/`, type: 'text/html', title: `${name} Equipment Financing & Pay in 4` },
      { anchor: `https://${domain}/api/products`, type: 'application/json', title: `${name} Products API` },
      { anchor: `https://${domain}/api/categories`, type: 'application/json', title: `${name} Categories API` },
      { anchor: `https://${domain}/api/search`, type: 'application/json', title: `${name} Search API` },
      { anchor: `https://${domain}/api/mcp`, type: 'application/json', 'https://www.iana.org/assignments/link-relations/service-desc': [{ href: `https://${domain}/.well-known/mcp/server-card.json` }], title: `${name} MCP Server` },
    ],
  };
  fs.writeFileSync(path.join(wellKnownDir, 'api-catalog'), JSON.stringify(apiCatalogContent, null, 2), 'utf8');

  // 5. .well-known/agent-skills/index.json
  const agentSkillsContent = {
    $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
    name,
    url: `https://${domain}`,
    description: tagline,
    skills: [
      { name: 'search-products', type: 'commerce', description: 'Search pro cinema and audio gear by keyword, category, or price', url: `https://${domain}/api/mcp`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { name: 'browse-catalog', type: 'navigation', description: 'Browse full cinema and photo catalog by category', url: `https://${domain}/shop/`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { name: 'order-draft', type: 'commerce', description: 'Create prefilled pro gear order draft for human completion', url: `https://${domain}/api/mcp`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { name: 'product-education', type: 'content', description: 'Technical comparisons and film production guides', url: `https://${domain}/blog/`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { name: 'contact', type: 'support', description: 'Contact Melbourne gear desk for quotes or technical assistance', url: `https://${domain}/contact/`, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ],
  };
  fs.writeFileSync(path.join(agentSkillsDir, 'index.json'), JSON.stringify(agentSkillsContent, null, 2), 'utf8');

  // 6. .well-known/mcp/server-card.json (Vercel Live Variant)
  const mcpCardContent = {
    $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.json',
    serverInfo: {
      name,
      version: '1.0.0',
      description: BRAND.description,
      homepage: `https://${domain}`,
      contact: {
        email: CONTACT.email,
        whatsapp: `+${CONTACT.whatsapp}`,
      },
    },
    transport: {
      type: 'streamable-http',
      endpoint: `https://${domain}/api/mcp`,
    },
    capabilities: {
      tools: [
        { name: 'search_products', description: 'Search professional cinema, photo, video, and audio products by keyword, category, or maximum price.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, category: { type: 'string' }, max_price: { type: 'number' } } } },
        { name: 'get_product', description: 'Get complete technical specifications, pricing, and stock status for a pro gear product by slug.', inputSchema: { type: 'object', required: ['slug'], properties: { slug: { type: 'string' } } } },
        { name: 'list_categories', description: 'List all professional gear categories, descriptions, and current inventory counts.', inputSchema: { type: 'object', properties: {} } },
        { name: 'get_policies', description: 'Get Australian shipping, transit insurance, payment rails, warranty, and returns policies.', inputSchema: { type: 'object', properties: {} } },
        { name: 'create_order_draft', description: 'Prepare a structured pro gear order draft with live prefilled WhatsApp and checkout links. Human completes payment.', inputSchema: { type: 'object', required: ['items'], properties: { items: { type: 'array' }, notes: { type: 'string' } } } },
      ],
      resources: [
        { name: 'product-catalog', description: 'Full professional equipment catalog', uri: `https://${domain}/shop/` },
        { name: 'financing', description: 'Equipment financing and Pay in 4 interest-free payment plans', uri: `https://${domain}/financing/` },
        { name: 'blog', description: 'Production technology articles and comparisons', uri: `https://${domain}/blog/` },
      ],
      commerce: {
        ordering: 'human-assisted-whatsapp-or-form',
        payment: SHOP.paymentMethods,
        currency: SITE.currency,
        minimumOrder: `${SHOP.minOrder} AUD`,
        freeShipping: `${SHOP.freeShippingThreshold} AUD`,
      },
    },
    legal: {
      abn: SITE.abn,
      acn: SITE.acn,
      compliance: 'Australian Consumer Law (ACL), 100% Genuine Australian Stock',
    },
  };
  fs.writeFileSync(path.join(mcpDir, 'server-card.json'), JSON.stringify(mcpCardContent, null, 2), 'utf8');

  // 7. .well-known/oauth-protected-resource
  const oauthResContent = {
    resource: `https://${domain}`,
    resource_name: `${name} Public Gear Catalog`,
    authorization_servers: [],
    scopes_supported: [],
    bearer_methods_supported: [],
    resource_documentation: `https://${domain}/auth.md`,
    resource_policy_uri: `https://${domain}/terms/`,
    tls_client_certificate_bound_access_tokens: false,
    note: `All resources on ${domain} are publicly accessible. No OAuth tokens required for discovery.`,
  };
  fs.writeFileSync(path.join(wellKnownDir, 'oauth-protected-resource'), JSON.stringify(oauthResContent, null, 2), 'utf8');

  // 8. .well-known/oauth-authorization-server
  const oauthServerContent = {
    issuer: `https://${domain}`,
    authorization_endpoint: null,
    token_endpoint: null,
    jwks_uri: null,
    grant_types_supported: [],
    response_types_supported: [],
    scopes_supported: [],
    note: `${name} does not require OAuth authorization. All catalog resources are publicly accessible.`,
    public_resources: [
      `https://${domain}/shop/`,
      `https://${domain}/blog/`,
      `https://${domain}/faq/`,
      `https://${domain}/llms.txt`,
      `https://${domain}/.well-known/api-catalog`,
      `https://${domain}/.well-known/agent-skills/index.json`,
      `https://${domain}/.well-known/mcp/server-card.json`,
    ],
    agent_auth: {
      register_uri: null,
      identity_types_supported: ['none'],
      credential_types_supported: ['none'],
      notes: 'No registration required. All content publicly accessible to autonomous agents.',
    },
  };
  fs.writeFileSync(path.join(wellKnownDir, 'oauth-authorization-server'), JSON.stringify(oauthServerContent, null, 2), 'utf8');

  // 9. .well-known/openid-configuration
  const oidcContent = {
    issuer: `https://${domain}`,
    note: `${name} does not operate an OpenID Connect provider. All resources publicly accessible.`,
    public_site: true,
    authorization_endpoint: null,
    token_endpoint: null,
    userinfo_endpoint: null,
    jwks_uri: null,
    scopes_supported: [],
    response_types_supported: [],
    grant_types_supported: [],
    subject_types_supported: [],
    id_token_signing_alg_values_supported: [],
  };
  fs.writeFileSync(path.join(wellKnownDir, 'openid-configuration'), JSON.stringify(oidcContent, null, 2), 'utf8');

  // 10. .well-known/acp.json
  const acpContent = {
    protocol: { name: 'acp', version: '0.1.0' },
    name,
    description: tagline,
    api_base_url: `https://${domain}`,
    homepage: `https://${domain}`,
    transports: ['https'],
    capabilities: {
      services: ['product-catalog', 'mcp-server', 'financing', 'blog', 'faq'],
      ordering: 'human-assisted',
      payment_methods: SHOP.paymentMethods,
      currency: SITE.currency,
      minimum_order_aud: SHOP.minOrder,
      free_shipping_threshold_aud: SHOP.freeShippingThreshold,
    },
    contact: {
      whatsapp: `https://wa.me/${CONTACT.whatsapp}`,
      email: CONTACT.email,
    },
    legal: {
      region: 'Australia',
      ships_to: ['Australia', 'New Zealand'],
      compliance: 'Australian Consumer Law (ACL), Australian GST Included',
    },
  };
  fs.writeFileSync(path.join(wellKnownDir, 'acp.json'), JSON.stringify(acpContent, null, 2), 'utf8');

  // 11. .well-known/ucp ("ucp": "1.0" is MANDATORY)
  const ucpContent = {
    ucp: '1.0',
    protocol_version: '1.0',
    spec: 'https://ucp.dev/specification/overview/',
    schema: 'https://ucp.dev/schema/v1.json',
    site: `https://${domain}`,
    name,
    description: tagline,
    services: [
      { id: 'product-catalog', type: 'catalog', url: `https://${domain}/shop/`, description: 'Full professional cinema, photo, and audio catalog' },
      { id: 'mcp-server', type: 'mcp', url: `https://${domain}/api/mcp`, description: 'MCP Streamable HTTP server for autonomous pro gear discovery' },
      { id: 'order', type: 'commerce', url: `https://wa.me/${CONTACT.whatsapp}`, description: 'Place equipment orders via WhatsApp or online checkout' },
      { id: 'financing', type: 'finance', url: `https://${domain}/financing/`, description: 'Pay in 4 interest-free equipment financing' },
    ],
    capabilities: ['browse', 'search', 'inquiry', 'financing', 'content', 'mcp'],
    endpoints: {
      mcp: `https://${domain}/api/mcp`,
      catalog: `https://${domain}/shop/`,
      contact: `https://${domain}/contact/`,
      agent_skills: `https://${domain}/.well-known/agent-skills/index.json`,
      mcp_server_card: `https://${domain}/.well-known/mcp/server-card.json`,
      api_catalog: `https://${domain}/.well-known/api-catalog`,
      llms_txt: `https://${domain}/llms.txt`,
    },
    currency: SITE.currency,
    minimum_order_aud: SHOP.minOrder,
    payment_methods: SHOP.paymentMethods,
    legal: {
      country: 'Australia',
      abn: SITE.abn,
      compliance: 'Australian Consumer Law (ACL)',
    },
  };
  fs.writeFileSync(path.join(wellKnownDir, 'ucp'), JSON.stringify(ucpContent, null, 2), 'utf8');

  // 12. public/js/webmcp.js
  const webmcpContent = `(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "search_products",
        description: "Search ${name} pro cinema and audio gear by keyword or category",
        inputSchema: { type: "object", properties: { query: { type: "string" }, category: { type: "string" }, max_price: { type: "number" } } },
        execute: async ({ query, category, max_price }) => {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (category) params.set('category', category);
          if (max_price) params.set('max_price', max_price);
          const res = await fetch("https://${domain}/api/search?" + params);
          return res.json();
        }
      },
      {
        name: "browse_products",
        description: "Browse products by category",
        inputSchema: { type: "object", properties: { category: { type: "string" } } },
        execute: async ({ category }) => {
          const url = category ? "https://${domain}/shop/" + category + "/" : "https://${domain}/shop/";
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "order_via_whatsapp",
        description: "Initiate a WhatsApp gear order with Theatricalz gear desk",
        inputSchema: { type: "object", properties: { message: { type: "string" } } },
        execute: async ({ message }) => {
          const greeting = "Hi ${name}, ";
          const url = "https://wa.me/${CONTACT.whatsapp}?text=" + encodeURIComponent(greeting + (message || ''));
          window.open(url, '_blank');
          return { url };
        }
      },
      {
        name: "contact",
        description: "Contact ${name} Melbourne pro gear desk",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = "https://${domain}/contact/";
          return { url: "https://${domain}/contact/" };
        }
      }
    ]
  });
})();
`;
  fs.writeFileSync(path.join(jsDir, 'webmcp.js'), webmcpContent, 'utf8');

  // 13. IndexNow verification file
  fs.writeFileSync(path.join(publicDir, `${SITE.indexNowKey}.txt`), SITE.indexNowKey, 'utf8');

  // 14. vercel.json
  const vercelConfig = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    trailingSlash: true,
    redirects: [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${domain}` }],
        destination: `https://${domain}/:path*`,
        permanent: true,
      },
      ...REDIRECTS.map((r) => ({ source: `${r.from}:path*`, destination: `${r.to}:path*`, permanent: true })),
    ],
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          {
            key: 'Link',
            value: `</.well-known/api-catalog>; rel="api-catalog", </.well-known/agent-skills/index.json>; rel="describedby", </llms.txt>; rel="describedby", </.well-known/mcp/server-card.json>; rel="service-desc", </auth.md>; rel="auth", </.well-known/openid-configuration>; rel="openid-configuration"`,
          },
        ],
      },
      {
        source: '/.well-known/api-catalog',
        headers: [
          { key: 'Content-Type', value: 'application/linkset+json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/agent-skills/index.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/mcp/server-card.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/oauth-protected-resource',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/oauth-authorization-server',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/openid-configuration',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/acp.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/ucp',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/auth.md',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Accept, Mcp-Session-Id, X-Admin-Passcode' },
        ],
      },
    ],
  };
  fs.writeFileSync(path.join(rootDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2), 'utf8');

  console.log(`[gen-agent-files] Successfully generated all agent-ready files for ${domain}`);
}

main().catch((err) => {
  console.error('[gen-agent-files] Failed:', err);
  process.exit(1);
});
