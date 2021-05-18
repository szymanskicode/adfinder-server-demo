const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const router = new express.Router();
const auth = require('../middleware/auth.js');
const Cart = require('../models/cart');
const validateCartData = require('../utils/validators/validateCartData');
const isValidObjectId = require('../utils/validators/isValidObjectId');

///////////////////////////
///// CREATE NEW CART /////
///////////////////////////

router.post('/api/carts', auth, async (req, res) => {
  // Entries
  // title (required, from req.body)
  // description (optional, from req.body)
  // owner (required, from auth)
  // parent (required, from owner)
  // createdAt (auto)
  // updatedAt (auto)

  try {
    // Checking for errors
    const validation = {};
    validation.title = await validateCartData(
      'title',
      req.body.title,
      req.user._id
    );
    validation.description = await validateCartData(
      'description',
      req.body.description
    );

    // Ending validation
    if (
      Object.keys(validation).filter((key) => Boolean(validation[key]))
        .length !== 0
    ) {
      return res.status(400).send({ validation });
    }

    // Preparing data
    const title = req.body.title;
    const description = req.body.description;
    const owner = req.user._id;
    let parent;
    if (req.user.role === 'Agent') {
      parent = req.user.parent;
    } else {
      parent = req.user._id;
    }

    // Creating and saving cart
    const cart = new Cart({
      title,
      description,
      owner,
      parent,
    });

    // Saving new cart
    await cart.save();
    res.status(201).send({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server error.' + err });
  }
});

///////////////////////
///// UPDATE CART /////
///////////////////////

router.patch('/api/carts', auth, async (req, res) => {
  // Entries
  // title (required, from req.body)
  // description (optional, from req.body)
  // cartId {required, from req.query}

  try {
    // Validating Id's
    if (!req.query.cartId || !isValidObjectId(req.query.cartId)) {
      return res.status(401).send({ error: 'Invalid Id.' });
    }

    // Setting allowed updates
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(402).send({ error: 'Invalid updates.' });
    }

    // Checking for errors
    const validation = {};
    if (Object.keys(req.body).includes('title')) {
      validation.title = validateCartData('title', req.body.title);
    }
    if (Object.keys(req.body).includes('description')) {
      validation.description = validateCartData(
        'description',
        req.body.description
      );
    }

    // Ending validation
    if (
      Object.keys(validation).filter((key) => Boolean(validation[key]))
        .length !== 0
    ) {
      return res.status(403).send({ validation });
    }

    // Finding cart
    const cart = await Cart.findOne({
      _id: ObjectId(req.query.cartId),
    });

    if (!cart) {
      return res.status(404).send({ error: 'Cart was not found.' });
    }

    // Updating cart
    updates.forEach((update) => (cart[update] = req.body[update]));

    // Saving updated cart
    await cart.save();
    res.send({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server error.' });
  }
});

///////////////////////////////////
///// ADD/REMOVE CART CONTENT /////
///////////////////////////////////

router.patch('/api/cart', auth, async (req, res) => {
  // Entries
  // adId (required, from req.body)
  // cartId (required, from req.query)

  try {
    // Validating Id's
    if (
      !req.body.adId ||
      !isValidObjectId(req.body.adId) ||
      !req.query.cartId ||
      !isValidObjectId(req.query.cartId)
    ) {
      return res.status(400).send({ error: 'Invalid Id.' });
    }

    // Finding cart
    const cart = await Cart.findOne({
      _id: ObjectId(req.query.cartId),
    });

    if (!cart) {
      return res.status(404).send({ error: 'Cart was not found.' });
    }

    if (cart.ads.includes(req.body.adId)) {
      const newArr = cart.ads.filter((ad) => ad !== req.body.adId);
      cart.ads = newArr;
    } else {
      cart.ads.push(req.body.adId);
    }

    // Saving updated cart
    await cart.save();
    res.send({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server error.' });
  }
});

/////////////////////
///// GET CARTS /////
/////////////////////

router.get('/api/carts', auth, async (req, res) => {
  // Entries
  // userId (required, from auth)

  try {
    // Finding carts
    const carts = await Cart.find({
      owner: ObjectId(req.user._id),
    });

    if (!carts) {
      return res.status(404).send({ error: 'Nothing was found.' });
    }

    res.send({ carts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server error.' });
  }
});

///////////////////////
///// DELETE CART /////
///////////////////////

router.delete('/api/carts', auth, async (req, res) => {
  // Entries
  // cartId (required, from req.query)

  try {
    // Validating Id's
    if (!req.query.cartId || !isValidObjectId(req.query.cartId)) {
      return res.status(400).send({ error: 'Invalid Id.' });
    }

    // Finding cart
    const cart = await Cart.findOneAndDelete({
      _id: ObjectId(req.query.cartId),
      owner: ObjectId(req.user._id),
    });

    if (!cart) {
      return res.status(404).send({ error: 'Cart was not found.' });
    }

    res.send({ cart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
