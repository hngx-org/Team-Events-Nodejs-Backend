"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./../../src/index"));
let app;
(0, globals_1.describe)("Event Integration Test", () => {
    (0, globals_1.beforeEach)(() => {
        app = index_1.default;
    });
    (0, globals_1.afterEach)(() => {
        index_1.default.close();
    });
    (0, globals_1.describe)("GET /api/events", () => {
        it("Should return all events", async () => {
            const res = await (0, supertest_1.default)(app).get("/api/events");
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toBeInstanceOf(Array);
            const firstEvent = res.body[0];
            (0, globals_1.expect)(firstEvent).toHaveProperty("id");
            (0, globals_1.expect)(firstEvent).toHaveProperty("event_name");
            (0, globals_1.expect)(firstEvent).toHaveProperty("event_description");
        });
    });
    (0, globals_1.describe)("GET /api/events/:id", () => {
        it("Should return a single event", async () => {
            const id = "dd46bb0f-f745-4ea0-9998-9241a47e71d0";
            const res = await (0, supertest_1.default)(app).get(`/api/events/info/${id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toBeInstanceOf(Object);
            (0, globals_1.expect)(res.body).toHaveProperty("data");
            const eventData = res.body.data;
            (0, globals_1.expect)(eventData).toHaveProperty("id");
            (0, globals_1.expect)(eventData).toHaveProperty("event_name");
            (0, globals_1.expect)(eventData).toHaveProperty("event_description");
        });
    });
    (0, globals_1.describe)("GET /api/events/search?keyword", () => {
        it("Should return a single event", async () => {
            const keyword = "linux";
            const res = await (0, supertest_1.default)(app).get(`/api/events/search?keyword=${keyword}`);
            (0, globals_1.expect)(res.statusCode).toBe(200);
        });
    });
});
//# sourceMappingURL=event.test.js.map