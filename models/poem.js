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

  /** Find all poems (optional filter on searchFilters).
   * searchFilters (all optional):
   * - title (will find case-insensitive, partial matches)
   * - author (will find case-insensitive, partial matches)
   * Returns [{ id, title, author, lineCount, lines }, ...]
   */
  static async findAll(searchFilters = {}) {
    let query = `SELECT id, title, author, line_count AS "lineCount", lines FROM poems`;
    let whereExpressions = [];
    let queryValues = [];

    const { title, author } = searchFilters;

    if (title !== undefined) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (author !== undefined) {
      queryValues.push(`%${author}%`);
      whereExpressions.push(`author ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY title";
    const poemsRes = await db.query(query, queryValues);
    return poemsRes.rows;
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


// const db = require("../db");
// const { BadRequestError, NotFoundError } = require("../expressError");

// class Poem {
//    /** Create a poem (from data), update db, return new poem data.
//   * Data should be { title, author, line_count, lines }
//   * Returns { id, title, author, line_count, lines }
//   * Throws BadRequestError if poem already in database.
//   * */

//   static async create ({ title, author, lineCount, lines }) {
//     const duplicateCheck = await db.query(
//           `SELECT title
//            FROM poems
//            WHERE title = $1`,
//         [title]);
  
//     if (duplicateCheck.rows[0])
//       throw new BadRequestError(`Duplicate poem: ${title}`);
  
//     const result = await db.query(
//           `INSERT INTO poems
//            (title, author, line_count, lines)
//            VALUES ($1, $2, $3, $4)
//            RETURNING title, author, line_count AS "lineCount", lines`,
//         [
//           title,
//           author,
//           lineCount,
//           lines,
//         ],
//     );
//     const poem = result.rows[0];
  
//     return poem;
//   }


//   /** Find all poems (optional filter on searchFilters).
//    * searchFilters (all optional):
//    * - title (will find case-insensitive, partial matches)
//    * - author (will find case-insensitive, partial matches)
//    * Returns [{ title, author, line_count, lines }, ...]
//    * */

//   static async findAll (searchFilters = {}) {
//     let query = `SELECT title,
//                         author,
//                         line_count AS "lineCount",
//                         lines
//                  FROM poems`;
//     let whereExpressions = [];
//     let queryValues = [];

//     const { title, author } = searchFilters;

//     // For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL

//     if (title !== undefined) {
//       queryValues.push(title);
//       whereExpressions.push(`title ILIKE $${queryValues.length}`);
//     }

//     if (author !== undefined) {
//       queryValues.push(author);
//       whereExpressions.push(`author ILIKE $${queryValues.length}`);
//     }

//     if (whereExpressions.length > 0) {
//       query += " WHERE " + whereExpressions.join(" AND ");
//     }

//     // Finalize query and return results

//     query += " ORDER BY title";
//     const poemsRes = await db.query(query, queryValues);
//     return poemsRes.rows;
//   }

//   /** Given a poem id, return poem data.
//    * Returns { title, author, line_count, lines }
//    * Throws NotFoundError if not found.
//    **/

//   static async get (id) {
//     const poemRes = await db.query(
//           `SELECT handle, title
//                   author,
//                   line_count AS "lineCount,
//                   lines
//            FROM poems
//            WHERE id = $1`,
//           [id]);

//     const poem = poemRes.rows[0];

//     if (!poem) throw new NotFoundError(`No such poem with id: ${id}`);

//     return poem;
//   }

// }

// module.exports = Poem;