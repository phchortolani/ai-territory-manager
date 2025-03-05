/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'aitab.lanisystems.com.br',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
