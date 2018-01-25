const path = require('path');
const frontmatter = require('front-matter');
const { isDefined } = require('../util/checks');

const splitPath = relativePath => path.parse(relativePath);

const splitMarkdown = markdown => {
  const parsed = frontmatter(markdown);
  const splitFirstH1AndBody = /^\n{0,}(?:#([^#]{1,}?)\n{1,}){0,1}([\s\S]*)$/;
  const [, firstH1, body] = parsed.body.match(splitFirstH1AndBody);

  return { body, firstH1, options: parsed.attributes };
};

const omitableNames = ['index', 'README', 'readme'];

const buildUri = (dir, name) => {
  const omitName = omitableNames.includes(name);
  if (dir === '' && !omitName) {
    return ['', name].join('/');
  }
  const parts = dir.split(path.sep);
  if (omitName) {
    return ['', ...parts].join('/');
  }
  return ['', ...parts, name].join('/');
};

const titleise = str => {
  if (str.length < 1) {
    return str;
  }
  const firstChar = str[0].toUpperCase();
  const rest = str.slice(1)
    .replace(/-/g, ' ')
    .replace(/(\w|^)([A-Z])/g, '$1 $2')
    .trimRight();

  return `${firstChar}${rest}`;
};

const findTitle = (options, firstH1, filename) => {
  if (isDefined(options.title)) {
    return options.title;
  }
  if (firstH1) {
    return firstH1.trim();
  }
  return titleise(filename);
};

module.exports = { buildUri, splitPath, splitMarkdown, findTitle, titleise };
