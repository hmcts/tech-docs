const { headingsLinks } = require('../render');
const { buildUri, splitPath, splitMarkdown, findTitle } = require('./parseOps');

class Page {
  constructor(uri, title, markdown, options) {
    this.uri = uri;
    this.title = title;
    this.options = options;
    this.markdown = markdown;
    this.jumpLinks = headingsLinks(markdown);
  }

  static parse({ relativePath, contents }) {
    const { body, options, firstH1 } = splitMarkdown(contents);
    const { dir, name } = splitPath(relativePath);
    const uri = buildUri(dir, name);
    const title = findTitle(options, firstH1, name);

    return new Page(uri, title, body, options);
  }

  get section() {
    return this.options.section || '';
  }

  get template() {
    return 'docs_page';
  }

  get contents() {
    if (this.options.contents) {
      console.log(this.options);
      return this.options.contents;
    }
    return this.jumpLinks;
  }
}

module.exports = Page;
