"use strict";

const http = require("node:http");
const { randomUUID } = require("node:crypto");
const { createApp } = require("../src/app");
const { normalizeNodeRequest } = require("../src/core/request");

const port = Number(process.env.PORT || 3000);
const app = createApp();

const server = http.createServer(async (req, res) => {
  const correlationId = req.headers["x-correlation-id"] || randomUUID();
  const { request, logs } = normalizeNodeRequest({
    method: req.method,
    url: req.url,
    headers: req.headers,
    correlationId
  });

  for (const log of logs) {
    console.debug(JSON.stringify(log));
  }

  const response = await app.handleRequest(request);
  res.writeHead(response.statusCode, response.headers);
  res.end(response.body);
});

server.listen(port, () => {
  console.log(`illfate web app listening on http://localhost:${port}`);
});
