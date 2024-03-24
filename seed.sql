INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES
    ('user1', 'password1', 'FirstName1', 'LastName1', 'user1@email.com', TRUE),
    ('user2', 'password2', 'FirstName2', 'LastName2', 'user2@email.com', FALSE),
    ('user3', 'password3', 'FirstName3', 'LastName3', 'user3@email.com', FALSE);

INSERT INTO poems (id, title, author, line_count, lines)
VALUES
    ('1a', 'Poem 1', 'Author 1', 3, ARRAY['Line 1', 'Line 2', 'Line 3']),
    ('2b', 'Poem 2', 'Author 2', 2, ARRAY['Line 1', 'Line 2']),
    ('3c', 'Poem 3', 'Author 3', 4, ARRAY['Line 1', 'Line 2', 'Line 3', 'Line 4']);

INSERT INTO themes (name)
VALUES
    ('Theme 1'),
    ('Theme 2'),
    ('Theme 3');

INSERT INTO tags (theme_name, poem_id, highlighted_lines, analysis, username)
VALUES
    ('Theme 1', '1a', ARRAY[1, 3], 'Analysis for Theme 1 in Poem 1', 'user1'),
    ('Theme 2', '2b', ARRAY[1, 2], 'Analysis for Theme 2 in Poem 2', 'user2'),
    ('Theme 3', '3c', ARRAY[3, 4], 'Analysis for Theme 3 in Poem 3', 'user2');

INSERT INTO comments (theme_name, poem_id, highlighted_lines, comment_text, username)
VALUES
    ('Theme 1', '1a', ARRAY[1, 3], 'Comment for Theme 1 in Poem 1', 'user2'),
    ('Theme 2', '2b', ARRAY[1, 2], 'Comment for Theme 2 in Poem 2', 'user2'),
    ('Theme 3', '3c', ARRAY[3, 4], 'Comment for Theme 3 in Poem 3', 'user1');
