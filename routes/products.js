'use strict';

// Module dependencies
const express = require('express');
const router = express.Router();

// Project dependencies
/// Helpers
const { isLoggedIn } = require('../helpers/middlewares');
/// Models
const Products = require('../models/product');

// Route '/products/get' - gets the products in the database
router.get('/get', isLoggedIn(), (req, res, next) => {
  Products.find()
    .then(products => {
      if (!products) {
        return res.status(404).json({
          error: 'products-not-found'
        });
      }
      return res.status(200).json(products);
    })
    .catch(next);
});

// Route '/products/search' - gets the products in the database
router.get('/search', isLoggedIn(), (req, res, next) => {
  const searchValue = req.query.name;
  console.log(searchValue);
  Products.find({ 'name': { $regex: `^${searchValue}.*$`, $options: 'i' } })
    .then(products => {
      if (!products) {
        return res.status(404).json({
          error: 'products-not-found'
        });
      }
      return res.status(200).json(products);
    })
    .catch(next);
});

// Export
module.exports = router;
