const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Comment {
  /** Create a comment (from data), update db, return new comment data.
   * Data should be { themeName, poemId, highlightedLines, username, commentText }
   * Returns { comment_id, themeName, poemId, highlightedLines, username, commentText, datetime }
   */
  static async create({ themeName, poemId, highlightedLines, username, commentText }) {
    const result = await db.query(
      `INSERT INTO comments (theme_name, 
                             poem_id, 
                             highlighted_lines,
                             username,
                             comment_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING comment_id,
                 theme_name AS "themeName", 
                 poem_id AS "poemId", 
                 highlighted_lines AS "highlightedLines",
                 username,
                 comment_text AS "commentText", 
                 datetime`,
      [themeName, poemId, highlightedLines, username, commentText]
    );
    const comment = result.rows[0];

    return comment;
  }

  /** Find comments by tag (tag's PK consists of theme_name, poem_id, highlighted_lines).
   * Returns an array of comments associated with the tag.
   */
  static async findByTag(themeName, poemId, highlightedLines) {
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
  static async findByUsername(username) {
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


// const db = require("../db");
// const { BadRequestError, NotFoundError } = require("../expressError");

// class Comment {
//   /** Create a comment (from data), update db, return new tag data.
//    * Data should be { theme_name, poem_id, highlighted_lines, username, comment_text }
//    * Returns { comment_id, theme_name, poem_id, highlighted_lines, username, comment_text, datetime }
//    * */

//   static async create ({ themeName, poemId, highlightedLines, username, commentText }) {

//     const result = await db.query(
//           `INSERT INTO comments (theme_name, 
//                                 poem_id, 
//                                 highlighted_lines,
//                                 username,
//                                 comment_text)
//           VALUES ($1, $2, $3, $4, $5)
//           RETURNING (comment_id,
//                     theme_name AS "themeName", 
//                     poem_id AS "poemId", 
//                     highlighted_lines AS "highlightedLines",
//                     username,
//                     comment_text AS "commentText", 
//                     datetime)`,
//           [themeName, 
//           poemId, 
//           highlightedLines, 
//           username,
//           commentText,
//           ],
//     );
//     const comment = result.rows[0];

//     return comment;
//   }

//   /** Find comments by tag (tag's PK consists of theme_name, poem_id, highlighted_lines).
//    * Returns an array of comments associated with the tag.
//    */

//   static async findByTag (themeName, poemId, highlightedLines) {
//     const result = await db.query(
//       `SELECT comment_id AS "commentId",
//               comment_text AS "commentText, 
//               username, 
//               datetime
//       FROM comments
//       WHERE theme_name = $1,
//             poem_id = $2,
//             highlighted_lines = $3`,
//       [themeName, poemId, highlightedLines]
//     );

//     return result.rows;
//   }

//   /** Find comments by username.
//    * Returns an array of comments created by the username.
//    */

//   static async findByUsername (username) {
//     const result = await db.query(
//       `SELECT comment_id AS "commentId",
//               theme_name AS "themeName",
//               poem_id AS "poemId",
//               comment_text AS "commentText,  
//               datetime
//       FROM comments
//       WHERE username = $1`,
//       [username]
//     );

//     return result.rows;
//   }
// }

// module.exports = Comment;