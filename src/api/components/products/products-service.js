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
  const { _id, __v, ...productWithoutIdAndV } = product.toObject(); // Convert Mongoose document to plain JavaScript object
  const productWithRenamedIdAndRemovedV = { id: _id, ...productWithoutIdAndV };

  return productWithRenamedIdAndRemovedV;
}

async function updateProduct(id, name, description, price) {
  return Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
  });
}

async function deleteProduct(id) {
  return Product.findByIdAndDelete(id);
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
