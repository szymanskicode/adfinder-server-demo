const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Number,
  },
  lastModified: {
    type: Number,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
