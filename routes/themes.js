const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const Theme = require("../models/theme");

const themeNewSchema = require("../schemas/themeNew.json");

const router = new express.Router();

/** POST / { theme } =>  { theme }
 * theme should be { name }
 * Returns { name }
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, themeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const theme = await Theme.create(req.body);
    return res.status(201).json({ theme });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { themes: [ { name }, ...] }
 * Can provide search filter in query for name (will find case-insensitive, partial matches)
 */

router.get("/", async function (req, res, next) {
  const searchTerm = req.query;

  try {
    const themes = await Theme.findAll(searchTerm);
    return res.json({ themes });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;