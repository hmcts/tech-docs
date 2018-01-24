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
  console.log(marked);
  const id = slugify(title);
  return [
    `<h${level} class="${headingClasses[level]}" id="${id}">`,
    `  <a href="#${id}" aria-hidden="true" class="heading-anchor"></a>`,
    `  ${title}`,
    `</h${level}>`
  ].join('\n');
};

renderer.paragraph = text => {
  return [
    '<p class="text">',
    `  ${text}`,
    '</p>'
  ].join('\n');
};

renderer.strong = text => {
  return `<strong class="bold">${text}</strong>`;
};

renderer.blockquote = text => {
  return `<div class="panel panel-border-wide">${text}</div>`;
};

renderer.list = (body, ordered) => {
  return [
    ordered ? '<ol class="list list-number">' : '<ul class="list list-bullet">',
    body,
    ordered ? '</ol>' : '</ul>'
  ].join('\n');
};

const highlight = (code, lang) => {
  if (lang) {
    try {
      return highlightJS.highlight(lang, code).value;
    } catch (err) {
      debug(`Failed rendering: ${err}`);
      return highlightJS.highlightAuto(code).value;
    }
  }
  return highlightJS.highlightAuto(code).value;
};

const renderMarkdown = content => {
  return marked(content, {
    renderer,
    highlight
  });
};

const headingsLinks = content => {
  return marked.lexer(content, { renderer })
    .filter(token => token.type === 'heading')
    .map(heading => {
      return {
        label: heading.text,
        href: `#${slugify(heading.text)}`
      };
    });
};

module.exports = { renderMarkdown, headingsLinks };
