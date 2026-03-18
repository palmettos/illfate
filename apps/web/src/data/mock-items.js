"use strict";

const items = Object.freeze([
  Object.freeze({
    id: "bookshop-guide",
    name: "Bookshop Guide",
    description: "A calm directory of independent bookstores and reading rooms."
  }),
  Object.freeze({
    id: "coastal-trails",
    name: "Coastal Trails",
    description: "Suggested day trips and walking notes for nearby coastal paths."
  }),
  Object.freeze({
    id: "lambda-journal",
    name: "Lambda Journal",
    description: "Short notes about shipping a small server-rendered site on AWS Lambda."
  }),
  Object.freeze({
    id: "tea-club",
    name: "Tea Club",
    description: "Weekly tasting notes and lightweight meetup announcements."
  })
]);

module.exports = {
  items
};
