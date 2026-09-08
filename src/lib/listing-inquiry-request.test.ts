import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { submitListingInquiry } from "./listing-inquiry-request.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("submitListingInquiry", () => {
  it("posts to the public inquiry endpoint and reports success", async () => {
    const calls: Array<{ url: string; init: RequestInit | undefined }> = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return new Response(JSON.stringify({ ok: true }), { status: 201 });
    }) as typeof fetch;

    const result = await submitListingInquiry("casa-burdeos", {
      name: "Ana",
      phone: "6641234567",
      message: "Quiero una visita",
    });

    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      "/api/public/listings/casa-burdeos/inquiries",
    );
    assert.equal(calls[0].init?.method, "POST");
    assert.equal(
      calls[0].init?.body,
      JSON.stringify({
        inquiry: {
          name: "Ana",
          phone: "6641234567",
          message: "Quiero una visita",
        },
      }),
    );
  });

  it("surfaces the API error without treating it as success", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ message: "Teléfono inválido" }), {
        status: 422,
      })) as typeof fetch;

    const result = await submitListingInquiry("casa-burdeos", {
      name: "Ana",
      phone: "123",
      message: "",
    });

    assert.deepEqual(result, { ok: false, message: "Teléfono inválido" });
  });

  it("returns a generic failure when fetch rejects", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;

    const result = await submitListingInquiry("casa-burdeos", {
      name: "Ana",
      phone: "6641234567",
      message: "Quiero una visita",
    });

    assert.deepEqual(result, {
      ok: false,
      message: "No se pudo completar la solicitud.",
    });
  });
});
