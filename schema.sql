CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password VARCHAR(25) NOT NULL,
  first_name VARCHAR(200) NOT NULL,
  last_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE poems (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author VARCHAR(200) NOT NULL,
  line_count INTEGER NOT NULL,
  lines TEXT[] NOT NULL
);

CREATE TABLE themes (
  name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE tags (
  theme_name VARCHAR(100) REFERENCES themes ON DELETE CASCADE,
  poem_id INTEGER REFERENCES poems ON DELETE CASCADE,
  highlighted_lines INTEGER[],
  PRIMARY KEY (theme_name, poem_id, highlighted_lines),
  analysis TEXT,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    theme_name VARCHAR(100) NOT NULL,
    poem_id INTEGER NOT NULL,
    highlighted_lines INTEGER[],
    FOREIGN KEY (theme_name, poem_id, highlighted_lines) REFERENCES tags(theme_name, poem_id, highlighted_lines) ON DELETE CASCADE,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE example_table (
    foreign_key1 INTEGER,
    foreign_key2 INTEGER,
    foreign_key3 INTEGER,
    PRIMARY KEY (foreign_key1, foreign_key2, foreign_key3),
    FOREIGN KEY (foreign_key1) REFERENCES table1(primary_key),
    FOREIGN KEY (foreign_key2) REFERENCES table2(primary_key),
    FOREIGN KEY (foreign_key3) REFERENCES table3(primary_key)
);
