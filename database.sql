CREATE DATABASE books_system;
USE books_system;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autores VARCHAR(255) NOT NULL,
    editora VARCHAR(255) NOT NULL,
    anopublicado date NOT NULL,
    genero VARCHAR(255),
    sinopse TEXT,
    estoque INT,
    preço FLOAT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE table IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) DEFAULT NULL
)