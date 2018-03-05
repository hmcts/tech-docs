const express = require('express');
const path = require('path');
const lookAndFeel = require('@hmcts/look-and-feel');
const { buildSite } = require('./site');
const {
  resolvePackageJson, resolveReadme,
  resolveDocs, resolveSections
} = require('./resolve');
const { renderMarkdown } = require('./render');
const { log, debug } = require('./util/logging')('tech-docs.main');
const watch = require('node-watch');

const loadSite = () => Promise.all([
  resolvePackageJson(),
  resolveDocs(),
  resolveSections(),
  resolveReadme()
]).then(([packageJson, pages, sections, readme]) => buildSite(
  packageJson.json, pages, sections, readme
));

const docsApp = ({ domain, secure, watchFiles }) => {
  const app = express();
  app.use('/docs', express.static(
    path.resolve(process.cwd(), 'docs'),
    { fallthrough: true }
  ));

  const baseUrl = [
    secure ? 'https://' : 'http://',
    domain
  ].join('');

  debug(`Serving assets on ${baseUrl}`);
  if (!secure) {
    debug('Serving assets on unsafe connection');
  }

  lookAndFeel.configure(app, {
    baseUrl,
    express: { views: [path.resolve(__dirname, 'views')] },
    webpack: { entry: [path.resolve(__dirname, 'assets/main.scss')] },
    nunjucks: {
      globals: {
        phase: 'ALPHA',
        global_header_text: 'HMCTS',
        feedbackLink: 'https://github.com/hmcts/one-per-page/issues/new',
        renderMarkdown
      }
    },
    development: { useWebpackDevMiddleware: true }
  });

  return loadSite().then(generatedSite => {
    let site = generatedSite;
    log(site.humanReadable);

    if (watchFiles) {
      debug('Watching for file changes');
      const watcher = watch(process.cwd(), {
        filter: /(?:\.(?:md|markdown|html)$|\/(?!\.git$|node_modules$)\w*$)/,
        recursive: true
      });

      watcher.on('change', (evt, name) => {
        log(`${name} changed on disk, reloading`);
        loadSite().then(generated => {
          site = generated;
        });
      });
    }

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
