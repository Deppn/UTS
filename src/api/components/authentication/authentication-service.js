const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_RESET_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

let loginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLogin(email, password) {
  const user = await authenticationRepository.getUsersEmail(email);
  const currentTime = new Date();
  if (
    loginAttempts[email] &&
    loginAttempts[email].count >= MAX_LOGIN_ATTEMPTS
  ) {
    const waktuLogin = currentTime - loginAttempts[email].lastAttempt;
    if (waktuLogin < LOGIN_ATTEMPT_RESET_TIME) {
      // mengembalikan error ketika melebihi limit
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again later.'
      );
    } else {
      // reset ketika sudah 30 mnt
      delete loginAttempts[email];
    }
  }

  // menambahkan percobaan login
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lastAttempt: null };
  }
  loginAttempts[email].count++;
  loginAttempts[email].lastAttempt = currentTime;

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    delete loginAttempts[email];
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}
/**
 * Get the number of login attempts for a given email.
 * @param {string} email - Email
 * @returns {number} Number of login attempts
 */
function getLoginAttempt(email) {
  return loginAttempts[email] ? loginAttempts[email].count : 0;
}

module.exports = {
  checkLogin,
  getLoginAttempt,
};
