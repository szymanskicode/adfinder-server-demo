const mongoose = require('mongoose');

module.exports = function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
};
