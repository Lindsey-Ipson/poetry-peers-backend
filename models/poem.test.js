const db = require("../db.js");
const Poem = require("../models/poem");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  test("Can create a new poem", async function () {
    let newPoem = await Poem.create({
      id: "4d",
      title: "New Poem",
      author: "New Author",
      lineCount: 2,
      lines: ["New Line 1", "New Line 2"]
    });

    expect(newPoem).toEqual({
      id: "4d",
      title: "New Poem",
      author: "New Author",
      lineCount: 2,
      lines: ["New Line 1", "New Line 2"]
    });

    const found = await db.query("SELECT * FROM poems WHERE id = '4d'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].title).toEqual("New Poem");
  });

  test("Throws BadRequestError on duplicate", async function () {
    expect(async () => {
      await Poem.create({
        id: "1a",
        title: "Poem 1",
        author: "Author 1",
        lineCount: 3,
        lines: ["Line 1", "Line 2", "Line 3"]
      });
    }).rejects.toThrow("Duplicate poem");
  });
});

describe("get", function () {
  test("Can retrieve a poem by id", async function () {
    let poem = await Poem.get("1a");
    expect(poem).toEqual({
      id: "1a",
      title: "Poem 1",
      author: "Author 1",
      lineCount: 3,
      lines: ["Line 1", "Line 2", "Line 3"]
    });
  });

  test("Throws NotFoundError for a non-existent poem", async function () {
    expect(async () => {
      await Poem.get("nonexistent");
    }).rejects.toThrow("No such poem");
  });
});

