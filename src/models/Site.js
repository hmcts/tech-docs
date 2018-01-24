const { parseAppName, parseTopLinks } = require('../parse');

class Site {
  constructor(app, topLinks, pages) {
    this.app = app;
    this.topLinks = topLinks;
    this.pages = pages;
  }

  get humanReadable() {
    const topLinksReabable = this.topLinks
      .map(({ label, href }) => `    ${label} - ${href}`);
    const pages = this.pages
      .map(page => `    ${page.uri} - ${page.title}`);

    return [
      this.app.name,
      '  topLinks:',
      ...topLinksReabable,
      '  pages:',
      ...pages
    ].join('\n');
  }

  static parse(packageJson, pages, readme) {
    const { name, displayName } = parseAppName(packageJson);
    const app = { name, displayName };
    const topLinks = parseTopLinks(packageJson);

    return new Site(app, topLinks, [...pages, readme]);
  }

  pageFor(path) {
    const uri = path.replace(/.\/$/, '');
    const page = this.pages.find(page => page.uri === uri);
    if (page) {
      return page;
    }
    if (uri === '/') {
      return this.pageFor('/docs/');
    }
    return undefined;
  }
}

module.exports = Site;
