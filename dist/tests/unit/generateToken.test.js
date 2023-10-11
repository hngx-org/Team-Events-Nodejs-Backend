"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../../src/utils/");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("Generate Token", () => {
    it("Should generate a token", () => {
        const id = "5c8e1b9f-c7f1-4578-bd6e-923832bdb903";
        const token = (0, utils_1.generateToken)(id);
        (0, globals_1.expect)(token).toBeDefined();
        (0, globals_1.expect)(typeof token).toBe("string");
        (0, globals_1.expect)(token.length).toBeGreaterThan(100);
    });
});
//# sourceMappingURL=generateToken.test.js.map