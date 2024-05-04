// src/api/components/products/products-service.js
const { Product } = require('../../../models');
const { User } = require('../../../models');

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
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    {
      name,
      description,
      price,
    },
    { new: true } // To return the updated document instead of the old one
  );

  if (!updatedProduct) {
    // Handle case where product with the given id is not found
    throw new Error('Product not found');
  }

  // Rename _id to id and remove __v in the response
  const { _id, __v, ...removeIdV } = updatedProduct.toObject();
  const updatedProductWithoutIdAndV = { id: _id, ...removeIdV };

  // Add text indicating product has been updated
  updatedProductWithoutIdAndV.text = 'Product has been updated';

  return updatedProductWithoutIdAndV;
}

async function deleteProduct(id) {
  const product = await Product.findById(id);
  if (!product) {
    return null;
  }

  try {
    await Product.deleteOne({ _id: id });
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
