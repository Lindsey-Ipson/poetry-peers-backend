const db = require("../db.js");
const Tag = require("../models/tag");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Tag", () => {

  describe("create", () => {
    test("Can create a new tag", async () => {
      let newTag = await Tag.create({
        themeName: "Theme 1",
        poemId: "1a",
        highlightedLines: [1, 2],
        analysis: "Test Analysis",
        username: "user1"
      });
      expect(newTag).toEqual(expect.objectContaining({
        themeName: "Theme 1",
        poemId: "1a",
        highlightedLines: [1, 2],
        analysis: "Test Analysis",
        username: "user1"
      }));

      const found = await db.query("SELECT * FROM tags WHERE poem_id = '1a' AND theme_name = 'Theme 1' AND highlighted_lines = ARRAY[1,2]");
      expect(found.rows.length).toEqual(1);
    });

    test("Throws BadRequestError on duplicate tag creation", async () => {
      await expect(Tag.create({
        themeName: "Theme 1",
        poemId: "1a",
        highlightedLines: [1, 3],
        analysis: "Test Analysis",
        username: "user1"
      })).rejects.toThrow("Duplicate tag");
    });
  });

  describe("findByPoemId", () => {
    test("Finds tags by poemId", async () => {
      const tags = await Tag.findByPoemId("1a");
      expect(tags).toEqual(expect.arrayContaining([
        expect.objectContaining({ poemId: "1a" })
      ]));
    });

    test("Returns empty array if no tags found for given poemId", async () => {
      const tags = await Tag.findByPoemId("nonexistent");
      expect(tags).toEqual([]);
    });
  });

  describe("findByUsername", () => {
    test("Finds tags created by username", async () => {
      const tags = await Tag.findByUsername("user2");
      expect(Array.isArray(tags)).toBeTruthy();
      expect(tags.length).toBe(2);
      tags.forEach(tag => {
        expect(tag).toEqual(expect.objectContaining({ username: "user2" }));
      });
    });

    test("Returns empty array if no tags found for given username", async () => {
      const tags = await Tag.findByUsername("nonexistent");
      expect(tags).toEqual([]);
    });
  });

  describe("findByThemeName", () => {
    test("Finds tags for a given themeName", async () => {
      const tags = await Tag.findByThemeName("Theme 1");
      expect(Array.isArray(tags)).toBeTruthy();
      expect(tags).toHaveLength(1);
      tags.forEach(tag => {
        expect(tag).toEqual(expect.objectContaining({ themeName: "Theme 1" }));
      });
    });

    test("Returns empty array if no tags found for given themeName", async () => {
      const tags = await Tag.findByThemeName("nonexistent");
      expect(tags).toEqual([]);
    });
  });

  describe("remove", () => {
    test("Successfully deletes a tag", async () => {
      await Tag.remove({ themeName: "Theme 1", poemId: "1a", highlightedLines: [1, 3] });
      const res = await db.query(
        "SELECT * FROM tags WHERE poem_id = '1a' AND theme_name = 'Theme 1' AND highlighted_lines = ARRAY[1,3]"
      );
      expect(res.rows.length).toEqual(0);
    });

    test("Throws NotFoundError if tag does not exist", async () => {
      await expect(Tag.remove({ themeName: "nonexistent", poemId: "1a", highlightedLines: [1, 3] }))
        .rejects.toThrow("No such tag");
    });
  });

});
