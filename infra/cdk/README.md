# @illfate/infra-cdk

Minimal AWS CDK infrastructure for the starter web app.

## What it provisions

- one Node.js Lambda function
- one public Lambda Function URL
- the default Lambda execution role
- a short log retention policy

## Commands

```bash
npm install
npm run bootstrap --workspace @illfate/infra-cdk
npm run synth --workspace @illfate/infra-cdk
npm run deploy --workspace @illfate/infra-cdk
```
