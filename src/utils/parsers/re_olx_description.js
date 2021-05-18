module.exports = function descriptionParser(description) {
  if (description) {
    // remove all new line tags
    description = description.replace(/(\r\n|\n|\r)/gm, ' ');
    description = description.trim();
    return description;
  } else {
    return null;
  }
};
