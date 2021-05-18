const validator = require('validator');

const validateHeaderURL = (headerURL) => {
  if (headerURL === '') {
    return undefined;
  } else if (!validator.isURL(headerURL)) {
    return 'Cloud storage problem occured (Invalid URL)';
  } else {
    return undefined;
  }
};

module.exports = validateHeaderURL;
