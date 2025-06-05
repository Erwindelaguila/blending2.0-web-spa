import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ============================================================================
  // CONFIGURACIÓN CSR PURO
  // ============================================================================
  
  output: 'export',

  images: {
    unoptimized: true,
  },

  // ============================================================================
  // REACT STRICT MODE (Deshabilitar para FluentUI TagPicker)
  // ============================================================================
  
  /**
   * Deshabilitar React Strict Mode temporalmente
   * Reason: FluentUI TagPicker tiene problemas conocidos con Strict Mode
   * TODO: Rehabilitar cuando FluentUI v9 solucione los issues
   */
  reactStrictMode: false,

  // ============================================================================
  // OPTIMIZACIONES DE RENDIMIENTO
  // ============================================================================
  
  experimental: {
    optimizePackageImports: ['@fluentui/react-components', '@fluentui/react-icons'],
  },

  // ============================================================================
  // CONFIGURACIÓN DE DESARROLLO
  // ============================================================================
  
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  
  // ============================================================================
  // OPTIMIZACIONES WEBPACK (Solo producción)
  // ============================================================================
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 10,
            },
            fluent: {
              test: /[\\/]node_modules[\\/]@fluentui[\\/]/,
              name: 'fluent-ui',
              chunks: 'all',
              priority: 8,
            },
            vendor: {
              test: /[\\/]node_modules[\\/](?!(react|react-dom|@fluentui)[\\/])/,
              name: 'vendors',
              chunks: 'all',
              priority: 1,
            },
          },
        },
      }
    }
    
    return config
  },
}

export default nextConfig