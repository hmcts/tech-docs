const debug = require('debug');

const NODE_ENV = process.env.NODE_ENV;

const log = (...message) => {
  if (NODE_ENV !== 'test') {
    console.log(...message);
  }
};

module.exports = prefix => {
  return {
    log,
    debug: debug(prefix)
  };
};
