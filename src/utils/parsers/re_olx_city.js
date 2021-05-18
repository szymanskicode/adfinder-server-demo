module.exports = function cityParser(city) {
  if (city) {
    const index = city.indexOf('-');
    city = city.substring(index + 1);
    city = city.trim();
    return city;
  } else {
    return null;
  }
};
