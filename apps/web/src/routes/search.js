"use strict";

const { freeze } = require("../core/contracts");
const { buildSearchViewModel } = require("../core/search");

function buildSearchResponse(request, items, template) {
  const { viewModel, logs } = buildSearchViewModel(items, request.query.q, request.correlationId);
  return freeze({
    statusCode: 200,
    template,
    context: freeze({
      title: "Search",
      activePage: "search",
      search: viewModel
    }),
    logs: freeze([
      ...logs,
      freeze({
        level: "debug",
        message: template === "pages/search.njk" ? "search-page-selected" : "search-fragment-selected",
        correlation_id: request.correlationId,
        state: {
          template,
          query: viewModel.query,
          totalResults: viewModel.totalResults
        }
      })
    ])
  });
}

function handleSearchPage(request, items) {
  return buildSearchResponse(request, items, "pages/search.njk");
}

function handleSearchResults(request, items) {
  return buildSearchResponse(request, items, "partials/search-results.njk");
}

module.exports = {
  handleSearchPage,
  handleSearchResults
};
