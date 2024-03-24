const db = require("../db");
const Theme = require("../models/theme");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  test("Can create a new theme with already upper-cased words", async function () {
    let newTheme = await Theme.create({ name: "New Theme" });
    expect(newTheme).toEqual({ name: "New Theme" });

    const found = await db.query("SELECT * FROM themes WHERE name = 'New Theme'");
    expect(found.rows.length).toEqual(1);
  });

  test("Can create a new theme with lower-cased words transformed into upper-cased words", async function () {
    let newTheme = await Theme.create({ name: "new theme" });
    expect(newTheme).toEqual({ name: "New Theme" });

    const found = await db.query("SELECT * FROM themes WHERE name = 'New Theme'");
    expect(found.rows.length).toEqual(1);
  });

  test("Throws BadRequestError on duplicate theme creation", async function () {
    await expect(Theme.create({ name: "Theme 1" }))
      .rejects.toThrow("Duplicate theme");
  });
});

describe("findAll", function () {
  test("Finds all themes without filter", async function () {
    const themes = await Theme.findAll({});
    expect(themes).toEqual(expect.arrayContaining([
      { name: "Theme 1" },
      { name: "Theme 2" },
      { name: "Theme 3" }
    ]));
  });

  test("Finds themes with a name filter", async function () {
    await Theme.create({ name: "Filtered Theme" });
    const themes = await Theme.findAll({ name: "Filtered" });
    expect(themes).toEqual(expect.arrayContaining([
      { name: "Filtered Theme" }
    ]));
    expect(themes.length).toEqual(1);
  });

  test("Returns empty array if no themes match filter", async function () {
    const themes = await Theme.findAll({ name: "Nonexistent" });
    expect(themes).toEqual([]);
  });

});
