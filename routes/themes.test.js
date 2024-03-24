const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /themes", () => {
  test("works for valid theme", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: "Theme New" })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      theme: { name: "Theme New" },
    });
  });

  test("fails for duplicate theme name", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: "Theme 1" })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
  });

  test("fails for invalid data - missing name field", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({})
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toContain("instance requires property \"name\"");
  });

  test("fails for invalid data - empty name", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: "" })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toContain("instance.name does not meet minimum length of 1");
  });

  test("fails for invalid data - name with only spaces", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: "   " })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toContain("instance.name does not match pattern \"^\\\\S(.*\\\\S)?$\"");
  });

  test("fails for invalid data - excessively long name", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: "a".repeat(101) })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toContain("instance.name does not meet maximum length of 100");
  });

  test("fails for non-string data types for name", async () => {
    const resp = await request(app)
      .post("/themes")
      .send({ name: 12345 })
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toContain("instance.name is not of a type(s) string");
  });

});

describe("GET /themes", () => {
  test("works without search filter", async () => {
    const resp = await request(app)
      .get("/themes")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.themes).toEqual([
      { name: "Theme 1" },
      { name: "Theme 2" },
      { name: "Theme 3" },
      { name: "Theme 4" },
    ]);
  });

  test("works with search filter", async () => {
    const resp = await request(app)
      .get("/themes?name=1")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.themes).toEqual([{ name: "Theme 1" }]);
  });

  test("returns empty array for no matching search filter", async () => {
    const resp = await request(app)
      .get("/themes?name=No Match")
      .set("Authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.themes).toEqual([]);
  });

});
