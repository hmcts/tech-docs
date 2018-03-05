# Markdown Syntax

## Headings

```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

# -H1
## -H2
### -H3
#### -H4
##### -H5
###### -H6

Alternatively, for H1 and H2, an underline-ish style:

```markdown
Alt-H1
======

Alt-H2
------
```

-Alt-H1
======

-Alt-H2
------

You can omit a heading from the table of contents by starting it with `-`.
```
### -Will be omitted
```

-------------------------------------------------------------------------------

## Emphasis

```markdown
To emphasise with italics use *asterisks* or _underscores_.
```

To emphasise with italics use *asterisks* or _underscores_.

```markdown
Strong emphasis, aka bold, with **asterisks** or __underscores__.
```

Strong emphasis, aka bold, with **asterisks** or __underscores__.

```markdown
Combined emphasis with **asterisks and _underscores_**.
```

Combined emphasis with **asterisks and _underscores_**.

```markdown
Strikethrough uses two tildes. ~~Scratch this.~~
```

Strikethrough uses two tildes. ~~Scratch this.~~

-------------------------------------------------------------------------------

## Lists

(In this example, leading and trailing spaces are shown with with dots: ⋅)

### Ordered lists

```markdown
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.
```

1. First ordered list item
2. Another item
  * Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

### Nested paragraphs

```markdown
1. A list item with indented paragraphs below
⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)
```

1. A list item with indented paragraphs below
   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.  
   Note that this line is separate, but within the same paragraph.  
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

### Unordered Lists

```markdown
* Unordered list can use asterisks
- Or minuses
+ Or pluses
```

* Unordered list can use asterisks
- Or minuses
+ Or pluses

-------------------------------------------------------------------------------

## Links

```markdown
[I'm an inline-style link](https://www.google.com)
```
[I'm an inline-style link](https://www.google.com)

```markdown
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")
```
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

```markdown
[I'm a reference-style link][Arbitrary case-insensitive reference text]

[arbitrary case-insensitive reference text]: https://www.mozilla.org
```
[I'm a reference-style link][Arbitrary case-insensitive reference text]

```markdown
[I'm a relative reference to a repository file](../blob/master/LICENSE)
```
[I'm a relative reference to a repository file](../blob/master/LICENSE)

```markdown
[You can use numbers for reference-style link definitions][1]

[1]: http://slashdot.org
```
[You can use numbers for reference-style link definitions][1]

```markdown
Or leave it empty and use the [link text itself].

[link text itself]: http://www.reddit.com
```
Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
`http://www.example.com` or `<http://www.example.com>` and sometimes
`example.com` (but not on Github, for example).

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

-------------------------------------------------------------------------------

## Images

Images from the `/docs` folder is served on `[your domain]/docs/image.jpeg`.

Inline style:

```markdown
![alt text](/docs/image.jpeg)
```

![alt text](/docs/image.jpeg)

Reference style:

```markdown
![alt text][image]

[image]: /docs/image.jpeg
```

![alt text][image]

[image]: /docs/image.jpeg

-------------------------------------------------------------------------------

## `Code Highlighting`

```markdown
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

Blocks of code are either fenced by lines with three back-ticks `````, or are
indented with four spaces. I recommend only using the fenced code blocks --
they're easier and only they support syntax highlighting.

````markdown
```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```
````

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

-------------------------------------------------------------------------------

## Tables

Tables are written by separating columns by `|` with header rows separated by
`-`. You can align columns by putting a `:` at one or more edge of the header
separator.

```
| Tables        | Are           | Cool          |
| ------------- |:-------------:| -------------:|
| left aligned  | centered      | right aligned |
```

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


There must be at least 3 dashes separating each header cell. The outer pipes
`|` are optional, and you don't need to make the raw Markdown line up prettily.
You can also use inline Markdown.

```markdown
Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

-------------------------------------------------------------------------------

## Blockquotes

Use bordered inset text to draw attention to important content on the page.

```markdown
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.
```

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

You can put arbitrary markdown inside a blockquote

```markdown
> You can _italicise_ or **bold** or any other [inline markdown](#links)
```

> You can _italicise_ or **bold** or any other [inline markdown](#links)

-------------------------------------------------------------------------------

## Inline HTML

You can also use raw HTML in your Markdown

```markdown
<div class="notice">
  <i class="icon icon-important">
    <span class="visually-hidden">Warning</span>
  </i>
  <strong class="bold-small">
    You can be fined up to £5,000 if you don’t register.
  </strong>
</div>
```
<div class="notice">
  <i class="icon icon-important">
    <span class="visually-hidden">Warning</span>
  </i>
  <strong class="bold-small">
    You can be fined up to £5,000 if you don’t register.
  </strong>
</div>

Any HTML from the [GOV.UK elements][govuk-elements] documentation should just
work.

[govuk-elements]:https://govuk-elements.herokuapp.com
