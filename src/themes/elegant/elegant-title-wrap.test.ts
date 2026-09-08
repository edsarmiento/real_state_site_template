import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { keepTrailingWordsTogether } from "./elegant-title-wrap.ts";

describe("keepTrailingWordsTogether", () => {
  it("keeps 'a fin' on the same line", () => {
    assert.equal(
      keepTrailingWordsTogether("Un proceso simple, de principio a fin"),
      "Un proceso simple, de principio a\u00a0fin",
    );
  });

  it("can keep the last three words together", () => {
    assert.equal(
      keepTrailingWordsTogether("Un proceso simple, de principio a fin", 3),
      "Un proceso simple, de principio\u00a0a\u00a0fin",
    );
  });

  it("joins short titles without dropping words", () => {
    assert.equal(keepTrailingWordsTogether("Proceso simple"), "Proceso\u00a0simple");
  });
});
