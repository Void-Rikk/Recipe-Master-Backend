CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    bio        TEXT,
    password   VARCHAR(255) NOT NULL,
    avatar_id  VARCHAR(36) UNIQUE
);

CREATE UNIQUE INDEX idx_users_name ON users(first_name, last_name);

CREATE TABLE recipes
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT         NOT NULL,
    image_id    VARCHAR(36) UNIQUE,
    user_id     INT          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients
(
    id          SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    recipe_id   INT  NOT NULL REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE instructions
(
    id            SERIAL PRIMARY KEY,
    description   TEXT NOT NULL,
    display_order INT DEFAULT 1,
    recipe_id     INT  NOT NULL REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    id        SERIAL PRIMARY KEY,
    content   TEXT NOT NULL,
    user_id   INT  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipe_id INT  NOT NULL REFERENCES recipes (id) on DELETE CASCADE
);

CREATE TABLE likes
(
    user_id   INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,

    PRIMARY KEY (user_id, recipe_id)
);