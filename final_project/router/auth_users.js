const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.filter(user => user.username === username).length > 0
}

const authenticatedUser = (username,password)=> { 
  return users.filter(user => user.username === username && user.password === password).length > 0 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
    if(authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {accessToken,username}
      return res.status(200).json({message: "Customer successfully logged in"});
    }
    else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  books[req.params.isbn].reviews[req.session.authorization.username]=req.query.review
  return res.status(200).json({message: `The review for the book with ISBN ${req.params.isbn} has been added/updated`});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let reviews =  {}
  const users = Object.keys(books[req.params.isbn].reviews)
  for(let i=0; i < users.length; i++) {
    if(users[i] != req.session.authorization.username) {
      reviews[users[i]]=  books[req.params.isbn].reviews[users[i]]
    }
  }
  books[req.params.isbn].reviews = reviews
  return res.status(200).json({message: `Reviews for the ISBN ${req.params.isbn} posted by the user ${req.session.authorization.username} has been deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
