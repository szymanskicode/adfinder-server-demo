const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const ObjectID = require('mongodb').ObjectID;
const RE_ad = require('../models/re_ad');

//////////////////////
///// SEARCH ADS /////
//////////////////////
router.get('/api/re_ads', auth, async (req, res) => {
  // Initialize search object
  let search = {};

  // Initialize skip and limit value
  let skip = 0; // default
  let limit = 5; // default

  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (req.query.page) {
    skip = (parseInt(req.query.page) - 1) * limit;
  }

  // Initialize sort object
  let sort = { date: -1 }; // default

  try {
    // GET SINGLE AD
    if (req.query.singlead) {
      let { adId } = req.query;
      if (!ObjectID.isValid(adId)) {
        return res.status(400).send({ error: 'Invalid adId' });
      }
      search = { ...search, _id: adId };
    }

    // HISTORY ADS QUERY
    if (req.query.historyads) {
      const { historyid, historydate } = req.query;
      search = { ...search, id: historyid, date: { $ne: historydate } };
    }

    // OTHER ADS QUERY
    if (req.query.otherads) {
      const { otherid, otherphone } = req.query;
      search = { ...search, phone: otherphone, _id: { $ne: otherid } };
    }

    // GET ASSIGNED ADS
    if (req.query.assignedAds) {
      const assignedAdsArr = req.user.assignedAds;
      search = { ...search, _id: { $in: assignedAdsArr } };
    }

    // SEARCH FORM QUERY

    // @state
    if (req.query.state) {
      const arr = [req.query.state];
      req.query.searchall && arr.push('', null);
      search = { ...search, state: { $in: arr } };
    }

    // @city
    if (req.query.city) {
      search = {
        ...search,
        citySearch: { $regex: req.query.city, $options: 'i' },
      };
    }

    // @transaction
    if (req.query.transaction) {
      const arr = [req.query.transaction];
      req.query.searchall && arr.push('', null);
      search = { ...search, transaction: { $in: arr } };
    }

    // @category
    if (req.query.category) {
      const arr = [req.query.category];
      req.query.searchall && arr.push('', null);
      search = { ...search, category: { $in: arr } };
    }

    // @subcategory
    if (req.query.subcategory) {
      const arr = [req.query.subcategory];
      req.query.searchall && arr.push('', null);
      search = { ...search, subcategory: { $in: arr } };
    }

    // @rooms
    if (req.query.rooms) {
      const arr = [req.query.rooms];
      req.query.searchall && arr.push('', null);
      search = { ...search, rooms: { $in: arr } };
    }

    // @price
    if (req.query.pricefrom || req.query.priceto) {
      if (!req.query.priceto) {
        const price1 = parseInt(req.query.pricefrom);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { price: { $gte: price1 } },
              { price: null },
              { price: 0 },
              { price: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            price: { $gte: price1 },
          };
        }
      } else if (!req.query.pricefrom) {
        const price2 = parseInt(req.query.priceto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { price: { $lte: price2 } },
              { price: null },
              { price: 0 },
              { price: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            price: { $lte: price2 },
          };
        }
      } else {
        const price1 = parseInt(req.query.pricefrom);
        const price2 = parseInt(req.query.priceto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { price: { $gte: price1, $lte: price2 } },
              { price: null },
              { price: 0 },
              { price: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            price: { $gte: price1, $lte: price2 },
          };
        }
      }
    }

    // @surface
    if (req.query.surfacefrom || req.query.surfaceto) {
      if (!req.query.surfaceto) {
        const surface1 = parseInt(req.query.surfacefrom);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { surface: { $gte: surface1 } },
              { surface: null },
              { surface: 0 },
              { surface: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            surface: { $gte: surface1 },
          };
        }
      } else if (!req.query.surfacefrom) {
        const surface2 = parseInt(req.query.surfaceto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { surface: { $lte: surface2 } },
              { surface: null },
              { surface: 0 },
              { surface: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            surface: { $lte: surface2 },
          };
        }
      } else {
        const surface1 = parseInt(req.query.surfacefrom);
        const surface2 = parseInt(req.query.surfaceto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { surface: { $gte: surface1, $lte: surface2 } },
              { surface: null },
              { surface: 0 },
              { surface: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            surface: { $gte: surface1, $lte: surface2 },
          };
        }
      }
    }

    // @date
    if (req.query.datefrom || req.query.dateto) {
      if (!req.query.dateto) {
        const date1 = parseInt(req.query.datefrom);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { date: { $gte: date1 } },
              { date: null },
              { date: 0 },
              { date: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            date: { $gte: date1 },
          };
        }
      } else if (!req.query.datefrom) {
        const date2 = parseInt(req.query.dateto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { date: { $lte: date2 } },
              { date: null },
              { date: 0 },
              { date: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            date: { $lte: date2 },
          };
        }
      } else {
        const date1 = parseInt(req.query.datefrom);
        const date2 = parseInt(req.query.dateto);
        if (req.query.searchall) {
          let andArr = [];
          if (search.$and) {
            andArr = [...search.$and];
          }

          const orObj = {
            $or: [
              { date: { $gte: date1, $lte: date2 } },
              { date: null },
              { date: 0 },
              { date: { $exists: false } },
            ],
          };

          andArr = [...andArr, orObj];

          search = {
            ...search,
            $and: andArr,
          };
        } else {
          search = {
            ...search,
            date: { $gte: date1, $lte: date2 },
          };
        }
      }
    }

    // @phrase
    if (req.query.phrase) {
      const phrase = req.query.phrase;
      const arr = [
        { category: { $regex: phrase, $options: 'i' } },
        { subcategory: { $regex: phrase, $options: 'i' } },
        { transaction: { $regex: phrase, $options: 'i' } },
        { state: { $regex: phrase, $options: 'i' } },
        { citySearch: { $regex: phrase, $options: 'i' } },
        { districtSearch: { $regex: phrase, $options: 'i' } },
        { streetSearch: { $regex: phrase, $options: 'i' } },
        { phone: { $regex: phrase, $options: 'i' } },
        { email: { $regex: phrase, $options: 'i' } },
        { titleSearch: { $regex: phrase, $options: 'i' } },
        { localId: { $regex: phrase, $options: 'i' } },
      ];
      req.query.checkdsc &&
        arr.push({ descriptionSearch: { $regex: phrase, $options: 'i' } });
      search = {
        ...search,
        $or: arr,
      };
    }

    // Count...
    let count = null;
    if (!req.query.historyads && !req.query.otherads) {
      count = await RE_ad.find(search).countDocuments();
    }

    // Search...
    const ads = await RE_ad.find(search).limit(limit).skip(skip).sort(sort);

    res.send({ ads, count, limit, skip });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Coś poszło nie tak...' });
  }
});

module.exports = router;
