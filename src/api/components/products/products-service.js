// src/api/components/products/products-service.js
const { Product } = require('../../../models');

async function getProducts() {
  return Product.find({});
}

async function getProduct(id) {
  return Product.findById(id);
}

async function createProduct(id, name, description, price) {
  const product = await Product.create({
    _id: id,
    name,
    description,
    price,
  });

  // Rename _id to id and remove __v in the response
  const { _id, __v, ...removeIdV } = product.toObject(); // Convert Mongoose document to plain JavaScript object
  const createdProduct = { id: _id, ...removeIdV };

  return createdProduct;
}

async function updateProduct(id, name, description, price) {
  return Product.findAndUpdate(id, {
    name,
    description,
    price,
  });
}

async function deleteProduct(id) {
  return Product.findAndDelete(id);
}
// products-service.js
async function addToCart(userId, productId) {
  // Implement logic to add product to user's cart
}

async function removeFromCart(userId, productId) {
  // Implement logic to remove product from user's cart
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
