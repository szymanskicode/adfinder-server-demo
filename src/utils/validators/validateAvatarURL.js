const validator = require('validator');

const validateAvatarURL = (avatarURL) => {
  if (avatarURL === '') {
    return undefined;
  } else if (!validator.isURL(avatarURL)) {
    return 'Cloud storage problem occured (Invalid URL)';
  } else {
    return undefined;
  }
};

module.exports = validateAvatarURL;
