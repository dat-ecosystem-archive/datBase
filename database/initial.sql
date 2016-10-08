DROP DATABASE IF EXISTS datland;
CREATE DATABASE datland;

\c datland;

CREATE TABLE users (
    id serial PRIMARY KEY,
    nickname varchar NOT NULL,
    password varchar NOT NULL,
    email varchar NOT NULL
);

CREATE TABLE dat (
    id serial PRIMARY KEY,
    user_id serial references users(id) NOT NULL,
    name varchar NOT NULL,
    hash varchar NOT NULL,
    title varchar,
    description text,
    keywords text[]
);
