const db = require("../db");

// NOTE: Commenting functionality not yet implemented in the frontend application.

class Comment {
  /** Create a comment (from data), update db, return new comment data.
   * Data should be { themeName, poemId, highlightedLines, commentText, username }
   * Returns { comment_id, themeName, poemId, highlightedLines, commentText, username, datetime }
   */
  static async create ({ themeName, poemId, highlightedLines, commentText, username }) {
    const result = await db.query(
      `INSERT INTO comments (theme_name, 
                             poem_id, 
                             highlighted_lines,
                             comment_text,
                             username
                             )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING comment_id AS "commentId",
                 theme_name AS "themeName", 
                 poem_id AS "poemId", 
                 highlighted_lines AS "highlightedLines",
                 comment_text AS "commentText", 
                 username,
                 datetime`,
      [themeName, poemId, highlightedLines, commentText, username]
    );
    const comment = result.rows[0];

    return comment;
  }

  /** Find comments by tag (tag's PK consists of theme_name, poem_id, highlighted_lines).
   * Returns an array of comments associated with the tag.
   */
  static async findByTagId (themeName, poemId, highlightedLines) {
    const result = await db.query(
      `SELECT comment_id AS "commentId",
              comment_text AS "commentText", 
              username, 
              datetime
       FROM comments
       WHERE theme_name = $1 AND
             poem_id = $2 AND
             highlighted_lines = $3`,
      [themeName, poemId, highlightedLines]
    );

    return result.rows;
  }

  /** Find comments by username.
   * Returns an array of comments created by the username.
   */
  static async findByUsername (username) {
    const result = await db.query(
      `SELECT comment_id AS "commentId",
              theme_name AS "themeName",
              poem_id AS "poemId",
              comment_text AS "commentText",  
              datetime
       FROM comments
       WHERE username = $1`,
      [username]
    );

    return result.rows;
  }
}

module.exports = Comment;