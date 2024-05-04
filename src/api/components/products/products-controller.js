const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getProducts(request, response, next) {
  try {
    const products = await productsService.getProducts();

    // merubah _id menjadi id dan menghilangkan __v
    const modifiedProducts = products.map((product) => {
      const { _id, __v, ...removeIdV } = product.toObject();
      return { id: _id, ...removeIdV };
    });

    return response.status(200).json(modifiedProducts);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // merubah _id menjadi id dan menghilangkan __v
    const { _id, __v, ...removeIdV } = product.toObject();
    const createdProduct = {
      id: _id,
      ...removeIdV,
    };

    return response.status(200).json(createdProduct);
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle create product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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
/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
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
/**
 * Handle delete product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;
    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Gagal menghapus produk'
      );
    }
    return response.status(204).json({ id: id });
  } catch (error) {
    return next(error);
  }
}
//author deppn
module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
