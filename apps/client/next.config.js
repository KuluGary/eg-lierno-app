module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
    staticPageGenerationTimeout: 100
  };
  return nextConfig;
};
