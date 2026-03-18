# @illfate/web

A minimal server-rendered Node.js app for AWS Lambda Function URLs.

## Routes

- `GET /` renders the home page.
- `GET /search` renders the full search page.
- `GET /search/results` renders the HTMX fragment for the results list.
- `GET /css/global.css` and `GET /js/alpine-init.js` serve static assets.

## Local development

```bash
npm install
npm run dev --workspace @illfate/web
```

Open <http://localhost:3000>.

## Tests

```bash
npm run test --workspace @illfate/web
```
