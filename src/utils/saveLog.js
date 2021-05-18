const Log = require('../models/log');

module.exports = async function saveLog(props) {
  const { type, scraper, msg, info } = props;
  try {
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
    console.log('Saving log error in saveLog.js / ' + err);
  }
};
