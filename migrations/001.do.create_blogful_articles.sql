-- first migration
CREATE TABLE blogful_articles
(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL
);