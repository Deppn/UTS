const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUsersEmail(email) {
  return User.findOne({ email });
}

module.exports = {
  getUsersEmail,
};
