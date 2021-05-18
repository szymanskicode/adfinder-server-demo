const mongoose = require('mongoose');

const re_adSchema = new mongoose.Schema({
  provider: {
    // re-olx, re-otodom, re-gumtree, etc...
    type: String,
  },
  category: {
    // mieszkanie, dom, dzialka, biuro-lokal, garaz-parking
    type: String,
  },
  subcategory: {
    // M: blok, kamienica, dom-wolnostojacy, szeregowiec, apartamentowiec, loft
    // D: wolnostojacy, blizniak, szeregowiec, gospodarstwo, letniskowy
    // DZ: rekreacyjna, budowlana, rolna, lesna, inwestycyjna, rolno-budowlana, siedliskowa, ogrodek-dzialkowy
    // BL: uslugowe, biurowe, handlowe, gastronomiczne, przemyslowe, hotelowe
    type: String,
  },
  transaction: {
    // sprzedaz, kupno, najem, wynajem, zamiana
    type: String,
  },
  country: {
    // pl, de, gb, etc...
    type: String,
  },
  state: {
    // dolnoslaskie, kujawsko-pomorskie, lubelskie, lubuskie, lodzkie, malopolskie, mazowieckie, opolskie, podkarpackie, podlaskie, pomorskie, slaskie, swietokrzyskie, warminsko-mazurskie, wielkopolskie, zachodniopomorskie
    type: String,
  },
  city: {
    // Forma oryginalna...
    type: String,
  },
  citySearch: {
    // Bez polskich znaków, wielkich liter i zamienione spacje na myślniki np. kedzierzyn-kozle
    type: String,
  },
  district: {
    // Forma oryginalna... np. Fabryczna, Gaj, etc...
    type: String,
  },
  districtSearch: {
    // Bez polskich znaków, wielkich liter i zamienione spacje na myślniki np. niskie-laki
    type: String,
  },
  street: {
    // Forma oryginalna... np. Waryńskiego, Krucza, etc...
    type: String,
  },
  streetSearch: {
    // Bez polskich znaków, wielkich liter i zamienione spacje na myślniki np. jana-ignacego
    type: String,
  },
  url: {
    type: String,
  },
  id: {
    type: String,
  },
  date: {
    type: Number,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  title: {
    // Forma oryginalna...
    type: String,
  },
  titleSearch: {
    type: String,
    // Bez polskich znaków, wielkich liter i zamienione spacje na myślniki
  },
  description: {
    // Forma oryginalna...
    type: String,
  },
  descriptionSearch: {
    // Bez polskich znaków, wielkich liter i zamienione spacje na myślniki
    type: String,
  },
  surface: {
    type: Number,
  },
  rooms: {
    // 1, 2, 3, 4
    type: Number,
  },
  price: {
    type: Number,
  },
  additionalInfo: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const RE_ad = mongoose.model('RE_ad', re_adSchema);

module.exports = RE_ad;
