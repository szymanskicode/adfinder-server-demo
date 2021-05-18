const express = require('express');
const router = new express.Router();
const Log = require('../models/log');

//////////////////////
///// CREATE LOG /////
//////////////////////
router.post('/api/admin/log', async (req, res) => {
  try {
    let { type, scraper, msg, info } = req.body;
    scraper = 'FRONTEND';

    // Creating and saving log
    const log = new Log({
      type,
      scraper,
      msg,
      info,
      createdAt: Date.now(),
    });
    await log.save();
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

//////////////////////////
///// READ ALL LOGS /////
//////////////////////////
router.get('/api/admin/logs', async (req, res) => {
  try {
    const logs = await Log.find({});
    res.send(logs);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

module.exports = router;
