const Page = require('./Page');
const { buildUri, splitPath, splitMarkdown, findTitle } = require('./parseOps');

class Readme extends Page {
  constructor(uri, title, markdown, options, pages) {
    super(uri, title, markdown, options);
  }

  get template() {
    return 'no_contents';
  }

  static parse(args) {
    if (args === undefined) {
      return new Readme('/', '', '', {});
    }
    const { relativePath, contents } = args;
    const { body, options, firstH1 } = splitMarkdown(contents);
    const { dir, name } = splitPath(relativePath);
    const uri = buildUri(dir, name);
    const title = findTitle(options, firstH1, name);

    return new Readme(uri, title, body, options);
  }
}

module.exports = Readme;
