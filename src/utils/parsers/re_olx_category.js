module.exports = function categoryParser(category) {
  if (category) {
    category = category.toLowerCase().trim();
  } else {
    return null;
  }

  if (category.includes('mieszkan')) {
    return 'mieszkanie';
  } else if (category.includes('dom')) {
    return 'dom';
  } else if (category.includes('działk')) {
    return 'dzialka';
  } else if (category.includes('biur')) {
    return 'biuro-lokal';
  } else if (category.includes('garaż')) {
    return 'garaz-parking';
  } else {
    return null;
  }
};
