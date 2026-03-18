"use strict";

const { assertObject, freeze } = require("../core/contracts");

function matchRoute(request) {
  assertObject(request, "request", request && request.correlationId ? request.correlationId : "router");
  const routeKey = `${request.method} ${request.path}`;
  let routeName = null;

  if (routeKey === "GET /") {
    routeName = "home";
  } else if (routeKey === "GET /search") {
    routeName = "search-page";
  } else if (routeKey === "GET /search/results") {
    routeName = "search-results";
  }

  return freeze({
    routeName,
    logs: freeze([
      freeze({
        level: "debug",
        message: routeName ? "route-matched" : "route-not-found",
        correlation_id: request.correlationId,
        state: {
          routeKey,
          routeName
        }
      })
    ])
  });
}

module.exports = {
  matchRoute
};
