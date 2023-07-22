const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    let user = {
        username: username,
        password: password
    }
    if(isValid(username)) {
        users.push(user)
        return res.json({message: "Customer successfully registred. Now you can login"});
    }
    else {
        return res.status(404).json({message: "Customer already exists!"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let response=[]
    let isbn = Object.keys(books)
    for(let i=0; i<isbn.length; i++) {
        if(books[isbn[i]]["author"]===req.params.author) {
            response.push(books[isbn[i]])
        }
    }
    return res.status(200).json({booksbyauthor: response});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let response=[]
    let isbn = Object.keys(books)
    for(let i=0; i<isbn.length; i++) {
        if(books[isbn[i]]["title"]===req.params.title) {
            response.push(books[isbn[i]])
        }
    }
    return res.status(200).json({booksbytitle: response});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
