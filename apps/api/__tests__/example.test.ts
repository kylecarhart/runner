import { describe, expect, it } from "vitest";

describe("Example Test Suite", () => {
  it("should pass a basic test", () => {
    expect(true).toBe(true);
  });

  it("should handle basic math", () => {
    expect(1 + 1).toBe(2);
  });

  // Example of an async test
  it("should handle async operations", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  // Example of test grouping
  describe("nested group", () => {
    it("should work with nested tests", () => {
      expect("nested").toBeTruthy();
    });
  });
});
