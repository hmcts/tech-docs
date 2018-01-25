const marked = require('marked');
const highlightJS = require('highlight.js');
const { debug } = require('./util/logging')('tech-docs.render');

const slugify = str => str.toLowerCase().replace(/[^\w]+/g, '-');

const renderer = new marked.Renderer();
const headingClasses = [
  'heading-xlarge',
  'heading-xlarge',
  'heading-large',
  'heading-medium',
  'heading-small',
  'heading-small',
  'heading-small',
  'heading-small',
  'heading-small'
];
renderer.heading = (title, level) => {
  const id = slugify(title);
  return [
    `<h${level} class="${headingClasses[level]}" id="${id}">`,
    `  <a href="#${id}" aria-hidden="true" class="heading-anchor"></a>`,
    `  ${title}`,
    `</h${level}>`
  ].join('\n');
};

renderer.paragraph = text => [
  '<p class="text">',
  `  ${text}`,
  '</p>'
].join('\n');

renderer.strong = text => `<strong class="bold">${text}</strong>`;

renderer.blockquote = text =>
  `<div class="panel panel-border-wide">${text}</div>`;

renderer.list = (body, ordered) => [
  ordered ? '<ol class="list list-number">' : '<ul class="list list-bullet">',
  body,
  ordered ? '</ol>' : '</ul>'
].join('\n');

const highlight = (code, lang) => {
  if (lang) {
    try {
      return highlightJS.highlight(lang, code).value;
    } catch (error) {
      debug(`Failed rendering: ${error}`);
      debug('Dropping down to auto language discovery');
      return highlightJS.highlightAuto(code).value;
    }
  }
  return highlightJS.highlightAuto(code).value;
};

const renderMarkdown = content => marked(content, {
  renderer,
  highlight
});

const headingsLinks = content => marked.lexer(content, { renderer })
  .filter(token => token.type === 'heading')
  .map(heading => {
    return {
      label: heading.text,
      href: `#${slugify(heading.text)}`
    };
  });

module.exports = { renderMarkdown, headingsLinks };
