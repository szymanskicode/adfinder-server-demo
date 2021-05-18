const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: {
    // success, warning, danger, info
    type: String,
    default: '',
  },
  scraper: {
    // re_olx, re_otodom, re_gumtree, etc...
    type: String,
    default: '',
  },
  msg: {
    type: String,
    default: '',
  },
  info: {
    // Place log was created
    type: String,
    default: '',
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
