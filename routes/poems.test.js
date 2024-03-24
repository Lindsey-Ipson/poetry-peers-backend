const request = require("supertest");
const app = require("../app");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /poems", function () {
  test("works for valid data", async function () {
    const resp = await request(app)
      .post("/poems")
      .send({
        id: "new",
        title: "New Poem",
        author: "New Author",
        lineCount: 2,
        lines: ["New Line 1", "New Line 2"]
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      poem: {
        id: "new",
        title: "New Poem",
        author: "New Author",
        lineCount: 2,
        lines: ["New Line 1", "New Line 2"]
      }
    });
  });

  test("fails for duplicate data", async function () {
    const resp = await request(app)
      .post("/poems")
      .send({
        id: "1a",
        title: "Poem 1",
        author: "Author 1",
        lineCount: 3,
        lines: ["Line 1", "Line 2", "Line 3"]
      });
    expect(resp.statusCode).toBe(400);
  });

  test("fails for invalid data", async function () {
    const resp = await request(app)
      .post("/poems")
      .send({
        id: "invalid",
        title: "",
        author: "Author Invalid",
        lineCount: 1,
        lines: []
      });
    expect(resp.statusCode).toBe(400);
  });

});

describe("GET /poems/:id", function () {
  test("works for existing poem", async function () {
    const resp = await request(app).get(`/poems/1a`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      poem: {
        id: "1a",
        title: "Poem 1",
        author: "Author 1",
        lineCount: 3,
        lines: ["Line 1", "Line 2", "Line 3"]
      }
    });
  });

  test("not found for non-existent poem", async function () {
    const resp = await request(app).get(`/poems/nonexistent`);
    expect(resp.statusCode).toBe(404);
  });

});
