const User = require('../../models/user');
const validator = require('validator');

const validateEmailUnique = async (email) => {
  if (!email) {
    return 'E-mail jest wymagany.';
  }

  email = email.trim().toLowerCase();
  if (!email) {
    return 'E-mail jest wymagany.';
  } else if (!validator.isEmail(email)) {
    return 'E-mail jest nieprawidłowy.';
  } else if (email.length > 100) {
    return 'E-mail nie może być dłuższy niż 100 znaków.';
  } else if (await User.findOne({ email })) {
    return 'E-mail jest już zajęty.';
  } else return undefined;
};

module.exports = validateEmailUnique;
