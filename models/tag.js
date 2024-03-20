const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Tag {
  /** Create a tag (from data), update db, return new tag data.
   * Data should be { theme_name, poem_id, highlighted_lines, analysis, username }
   * Returns { theme_name, poem_id, highlighted_lines, analysis, username }
   * Throws BadRequestError if tag already in database with same exact combination of theme_name, poem_id, and highlighted_lines.
   * */

  static async create({ themeName, poemId, highlightedLines, analysis, username }) {
    const duplicateCheck = await db.query(
          `SELECT theme_name,
                  poem_id,
                  highlighted_lines
           FROM tags
           WHERE theme_name = $1 AND
                  poem_id = $2 AND
                  highlighted_lines = $3`,
        [themeName, poemId, highlightedLines]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate tag: ${themeName, poemId, highlightedLines}`);

    const result = await db.query(
          `INSERT INTO tags (theme_name, 
                            poem_id, 
                            highlighted_lines, 
                            analysis,
                            username)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING theme_name AS "themeName", 
                    poem_id AS "poemId", 
                    highlighted_lines AS "highlightedLines",
                    analysis, 
                    username,
                    datetime`,
          [themeName, 
          poemId, 
          highlightedLines, 
          analysis,
          username
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


  /** Get all tags for a given theme id.
   * Returns [{ theme_name, poem_id, highlighted_lines, analysis, username, datetime }, ...]
   * Case sensitive.
   */
  static async findByThemeName(themeName) {
    const result = await db.query(
      `SELECT theme_name AS "themeName",
              poem_id AS "poemId",
              highlighted_lines AS "highlightedLines",
              analysis,
              username,
              datetime
      FROM tags
      WHERE theme_name = $1
      ORDER BY datetime DESC`,
      [themeName]
    );

    return result.rows;
  }

    /** Delete tag from database; returns message. */

    static async remove ({ themeName, poemId, highlightedLines }) {
      let result = await db.query(
            `DELETE
             FROM tags
             WHERE theme_name = $1 AND poem_id = $2 AND highlighted_lines = $3
             RETURNING theme_name AS "themeName", poem_id AS "poemId", highlighted_lines AS "highlightedLines"`,
          [themeName, poemId, highlightedLines],
      );

      const deletedTag = result.rows[0];
  
      if (!deletedTag) throw new NotFoundError(`No such tag: ${themeName}, ${poemId}, ${highlightedLines}`);

      return deletedTag;
    }

}

module.exports = Tag;