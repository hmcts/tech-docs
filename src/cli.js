#!/usr/bin/env node

const docsApp = require('./main.js');
const { log } = require('./util/logging')('tech-docs.cli');
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
  version,
  addHelp: true,
  description: 'Serve GOV.UK style documentation sites from your markdown docs'
});

parser.addArgument([ '-p', '--port' ], {
  help: 'The port to serve the docs on',
  defaultValue: 3000
});
parser.addArgument([ '-d', '--domain' ], {
  help: 'The public domain to serve assets on',
  defaultValue: 'localhost:3000'
});
parser.addArgument([ '--use-http' ], {
  help: 'Serve on unsafe http requests',
  defaultValue: true,
  action: 'storeFalse',
  dest: 'secure'
});

const args = parser.parseArgs();

docsApp(args)
  .then(app => {
    app.listen(args.port);
    log(`listening on ${args.port}`);
  })
  .catch(error => {
    log(error);
    log('Exiting.');
    process.exit(1); // eslint-disable-line no-process-exit
  });
