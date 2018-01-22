# Tech Docs

Serve your markdown documentation in GOV.UK style. Store your docs alongside the
code they describe.

## Usage

From the root of your node app:

```
> npm install @hmcts/tech-docs
> tech-docs
```

Your documentation will be available on http://localhost:3000.

Tech docs will:
- Parse your package.json for repo / issues / npm links
- Find any markdown files in `/docs` and serve them

## Installation

Docs app can be installed from npm:

```
> npm install -g @hmcts/tech-docs
```
