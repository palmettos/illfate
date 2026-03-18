# illfate

Phase 1 file tree:

```text
/
├── package.json
├── README.md
├── .gitignore
├── apps/
│   └── web/
│       ├── package.json
│       ├── README.md
│       ├── scripts/
│       │   └── dev.js
│       ├── src/
│       │   ├── app.js
│       │   ├── handler.js
│       │   ├── core/
│       │   │   ├── contracts.js
│       │   │   ├── request.js
│       │   │   └── search.js
│       │   ├── data/
│       │   │   └── mock-items.js
│       │   ├── public/
│       │   │   ├── css/
│       │   │   │   └── global.css
│       │   │   └── js/
│       │   │       └── alpine-init.js
│       │   ├── router/
│       │   │   └── index.js
│       │   ├── routes/
│       │   │   ├── home.js
│       │   │   └── search.js
│       │   └── views/
│       │       ├── layouts/
│       │       │   └── base.njk
│       │       ├── pages/
│       │       │   ├── home.njk
│       │       │   └── search.njk
│       │       └── partials/
│       │           ├── footer.njk
│       │           ├── header.njk
│       │           └── search-results.njk
│       └── tests/
│           ├── request.test.js
│           ├── router.test.js
│           └── search.test.js
└── infra/
    └── cdk/
        ├── package.json
        ├── cdk.json
        ├── README.md
        ├── bin/
        │   └── cdk.js
        └── lib/
            └── web-stack.js
```

Deviations from the requested structure:
- Added `src/core` for pure request and search logic so the imperative shell stays small.
- Added `src/data/mock-items.js` for explicit in-memory demo data.
- Added `tests/` under `apps/web` using Node's built-in test runner so no extra test framework is needed.

Phase 2 implementation summary:
- The web app is a single Lambda-compatible Node.js app that renders Nunjucks templates and serves static assets directly.
- `GET /` renders a full home page.
- `GET /search` renders a full search page.
- `GET /search/results` returns just the results fragment for HTMX updates.
- Local development reuses the same application logic through a tiny Node HTTP server.
- CDK provisions one Lambda function and one public Function URL.

## Local development

Install dependencies:

```bash
npm install
```

Run the web app locally:

```bash
npm run dev
```

Then open <http://localhost:3000>.

Run the focused tests:

```bash
npm test
```

## AWS CDK

Bootstrap an environment once per account and region:

```bash
npm run bootstrap --workspace @illfate/infra-cdk
```

Synthesize the stack:

```bash
npm run synth
```

Deploy the stack:

```bash
npm run deploy
```

## Assumptions and limitations

- The starter app intentionally has no database, authentication, or background jobs.
- Static assets are served from the same Lambda function for simplicity.
- The deploy scripts install production dependencies into `apps/web/node_modules` before CDK packages the Lambda asset.
- HTMX enhances the search interaction, but every important page still works as a normal full-page request.
