import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isExampleEmail, isExamplePhone } from "./example-contact.ts";

describe("isExamplePhone", () => {
  it("flags phones that contain example", () => {
    assert.equal(isExamplePhone("example"), true);
    assert.equal(isExamplePhone("+52 EXAMPLE 123"), true);
  });

  it("keeps real phones", () => {
    assert.equal(isExamplePhone("+525512345678"), false);
    assert.equal(isExamplePhone(" 6641234567 "), false);
  });

  it("treats empty as not example", () => {
    assert.equal(isExamplePhone(""), false);
    assert.equal(isExamplePhone(null), false);
    assert.equal(isExamplePhone(undefined), false);
  });
});

describe("isExampleEmail", () => {
  it("flags .example and @example. domains", () => {
    assert.equal(isExampleEmail("contacto@agencia.example"), true);
    assert.equal(isExampleEmail("user@example.com"), true);
    assert.equal(isExampleEmail("a@sub.example.org"), true);
  });

  it("keeps real emails", () => {
    assert.equal(isExampleEmail("hola@agencia.mx"), false);
    assert.equal(isExampleEmail("sales@exampleagency.com"), false);
  });

  it("treats empty as not example", () => {
    assert.equal(isExampleEmail(""), false);
    assert.equal(isExampleEmail(null), false);
  });
});
