"use strict";

const { freeze } = require("../core/contracts");

function handleHome(request) {
  return freeze({
    statusCode: 200,
    template: "pages/home.njk",
    context: freeze({
      title: "illfate",
      activePage: "home"
    }),
    logs: freeze([
      freeze({
        level: "debug",
        message: "home-page-selected",
        correlation_id: request.correlationId,
        state: {
          activePage: "home"
        }
      })
    ])
  });
}

module.exports = {
  handleHome
};
