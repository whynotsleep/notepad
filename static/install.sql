CREATE TABLE IF NOT EXISTS category(
    cate_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    label TEXT,
    create_date DATETIME,
    update_date DATETIME
);

CREATE TABLE IF NOT EXISTS article(
    article_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    cate_id INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    create_date DATETIME,
    update_date DATETIME,
    is_top INTEGER
);