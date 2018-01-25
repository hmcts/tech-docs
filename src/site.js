const { Site, Page, Section, Readme } = require('./models');
const path = require('path');

const buildPagesAndSections = (pagesPaths, sectionsPaths) => {
  const pages = pagesPaths.map(Page.parse);
  const sections = sectionsPaths.map(Section.parse);
  const all = [...sections, ...pages];

  sections.forEach(section => {
    section.pages = all.filter(page => path.dirname(page.uri) === section.uri);
  });

  return [...pages, ...sections];
};

const buildSite = (packageJson, pagesPaths, sectionsPaths, readmePath) => {
  const readme = Readme.parse(readmePath);
  const pages = buildPagesAndSections(pagesPaths, sectionsPaths);
  return Site.parse(packageJson, pages, readme);
};

module.exports = { buildSite };
