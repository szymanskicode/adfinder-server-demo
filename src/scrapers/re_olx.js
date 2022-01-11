const puppeteer = require('puppeteer');
const randomUserAgent = require('../utils/randomUserAgent');
const randomNumInRange = require('../utils/randomNumInRange');
const saveLog = require('../utils/saveLog');
const compareAd = require('../utils/compareAd');
const saveAd = require('../utils/saveAd');
const delay = require('../utils/delay');
const categoryParser = require('../utils/parsers/re_olx_category');
const transactionParser = require('../utils/parsers/re_olx_transaction');
const stateParser = require('../utils/parsers/re_olx_state');
const cityParser = require('../utils/parsers/re_olx_city');
const districtParser = require('../utils/parsers/re_olx_district');
const idParser = require('../utils/parsers/re_olx_id');
const dateParser = require('../utils/parsers/re_olx_date');
const phoneParser = require('../utils/parsers/re_olx_phone');
const titleParser = require('../utils/parsers/re_olx_title');
const descriptionParser = require('../utils/parsers/re_olx_description');
const surfaceParser = require('../utils/parsers/re_olx_surface');
const roomsParser = require('../utils/parsers/re_olx_rooms');
const priceParser = require('../utils/parsers/re_olx_price');
const toSearchString = require('../utils/toSearchString');

