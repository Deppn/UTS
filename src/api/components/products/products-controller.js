// src/api/components/products/products-controller.js
const productsService = require('./products-service');

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
async function addToCart(request, response, next) {
  try {
    const { productId } = request.body;
    const userId = request.user.id; // Assuming you have user information in the request

    await productsService.addToCart(userId, productId);

    return response
      .status(200)
      .json({ message: 'Product added to cart successfully' });
  } catch (error) {
    return next(error);
  }
}

async function removeFromCart(request, response, next) {
  try {
    const { productId } = request.body;
    const userId = request.user.id; // Assuming you have user information in the request

    await productsService.removeFromCart(userId, productId);

    return response
      .status(200)
      .json({ message: 'Product removed from cart successfully' });
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
  addToCart,
  removeFromCart,
};
