const RE_ad = require('../models/re_ad');

module.exports = async function saveAd(obj) {
  try {
    const ad = new RE_ad(obj);
    await ad.save();
    console.log('New ad added!');
  } catch (err) {
    console.log('Saving ad error in saveAd.js / ' + err);
  }
};
