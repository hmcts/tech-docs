const { fallback, isDefined, isString } = require('./util/checks');
const hostedGitInfo = require('hosted-git-info');

const parseAppName = packageJson => {
  const name = fallback(packageJson.name, '')
  return { name, displayName: fallback(packageJson.displayName, name) };
};

const parseRepoLink = ({ repository: repo = {} }, links) => {
  if (isString(repo) || (isString(repo.url) && !isDefined(repo.type))) {
    const repoUrl = fallback(repo.url, repo);
    const gitInfo = hostedGitInfo.fromUrl(repoUrl);
    links.push({
      label: gitInfo.type,
      href: gitInfo.browse()
    });
  } else if (isString(repo.type) && isString(repo.url)) {
    links.push({
      label: repo.type,
      href: repo.url
    });
  }
};

const parseIssuesLink = ({ bugs = {}, repository = {} }, links) => {
  if (isString(bugs) || isString(bugs.url)) {
    links.push({
      label: 'issues',
      href: fallback(bugs.url, bugs)
    });
  } else if (isString(bugs.email)) {
    links.push({ label: 'issues', href: `mailto:${bugs.email}` });
  } else if (isString(repository) || isString(repository.url)) {
    const gitInfo = hostedGitInfo.fromUrl(fallback(repository.url, repository));
    links.push({ label: 'issues', href: gitInfo.bugs() });
  }
};

const parseNpmLink = (packageJson, links) => {
  if (isString(packageJson.name)) {
    links.push({ label: 'npm', href: `https://npmjs.org/${packageJson.name}` });
  }
};

const parseDefaultLinks = packageJson => {
  const defaults = [{ label: 'documentation', href: '/docs' }];
  parseRepoLink(packageJson, defaults);
  parseIssuesLink(packageJson, defaults);
  parseNpmLink(packageJson, defaults);
  return defaults;
};

const parseTopLinks = packageJson => {
  return [...parseDefaultLinks(packageJson)];
};

module.exports = {
  parseAppName,
  parseTopLinks,
  parseDefaultLinks
};
