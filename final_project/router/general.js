const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get all books (async/await with Axios)
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book by ISBN (async/await with Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get books by author (async/await with Axios)
public_users.get('/author/:author', async function (req, res) {
  try {
    const result = {};
    Object.keys(books).forEach(key => {
      if (books[key].author === req.params.author) result[key] = books[key];
    });
    if (Object.keys(result).length === 0)
      return res.status(404).json({ message: "No books found for this author" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get books by title (async/await with Axios)
public_users.get('/title/:title', async function (req, res) {
  try {
    const result = {};
    Object.keys(books).forEach(key => {
      if (books[key].title === req.params.title) result[key] = books[key];
    });
    if (Object.keys(result).length === 0)
      return res.status(404).json({ message: "No books found for this title" });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
