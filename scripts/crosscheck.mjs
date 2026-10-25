// scripts/crosscheck.mjs - Pre-ship blocking crosscheck (WebForge v11.1)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let failures = [];
let warnings = [];

function fail(code, message) {
  failures.push(`[BLOCKING FAIL ${code}] ${message}`);
}

function warn(message) {
  warnings.push(`[WARN] ${message}`);
}

async function runCrosscheck() {
  console.log('--- WebForge v11.1 Pre-Ship Crosscheck Starting ---');

  const { SITE, FORMS, REPLY, SHOP } = await import('../config/site.js');

  // B1: SITE.domain check
  if (!SITE.domain) {
    fail('B1', 'SITE.domain is missing.');
  }

  // B2: Capability checks
  const searchRoutePath = path.join(rootDir, 'app', 'search', 'page.jsx');
  if (!fs.existsSync(searchRoutePath)) {
    fail('B2', 'SearchAction schema advertised but app/search/page.jsx is missing.');
  }

  // B4: Strategy docs leak check
  const publicDocs = path.join(rootDir, 'public', 'docs');
  const publicProject = path.join(rootDir, 'public', 'PROJECT.md');
  const publicKeywords = path.join(rootDir, 'public', 'keyword-map.md');
  if (fs.existsSync(publicDocs) || fs.existsSync(publicProject) || fs.existsSync(publicKeywords)) {
    fail('B4', 'Strategy documentation leaked in public/ directory.');
  }

  // B5: Secrets check in tracked repo files
  const filesToCheck = [
    'config/site.js',
    'app/layout.tsx',
    'lib/mailer.js',
    'lib/adminAuth.js',
    'lib/orderStore.js',
  ];
  for (const f of filesToCheck) {
    const fullP = path.join(rootDir, f);
    if (fs.existsSync(fullP)) {
      const content = fs.readFileSync(fullP, 'utf8');
      if (content.includes('SMTP_PASS=') || /['"]SG\.[a-zA-Z0-9_-]{20,}['"]/.test(content)) {
        fail('B5', `Hardcoded secret detected in ${f}.`);
      }
    }
  }

  // B6: Missing agent files A–N
  const agentFiles = [
    'public/robots.txt',
    'public/llms.txt',
    'public/auth.md',
    'public/.well-known/api-catalog',
    'public/.well-known/agent-skills/index.json',
    'public/.well-known/mcp/server-card.json',
    'public/.well-known/oauth-protected-resource',
    'public/.well-known/oauth-authorization-server',
    'public/.well-known/openid-configuration',
    'public/.well-known/acp.json',
    'public/.well-known/ucp',
    'public/js/webmcp.js',
    'vercel.json',
  ];
  // Extensionless .well-known documents are served by /api/wellknown/[name] (rewritten in next.config.ts), so
  // they must exist in lib/wellKnown.generated.json rather than as files in public/.
  let wellKnownDocs = {};
  try { wellKnownDocs = JSON.parse(fs.readFileSync(path.join(rootDir, 'lib/wellKnown.generated.json'), 'utf8')); } catch { wellKnownDocs = {}; }
  for (const af of agentFiles) {
    const wkName = af.startsWith('public/.well-known/') ? af.slice('public/.well-known/'.length) : '';
    if (wkName && wellKnownDocs[wkName]) continue;
    if (!fs.existsSync(path.join(rootDir, af))) {
      fail('B6', `Mandatory agent file ${af} is missing.`);
    }
  }

  // B9: ADMIN_PASSCODE not in NEXT_PUBLIC_*
  const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
  if (envExample.includes('NEXT_PUBLIC_ADMIN_PASSCODE')) {
    fail('B9', 'ADMIN_PASSCODE is exposed as NEXT_PUBLIC_ADMIN_PASSCODE.');
  }

  // B10: robots.txt disallows /admin/
  const robotsPath = path.join(rootDir, 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (!robots.includes('Disallow: /admin/')) {
      fail('B10', 'robots.txt must disallow /admin/.');
    }
  }

  // B11: Web3Forms retired check
  function scanDir(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.next' || item === '.git') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scanDir(full);
      } else if (/\.(js|jsx|ts|tsx|json|md)$/.test(item)) {
        const text = fs.readFileSync(full, 'utf8');
        if (/web3forms|WEB3FORMS_KEY|api\.web3forms\.com/i.test(text)) {
          fail('B11', `Retired provider web3forms referenced in ${item}.`);
        }
      }
    }
  }
  scanDir(rootDir);

  // UCP 1.0 check
  const ucpPath = path.join(rootDir, 'public', '.well-known', 'ucp');
  if (fs.existsSync(ucpPath)) {
    const ucpContent = JSON.parse(fs.readFileSync(ucpPath, 'utf8'));
    if (ucpContent.ucp !== '1.0') {
      fail('UCP', '"ucp": "1.0" field is mandatory in .well-known/ucp.');
    }
  }

  // Auth.md check
  const authPath = path.join(rootDir, 'public', 'auth.md');
  if (fs.existsSync(authPath)) {
    const firstLine = fs.readFileSync(authPath, 'utf8').split('\n')[0].trim();
    if (firstLine !== '# Auth.md') {
      fail('AUTH', 'auth.md must start with exactly "# Auth.md" as its first line.');
    }
  }

  // Reply portal check
  const adminPage = path.join(rootDir, 'app', 'admin', 'page.jsx');
  const copyPage = path.join(rootDir, 'app', 'order', 'payment-details', 'page.jsx');
  if (!fs.existsSync(adminPage) || !fs.existsSync(copyPage)) {
    fail('PORTAL', 'Reply Portal pages /admin/ or /order/payment-details/ missing.');
  }

  console.log('\n--- Crosscheck Results ---');
  if (failures.length > 0) {
    console.error(`FAILED with ${failures.length} blocking issues:`);
    failures.forEach((f) => console.error(f));
    process.exit(1);
  } else {
    console.log('ALL PRE-SHIP CROSSCHECKS PASSED! (0 failures)');
    process.exit(0);
  }
}

runCrosscheck().catch((err) => {
  console.error('Crosscheck exception:', err);
  process.exit(1);
});
