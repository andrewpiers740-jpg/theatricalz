import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    // Optimised images are cached for 30 days instead of being re-checked on every visit.
    minimumCacheTTL: 2592000,
    // Fewer width variants keep each image's srcset short (it was 10 long URLs per picture, about 2 KB of HTML each)
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // Extensionless /.well-known documents are served by a route so they get a proper Content-Type.
    const wellKnown = ['api-catalog', 'oauth-protected-resource', 'oauth-authorization-server', 'openid-configuration', 'ucp'].map((name) => ({
      source: `/.well-known/${name}`,
      destination: `/api/wellknown/${name}/`,
    }));
    // /sitemap.xml is the sitemap index (the split sitemaps live under /sitemap/<id>.xml)
    return { beforeFiles: [{ source: '/sitemap.xml', destination: '/sitemap-index/' }], afterFiles: wellKnown, fallback: [] };
  },
  output: 'standalone',
  agentRules: false, // stop Next.js writing an AGENTS.md into the repo
};

export default nextConfig;
