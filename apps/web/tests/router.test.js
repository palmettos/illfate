"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { matchRoute } = require("../src/router");

function createRequest(path) {
  return {
    method: "GET",
    path,
    correlationId: "test-route"
  };
}

test("matchRoute returns the expected home route", () => {
  const route = matchRoute(createRequest("/"));
  assert.equal(route.routeName, "home");
});

test("matchRoute returns the expected search routes", () => {
  assert.equal(matchRoute(createRequest("/search")).routeName, "search-page");
  assert.equal(matchRoute(createRequest("/search/results")).routeName, "search-results");
});

test("matchRoute returns null for unknown paths", () => {
  assert.equal(matchRoute(createRequest("/missing")).routeName, null);
});
