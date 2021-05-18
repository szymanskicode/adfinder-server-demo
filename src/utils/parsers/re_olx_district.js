module.exports = function districtParser(district) {
  if (district) {
    const index = district.indexOf('-');
    district = district.substring(index + 1);
    district = district.trim();
    return district;
  } else {
    return null;
  }
};
