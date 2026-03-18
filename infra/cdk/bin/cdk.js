#!/usr/bin/env node
"use strict";

const cdk = require("aws-cdk-lib");
const { WebStack } = require("../lib/web-stack");

const app = new cdk.App();

new WebStack(app, "IllfateWebStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
