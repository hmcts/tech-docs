const { expect, sinon } = require('../util/chai');
const Page = require('../../src/models/Page');
const { readDoc } = require('../../src/resolve');
const path = require('path');

describe('Page', () => {
  let sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(process, 'cwd');
    process.cwd.returns(path.join(__dirname, 'fixtures/Page'));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#parse', () => {
    const fp = path.join(__dirname, 'fixtures/Page/docs/hasFrontMatter.md');

    it('parses options out of a file with front matter', () => {
      return readDoc(fp).then(doc => {
        const page = Page.parse(doc);
        expect(page.options).to.eql({ foo: 'Foo', bar: 'Bar' });
      });
    });

    it('parses the uri from the relative path', () => {
      return readDoc(fp).then(doc => {
        expect(Page.parse(doc).uri).to.eql('/docs/hasFrontMatter');
      });
    });

    it('parses the uri docs/foo/ from docs/foo/index', () => {
      sandbox.stub(path, 'parse').returns({
        dir: 'docs/foo/',
        name: 'index'
      });
      return readDoc(fp).then(doc => {
        expect(Page.parse(doc).uri).to.eql('/docs/foo/');
      });
    });

    it('parses the uri correctly in windows', () => {
      sandbox.stub(path, 'parse').returns({
        dir: 'foo\\bar',
        name: 'baz'
      });
      sandbox.stub(path, 'sep').value('\\');

      return readDoc(fp).then(doc => {
        expect(Page.parse(doc).uri).to.eql('/foo/bar/baz');
      });
    });

    {
      const camelCasePath = 'docs/section-a/aPage';
      const hyphenedPath = 'docs/section-a/a-page';
      const yamlTitle = ['---', 'title: A Title', '---'].join('\n');
      const markdownHeader = header => [
        '---',
        '---',
        header,
        'content'
      ].join('\n');


      it('plucks a title from the options', () => {
        const page = Page.parse({
          relativePath: camelCasePath,
          contents: yamlTitle
        });
        expect(page.title).to.eql('A Title');
      });

      it('plucks first h1 from contents (first line)', () => {
        const contents = markdownHeader('# A content header');
        const page = Page.parse({ relativePath: camelCasePath, contents });
        expect(page.title).to.eql('A content header');
      });

      it('plucks first h1 from contents (buried)', () => {
        const contents = markdownHeader('\n\n# A content header');
        const page = Page.parse({ relativePath: camelCasePath, contents });
        expect(page.title).to.eql('A content header');
      });

      it('plucks first h1 from contents (mixed case)', () => {
        const contents = markdownHeader('#A content Header');
        const page = Page.parse({ relativePath: camelCasePath, contents });
        expect(page.title).to.eql('A content Header');
      });

      it('defaults title to the filename (camel case)', () => {
        const page = Page.parse({ relativePath: camelCasePath, contents: '' });
        expect(page.title).to.eql('A Page');
      });

      it('defaults title to the filename (hyphened)', () => {
        const page = Page.parse({ relativePath: hyphenedPath, contents: '' });
        expect(page.title).to.eql('A page');
      });
    }
  });

  describe('#contents', () => {
    const markdown = `
# Title
## Second Title
## Another Title
    `;

    it('returns the headings from the markdown', () => {
      const page = new Page('/page', 'Page', markdown, {});
      expect(page.contents).to.eql([
        { label: 'Second Title', href: '#second-title', links: [] },
        { label: 'Another Title', href: '#another-title', links: [] }
      ]);
    });

    it('returns options.contents if defined', () => {
      const contents = [{ label: 'Overriden', href: 'www.overriden.com' }];
      const page = new Page('/page', 'Page', markdown, { contents });
      expect(page.contents).to.eql(contents);
    });
  });
});
