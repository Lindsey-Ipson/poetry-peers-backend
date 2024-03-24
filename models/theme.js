const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError"); // Ensure BadRequestError is imported
const { capitalizeWords } = require("../helpers/capitalizeWords");

class Theme {
  /** Create a theme (from data), capitalizing the first letter of each word, update db, return new theme data.
   * data should be { name }
   * Returns { name }
   **/
  static async create ({name}) {
    name = capitalizeWords(name);

    const duplicateCheck = await db.query(
      `SELECT name
       FROM themes
       WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate theme: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO themes (name)
       VALUES ($1)
       RETURNING name`,
      [name]
    );
    let theme = result.rows[0];

    return theme;
  }

  /** Find all themes (optional filter on searchFilters).
   * searchFilters (optional):
   * - name
   * Returns [{ name }, ...]
   **/
  static async findAll ({ name } = {}) {
    let query = `SELECT name FROM themes`;
    let whereExpressions = [];
    let queryValues = [];

    if (name !== undefined) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY name"; 

    const themesRes = await db.query(query, queryValues);
    return themesRes.rows;
  }
}

module.exports = Theme;
