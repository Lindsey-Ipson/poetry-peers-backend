INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES
    ('user1', 'password1', 'John', 'Doe', 'john.doe@example.com', TRUE),
    ('user2', 'password2', 'Jane', 'Smith', 'jane.smith@example.com', FALSE),
    ('user3', 'password3', 'Jacob', 'Smith', 'jacob.smith@example.com', FALSE);

INSERT INTO poems (title, author, line_count, lines)
VALUES
    ('Poem 1', 'Author 1', 3, ARRAY['Line 1', 'Line 2', 'Line 3']),
    ('Poem 2', 'Author 2', 2, ARRAY['Line 1', 'Line 2']),
    ('Poem 3', 'Author 3', 4, ARRAY['Line 1', 'Line 2', 'Line 3', 'Line 4']);

INSERT INTO themes (name)
VALUES
    ('Theme 1'),
    ('Theme 2'),
    ('Theme 3');

INSERT INTO tags (theme_name, poem_id, highlighted_lines, explanation)
VALUES
    ('Theme 1', 1, ARRAY[1, 3], 'Explanation for Theme 1 in Poem 1'),
    ('Theme 2', 2, ARRAY[1, 2], 'Explanation for Theme 2 in Poem 2'),
    ('Theme 3', 3, ARRAY[3, 4], 'Explanation for Theme 3 in Poem 3');

INSERT INTO comments (theme_name, poem_id, comment_text)
VALUES
    ('Theme 1', 1, 'This is a comment for Theme 1 in Poem 1'),
    ('Theme 2', 2, 'This is a comment for Theme 2 in Poem 2'),
    ('Theme 3', 3, 'This is a comment for Theme 3 in Poem 3');
