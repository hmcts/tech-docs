const { expect } = require('./util/chai');
const {
  parseAppName,
  parseDefaultLinks
} = require('../src/parse');

describe('parse', () => {
  describe('#parseAppName', () => {
    it('returns json.name if present', () => {
      const returned = parseAppName({ name: 'foo' });
      expect(returned).to.eql({ name: 'foo', displayName: 'foo' });
    });

    it('returns "" as a fallback', () => {
      expect(parseAppName({})).to.eql({ name: '', displayName: '' });
    });
  });

  describe('#parseDefaultLinks', () => {
    describe('repo link', () => {
      it('parses a github link from foo/bar', () => {
        const json = { repository: 'foo/bar' };
        const expected = {
          label: 'github',
          href: 'https://github.com/foo/bar'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses a github link from github:foo/bar', () => {
        const json = { repository: 'github:foo/bar' };
        const expected = {
          label: 'github',
          href: 'https://github.com/foo/bar'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses a github link from https://github.com/foo/bar', () => {
        const json = { repository: 'https://github.com/foo/bar' };
        const expected = {
          label: 'github',
          href: 'https://github.com/foo/bar'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses from { url }', () => {
        const json = { repository: { url: 'https://github.com/foo/bar' } };
        const expected = {
          label: 'github',
          href: 'https://github.com/foo/bar'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses from { type, url }', () => {
        const json = {
          repository: {
            type: 'git',
            url: 'https://github.com/foo/bar'
          }
        };
        const expected = { label: 'git', href: 'https://github.com/foo/bar' };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });
    });

    it('returns [documentation] if no repository / issues / etc', () => {
      expect(parseDefaultLinks({})).to.eql([
        {
          label: 'documentation',
          href: '/docs'
        }
      ]);
    });

    describe('issues link', () => {
      it('parses a bugs link', () => {
        const json = { bugs: 'https://github.com/foo/bar/issues' };
        const expected = {
          label: 'issues',
          href: 'https://github.com/foo/bar/issues'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses a bugs object and prefers a url over email', () => {
        const json = { bugs: { url: 'https://github.com/foo/bar/issues' } };
        const expected = {
          label: 'issues',
          href: 'https://github.com/foo/bar/issues'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('parses a bugs object with an email', () => {
        const json = { bugs: { email: 'michael@allen.digital' } };
        const expected = {
          label: 'issues',
          href: 'mailto:michael@allen.digital'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });

      it('falls back on repository link', () => {
        const json = { repository: 'foo/bar' };
        const expected = {
          label: 'issues',
          href: 'https://github.com/foo/bar/issues'
        };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });
    });

    describe('npm link', () => {
      it('returns a link to npm using the package name', () => {
        const json = { name: 'foo-bar' };
        const expected = { label: 'npm', href: 'https://npmjs.org/foo-bar' };
        expect(parseDefaultLinks(json)).to.deep.include(expected);
      });
    });
  });
});
