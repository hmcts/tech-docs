const marked = require('marked');
const highlightJS = require('highlight.js');
const { debug } = require('./util/logging')('tech-docs.render');

const slugify = str => str
  .toLowerCase()
  .replace(/[^\w]+/g, '-')
  .replace(/(^-|-$)/g, '');

const parseHeading = str => {
  return { omit: str.startsWith('-'), raw: str.replace(/^-/, '') };
};

const renderer = new marked.Renderer();
const inline = new marked.InlineLexer([], { renderer });

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
renderer.heading = (title, level, rawText) => {
  const { raw } = parseHeading(rawText);
  const id = slugify(rawText);
  return [
    `<h${level} class="${headingClasses[level]}" id="${id}">`,
    `  <a href="#${id}" aria-hidden="true" class="heading-anchor"></a>`,
    `  ${inline.output(raw)}`,
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

const toc = require('markdown-toc');

const h2 = 2;
const h3 = 3;
const headingsLinks = markdown => {
  const parsed = toc(markdown);
  const links = [];

  parsed.json
    .filter(({ content }) => !parseHeading(content).omit)
    .forEach(({ lvl, content }) => {
      const newLink = {
        label: inline.output(content),
        href: `#${slugify(content)}`,
        links: []
      };
      if (lvl === h2 || (lvl === h3 && links === [])) {
        links.push(newLink);
      }
      if (lvl === h3) {
        links[links.length - 1].links.push(newLink);
      }
    });
  return links;
};

module.exports = { renderMarkdown, headingsLinks };
