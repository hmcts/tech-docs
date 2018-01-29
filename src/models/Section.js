const Page = require('./Page');
const { buildUri, splitPath, splitMarkdown, findTitle } = require('./parseOps');

class Section extends Page {
  constructor(uri, title, markdown, options) {
    super(uri, title, markdown, options);
    this.pages = [];
  }

  get contents() {
    return this.contentsLinks(true);
  }

  contentsLinks(includeChildren) {
    return this.pages.map(page => {
      const isSection = page instanceof Section;
      return {
        label: page.title,
        href: page.uri,
        isSection,
        links: isSection && includeChildren ? page.contentsLinks(false) : []
      };
    });
  }

  static parse({ relativePath, contents }) {
    const { body, options, firstH1 } = splitMarkdown(contents);
    const { dir, name } = splitPath(relativePath);
    const uri = buildUri(dir, name);
    const title = findTitle(options, firstH1, name);

    return new Section(uri, title, body, options);
  }
}

module.exports = Section;
