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
const assignFirmToAgent = require('../utils/assignFirmToAgent');

///////////////////////
///// CREATE USER /////
///////////////////////
router.post('/api/users', async (req, res) => {
  const { username, phone, email, password, repeatPassword } = req.body;

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

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send({ validationErrors });
    }

    // Creating and saving user / start.
    const time = Date.now();
    const user = new User({ ...req.body, createdAt: time, lastModified: time });

    // If AccountOwner creates user assign parent value, and Agent role
    const { parentId, parentRole } = req.body;
    if (parentRole === 'AccountOwner') {
      user.parent = parentId.toString();
      user.role = 'Agent';
    }
    // end.

    await user.save();

    // const token = await user.generateAuthToken();

    res.status(201).send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
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
    // validationErrors.password = validatePassword(password);

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send({ validationErrors });
    }

    // Finding user by credentials
    let user = await User.findByCredentials(req.body.email, req.body.password);

    if (!user) {
      validationErrors.error = 'E-mail i/lub hasło są nieprawidłowe.';
      return res.status(400).send({ validationErrors });
    }

    // Generating token
    const token = await user.generateAuthToken();

    // Assign firm to user with Agent role
    if (user.role === 'Agent') {
      const parent = await User.findOne({ _id: user.parent });

      if (!parent) {
        throw new Error();
      }

      user = await assignFirmToAgent(user, parent);
    }

    // Check account expiration date
    if (user.accountExpires < Date.now()) {
      validationErrors.error =
        'Konto straciło ważność. Skontaktuj się z obsługą serwisu.';
      return res.status(400).send({ validationErrors });
    }

    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

/////////////////////////////
///// AUTHENTICATE USER /////
/////////////////////////////
router.post('/api/users/isauth', auth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

///////////////////////
///// LOGOUT USER /////
///////////////////////
router.post('/api/users/logout', auth, async (req, res) => {
  try {
    // Nie możemy wziąć usera z req.body ponieważ ma od przypisane dane firmowe, które zostałyby  do niego przypisane, dlatego wyszukujemy tego samego usera na nowo z bazy.
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new Error();
    }

    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();
    res.status(200).send({ msg: 'User logged out' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

///////////////////////////
///// LOGOUT USER ALL /////
///////////////////////////
router.post('/api/users/logoutAll', auth, async (req, res) => {
  try {
    // Komentarz jak wyżej.
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new Error();
    }

    user.tokens = [];
    await user.save();
    res.send({ msg: 'User logged out' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

////////////////////////
///// EDIT USER ME /////
////////////////////////
router.patch('/api/users/me', auth, async (req, res) => {
  const { username, phone, email, password, repeatPassword } = req.body;
  // Setting allowed updates
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'username',
    'phone',
    'email',
    'password',
    'repeatPassword',
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: 'Nie można zaktualizować tych danych.' });
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

    if (repeatPassword !== undefined) {
      validationErrors.repeatPassword = validateRepeatPassword(
        password,
        repeatPassword
      );
    }

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send({ validationErrors });
    }

    // Finding user from database without assigned firm detiles and set updates
    const user = await User.findById({ _id: req.user._id });

    updates.forEach((update) => (user[update] = req.body[update]));

    const time = Date.now();
    user.lastModified = time;

    // Safe updated user
    await user.save();

    // Assign firm detiles to updated user
    const modifiedUser = await assignFirmToAgent(user);

    res.send({ user: modifiedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }

  // NOTATKA
  // W tym przypadku nie możemy użyć metody .findByIdAndUpdate(), ponieważ ta metoda wykonywana jest bezpośrednio na bazie danych i omija konieczność użycia metody .save() do której w tym przypadku w modelu użytkownika mamy podpiętą dodatkową metodę, która przed wykonaniem metody .save() wykonuje dodatkową metodę hashowania hasła.
  // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  // Opcja new:true pozwala w stałej user zwrócić użytkownika już po modyfikacji zamiast użytkownika, który został znaleziony przez metodę findByIdAndUpdate ma podstawie przekazanych parametrów.
});

//////////////////////
///// EDIT AGENT /////
//////////////////////
router.patch('/api/agent', auth, async (req, res) => {
  const {
    username,
    phone,
    email,
    password,
    repeatPassword,
    parentId,
    agentId,
  } = req.body;

  // Setting allowed updates
  const updates = Object.keys(req.body);

  // Removing  agentId from updates list

  let index = updates.indexOf('agentId');
  if (index > -1) {
    updates.splice(index, 1);
  }

  const allowedUpdates = [
    'username',
    'phone',
    'email',
    'password',
    'repeatPassword',
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send({ error: 'Nie można zaktualizować tych danych.' });
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

    if (repeatPassword !== undefined) {
      validationErrors.repeatPassword = validateRepeatPassword(
        password,
        repeatPassword
      );
    }

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send({ validationErrors });
    }

    // Finding user from database without assigned firm detiles and set updates
    const user = await User.findById({ _id: agentId });

    if (!user) {
      throw new Error('No user was found!');
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    const time = Date.now();
    user.lastModified = time;

    // Safe updated user
    await user.save();

    // Assign firm detiles to updated user
    const modifiedUser = await assignFirmToAgent(user);

    res.send({ user: modifiedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

////////////////////////
///// DELETE AGENT /////
////////////////////////
router.delete('/api/agents', auth, async (req, res) => {
  const { agentId } = req.body;

  try {
    const user = await User.findById({ _id: agentId });

    if (!user) {
      throw Error;
    }

    await user.remove();
    res.send({ user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

////////////////////////////
///// EDIT USER BADGES /////
////////////////////////////
router.patch('/api/users/badge', auth, async (req, res) => {
  const { adId, badgeName } = req.body;

  try {
    // Finding user from database without assigned firm detiles and set updates
    const user = await User.findById({ _id: req.user._id });

    if (!user) {
      throw new Error();
    }

    // Add badge
    if (!user.badges.includes(badgeName + adId)) {
      user.badges.push(badgeName + adId);
      if (badgeName !== 'watched' && !user.badges.includes('watched' + adId)) {
        user.badges.push('watched' + adId);
      }
    }
    // Remove badge
    else {
      let updatedBadges;
      if (
        badgeName === 'watched' &&
        user.badges.filter((str) => str.includes(adId)).length > 1
      ) {
        updatedBadges = user.badges;
      } else {
        updatedBadges = user.badges.filter(
          (value) => value !== badgeName + adId
        );
      }
      user.badges = updatedBadges;
    }

    const time = Date.now();
    user.lastModified = time;

    // Safe updated user
    await user.save();

    // Assign firm detiles to updated user
    const modifiedUser = await assignFirmToAgent(user);

    res.send({ user: modifiedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

////////////////////////////
///// READ AGENTS LIST /////
////////////////////////////
router.get('/api/agents', auth, async (req, res) => {
  try {
    // Setting main Id depending on user role
    let mainId;
    if (req.user.role === 'Agent') {
      mainId = req.user.parent;
    } else {
      mainId = req.user._id.toString();
    }

    const users = await User.find({
      $or: [{ _id: mainId }, { parent: mainId }],
    });

    res.send({ users });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//////////////////////////
///// READ USERS ALL /////
//////////////////////////
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
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
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
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
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

module.exports = router;
