// src/api/components/products/products-route.js
const express = require('express');
const productsController = require('./products-controller');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Define product routes
  route.get('/', authenticationMiddleware, productsController.getProducts);
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsController.createProduct
  );
  route.get('/:id', authenticationMiddleware, productsController.getProduct);
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsController.updateProduct
  );
  route.delete(
    '/:id',
    authenticationMiddleware,
    productsController.deleteProduct
  );
  // products-route.js
  route.post(
    '/:purchase/add-to-cart',
    authenticationMiddleware,
    celebrate(productsValidator.addToCart),
    productsController.addToCart
  );

  route.delete(
    '/:purchase/remove-from-cart',
    authenticationMiddleware,
    celebrate(productsValidator.removeFromCart),
    productsController.removeFromCart
  );
};
