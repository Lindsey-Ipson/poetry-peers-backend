const db = require("../db.js");
const User = require("../models/user");
const Poem = require("../models/poem");
const Tag = require("../models/tag");
const Theme = require("../models/theme");
const Comment = require("../models/comment");
const { createToken } = require("../helpers/token");

async function commonBeforeAll() {
  // Clean up existing data
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM tags");
  await db.query("DELETE FROM themes");
  await db.query("DELETE FROM poems");
  await db.query("DELETE FROM users");

  // Add users
  await User.register({
    username: 'user1',
    password: 'password1',
    firstName: 'FirstName1',
    lastName: 'LastName1',
    email: 'user1@email.com',
    isAdmin: true
  });
  await User.register({
    username: 'user2',
    password: 'password2',
    firstName: 'FirstName2',
    lastName: 'LastName2',
    email: 'user2@email.com',
    isAdmin: false
  });
  await User.register({
    username: 'user3',
    password: 'password3',
    firstName: 'FirstName3',
    lastName: 'LastName3',
    email: 'user3@email.com',
    isAdmin: false
  });

  // Add poems
  await Poem.create({
    id: '1a',
    title: 'Poem 1',
    author: 'Author 1',
    lineCount: 3,
    lines: ['Line 1', 'Line 2', 'Line 3']
  });
  await Poem.create({
    id: '2b',
    title: 'Poem 2',
    author: 'Author 2',
    lineCount: 2,
    lines: ['Line 1', 'Line 2']
  });
  await Poem.create({
    id: '3c',
    title: 'Poem 3',
    author: 'Author 3',
    lineCount: 4,
    lines: ['Line 1', 'Line 2', 'Line 3', 'Line 4']
  });
  await Poem.create({
    id: '4d',
    title: 'Poem 4',
    author: 'Author 3',
    lineCount: 4,
    lines: ['Line 1', 'Line 2', 'Line 3', 'Line 4']
  });    

  // Add themes
  await Theme.create({ name: 'Theme 1' });
  await Theme.create({ name: 'Theme 2' });
  await Theme.create({ name: 'Theme 3' });
  await Theme.create({ name: 'Theme 4' });

  // Add tags
  await Tag.create({
    themeName: 'Theme 1',
    poemId: '1a',
    highlightedLines: [1, 3],
    analysis: 'Analysis for Theme 1 in Poem 1',
    username: 'user1'
  });
  await Tag.create({
    themeName: 'Theme 2',
    poemId: '2b',
    highlightedLines: [1, 2],
    analysis: 'Analysis for Theme 2 in Poem 2',
    username: 'user2'
  });
  await Tag.create({
    themeName: 'Theme 3',
    poemId: '3c',
    highlightedLines: [3, 4],
    analysis: 'Analysis for Theme 3 in Poem 3',
    username: 'user2'
  });

  // Add comments
  await Comment.create({
    themeName: 'Theme 1',
    poemId: '1a',
    highlightedLines: [1, 3],
    commentText: 'Comment for Theme 1 in Poem 1',
    username: 'user2'
  });
  await Comment.create({
    themeName: 'Theme 2',
    poemId: '2b',
    highlightedLines: [1, 2],
    commentText: 'Comment for Theme 2 in Poem 2',
    username: 'user2'
  });
  await Comment.create({
    themeName: 'Theme 3',
    poemId: '3c',
    highlightedLines: [3, 4],
    commentText: 'Comment for Theme 3 in Poem 3',
    username: 'user1'
  });
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

// Create tokens for test users
const u1Token = createToken({ username: "user1", isAdmin: true });
const u2Token = createToken({ username: "user2", isAdmin: false });
const u3Token = createToken({ username: "user3", isAdmin: false });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};