// src/api/components/products/products-controller.js
const productsService = require('./products-service');

async function getProducts(request, response, next) {
  try {
    const products = await productsService.getProducts();
    return response.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);
    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(request, response, next) {
  try {
    const { id, name, description, price } = request.body;
    const product = await productsService.createProduct(
      parseInt(id),
      name,
      description,
      price
    );
    return response.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(request, response, next) {
  try {
    const { id } = request.params;
    const { name, description, price } = request.body;
    const product = await productsService.updateProduct(
      id,
      name,
      description,
      price
    );
    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(request, response, next) {
  try {
    const { id } = request.params;
    await productsService.deleteProduct(id);
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
