const request = require("supertest");
const { connect } = require("./database");
const UserModel = require("../models/user");
const app = require("../index");

describe("Signup", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/user")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        username: "Kennyk",
      });

    expect(response.status).toBe(302);
    
    expect(response.headers.location).toContain(
      '/home',
    )
  });


});
