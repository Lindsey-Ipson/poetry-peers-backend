const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Poem {

  /** Create a poem (from data), update db, return new poem data.
   * Data should be { id, title, author, lineCount, lines }
   * Returns { id, title, author, lineCount, lines }
   * Throws BadRequestError if a poem with the same id (title and author hash) already exists in the database.
   */

  static async create ({ id, title, author, lineCount, lines }) {

    const duplicateCheck = await db.query(
      `SELECT title, author
       FROM poems
       WHERE id = $1`,
      [id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate poem: ${title} by ${author}`);

    const result = await db.query(
      `INSERT INTO poems (id, title, author, line_count, lines)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, author, line_count AS "lineCount", lines`,
      [id, title, author, lineCount, lines]
    );
    const poem = result.rows[0];

    return poem;
  }

  /** Given a poem id, return poem data.
   * Returns { id, title, author, lineCount, lines }
   * Throws NotFoundError if not found.
   */

  static async get (id) {
    const poemRes = await db.query(
      `SELECT id, title, author, line_count AS "lineCount", lines
       FROM poems
       WHERE id = $1`,
      [id]
    );

    const poem = poemRes.rows[0];

    if (!poem) throw new NotFoundError(`No such poem with id: ${id}`);

    return poem;
  }
}

module.exports = Poem;

