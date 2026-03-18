"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const nunjucks = require("nunjucks");
const { items: defaultItems } = require("./data/mock-items");
const { matchRoute } = require("./router");
const { handleHome } = require("./routes/home");
const { handleSearchPage, handleSearchResults } = require("./routes/search");

const viewsPath = path.join(__dirname, "views");
const publicPath = path.join(__dirname, "public");
const staticContentTypes = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
});
const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(viewsPath, { noCache: true }),
  { autoescape: true }
);

function defaultLogger(entry) {
  console.debug(JSON.stringify(entry));
}

function flushLogs(logger, logs) {
  for (const log of logs || []) {
    logger(log);
  }
}

function isStaticRequest(requestPath) {
  return requestPath.startsWith("/css/") || requestPath.startsWith("/js/");
}

function createHtmlResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "text/html; charset=utf-8"
    },
    body
  };
}

function createApp(dependencies) {
  const resolvedDependencies = dependencies || {};
  const items = resolvedDependencies.items || defaultItems;
  const logger = resolvedDependencies.logger || defaultLogger;
  const renderTemplate = resolvedDependencies.renderTemplate || ((template, context) => nunjucksEnvironment.render(template, context));
  const readFile = resolvedDependencies.readFile || fs.readFile;

  return {
    async handleRequest(request) {
      logger({
        level: "debug",
        message: "request-received",
        correlation_id: request.correlationId,
        state: request
      });

      if (isStaticRequest(request.path)) {
        const assetPath = path.join(publicPath, request.path.replace(/^\//, ""));
        const extension = path.extname(assetPath);
        const assetBody = await readFile(assetPath);
        logger({
          level: "debug",
          message: "static-asset-served",
          correlation_id: request.correlationId,
          state: {
            requestPath: request.path,
            assetPath
          }
        });
        return {
          statusCode: 200,
          headers: {
            "content-type": staticContentTypes[extension] || "application/octet-stream"
          },
          body: assetBody.toString("utf8")
        };
      }

      const routeMatch = matchRoute(request);
      flushLogs(logger, routeMatch.logs);

      if (!routeMatch.routeName) {
        logger({
          level: "debug",
          message: "returning-not-found",
          correlation_id: request.correlationId,
          state: {
            path: request.path
          }
        });
        return createHtmlResponse(404, "<h1>Not found</h1>");
      }

      const routeResponse = routeMatch.routeName === "home"
        ? handleHome(request)
        : routeMatch.routeName === "search-page"
          ? handleSearchPage(request, items)
          : handleSearchResults(request, items);

      flushLogs(logger, routeResponse.logs);

      const body = renderTemplate(routeResponse.template, routeResponse.context);
      logger({
        level: "debug",
        message: "template-rendered",
        correlation_id: request.correlationId,
        state: {
          template: routeResponse.template,
          statusCode: routeResponse.statusCode
        }
      });

      return createHtmlResponse(routeResponse.statusCode, body);
    }
  };
}

module.exports = {
  createApp
};
