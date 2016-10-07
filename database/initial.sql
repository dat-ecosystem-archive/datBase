DROP DATABASE IF EXISTS datland;
CREATE DATABASE datland;

\c datland;

CREATE TABLE user (
    id serial PRIMARY KEY,
    nickname varchar NOT NULL,
    password varchar NOT NULL,
    email varchar NOT NULL
);

CREATE TABLE dat (
    id serial PRIMARY KEY,
    user varchar references users(user) NOT NULL,
    name varchar NOT NULL,
    hash varchar NOT NULL,
    title varchar,
    description text,
    keywords text[]
);
