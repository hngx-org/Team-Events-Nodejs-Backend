import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import request from "supertest";
import server from "./../../src/index";

let app: any;

describe("Event Integration Test", () => {
  beforeEach(() => {
    app = server;
  });

  afterEach(() => {
    server.close();
  });

  describe("GET /api/events", () => {
    it("Should return all events", async () => {
      const res = await request(app).get("/api/events");
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);

      const firstEvent = res.body[0];
      expect(firstEvent).toHaveProperty("id");
      expect(firstEvent).toHaveProperty("event_name");
      expect(firstEvent).toHaveProperty("event_description");
    });
  });

  describe("GET /api/events/:id", () => {
    it("Should return a single event", async () => {
      const id = "dd46bb0f-f745-4ea0-9998-9241a47e71d0";
      const res = await request(app).get(`/api/events/info/${id}`);
      expect(res.status).toBe(200);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("data");
      const eventData = res.body.data;

      expect(eventData).toHaveProperty("id");
      expect(eventData).toHaveProperty("event_name");
      expect(eventData).toHaveProperty("event_description");
    });
  });

  describe("GET /api/events/search?keyword", () => {
    it("Should return a single event", async () => {
      const keyword = "linux";
      const res = await request(app).get(
        `/api/events/search?keyword=${keyword}`
      );
      expect(res.statusCode).toBe(200);
    });
  });
});
