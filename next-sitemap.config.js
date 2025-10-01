module.exports = {
  siteUrl: 'https://securepdftool.com',
  generateRobotsTxt: true,
  transform: async (cfg, path) => {
    if (path === '/') return null; // /[locale] 쓰므로
    return { loc: path, changefreq: 'weekly', priority: 0.7 };
  }
};
