CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    bio        TEXT,
    password   VARCHAR(255) NOT NULL,
    avatar_id  VARCHAR(36) UNIQUE,
    avatar_extension VARCHAR(5)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name ON users (first_name, last_name);

CREATE TABLE IF NOT EXISTS recipes
(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT         NOT NULL,
    image_id        VARCHAR(36) UNIQUE,
    image_extension VARCHAR(5),
    user_id         INT          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredients
(
    id          SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    recipe_id   INT  NOT NULL REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instructions
(
    id            SERIAL PRIMARY KEY,
    description   TEXT NOT NULL,
    display_order INT DEFAULT 1,
    recipe_id     INT  NOT NULL REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments
(
    id        SERIAL PRIMARY KEY,
    content   TEXT NOT NULL,
    user_id   INT  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipe_id INT  NOT NULL REFERENCES recipes (id) on DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes
(
    user_id   INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,

    PRIMARY KEY (user_id, recipe_id)
);