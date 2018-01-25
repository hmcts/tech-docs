const { readFile, readJson, glob } = require('./util/fs');
const { log, debug } = require('./util/logging')('tech-docs.resolve');
const path = require('path');

const resolvePackageJson = () => {
  const packageJsonPath = path.join(process.cwd(), './package.json');
  return readJson(packageJsonPath).then(
    json => {
      debug('Resolved package.json at ');
      return { path: packageJsonPath, json };
    },
    error => {
      log('Failed to find package.json due to: ', error);
      return {};
    }
  );
};

const readDoc = filepath => {
  const relativePath = path.relative(process.cwd(), filepath);
  const filename = path.basename(filepath);

  return readFile(filepath)
    .then(buffer => {
      const contents = buffer.toString();
      debug(`resolved ${filename} from ${relativePath}`);

      return { path: filepath, relativePath, filename, contents };
    })
    .catch(error => {
      debug(`no file found at ${relativePath}: ${error}`);
      return { path: filepath, relativePath, filename, contents: '' };
    });
};

const filename = filepath => {
  const ext = path.extname(filepath);
  return path.basename(filepath, ext);
};

const resolveSections = () => {
  const docsPath = path.join(process.cwd(), './docs/**{/,/index.md}');
  return glob(docsPath)
    .then(filepaths => {
      const filtered = filepaths.filter(fp => {
        if (fp.endsWith('.md') || fp.endsWith('.markdown')) {
          return true;
        }
        return !filepaths.some(existingPath => {
          const parentPath = path.join(existingPath, '../');
          return parentPath === fp && filename(existingPath) === 'index';
        });
      });
      return Promise.all(filtered.map(readDoc));
    });
};

const readme = '{./readme.md,./README.md,./readme.markdown,./README.markdown}';

const resolveReadme = () => {
  const readmePath = path.join(process.cwd(), readme);
  return glob(readmePath).then(filepaths => {
    if (filepaths.length > 0) {
      return readDoc(filepaths[0]);
    }
    return undefined; // eslint-disable-line no-undefined
  });
};

const resolveDocs = () => {
  const docsPath = path.join(process.cwd(), './docs/**/*.md');
  return glob(docsPath).then(
    filepaths => {
      const noIndexes = filepaths.filter(fp => filename(fp) !== 'index');
      return Promise.all(noIndexes.map(readDoc));
    }
  );
};

module.exports = {
  resolvePackageJson,
  resolveDocs,
  readDoc,
  resolveSections,
  resolveReadme
};
