import createNextIntlPlugin from 'next-intl/plugin';

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
        ],
    },
};

export default withNextIntl(nextConfig);