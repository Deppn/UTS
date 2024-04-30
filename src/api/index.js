// src/components/index.js
const express = require('express');

// Import your route handlers
const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const products = require('./components/products/products-route'); // Add this line

module.exports = () => {
  const app = express.Router();

  // Use your route handlers
  authentication(app);
  users(app);
  products(app); // Add this line

  return app;
};
