const redis = require("redis-mock");
const request = require("supertest");
const { connect } = require("./database");
const UserModel = require("../models/user");
const app = require("../index");
const agent = request.agent(app);

describe("urlRoute", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  beforeEach(async () => {
    const loginResponse = await agent
      .post("/user")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        username: "Kennyk",
      });

    await agent
      .post("/shortUrl")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        full: "https://www.npmjs.com/package/redis-mock",
        short: "redis-mock",
      });
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should create a short url", async () => {
    const response = await agent
      .post("/shortUrl")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        full: "https://pusher.com/tutorials/http-response-codes-part-1/#request-header-fields-too-large",
        short: "status",
      });

    expect(response.statusCode).toBe(200);
  });

  it("should delete all urls", async () => {
    const response = await agent
      .delete("/urls")
      .set("content-type", "application/x-www-form-urlencoded");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "all urls deleted");
  });

  it("should delete a url", async () => {
    const response = await agent
      .delete("/shortUrl/redis-mock")
      .set("content-type", "application/x-www-form-urlencoded");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "url deleted");
  });

  it("should get a url", async () => {
    const response = await agent
      .get("/shortUrl/redis-mock")
      .set("content-type", "application/x-www-form-urlencoded");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain(
      "https://www.npmjs.com/package/redis-mock"
    );
  });

  it("should get a url qr-code", async () => {
    const response = await agent.get("/qrcode/redis-mock");
    expect(response.statusCode).toBe(200);
  });
});
