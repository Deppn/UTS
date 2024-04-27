const joi = require('joi');

module.exports = {
  getUsers: {
    query: {
      page_number: joi.number().integer().min(1).label('Page Number'),
      page_size: joi.number().integer().min(1).label('Page Size'),
      sort: joi
        .string()
        .pattern(/^(name|email):(asc|desc)$/)
        .label('Sort'),
      search: joi.string().allow('').label('Search'),
    },
  },

  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(8).max(30).required().label('Password'),
      password_confirm: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      old_password: joi.string().min(8).max(30).required(),
      new_password: joi.string().min(8).max(30).required(), // contoh: password harus memiliki panjang minimal 8 karakter dan maksimal 30 karakter
      confirm_new_password: joi.string().min(8).max(30).required(),
    },
  },
};
