module.exports = function priceParser(price) {
  if (price) {
    price = price.replace('zł', '');
    price = price.replace(/ /g, '');
    price = price.trim();
    price = parseInt(price, 10);

    return price;
  } else {
    return null;
  }
};
