// src/api/components/products/products-route.js
const express = require('express');
const productsController = require('./products-controller');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsValidator = require('./products-validator');

const router = express.Router();

module.exports = (app) => {
  app.use('/products', router);

  // Define product routes
  router.get('/', authenticationMiddleware, productsController.getProducts);
  router.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsController.createProduct
  );
  router.get('/:id', authenticationMiddleware, productsController.getProduct);
  router.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsController.updateProduct
  );
  router.delete(
    '/:id',
    authenticationMiddleware,
    productsController.deleteProduct
  );
};
