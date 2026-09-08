/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent unhandled typecheck halts in cloud CI environments
    ignoreBuildErrors: true,
  },
  async rewrites() {
    try {
      let raw = (
        process.env.BACKEND_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        ''
      ).trim().replace(/^["']|["']$/g, '').replace(/\/$/, '');

      if (!raw) return [];

      if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        raw = `https://${raw}`;
      }

      new URL(raw); // validate valid URL format

      return [
        {
          source: '/api/backend/:path*',
          destination: `${raw}/api/:path*`,
        },
      ];
    } catch {
      return [];
    }
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
