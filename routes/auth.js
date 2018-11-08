'use strict';

// Module dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Project dependencies
const User = require('../models/user');

// Route '/auth/me' - returns the current user
router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({
      error: 'not-found'
    });
  }
});

// Route '/auth/login' - handles the login process
router.post('/login', (req, res, next) => {
  // Protection: if user is already logged in
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  // Protection: if email or password are empty
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: 'validation'
    });
  }

  // Check if user has logged in correctly
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: 'user-not-found'
        });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      }
      return res.status(404).json({
        error: 'wrong-password'
      });
    })
    .catch(next);
});

// Route '/auth/signup' - handles the signup process
router.post('/signup', (req, res, next) => {
  const { email, password } = req.body;

  // Protection: if email or password are empty
  if (!email || !password) {
    return res.status(422).json({
      error: 'empty'
    });
  }

  // Check that nobody in the database has already signed up with the given email
  User.findOne({ email }, 'email')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'email-not-unique'
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = User({ email, password: hashPass });

      return newUser.save().then(() => {
        req.session.currentUser = newUser;
        res.json(newUser);
      });
    })
    .catch(next);
});

// Route '/auth/login' - handles the logout process
router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

// Para proteger consultas privadas
// const { isLoggedIn } = require('../helpers/middlewares');
// router.get('/private', isLoggedIn(), (req, res, next) => {
//   res.status(200).json({
//     message: 'This is a private message'
//   });
// });

module.exports = router;
