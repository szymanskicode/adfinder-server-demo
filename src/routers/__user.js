const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const checkErrors = require('../utils/validators/checkErrors');
const validateUsername = require('../utils/validators/validateUsername');
const validateEmailUnique = require('../utils/validators/validateEmailUnique');
const validateEmail = require('../utils/validators/validateEmail');
const validatePassword = require('../utils/validators/validatePassword');
const validateRepeatPassword = require('../utils/validators/validateRepeatPassword');
const validateTermsAgree = require('../utils/validators/validateTermsAgree');

///////////////////////
///// CREATE USER /////
///////////////////////
router.post('/api/users', async (req, res) => {
  const { username, email, password, repeatPassword, termsAgree } = req.body;

  try {
    // Checking for errors
    const validationErrors = {};
    validationErrors.username = validateUsername(username);
    validationErrors.email = await validateEmailUnique(email);
    validationErrors.password = validatePassword(password);
    validationErrors.repeatPassword = validateRepeatPassword(
      password,
      repeatPassword
    );
    validationErrors.termsAgree = validateTermsAgree(termsAgree);

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send(validationErrors);
    }

    // Creating and saving user
    const time = Date.now();
    const user = new User({ ...req.body, createdAt: time, lastModified: time });

    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

//////////////////////
///// LOGIN USER /////
//////////////////////
router.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checking for errors
    const validationErrors = {};
    validationErrors.email = validateEmail(email);
    validationErrors.password = validatePassword(password);

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send(validationErrors);
    }

    // Finding user by credentials
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      validationErrors.invalidCredentials = 'Invalid credentials';
      return res.status(400).send(validationErrors);
    }

    // Generating token
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

/////////////////////////////
///// AUTHENTICATE USER /////
/////////////////////////////
router.post('/api/users/isauth', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

///////////////////////
///// LOGOUT USER /////
///////////////////////
router.post('/api/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ msg: 'User logged out' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

///////////////////////////
///// LOGOUT USER ALL /////
///////////////////////////
router.post('/api/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ msg: 'User logged out' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

//////////////////////////
///// READ USERS ALL /////
//////////////////////////
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

////////////////////////
///// READ USER ME /////
////////////////////////
router.get('/api/users/me', auth, async (req, res) => {
  res.send(req.user);
});

///////////////////////////
///// READ USER BY ID /////
///////////////////////////
router.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;

  // Validating if request data is valid ObjectId
  if (id.length != 12 && id.length != 24) {
    return res.status(404).send({ msg: 'Nothing was found' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ msg: 'Nothing was found' });
    }

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

////////////////////////
///// EDIT USER ME /////
////////////////////////
router.patch('/api/users/me', auth, async (req, res) => {
  const { username, email, password } = req.body;

  // Setting allowed updates
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    // Checking for errors
    const validationErrors = {};

    if (username !== undefined) {
      validationErrors.username = validateUsername(username);
    }

    if (email !== undefined) {
      validationErrors.email = await validateEmailUnique(email);
    }

    if (password !== undefined) {
      validationErrors.password = validatePassword(password);
    }

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send(validationErrors);
    }

    updates.forEach((update) => (req.user[update] = req.body[update]));

    const time = Date.now();
    req.user.lastModified = time;
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }

  // NOTATKA
  // W tym przypadku nie możemy użyć metody .findByIdAndUpdate(), ponieważ ta metoda wykonywana jest bezpośrednio na bazie danych i omija konieczność użycia metody .save() do której w tym przypadku w modelu użytkownika mamy podpiętą dodatkową metodę, która przed wykonaniem metody .save() wykonuje dodatkową metodę hashowania hasła.
  // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  // Opcja new:true pozwala w stałej user zwrócić użytkownika już po modyfikacji zamiast użytkownika, który został znaleziony przez metodę findByIdAndUpdate ma podstawie przekazanych parametrów.
});

//////////////////////////
///// DELETE USER ME /////
//////////////////////////
router.delete('/api/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

module.exports = router;
