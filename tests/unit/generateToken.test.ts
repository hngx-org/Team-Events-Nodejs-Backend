import { generateToken } from "./../../src/utils/";


describe("Generate Token", () => {
    it("Should generate a token", () => {
        const id = "5c8e1b9f-c7f1-4578-bd6e-923832bdb903";
        const token = generateToken(id);
        expect(token).toBeDefined();
        expect(token).toHaveLength(64);
    })
})
