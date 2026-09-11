import assert from "node:assert/strict";
import { afterEach, it, mock } from "node:test";
import { publicApiFetch } from "./public-api-fetch.ts";

afterEach(() => mock.restoreAll());

for (const error of [new TypeError("network error"), Object.assign(new TypeError("terminated"), { cause: { code: "UND_ERR_SOCKET" } })]) {
  it(`returns 503 when response body fails: ${error.message}`, async () => {
    const response = new Response(new ReadableStream({ start(controller) { controller.error(error); } }));
    mock.method(globalThis, "fetch", async () => response);
    assert.deepEqual(await publicApiFetch("/test"), { ok: false, data: null, status: 503 });
  });
}
for (const error of [new DOMException("aborted", "AbortError"), new DOMException("timeout", "TimeoutError"), new TypeError("programming bug")]) {
  it(`preserves unexpected and abort-related body errors: ${error.name} ${error.message}`, async () => {
    const response = new Response(new ReadableStream({ start(controller) { controller.error(error); } }));
    mock.method(globalThis, "fetch", async () => response);
    await assert.rejects(publicApiFetch("/test"), (actual) => actual === error);
  });
}
for (const [body, status, data] of [[null, 200, null], ["not json", 200, "not json"], ['{"message":"bad"}', 400, { message: "bad" }]] as const) {
  it(`preserves HTTP/parse semantics for ${status} ${body}`, async () => {
    mock.method(globalThis, "fetch", async () => new Response(body, { status }));
    assert.deepEqual(await publicApiFetch("/test"), { ok: status < 400, status, data });
  });
}
