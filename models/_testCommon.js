const db = require("../db.js");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll () {
  // Clean up existing data
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM tags");
  await db.query("DELETE FROM themes");
  await db.query("DELETE FROM poems");
  await db.query("DELETE FROM users");

  // Insert test data for users with hashed passwords
  const hashedPasswords = await Promise.all([
    bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
  ]);

  // Insert test data for users with hashed passwords
  await db.query(`
  INSERT INTO users (username, password, first_name, last_name, email, is_admin)
  VALUES 
    ('user1', $1, 'FirstName1', 'LastName1', 'user1@email.com', TRUE),
    ('user2', $2, 'FirstName2', 'LastName2', 'user2@email.com', FALSE),
    ('user3', $3, 'FirstName3', 'LastName3', 'user3@email.com', FALSE);
  `, hashedPasswords);

  // Insert test data for poems
  await db.query(`
    INSERT INTO poems (id, title, author, line_count, lines)
    VALUES
      ('1a', 'Poem 1', 'Author 1', 3, ARRAY['Line 1', 'Line 2', 'Line 3']),
      ('2b', 'Poem 2', 'Author 2', 2, ARRAY['Line 1', 'Line 2']),
      ('3c', 'Poem 3', 'Author 3', 4, ARRAY['Line 1', 'Line 2', 'Line 3', 'Line 4'])
  `);

  // Insert test data for themes
  await db.query(`
    INSERT INTO themes (name)
    VALUES 
      ('Theme 1'),
      ('Theme 2'),
      ('Theme 3')
  `);

  // Insert test data for tags
  await db.query(`
    INSERT INTO tags (theme_name, poem_id, highlighted_lines, analysis, username)
    VALUES
      ('Theme 1', '1a', ARRAY[1, 3], 'Analysis for Theme 1 in Poem 1', 'user1'),
      ('Theme 2', '2b', ARRAY[1, 2], 'Analysis for Theme 2 in Poem 2', 'user2'),
      ('Theme 3', '3c', ARRAY[3, 4], 'Analysis for Theme 3 in Poem 3', 'user2')
  `);

  // Insert test data for comments
  await db.query(`
    INSERT INTO comments (theme_name, poem_id, highlighted_lines, comment_text, username)
    VALUES
      ('Theme 1', '1a', ARRAY[1, 3], 'This is a comment for Theme 1 in Poem 1', 'user2'),
      ('Theme 2', '2b', ARRAY[1, 2], 'This is a comment for Theme 2 in Poem 2', 'user2'),
      ('Theme 3', '3c', ARRAY[3, 4], 'This is a comment for Theme 3 in Poem 3', 'user1')
  `);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
