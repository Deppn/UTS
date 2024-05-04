const productsService = require('./products-service');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function getProducts(request, response, next) {
  try {
    const products = await productsService.getProducts();

    // Modify each product in the array to use id instead of _id and remove __v field
    const modifiedProducts = products.map((product) => {
      const { _id, __v, ...removeIdV } = product.toObject();
      return { id: _id, ...removeIdV };
    });

    return response.status(200).json(modifiedProducts);
  } catch (error) {
    return next(error);
  }
}

async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    // Modify the response object to use id instead of _id and remove __v field
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
// products-controller.js
async function masukKeranjang(request, response, next) {
  try {
    const { productId } = request.body;
    const userId = request.user.id; // Assuming you have user information in the request

    await productsService.masukKeranjang(userId, productId);

    return response
      .status(200)
      .json({ message: 'Produk berhasil dimasukan ke keranjang' });
  } catch (error) {
    return next(error);
  }
}

async function hapusKeranjang(request, response, next) {
  try {
    const { productId } = request.body;
    const userId = request.user.id; // Assuming you have user information in the request

    await productsService.hapusKeranjang(userId, productId);

    return response
      .status(200)
      .json({ message: 'Produk telah di hapus dari keranjang' });
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
  masukKeranjang,
  hapusKeranjang,
};
