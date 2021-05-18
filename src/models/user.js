const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const Post = require('./post');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  // parent._id
  parent: {
    type: String,
    default: '000000000000000000000000',
  },
  // Guest, Agent, AccountOwner, Super!Admin
  role: {
    type: String,
    required: true,
    default: 'Guest',
  },
  firmName: {
    type: String,
  },
  firmStreet: {
    type: String,
  },
  firmStreetNumber: {
    type: String,
  },
  firmCity: {
    type: String,
  },
  firmPostalCode: {
    type: String,
  },
  firmNIP: {
    type: String,
  },
  firmEmail: {
    type: String,
  },
  firmPhone: {
    type: String,
  },
  // Abonament
  accountType: {
    type: String,
  },
  accountExpires: {
    type: Number,
  },
  badges: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  lastModified: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// userSchema.virtual('posts', {
//   ref: 'Post',
//   localField: '_id',
//   foreignField: 'owner',
// });

// Methodes are accessable on Instances of model - methods need to use regular function, not arrow function.
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// On models using .statics we can provide our own custom methodes.
// Static methodes are accessable on Models
userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  } catch {
    throw new Error('Unable to login');
  }
};

// Thanks to Schema we can provide a middleware which can run before or after specific method will take place.
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  if (user.email) {
    user.email = user.email.toLowerCase();
  }

  next();
});

// Delete user posts when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  // await Post.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
