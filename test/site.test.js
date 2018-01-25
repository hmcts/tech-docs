const { expect } = require('./util/chai');
const { buildSite } = require('../src/site');
const { Site } = require('../src/models');

describe('site', () => {
  describe('#buildSite', () => {
    const packageJson = { name: '@hmcts/tech-docs' };

    it('returns a Site object', () => {
      const site = buildSite(packageJson, [], []);
      expect(site).an.instanceof(Site);
    });
  });
});
