const express = require('express');

const productsController = require('./products-controller');
const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  //get list of products
  route.get('/', authenticationMiddleware, productsController.getProducts);

  //post product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsController.createProduct
  );

  //get product by id
  route.get('/:id', authenticationMiddleware, productsController.getProduct);

  //update product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsController.updateProduct
  );

  //delete product
  route.delete(
    '/:id',
    authenticationMiddleware,
    productsController.deleteProduct
  );
};
