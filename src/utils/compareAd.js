const RE_ad = require('../models/re_ad');
// Checks if ad is already in database
module.exports = async function compareAd(obj) {
  try {
    const compare = await RE_ad.findOne({
      id: obj.id,
      date: obj.date,
    });

    if (compare) {
      return true;
    } else return false;
  } catch (err) {
    console.log('Comparing ads error in compareAd.js / ' + err);
  }
};
