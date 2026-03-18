"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeLambdaEvent, normalizeNodeRequest } = require("../src/core/request");

test("normalizeLambdaEvent lowercases headers and detects HTMX", () => {
  const { request } = normalizeLambdaEvent({
    rawPath: "/search/results",
    headers: {
      "HX-Request": "true",
      "X-Correlation-Id": "corr-123"
    },
    queryStringParameters: {
      q: "lambda"
    },
    requestContext: {
      requestId: "aws-1",
      http: {
        method: "get"
      }
    }
  });

  assert.equal(request.method, "GET");
  assert.equal(request.path, "/search/results");
  assert.equal(request.correlationId, "corr-123");
  assert.equal(request.isHtmx, true);
  assert.deepEqual(request.query, { q: "lambda" });
});

test("normalizeNodeRequest parses the pathname and query string", () => {
  const { request } = normalizeNodeRequest({
    method: "GET",
    url: "/search?q=tea",
    headers: {
      accept: "text/html"
    },
    correlationId: "local-1"
  });

  assert.equal(request.path, "/search");
  assert.equal(request.query.q, "tea");
  assert.equal(request.correlationId, "local-1");
  assert.equal(request.isHtmx, false);
});

test("normalizeNodeRequest canonicalizes the request path", () => {
  const { request } = normalizeNodeRequest({
    method: "GET",
    url: "/css/../search/results?q=tea",
    headers: {},
    correlationId: "local-2"
  });

  assert.equal(request.path, "/search/results");
});
