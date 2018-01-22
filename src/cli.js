#!/usr/bin/env node

const docsApp = require('./main.js');
docsApp()
  .then(app => app.listen(3000))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
