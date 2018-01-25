const isDefined = value => typeof value !== 'undefined';
const isString = value => typeof value === 'string';
const fallback = (...possibleValues) => possibleValues.find(isDefined);

module.exports = { isDefined, fallback, isString };
