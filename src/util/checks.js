const isDefined = value => typeof value !== 'undefined';
const isString = value => typeof value === 'string';
const fallback = (...possibleValues) => {
  return possibleValues.find(isDefined);
};

module.exports = { isDefined, fallback, isString };