const scraper = {
  URLs: {
    dolnoslaskie: [
      // Mieszkania > Dolnośląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/dolnoslaskie/?search%5Bprivate_business%5D=private',
      // Domy > Dolnośląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/dolnoslaskie/?search%5Bprivate_business%5D=private',
      // Działki > Dolnośląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/dolnoslaskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Dolnośląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/dolnoslaskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Dolnośląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/dolnoslaskie/?search%5Bprivate_business%5D=private',
    ],
    kujawskopomorskie: [
      // Mieszkania > Kujawsko-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/kujawsko-pomorskie/?search%5Bprivate_business%5D=private',
      // Domy > Kujawsko-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/kujawsko-pomorskie/?search%5Bprivate_business%5D=private',
      // Działki > Kujawsko-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/kujawsko-pomorskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Kujawsko-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/kujawsko-pomorskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Kujawsko-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/kujawsko-pomorskie/?search%5Bprivate_business%5D=private',
    ],
    lubelskie: [
      // Mieszkania > Lubelskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/lubelskie/?search%5Bprivate_business%5D=private',
      // Domy > Lubelskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/lubelskie/?search%5Bprivate_business%5D=private',
      // Działki > Lubelskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/lubelskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Lubelskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/lubelskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Lubelskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/lubelskie/?search%5Bprivate_business%5D=private',
    ],
    lubuskie: [
      // Mieszkania > Lubuskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/lubuskie/?search%5Bprivate_business%5D=private',

      // Domy > Lubuskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/lubuskie/?search%5Bprivate_business%5D=private',
      // Działki > Lubuskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/lubuskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Lubuskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/lubuskie/?search%5Bprivate_business%5D=private',

      // Garaże i Parkingi > Lubuskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/lubuskie/?search%5Bprivate_business%5D=private',
    ],
    lodzkie: [
      // Mieszkania > Łódzkie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/lodzkie/?search%5Bprivate_business%5D=private',
      // Domy > Łódzkie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/lodzkie/?search%5Bprivate_business%5D=private',
      // Działki > Łódzkie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/lodzkie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Łódzkie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/lodzkie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Łódzkie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/lodzkie/?search%5Bprivate_business%5D=private',
    ],
    malopolskie: [
      // Mieszkania > Małopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/malopolskie/?search%5Bprivate_business%5D=private',
      // Domy > Małopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/malopolskie/?search%5Bprivate_business%5D=private',
      // Działki > Małopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/malopolskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Małopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/malopolskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Małopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/malopolskie/?search%5Bprivate_business%5D=private',
    ],
    mazowieckie: [
      // Mieszkania > Mazowieckie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/mazowieckie/?search%5Bprivate_business%5D=private',
      // Domy > Mazowieckie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/mazowieckie/?search%5Bprivate_business%5D=private',
      // Działki > Mazowieckie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/mazowieckie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Mazowieckie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/mazowieckie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Mazowieckie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/mazowieckie/?search%5Bprivate_business%5D=private',
    ],
    opolskie: [
      // Mieszkania > Opolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/opolskie/?search%5Bprivate_business%5D=private',
      // Domy > Opolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/opolskie/?search%5Bprivate_business%5D=private',
      // Działki > Opolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/opolskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Opolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/opolskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Opolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/opolskie/?search%5Bprivate_business%5D=private',
    ],
    podkarpackie: [
      // Mieszkania > Podkarpackie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/podkarpackie/?search%5Bprivate_business%5D=private',
      // Domy > Podkarpackie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/podkarpackie/?search%5Bprivate_business%5D=private',
      // Działki > Podkarpackie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/podkarpackie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Podkarpackie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/podkarpackie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Podkarpackie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/podkarpackie/?search%5Bprivate_business%5D=private',
    ],
    podlaskie: [
      // Mieszkania > Podlaskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/podlaskie/?search%5Bprivate_business%5D=private',
      // Domy > Podlaskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/podlaskie/?search%5Bprivate_business%5D=private',
      // Działki > Podlaskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/podlaskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Podlaskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/podlaskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Podlaskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/podlaskie/?search%5Bprivate_business%5D=private',
    ],
    pomorskie: [
      // Mieszkania > Pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/pomorskie/?search%5Bprivate_business%5D=private',
      // Domy > Pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/pomorskie/?search%5Bprivate_business%5D=private',
      // Działki > Pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/pomorskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/pomorskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/pomorskie/?search%5Bprivate_business%5D=private',
    ],
    slaskie: [
      // Mieszkania > Śląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/slaskie/?search%5Bprivate_business%5D=private',
      // Domy > Śląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/slaskie/?search%5Bprivate_business%5D=private',
      // Działki > Śląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/slaskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Śląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/slaskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Śląskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/slaskie/?search%5Bprivate_business%5D=private',
    ],
    swietokrzyskie: [
      // Mieszkania > Świętokrzyskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/swietokrzyskie/?search%5Bprivate_business%5D=private',
      // Domy > Świętokrzyskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/swietokrzyskie/?search%5Bprivate_business%5D=private',
      // Działki > Świętokrzyskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/swietokrzyskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Świętokrzyskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/swietokrzyskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Świętokrzyskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/swietokrzyskie/?search%5Bprivate_business%5D=private',
    ],
    warminskomazurskie: [
      // Mieszkania > Warmińsko-mazurskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/warminsko-mazurskie/?search%5Bprivate_business%5D=private',
      // Domy > Warmińsko-mazurskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/warminsko-mazurskie/?search%5Bprivate_business%5D=private',
      // Działki > Warmińsko-mazurskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/warminsko-mazurskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Warmińsko-mazurskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/warminsko-mazurskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Warmińsko-mazurskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/warminsko-mazurskie/?search%5Bprivate_business%5D=private',
    ],
    wielkopolskie: [
      // Mieszkania > Wielkopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/wielkopolskie/?search%5Bprivate_business%5D=private',
      // Domy > Wielkopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/wielkopolskie/?search%5Bprivate_business%5D=private',
      // Działki > Wielkopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/wielkopolskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Wielkopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/wielkopolskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Wielkopolskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/wielkopolskie/?search%5Bprivate_business%5D=private',
    ],
    zachodniopomorskie: [
      // Mieszkania > Zachodnio-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/mieszkania/zachodniopomorskie/?search%5Bprivate_business%5D=private',
      // Domy > Zachodnio-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/domy/zachodniopomorskie/?search%5Bprivate_business%5D=private',
      // Działki > Zachodnio-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/dzialki/zachodniopomorskie/?search%5Bprivate_business%5D=private',
      // Biura i Lokale > Zachodnio-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/biura-lokale/zachodniopomorskie/?search%5Bprivate_business%5D=private',
      // Garaże i Parkingi > Zachodnio-pomorskie > Prywatne
      'https://www.olx.pl/nieruchomosci/garaze-parkingi/zachodniopomorskie/?search%5Bprivate_business%5D=private',
    ],
  },

  hrefs: [],

  browser: null,
  page: null,
  startTime: Date.now(),
  districtFailCount: 0,

  initialize: async (state) => {
    try {
      /* Scraping started */
      await saveLog({
        type: 'success',
        scraper: 're_olx',
        msg: 'Scraping has started...',
        info: '',
      });

      /* Browser setup */
      scraper.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
      scraper.page = await scraper.browser.newPage();
      await scraper.page.setDefaultTimeout(10000);

      for (let i = 0; i < scraper.URLs[state].length; i++) {
        /* Get ad hrefs */
        try {
          /* Wait before opening new page */
          await delay(randomNumInRange(1500, 2500));

          await scraper.page.goto(scraper.URLs[state][i], {
            waitUntil: 'networkidle2',
          });

          /* Click cookies button */
          if (i === 0) {
            try {
              /* Wait before clicking cookies button */
              await delay(randomNumInRange(1500, 2500));

              const cookiesButton = await scraper.page.waitForSelector(
                'button#onetrust-accept-btn-handler'
              );
              await cookiesButton.click();
            } catch (err) {
              await saveLog({
                type: 'warning',
                scraper: 're_olx',
                msg: 'Click cookies button / ' + err,
                info: scraper.URLs[state][i].toString(),
              });
            }
          }

          scraper.hrefs = await scraper.page.$$eval(
            'a[data-cy="listing-ad-title"]',
            (els) => els.map((el) => el.getAttribute('href'))
          );

          /* Remove first 5 which are promoted ads */
          scraper.hrefs = scraper.hrefs.slice(5, scraper.hrefs.length);
        } catch (err) {
          await saveLog({
            type: 'danger',
            scraper: 're_olx',
            msg: 'Get ad hrefs error / ' + err,
            info: scraper.URLs[state][i].toString(),
          });
          continue;
        }

        /* Reading data from ad page */
        for (let j = 0; j < scraper.hrefs.length; j++) {
          /* Execute only for olx.pl (not otodom.pl) */
          if (scraper.hrefs[j].includes('olx.pl')) {
            try {
              /* Wait before opening ad page */
              await delay(randomUserAgent(1500, 2500));

              /* Open ad page */
              await scraper.page.goto(scraper.hrefs[j], {
                waitUntil: 'networkidle2',
              });

              /* Fake scrolling */
              try {
                /* Wait before start scrolling */
                await delay(randomNumInRange(1500, 2500));

                const ticks = randomNumInRange(50, 150);
                for (let k = 0; k < ticks; k++) {
                  if (k + 10 < ticks) {
                    await scraper.page.evaluate(() => {
                      window.scrollBy(0, 10);
                    });
                    await delay(20);
                  } else {
                    await scraper.page.evaluate(() => {
                      window.scrollBy(0, -10);
                    });
                    await delay(20);
                  }
                }
              } catch (err) {
                await saveLog({
                  type: 'warning',
                  scraper: 're_olx',
                  msg: 'Fake scrolling error / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              /* Reveal phone number */
              try {
                /* Wait before clicking phone button */
                await delay(randomNumInRange(1500, 2500));

                let phoneButton;
                phoneButton = await scraper.page.waitForSelector(
                  'button[data-cy="ad-contact-phone"]'
                );
                await phoneButton.click();
              } catch (err) {
                await saveLog({
                  type: 'warning',
                  scraper: 're_olx',
                  msg: 'Reveal phone number error / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              /* GETTING DATA */
              const ad = {
                provider: 're_olx',
                // category: '',
                // subcategory: '',
                // transaction: '',
                country: 'pl',
                // state: '',
                // city: '',
                // citySearch: '',
                // district: '',
                // districtSearch: '',
                // street: '',
                // streetSearch: '',
                // url: '',
                // id: '',
                // date: null,
                // phone: '',
                // email: '',
                // title: '',
                // titleSearch: '',
                // description: '',
                // descriptionSearch: '',
                // surface: null,
                // rooms: null,
                // price: null,
                additionalInfo: [],
                // createdAt: null,
              };

              // provider
              // data hard coded in ad object

              // category, transaction, state, city, district
              let breadcrumbs;
              try {
                await scraper.page.waitForSelector(
                  'li[data-testid="breadcrumb-item"]'
                );
                breadcrumbs = await scraper.page.$$eval(
                  'li[data-testid="breadcrumb-item"]',
                  (els) => els.map((el) => el.innerText)
                );
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg:
                    'Getting data error / category / transation / state / city / district / ' +
                    err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // category
              if (Array.isArray(breadcrumbs)) {
                const category = categoryParser(breadcrumbs[2]);

                if (category) {
                  ad.category = category;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Category cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // transaction
              if (Array.isArray(breadcrumbs)) {
                const transaction = transactionParser(breadcrumbs[3]);

                if (transaction) {
                  ad.transaction = transaction;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Transaction cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // state
              if (Array.isArray(breadcrumbs)) {
                const state = stateParser(breadcrumbs[4]);

                if (state) {
                  ad.state = state;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'State cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // city
              if (Array.isArray(breadcrumbs)) {
                const city = cityParser(breadcrumbs[5]);

                if (city) {
                  ad.city = city;
                  ad.citySearch = toSearchString(city);
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'City cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // district
              if (Array.isArray(breadcrumbs)) {
                const district = districtParser(breadcrumbs[6]);

                if (district) {
                  ad.district = district;
                  ad.districtSearch = toSearchString(district);
                  scraper.districtFailCount = 0;
                } else {
                  scraper.districtFailCount++;
                  if (scraper.districtFailCount > 30) {
                    await saveLog({
                      type: 'warning',
                      scraper: 're_olx',
                      msg: 'District cannot be defined',
                      info: scraper.hrefs[j].toString(),
                    });
                  }
                }
              }

              // subcategory
              // In consideration...

              // country
              // data hard coded in ad object

              // street
              // no info

              // url
              ad.url = scraper.hrefs[j];

              // id
              try {
                await scraper.page.waitForXPath(
                  '//span[contains(text(), "ID:")]'
                );
                const spanIdArr = await scraper.page.$x(
                  '//span[contains(text(), "ID:")]'
                );
                const spanId = spanIdArr[0];
                const spanIdTxt = await spanId.evaluate((el) => el.innerText);

                const id = idParser(spanIdTxt);

                if (id) {
                  ad.id = id;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Id cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / id / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // date
              try {
                await scraper.page.waitForSelector(
                  'span[data-cy="ad-posted-at"]'
                );
                const dateTxt = await scraper.page.$eval(
                  'span[data-cy="ad-posted-at"]',
                  (el) => el.innerText
                );

                const date = dateParser(dateTxt);

                if (date) {
                  ad.date = date;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Date cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / date / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // phone
              try {
                /* Wait for phone number reveal */
                await delay(1500);

                await scraper.page.waitForSelector(
                  'button[data-cy="ad-contact-phone"]'
                );
                const phoneTxt = await scraper.page.$eval(
                  'button[data-cy="ad-contact-phone"]',
                  (el) => el.innerText
                );

                const phone = phoneParser(phoneTxt);

                if (phone) {
                  ad.phone = phone;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Phone cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / phone / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // email
              // no info

              // title
              try {
                await scraper.page.waitForSelector('h1[data-cy="ad_title"]');
                const titleTxt = await scraper.page.$eval(
                  'h1[data-cy="ad_title"]',
                  (el) => el.innerText
                );

                const title = titleParser(titleTxt);

                if (title) {
                  ad.title = title;
                  ad.titleSearch = toSearchString(title);
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Title cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / title / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // description
              try {
                await scraper.page.waitForSelector(
                  'div[data-cy="ad_description"] > div'
                );
                const descriptionTxt = await scraper.page.$eval(
                  'div[data-cy="ad_description"] > div',
                  (el) => el.innerText
                );

                const description = descriptionParser(descriptionTxt);

                if (description) {
                  ad.description = description;
                  ad.descriptionSearch = toSearchString(description);
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Description cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / description / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // surface
              try {
                await scraper.page.waitForXPath(
                  '//p[contains(text(), "Powierzchnia:")]'
                );
                const pSurfaceArr = await scraper.page.$x(
                  '//p[contains(text(), "Powierzchnia:")]'
                );
                const pSurface = pSurfaceArr[0];
                const pSurfaceTxt = await pSurface.evaluate(
                  (el) => el.innerText
                );

                const surface = surfaceParser(pSurfaceTxt);

                if (surface) {
                  ad.surface = surface;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'Surface cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / surface / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // rooms
              try {
                await scraper.page.waitForXPath(
                  '//p[contains(text(), "pokoi:")]'
                );
                const pRoomsArr = await scraper.page.$x(
                  '//p[contains(text(), "pokoi:")]'
                );
                const pRooms = pRoomsArr[0];
                const pRoomsTxt = await pRooms.evaluate((el) => el.innerText);

                const rooms = roomsParser(pRoomsTxt);

                if (rooms) {
                  ad.rooms = rooms;
                } else {
                  if (ad.category.toLowerCase() === 'mieszkanie') {
                    await saveLog({
                      type: 'warning',
                      scraper: 're_olx',
                      msg: 'Rooms cannot be defined',
                      info: scraper.hrefs[j].toString(),
                    });
                  }
                }
              } catch (err) {
                if (ad.category.toLowerCase() === 'mieszkanie') {
                  await saveLog({
                    type: 'danger',
                    scraper: 're_olx',
                    msg: 'Getting data error / rooms / ' + err,
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // price
              try {
                await scraper.page.waitForSelector(
                  'div[data-testid="ad-price-container"] > h3'
                );
                const priceTxt = await scraper.page.$eval(
                  'div[data-testid="ad-price-container"] > h3',
                  (el) => el.innerText
                );

                const price = priceParser(priceTxt);

                if (price) {
                  ad.price = price;
                } else {
                  if (ad.transaction.toLowerCase() !== 'zamiana') {
                    await saveLog({
                      type: 'warning',
                      scraper: 're_olx',
                      msg: 'Price cannot be defined',
                      info: scraper.hrefs[j].toString(),
                    });
                  }
                }
              } catch (err) {
                if (ad.transaction.toLowerCase() !== 'zamiana') {
                  await saveLog({
                    type: 'danger',
                    scraper: 're_olx',
                    msg: 'Getting data error / price / ' + err,
                    info: scraper.hrefs[j].toString(),
                  });
                }
              }

              // additionalInfo
              try {
                await scraper.page.waitForXPath(
                  '/html/body/div[1]/div[1]/div[3]/div[2]/div[1]/div[2]/ul/li'
                );
                let additionalInfoArr = await scraper.page.$x(
                  '/html/body/div[1]/div[1]/div[3]/div[2]/div[1]/div[2]/ul/li'
                );

                let additionalInfo = [];
                for (let l = 0; l < additionalInfoArr.length; l++) {
                  additionalInfo.push(
                    await scraper.page.evaluate(
                      (el) => el.innerText,
                      additionalInfoArr[l]
                    )
                  );
                }

                if (
                  Array.isArray(additionalInfo) &&
                  additionalInfo.length > 0
                ) {
                  ad.additionalInfo = additionalInfo;
                } else {
                  await saveLog({
                    type: 'warning',
                    scraper: 're_olx',
                    msg: 'AdditionalInfo property cannot be defined',
                    info: scraper.hrefs[j].toString(),
                  });
                }
              } catch (err) {
                await saveLog({
                  type: 'danger',
                  scraper: 're_olx',
                  msg: 'Getting data error / additionalInfo / ' + err,
                  info: scraper.hrefs[j].toString(),
                });
              }

              // createdAt
              ad.createdAt = Date.now();

              /* Ending reading data... */

              await delay(3000);
              if ((!ad.title && !ad.description && !ad.surface) || !ad.date) {
                return;
              } else {
                await saveAd(ad);
              }
            } catch (err) {
              await saveLog({
                type: 'danger',
                scraper: 're_olx',
                msg: 'Reading data from ad page error / ' + err,
                info: scraper.hrefs[j].toString(),
              });
              continue;
            }
          }
        }
      }

      /* Close Browser */
      await scraper.browser.close();

      /* Scraping ended */
      scraper.endTime = Date.now();
      await saveLog({
        type: 'success',
        scraper: 're_olx',
        msg: 'Scraping has ended!',
        info:
          'Time: ' +
          Math.floor((scraper.endTime - scraper.startTime) / 1000) +
          ' seconds',
      });
    } catch (err) {
      /* Scraper general error */
      scraper.endTime = Date.now();
      await saveLog({
        type: 'danger',
        scraper: 're_olx',
        msg: 'Scraping has ended with General Error! / ' + err,
        info:
          'Time: ' +
          Math.floor((scraper.endTime - scraper.startTime) / 1000) +
          ' seconds',
      });
      /* Close Browser */
      await scraper.browser.close();
    }
  },
};

module.exports = scraper;
