const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      id: joi.number().required().label('ID'),
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().required().label('Description'),
      price: joi.number().min(0).required().label('Price'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().required().label('Description'),
      price: joi.number().min(0).required().label('Price'),
    },
  },
};
