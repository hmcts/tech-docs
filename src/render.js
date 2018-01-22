const marked = require('marked');

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

renderer.paragraph = text => {
  return [
    '<p class="text">',
    `  ${text}`,
    '</p>'
  ].join('\n');
};

renderer.list = (body, ordered) => {
  return [
    ordered ? '<ol class="list">' : '<ul class="list">',
    body,
    ordered ? '</ol>' : '</ul>'
  ].join('\n');
};

const renderMarkdown = content => {
  return marked(content, { renderer });
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
