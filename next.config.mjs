import createNextIntlPlugin from 'next-intl/plugin';
import NextBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'api-bigboy.duthanhduoc.com',
                pathname: '/**',
            },
            {
                hostname: 'via.placeholder.com',
                pathname: '/**',
            },
            {
                hostname: 'localhost',
                pathname: '/**'
            },
        ],
    },
};

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(withNextIntl(nextConfig));