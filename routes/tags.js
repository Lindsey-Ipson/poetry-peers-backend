const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const Tag = require("../models/tag");

const tagNewSchema = require("../schemas/tagNew.json");

const router = new express.Router();

/** POST / { tag } =>  { tag }
 * tag should be { themeName, poemId, highlightedLines, analysis, username }
 * Returns { theme_name, poem_id, highlighted_lines, analysis, username }
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tagNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const tag = await Tag.create(req.body);
    return res.status(201).json({ tag });
  } catch (err) {
    return next(err);
  }
});

/** GET route to find tags by poemId
 * GET /by-poem/:poemId =>
 * {tags: [ { theme_name, poem_id, highlighted_lines, analysis, username }, ...] }
 */

router.get("/by-poem/:poemId", async function (req, res, next) {
  try {
    const poemId = req.params.poemId;
    const tags = await Tag.findByPoemId(poemId);
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

/** GET route to find tags by username
 * GET /by-user/:username =>
 * {tags: [ { theme_name, poem_id, highlighted_lines, analysis, username }, ...] }
 */

router.get("/by-user/:username", async function (req, res, next) {
  try {
    const username = req.params.username;
    const tags = await Tag.findByUsername(username);
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

router.get("/by-theme/:themeName", async function (req, res, next) {
  try {
    const themeName = req.params.themeName;
    const tags = await Tag.findByThemeName(themeName);
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;