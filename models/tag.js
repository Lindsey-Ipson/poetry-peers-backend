const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Tag {
  /** Create a tag (from data), update db, return new tag data.
   * Data should be { theme_name, poem_id, highlighted_lines, analysis }
   * Returns { theme_name, poem_id, highlighted_lines, analysis }
   * Throws BadRequestError if tag already in database with same exact combination of theme_name, poem_id, and highlighted_lines.
   * */

  static async create({ themeName, poemId, highlightedLines, analysis }) {
    const duplicateCheck = await db.query(
          `SELECT theme_name,
                  poem_id
                  highlighted_lines
           FROM tags
           WHERE theme_name = $1,
                  poem_id = $2,
                  highlighted_lines = $3`,
        [themeName, poemId, highlightedLines]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate tag: ${themeName, poemId, highlightedLines}`);

    const result = await db.query(
          `INSERT INTO tags (theme_name, 
                            poem_id, 
                            highlighted_lines, 
                            analysis)
          VALUES ($1, $2, $3, $4)
          RETURNING theme_name AS "themeName", 
                    poem_id AS "poemId", 
                    highlighted_lines AS "highlightedLines",
                    analysis, 
                    datetime`,
          [themeName, 
          poemId, 
          highlightedLines, 
          analysis
          ],
    );
    const tag = result.rows[0];

    return tag;
  }

  /** Find tags by poemId.
   * Returns an array of tags associated with the poemId.
   */
  static async findByPoemId(poemId) {
    const result = await db.query(
      `SELECT theme_name AS "themeName",
              poem_id AS "poemId",
              highlighted_lines AS "highlightedLines",
              analysis,
              username,
              datetime
       FROM tags
       WHERE poem_id = $1`,
      [poemId]
    );

    return result.rows;
  }

  /** Find tags by username.
   * Returns an array of tags created by the username.
   */
  static async findByUsername(username) {
    const result = await db.query(
      `SELECT theme_name AS "themeName",
              poem_id AS "poemId",
              highlighted_lines AS "highlightedLines",
              analysis,
              username,
              datetime
       FROM tags
       WHERE username = $1`,
      [username]
    );

    return result.rows;
  }
}

module.exports = Tag;