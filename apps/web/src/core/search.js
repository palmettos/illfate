"use strict";

const { assert, assertNonEmptyString, freeze } = require("./contracts");

function normalizeSearchQuery(query) {
  return String(query || "").trim();
}

function filterItems(items, query, correlationId) {
  assert(Array.isArray(items), "items must be an array", correlationId, { items });
  const normalizedQuery = normalizeSearchQuery(query);
  const searchTerms = normalizedQuery.toLowerCase();
  const results = normalizedQuery.length === 0
    ? items
    : items.filter((item) => {
        const haystack = `${item.name} ${item.description}`.toLowerCase();
        return haystack.includes(searchTerms);
      });

  return freeze({
    query: normalizedQuery,
    results: freeze(results.slice()),
    hasQuery: normalizedQuery.length > 0,
    logs: freeze([
      freeze({
        level: "debug",
        message: normalizedQuery.length === 0 ? "search-returned-all-items" : "search-filtered-items",
        correlation_id: correlationId,
        state: {
          query: normalizedQuery,
          resultCount: results.length
        }
      })
    ])
  });
}

function buildSearchViewModel(items, query, correlationId) {
  const searchState = filterItems(items, query, correlationId);
  const heading = searchState.hasQuery
    ? `Results for “${searchState.query}”`
    : "All example items";
  const emptyMessage = searchState.hasQuery
    ? `No example items matched “${searchState.query}”.`
    : "There are no example items yet.";
  const viewModel = freeze({
    query: searchState.query,
    hasQuery: searchState.hasQuery,
    heading,
    emptyMessage,
    results: searchState.results,
    totalResults: searchState.results.length
  });

  assertNonEmptyString(viewModel.heading, "heading", correlationId);

  return freeze({
    viewModel,
    logs: freeze([
      ...searchState.logs,
      freeze({
        level: "debug",
        message: "search-view-model-created",
        correlation_id: correlationId,
        state: viewModel
      })
    ])
  });
}

module.exports = {
  buildSearchViewModel,
  filterItems,
  normalizeSearchQuery
};
