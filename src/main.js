const express = require('express');
const path = require('path');
const lookAndFeel = require('@hmcts/look-and-feel');
const { Site, Page } = require('./models');
const { buildSite } = require('./site');
const { resolvePackageJson, resolveDocs, resolveSections, resolveReadme } = require('./resolve');
const { renderMarkdown } = require('./render');
const { log, debug } = require('./util/logging')('tech-docs.main');

const domain = () => {
  if (process.env.URL) {
    return process.env.URL;
  }
  return 'http://localhost:3000';
}

const docsApp = () => {
  const app = express();
  app.use('/docs', express.static(
    path.resolve(process.cwd(), 'docs'),
    { fallthrough: true }
  ));

  lookAndFeel.configure(app, {
    baseUrl: domain(),
    express: {
      views: [path.resolve(__dirname, 'views')]
    },
    webpack: {
      entry: [path.resolve(__dirname, 'assets/main.scss')]
    },
    nunjucks: {
      globals: {
        phase: 'ALPHA',
        global_header_text: 'HMCTS',
        feedbackLink: 'https://github.com/hmcts/one-per-page/issues/new',
        renderMarkdown: renderMarkdown
      }
    }
  });

  return Promise
    .all([resolvePackageJson(), resolveDocs(), resolveSections(), resolveReadme()])
    .then(([packageJson, pages, sections, readme]) => {
      return buildSite(packageJson.json, pages, sections, readme);
    })
    .then(site => {
      log(site.humanReadable);

      app.get('/*', (req, res) => {
        const page = site.pageFor(req.path);
        if (page) {
          res.render(page.template, { site, page });
        } else {
          res.sendStatus('404');
        }
      });

      return app;
    });
};

module.exports = docsApp;
