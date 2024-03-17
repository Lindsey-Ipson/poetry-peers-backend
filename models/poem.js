const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Poem {
  /** Create a poem (from data), update db, return new poem data.
   * Data should be { title, author, lineCount, lines }
   * Returns { id, title, author, lineCount, lines }
   * Throws BadRequestError if a poem with the same title and author already exists in the database.
   */
  static async create({ title, author, lineCount, lines }) {
    // Enhanced duplicate check for both title and author
    const duplicateCheck = await db.query(
      `SELECT id
       FROM poems
       WHERE title = $1 AND author = $2`,
      [title, author]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate poem: ${title} by ${author}`);

    const result = await db.query(
      `INSERT INTO poems (title, author, line_count, lines)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, author, line_count AS "lineCount", lines`,
      [title, author, lineCount, lines]
    );
    const poem = result.rows[0];

    return poem;
  }

  /** Given a poem id, return poem data.
   * Returns { id, title, author, lineCount, lines }
   * Throws NotFoundError if not found.
   */
  static async get(id) {
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

