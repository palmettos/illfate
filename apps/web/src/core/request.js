"use strict";

const path = require("node:path");
const { assertNonEmptyString, assertObject, freeze } = require("./contracts");

function normalizeHeaders(headers) {
  const input = headers || {};
  const normalized = {};

  for (const [key, value] of Object.entries(input)) {
    normalized[String(key).toLowerCase()] = Array.isArray(value) ? String(value[0] || "") : String(value || "");
  }

  return freeze(normalized);
}

function normalizeQuery(query) {
  const input = query || {};
  const normalized = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) {
      continue;
    }

    normalized[String(key)] = String(value);
  }

  return freeze(normalized);
}

function normalizePathname(pathname, correlationId) {
  const normalizedPath = path.posix.normalize(assertNonEmptyString(pathname, "path", correlationId));
  return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
}

function buildNormalizedRequest({ source, method, path, headers, query, correlationId }) {
  const normalizedMethod = assertNonEmptyString(method, "method", correlationId).toUpperCase();
  const normalizedPath = normalizePathname(path, correlationId);
  const normalizedHeaders = normalizeHeaders(headers);
  const normalizedQuery = normalizeQuery(query);
  const request = freeze({
    source,
    correlationId: assertNonEmptyString(correlationId, "correlationId", correlationId),
    method: normalizedMethod,
    path: normalizedPath,
    headers: normalizedHeaders,
    query: normalizedQuery,
    isHtmx: normalizedHeaders["hx-request"] === "true"
  });

  return freeze({
    request,
    logs: freeze([
      freeze({
        level: "debug",
        message: `normalized-${source}-request`,
        correlation_id: correlationId,
        state: request
      })
    ])
  });
}

function normalizeLambdaEvent(event) {
  assertObject(event, "event", "lambda-request");
  const headers = normalizeHeaders(event.headers);
  const correlationId = headers["x-correlation-id"] || event.requestContext?.requestId || "lambda-request";
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = event.rawPath || event.path || "/";
  const query = normalizeQuery(event.queryStringParameters);

  return buildNormalizedRequest({
    source: "lambda",
    method,
    path,
    headers,
    query,
    correlationId
  });
}

function normalizeNodeRequest(input) {
  assertObject(input, "input", "node-request");
  const correlationId = input.correlationId || "node-request";
  const method = input.method || "GET";
  const url = new URL(input.url || "/", "http://localhost");
  const query = {};

  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value;
  }

  return buildNormalizedRequest({
    source: "node",
    method,
    path: url.pathname,
    headers: input.headers,
    query,
    correlationId
  });
}

module.exports = {
  normalizeLambdaEvent,
  normalizeNodeRequest
};
