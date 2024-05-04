const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle change user's password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function changePassword(request, response, next) {
  try {
    const userId = request.params.id;
    const old_password = request.body.old_password;
    const new_password = request.body.new_password;
    const passwordConfirm = request.body.confirm_new_password; // Menggunakan request.body.password_confirm

    // Check if password_confirm is provided
    if (!passwordConfirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation is required'
      );
    }

    // Check if password and password_confirm match
    if (new_password !== passwordConfirm) {
      // Menggunakan old_password untuk membandingkan dengan passwordConfirm
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and confirmation do not match'
      );
    }

    await usersService.changePassword(userId, old_password, new_password);
    return response.status(200).json({ message: 'Password berhasil diubah' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;

    // Check if email already exists
    const emailExists = await usersService.checkEmailExists(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    // Check if password_confirm is provided
    const passwordConfirm = request.body.password_confirm;
    if (!passwordConfirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation is required'
      );
    }

    // Check if password and password_confirm match
    if (password !== passwordConfirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and confirmation do not match'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Check if email already exists
    const emailExists = await usersService.checkEmailExists(email);
    if (emailExists) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }
    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    //menggunakan query
    const pageNumber = request.query.page_number
      ? parseInt(request.query.page_number) //ubah menjadi int
      : 1; //default
    const pageSize = request.query.page_size
      ? parseInt(request.query.page_size)
      : 0; //default
    const search = request.query.search || '';
    const sort = request.query.sort || '';

    const result = await usersService.getUsers(
      pageNumber,
      pageSize,
      search,
      sort
    );
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  changePassword,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
