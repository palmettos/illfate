"use strict";

function assert(condition, message, correlationId, state) {
  if (!condition) {
    const error = new Error(message);
    error.correlationId = correlationId;
    error.state = state || {};
    throw error;
  }
}

function assertObject(value, fieldName, correlationId) {
  assert(Boolean(value) && typeof value === "object" && !Array.isArray(value), `${fieldName} must be an object`, correlationId, { fieldName, value });
  return value;
}

function assertNonEmptyString(value, fieldName, correlationId) {
  assert(typeof value === "string" && value.trim().length > 0, `${fieldName} must be a non-empty string`, correlationId, { fieldName, value });
  return value;
}

function freeze(value) {
  return Object.freeze(value);
}

module.exports = {
  assert,
  assertObject,
  assertNonEmptyString,
  freeze
};
