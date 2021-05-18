const express = require('express');
const router = new express.Router();
const Post = require('../models/post');
const auth = require('../middleware/auth');
const checkErrors = require('../utils/validators/checkErrors');
const validateTitle = require('../utils/validators/validateTitle');

///////////////////////
///// CREATE POST /////
///////////////////////
router.post('/api/posts', auth, async (req, res) => {
  const { title } = req.body;

  try {
    // Checking for errors
    const validationErrors = {};
    validationErrors.title = validateTitle(title);

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send(validationErrors);
    }

    // Creating and saving post
    const time = Date.now();
    const post = new Post({
      ...req.body,
      createdAt: time,
      lastModified: time,
      owner: req.user._id,
    });

    await post.save();
    res.status(201).send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

//////////////////////////
///// READ ALL POSTS /////
//////////////////////////
router.get('/api/posts', async (req, res) => {
  // Getting and sending posts array
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

/////////////////////////////
///// READ ALL MY POSTS /////
/////////////////////////////
router.get('/api/posts/me', auth, async (req, res) => {
  // Getting and sending posts array
  try {
    // @desc This works too
    // const posts = await Post.find({ owner: req.user._id });
    // res.send(posts);

    await req.user.populate('posts').execPopulate();
    res.send(req.user.posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

///////////////////////////
///// READ POST BY ID /////
///////////////////////////
router.get('/api/posts/:id', async (req, res) => {
  const id = req.params.id;

  // Validating if request data is valid ObjectId
  if (id.length != 12 && id.length != 24) {
    return res.status(404).send({ msg: 'Nothing was found' });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ msg: 'Nothing was found' });
    }

    // Line below returns full details about post owner
    // await post.populate('owner').execPopulate();

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

//////////////////////////////
///// EDIT MY POST BY ID /////
//////////////////////////////
router.patch('/api/posts/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;

  // Validating if request data is valid ObjectId
  if (id.length != 12 && id.length != 24) {
    return res.status(404).send({ msg: 'Nothing was found' });
  }

  // Setting allowed updates
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const post = await Post.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!post) {
      return res.status(404).send({ msg: 'Nothing was found' });
    }

    // Checking for errors
    const validationErrors = {};

    if (title !== undefined) {
      validationErrors.title = validateTitle(title);
    }

    // Ending validation
    if (!checkErrors(validationErrors)) {
      return res.status(400).send(validationErrors);
    }

    updates.forEach((update) => (post[update] = req.body[update]));

    const time = Date.now();
    post.lastModified = time;
    await post.save();
    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

////////////////////////////////
///// DELETE MY POST BY ID /////
////////////////////////////////
router.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!post) {
      return res.status(404).send({ msg: 'Nothing was found' });
    }

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong...' });
  }
});

module.exports = router;
