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

  // merubah _id menjadi id dan menghilangkan __v
  const { _id, __v, ...removeIdV } = product.toObject();
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
    { new: true } // return product yang baru
  );

  if (!updatedProduct) {
    // kalau tidak ada id yg ditemukan
    throw new Error('Produk tidak ditemukan');
  }

  // merubah _id menjadi id dan menghilangkan __v
  const { _id, __v, ...removeIdV } = updatedProduct.toObject();
  const updatedProducts = { id: _id, ...removeIdV };

  // menambahkan text kalau produk sudah diupdate
  updatedProducts.text = 'Produk telah diupdate';

  return updatedProducts;
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
