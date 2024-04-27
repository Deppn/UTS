const { User } = require('../../../models');
const { hashPassword } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(pageNumber, pageSize, search, sort) {
  // Default values
  pageNumber = pageNumber ? parseInt(pageNumber) : 1;
  pageSize = pageSize ? parseInt(pageSize) : 0;

  pageNumber = Math.max(1, pageNumber);
  pageSize = Math.max(1, pageSize);

  const filter = {};
  if (search) {
    filter.email = { $regex: search, $options: 'i' };
  }

  let sortField = 'email';
  let sortOrder = 1;
  if (sort) {
    const [field, order] = sort.split(':');
    if (field === 'name' || field === 'email') {
      sortField = field;
    }
    if (order === 'desc') {
      sortOrder = -1;
    }
  }

  const skip = (pageNumber - 1) * pageSize;

  const users = await User.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(pageSize);

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / pageSize);

  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: totalUsers,
    total_pages: totalPages,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await User.findById(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await User.findById(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          name,
          email,
        },
      }
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await User.findById(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await User.deleteOne({ _id: id });
  } catch (err) {
    return null;
  }

  return true;
}

async function checkEmailExists(email) {
  const user = await User.findOne({ email });
  return !!user;
}

async function changePassword(userId, old_password, new_password) {
  const passwordCek = await validatePassword(userId, old_password);
  if (!passwordCek) {
    throw errorResponder(errorTypes.INVALID_PASSWORD, 'Old password salah');
  }
  const hashedPassword = await hashPassword(new_password);

  await updatePassword(userId, hashedPassword);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkEmailExists,
  changePassword,
};
