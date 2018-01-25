const { expect, sinon } = require('./util/chai');
const path = require('path');
const {
  resolvePackageJson,
  resolveDocs,
  resolveSections
} = require('../src/resolve');

describe('resolve', () => {
  beforeEach(() => {
    sinon.stub(process, 'cwd');
  });

  afterEach(() => {
    process.cwd.restore();
  });
  const setCWD = fp => process.cwd.returns(path.join(__dirname, fp));

  describe('#resolvePackageJson', () => {
    it('resolves to the package.json in the current working dir', () => {
      setCWD('./fixtures/resolve/withPackageJson');
      const pathToPackage = './fixtures/resolve/withPackageJson/package.json';
      const expected = {
        path: path.join(__dirname, pathToPackage),
        json: require(pathToPackage) // eslint-disable-line global-require
      };
      return expect(resolvePackageJson()).to.eventually.eql(expected);
    });

    it('resolves with {} if no package json', () => {
      setCWD('./fixtures/resolve/noPackageJson');
      return expect(resolvePackageJson()).to.eventually.eql({});
    });
  });

  describe('#resolveSections', () => {
    it('resolves all the folders in the docs folder', () => {
      setCWD('./fixtures/resolve/withSections');
      const fixtures = path.join(__dirname, './fixtures/resolve/withSections');
      const expected = [
        {
          path: path.join(fixtures, './docs/'),
          relativePath: 'docs',
          filename: 'docs',
          contents: ''
        }, {
          path: path.join(fixtures, './docs/bar/index.md'),
          relativePath: 'docs/bar/index.md',
          filename: 'index.md',
          contents: 'Bar section\n'
        }, {
          path: path.join(fixtures, './docs/baz/'),
          relativePath: 'docs/baz',
          filename: 'baz',
          contents: ''
        }, {
          path: path.join(fixtures, './docs/foo/index.md'),
          relativePath: 'docs/foo/index.md',
          filename: 'index.md',
          contents: 'Foo section\n'
        }
      ];

      return expect(resolveSections()).to.eventually.eql(expected);
    });
  });

  describe('#resolveDocs', () => {
    it('resolves a list of the files with their contents', () => {
      setCWD('./fixtures/resolve/withDocs');
      const docsPath = path.join(__dirname, './fixtures/resolve/withDocs/docs');
      const expected = [
        {
          path: path.join(docsPath, './nested/deeply/deeplyNested.md'),
          relativePath: 'docs/nested/deeply/deeplyNested.md',
          filename: 'deeplyNested.md',
          contents: "I'm deeply nested\n"
        }, {
          path: path.join(docsPath, './nested/nested.md'),
          relativePath: 'docs/nested/nested.md',
          filename: 'nested.md',
          contents: "I'm nested\n"
        }, {
          path: path.join(docsPath, './root.md'),
          relativePath: 'docs/root.md',
          filename: 'root.md',
          contents: "I'm root\n"
        }
      ];
      return expect(resolveDocs()).to.eventually.deep.eql(expected);
    });

    it('resolves [] if no docs exist', () => {
      setCWD('./fixtures/resolve/withPackageJson');
      return expect(resolveDocs()).to.eventually.eql([]);
    });
  });
});
