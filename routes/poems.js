const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Poem = require("../models/poem");
const poemNewSchema = require("../schemas/poemNew.json");
const router = new express.Router();

/** POST / { poem } =>  { poem }
 * Poem should be { title, author, lineCount, lines }
 * Returns { id, title, author, lineCount, lines }
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, poemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const poem = await Poem.create(req.body);
    return res.status(201).json({ poem });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { poem }
 */

router.get("/:id", async function (req, res, next) {
  try {
    const poem = await Poem.get(req.params.id);
    return res.json({ poem });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
