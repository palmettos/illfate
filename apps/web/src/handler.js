"use strict";

const { createApp } = require("./app");
const { normalizeLambdaEvent } = require("./core/request");

const app = createApp();

async function handler(event) {
  const { request, logs } = normalizeLambdaEvent(event);

  for (const log of logs) {
    console.debug(JSON.stringify(log));
  }

  try {
    return await app.handleRequest(request);
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      message: "request-failed",
      correlation_id: request.correlationId,
      state: {
        error: error.message,
        stack: error.stack
      }
    }));
    return {
      statusCode: 500,
      headers: {
        "content-type": "text/html; charset=utf-8"
      },
      body: "<h1>Something went wrong</h1>"
    };
  }
}

module.exports = {
  handler
};
