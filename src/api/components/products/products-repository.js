// src/api/components/products/products-repository.js
const { Product } = require('../../../models');

/**
 * Get all products
 * @returns {Promise<Array>} Array of products
 */
async function getAllProducts() {
  return Product.find({});
}

/**
 * Get a product by its ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
async function getProductById(id) {
  return Product.findById(id);
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
async function createProduct(productData) {
  return Product.create(productData);
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} updatedData - Updated product data
 * @returns {Promise<Object|null>} Updated product or null if not found
 */
async function updateProduct(id, updatedData) {
  return Product.findByIdAndUpdate(id, updatedData, { new: true });
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} true if deletion successful, false otherwise
 */
async function deleteProduct(id) {
  const result = await Product.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
