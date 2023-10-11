import { generateToken } from "./../../src/utils/";
import { describe, expect, test } from "@jest/globals";

describe("Generate Token", () => {
  it("Should generate a token", () => {
    const id = "5c8e1b9f-c7f1-4578-bd6e-923832bdb903";
    const token = generateToken(id);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(100); 
  });
});
