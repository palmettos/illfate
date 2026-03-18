"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { items } = require("../src/data/mock-items");
const { buildSearchViewModel, filterItems, normalizeSearchQuery } = require("../src/core/search");

test("normalizeSearchQuery trims user input", () => {
  assert.equal(normalizeSearchQuery("  tea  "), "tea");
});

test("filterItems returns all items when there is no query", () => {
  const state = filterItems(items, "", "search-1");
  assert.equal(state.results.length, items.length);
  assert.equal(state.hasQuery, false);
});

test("buildSearchViewModel filters items case-insensitively", () => {
  const { viewModel } = buildSearchViewModel(items, "lambda", "search-2");
  assert.equal(viewModel.totalResults, 1);
  assert.equal(viewModel.results[0].name, "Lambda Journal");
  assert.equal(viewModel.heading, "Results for “lambda”");
});

test("buildSearchViewModel returns an empty-state message when nothing matches", () => {
  const { viewModel } = buildSearchViewModel(items, "zzz", "search-3");
  assert.equal(viewModel.totalResults, 0);
  assert.equal(viewModel.emptyMessage, "No example items matched “zzz”.");
});
