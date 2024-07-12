import path from 'path'

const webpack = (
  config,
  { buildId, dev, isServer, defaultLoaders, webpack }
) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
    next: path.resolve('./node_modules/next'),
    'styled-components': path.resolve('./node_modules/styled-components')
  }

  return config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    // webpack // ADDING THIS
};

export default nextConfig;
