'use strict';

// Module dependencies
const express = require('express');
const router = express.Router();

// Project dependencies
/// Helpers
const { isLoggedIn } = require('../helpers/middlewares');

/// Models
const Box = require('../models/box');

// Route '/box/get' - creates a box in the database
router.get('/get', isLoggedIn(), (req, res, next) => {
  const owner = req.session.currentUser._id;
  Box.findOne({ owner })
    .then(box => {
      console.log(box);
      res.status(200).json(box);
    })
    .catch(error => {
      next(error);
    });
});

// Route '/box/create' - creates a box in the database
router.post('/create', isLoggedIn(), (req, res, next) => {
  const { price, size, maxQuantity, products, owner } = req.body;
  const box = Box({ price, size, maxQuantity, products, owner });
  return box.save()
    .then((box) => {
      res.status(200).json(box);
    })
    .catch(next);
});

// Route '/box/edit' - creates a box in the database
router.put('/edit', isLoggedIn(), (req, res, next) => {
  const { price, size, maxQuantity } = req.body;
  const userId = req.session.currentUser._id;

  Box.findOneAndUpdate({ owner: userId }, { price, size, maxQuantity })
    .then(() => {
      res.status(200).json({ 'message': 'updated' });
    })
    .catch(next);
});

// Export
module.exports = router;
