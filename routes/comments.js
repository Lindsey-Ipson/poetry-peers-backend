const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const Comment = require("../models/comment");

const commentNewSchema = require("../schemas/commentNew.json");
const commentSearchSchema = require("../schemas/commentSearch.json");

const router = new express.Router();

/** POST / { comment } =>  { comment }
 * comment should be { themeName, poemId, highlightedLines, commentText, username }
 * Returns { theme_name, poem_id, highlighted_lines, commentText, username }
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const comment = await Comment.create(req.body);
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});

/** GET route to find comments by tag (tag has 3-part FK of themeName, poemId, highlightedLines)
 * GET /tag/:tagId =>
 * {comments: [  { comment_id, commentText, username, datetime }, ...] }
 */

router.get("/by-tag", async function (req, res, next) {
  try {
    // Extracting each part of the composite key from query parameters
    let { themeName, poemId, highlightedLines } = req.query;

    // Transform highlightedLines to an array
    highlightedLines = highlightedLines.split(",").map(Number);

    const validator = jsonschema.validate({ themeName, poemId, highlightedLines }, commentSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const comments = await Comment.findByTagId(themeName, poemId, highlightedLines);
    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

/** GET route to find comments by username
 * GET /by-user/:username =>
 * {comments: [ { theme_name, poem_id, highlighted_lines, analysis, username }, ...] }
 */

router.get("/by-user/:username", async function (req, res, next) {
  try {
    const username = req.params.username;
    const comments = await Comment.findByUsername(username);
    return res.json({ comments });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;