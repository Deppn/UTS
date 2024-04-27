const joi = require('joi');

module.exports = {
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
