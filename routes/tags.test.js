const request = require("supertest");
const app = require("../app");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /tags", () => {
  test("works for valid data", async () => {
    const resp = await request(app)
      .post("/tags")
      .send({
        themeName: "Theme 1",
        poemId: "2b",
        highlightedLines: [1],
        analysis: "New analysis for Theme 1 in Poem 2b",
        username: "user1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      tag: expect.objectContaining({
        themeName: "Theme 1",
        poemId: "2b",
        highlightedLines: expect.any(Array),
        analysis: "New analysis for Theme 1 in Poem 2b",
        username: "user1"
      }),
    });
  });

  test("fails for duplicate tag", async () => {
    const resp = await request(app)
      .post("/tags")
      .send({
        themeName: "Theme 1",
        poemId: "1a",
        highlightedLines: [1, 3],
        analysis: "Analysis for Theme 1 in Poem 1",
        username: "user1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
  });

  test("fails for invalid data (missing fields)", async () => {
    const resp = await request(app)
      .post("/tags")
      .send({
        themeName: "Theme 1",
        // poemId is missing
        highlightedLines: [1],
        analysis: "Incomplete data for Theme 1",
        username: "user1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error).toEqual(expect.any(Object));
    expect(resp.body.error.message).toContain("instance requires property \"poemId\"");
  });

  test("fails for non-existent poem", async () => {
    const resp = await request(app)
      .post("/tags")
      .send({
        themeName: "Theme 1",
        poemId: "nonexistent",
        highlightedLines: [1],
        analysis: "Tag for a non-existent poem",
        username: "user1"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(500);
  });
  
});

describe("GET /tags/by-poem/:poemId", () => {
  test("works for existing poem", async () => {
    const resp = await request(app)
      .get("/tags/by-poem/1a")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual(expect.any(Array));
    expect(resp.body.tags[0]).toEqual(expect.objectContaining({
      themeName: expect.any(String),
      poemId: "1a",
      highlightedLines: expect.any(Array),
      analysis: expect.any(String),
      username: expect.any(String),
    }));
  });

  test("returns empty array for a poem with no tags", async () => {
    const resp = await request(app)
      .get("/tags/by-poem/4d")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

  test("returns empty array for non-existing poem", async () => {
    const resp = await request(app)
      .get("/tags/by-poem/nonexistent")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

});

describe("GET /tags/by-user/:username", () => {
  test("works for existing user with tags", async () => {
    const resp = await request(app)
      .get("/tags/by-user/user1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual(expect.any(Array));
    expect(resp.body.tags).not.toHaveLength(0);
    expect(resp.body.tags[0]).toEqual(expect.objectContaining({
      themeName: expect.any(String),
      poemId: expect.any(String),
      highlightedLines: expect.any(Array),
      analysis: expect.any(String),
      username: "user1",
    }));
  });

  test("returns empty array for existing user with no tags", async () => {
    const resp = await request(app)
      .get("/tags/by-user/user3")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

  test("returns empty array for non-existing user", async () => {
    const resp = await request(app)
      .get("/tags/by-user/nonexistentuser")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

});

describe("GET /tags/by-theme/:themeName", () => {
  test("works for existing theme with tags", async () => {
    const resp = await request(app)
      .get("/tags/by-theme/Theme 1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual(expect.any(Array));
    expect(resp.body.tags).toHaveLength(1);
    expect(resp.body.tags[0]).toEqual(expect.objectContaining({
      themeName: 'Theme 1',
      poemId: '1a',
      highlightedLines: [1, 3],
      analysis: 'Analysis for Theme 1 in Poem 1',
      username: 'user1'
    }));
  });

  test("returns empty array for theme with no tags", async () => {
    const resp = await request(app)
      .get("/tags/by-theme/Theme 4")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

  test("returns empty array for non-existing theme", async () => {
    const resp = await request(app)
      .get("/tags/by-theme/Nonexistent Theme")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.tags).toEqual([]);
  });

});

describe("DELETE /tags", () => {
  test("works for existing tag", async () => {
    const resp = await request(app)
      .delete("/tags")
      .query({ themeName: "Theme 1", poemId: "1a", highlightedLines: "1,3" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      deleted: expect.objectContaining({
        themeName: "Theme 1",
        poemId: "1a",
        highlightedLines: expect.any(Array),
      }),
    });
  });

  test("fails for non-existing tag", async () => {
    const resp = await request(app)
      .delete("/tags")
      .query({ themeName: "Nonexistent", poemId: "nope", highlightedLines: "100" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(404);
  });

});
