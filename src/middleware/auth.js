const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const assignFirmToAgent = require('../utils/assignFirmToAgent');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    // Assign firm to user with Agent role
    if (user.role === 'Agent') {
      user = await assignFirmToAgent(user);
    }

    // Check account expiration date
    if (user.accountExpires < Date.now()) {
      req.user = null;
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    res.status(401).send({ error: 'Musisz być zalogowany.' });
  }
};

module.exports = auth;
