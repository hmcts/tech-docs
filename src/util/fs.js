const fs = require('fs');
const callbackGlob = require('glob');

const readFile = filepath => new Promise((resolve, reject) => {
  fs.readFile(filepath, (error, contents) => {
    if (error) {
      reject(error);
    } else {
      resolve(contents);
    }
  });
});

const readJson = filepath => readFile(filepath).then(JSON.parse);

const glob = pattern => new Promise((resolve, reject) => {
  callbackGlob(pattern, {}, (error, filepaths) => {
    if (error) {
      reject(error);
    } else {
      resolve(filepaths);
    }
  });
});

module.exports = { readFile, readJson, glob };
